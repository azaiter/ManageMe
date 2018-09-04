from flask_restful import Resource

class index(Resource):
	def get(self):
		return {'message': 'Welcome to ManageMe API!'}