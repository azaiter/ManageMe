'''
Dependencies:
	install python 2.7.14
	install latest pip
	pip install flask
	pip install flask-restful
	pip install mysqlclient
	pip install validate_email
	pip install Flask-HTTPAuth
	pip install -U flask-cors
	pip install Flask-WTF
'''
# import dependencies
from sys import argv
import sys
from flask import Flask
from flask_restful import Api
from flask_cors import CORS

# routing classes
from resources.index import index
from resources.helloworld import helloworld
from resources.user import user
from resources.login import login
from resources.register import register
from resources.createproject import createproject
from resources.getprojects import getprojects
from resources.createteam import createteam
from resources.viewhours import viewhours
from resources.viewprojecthours import viewprojecthours
from resources.clockin import clockin
from resources.clockout import clockout
from resources.disableuser import disableuser

# define the app and run it
app = Flask(__name__)
api = Api(app)
CORS(app)
#CORS(app, resources={r"/*": {"origins": "*"}})

# @app.after_request
# def after_request(response):
  # response.headers.add('Access-Control-Allow-Origin', '*')
  # response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  # response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  # return response

# routing paths
api.add_resource(index, '/')
api.add_resource(helloworld, '/helloworld', '/helloworld/')
api.add_resource(user, '/user', '/user/')
api.add_resource(login, '/user/login', '/user/login/')
api.add_resource(register, '/user/create', '/user/create/')
api.add_resource(createproject, '/project/create', '/project/create/')
api.add_resource(getprojects, '/project/get', '/project/get/')
api.add_resource(createteam, '/team/create', '/team/create/')
api.add_resource(viewhours, '/clock/get', '/clock/get/')
api.add_resource(viewprojecthours, '/project/hours/get', '/project/hours/get/')
api.add_resource(clockin, '/clock/in', '/clock/in/')
api.add_resource(clockout, '/clock/out', '/clock/out/')
api.add_resource(disableuser, '/user/disable', '/user/disable/')

# for debugging, running indivisually with -debug param
if '-debug' in argv:
	app.run()
