'''
Dependencies:
	install python 2.7.14
	install latest pip
	install flask
	install flask-restful
	install mysqlclient
	install validate_email
	install Flask-HTTPAuth
'''
# import dependencies
from sys import argv
import sys
from flask import Flask
from flask_restful import Api

# routing classes
from resources.index import index
from resources.helloworld import helloworld
from resources.user import user
from resources.login import login
from resources.register import register
from resources.createproject import createproject
from resources.getprojects import getprojects

# define the app and run it
app = Flask(__name__)
api = Api(app)

# routing paths
api.add_resource(index, '/')
api.add_resource(helloworld, '/helloworld', '/helloworld/')
api.add_resource(user, '/user', '/user/')
api.add_resource(login, '/user/login', '/user/login/')
api.add_resource(register, '/user/create', '/user/create/')
api.add_resource(createproject, '/project/create', '/project/create/')
api.add_resource(getprojects, '/project/get', '/project/get/')

# for debugging, running indivisually with -debug param
if '-debug' in argv:
	app.run()
