from importlib import import_module
from common import settings
from common import util as managemeutil
dbEngineName = str("common."+settings.dbEngineFileName)
dbengine = import_module(dbEngineName)

########################## Zaiter Responses patch ##############################

from werkzeug import exceptions
import flask_restful
import json
from flask import Response
from flask_restful import reqparse
from flask import request

class zaiterClass(reqparse.RequestParser):
	def __init__(self, *args, **kwargs):
		#self = reqparse.RequestParser(bundle_errors=True)
		super(reqparse.RequestParser, self).__init__(*args, **kwargs)
		#reqparse.RequestParser.__init__(self, bundle_errors=True)
		
	def parse_args(self, req=None, strict=False, http_error_code=400):
		print("executing from my class")
		"""Parse all arguments from the provided request and return the results
		as a Namespace
		:param strict: if req includes args not in parser, throw 400 BadRequest exception
		:param http_error_code: use custom error code for `flask_restful.abort()`
		"""
		if req is None:
			req = request

		namespace = self.namespace_class()

		# A record of arguments not yet parsed; as each is found
		# among self.args, it will be popped out
		req.unparsed_arguments = dict(self.argument_class('').source(req)) if strict else {}
		errors = {}
		for arg in self.args:
			value, found = arg.parse(req, self.bundle_errors)
			if isinstance(value, ValueError):
				errors.update(found)
				found = None
			if found or arg.store_missing:
				namespace[arg.dest or arg.name] = value
		if errors:
			print(errors)
			if "token" in errors and "token is invalid" in errors["token"]:
				http_error_code = 200
			response = Response(
				response=json.dumps(dict(errors)), 
				status=http_error_code, mimetype='application/json')
			flask_restful.abort(response)

		if strict and req.unparsed_arguments:
			raise exceptions.BadRequest('Unknown arguments: %s' % ', '.join(req.unparsed_arguments.keys()))
		return namespace


###########################################################################