from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil


#############################
updateProject_parser = reqparse.RequestParser(bundle_errors=True)

updateProject_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

updateProject_parser.add_argument(
    'project_id', dest='project_id',
    location='json', required=True,
    type=managemeutil.verify_valid_project_id,
    help='The project\'s ID {error_msg}',
)

updateProject_parser.add_argument(
    'project_name', dest='project_name',
    location='json', required=True,
    help='The project\'s name {error_msg}',
)
updateProject_parser.add_argument(
    'project_desc', dest='project_desc',
    location='json', required=True,
    type=str,
    help='The project\'s description {error_msg}',
)
class updateProject(Resource):
	def post(self):
		args = updateProject_parser.parse_args()
		return dbengine.updateProject(args)

####################################
deleteProject_parser = reqparse.RequestParser(bundle_errors=True)

deleteProject_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

deleteProject_parser.add_argument(
    'project_id', dest='project_id',
    location='json', required=True,
    type=managemeutil.verify_valid_project_id,
    help='The project\'s ID {error_msg}',
)

class deleteProject(Resource):
	def post(self):
		args = deleteProject_parser.parse_args()
		return dbengine.deleteProject(args)
		
#######################################