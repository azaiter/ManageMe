from flask_restful import Resource
from resources.__init__ import dbengine, managemeutil

class helloworld(Resource):
	@managemeutil.auth.login_required
	def get(self):
		return {'hello': 'world'}