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
    location='json', required=False,
    help='The project\'s name {error_msg}',
)
updateProject_parser.add_argument(
    'project_desc', dest='project_desc',
    location='json', required=False,
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



###########################################################################

update_team_lead_parser = reqparse.RequestParser(bundle_errors=True)

update_team_lead_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

update_team_lead_parser.add_argument(
    'teamID', dest='teamID',
    location='json', required=True,
    type=managemeutil.verify_valid_team_id,
    help='The team\'s ID. {error_msg}',
)

update_team_lead_parser.add_argument(
    'user_id', dest='user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The user\'s ID. {error_msg}',
)


class updateTeamLead(Resource):
	def post(self):
		args = update_team_lead_parser.parse_args()
		return dbengine.updateTeamLead(args)
	
###########################################################################

###########################################################################

delete_team_member_parser = reqparse.RequestParser(bundle_errors=True)

delete_team_member_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

delete_team_member_parser.add_argument(
    'teamID', dest='teamID',
    location='json', required=True,
    type=managemeutil.verify_valid_team_id,
    help='The team\'s ID. {error_msg}',
)

delete_team_member_parser.add_argument(
    'user_id', dest='user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The user\'s ID. {error_msg}',
)

class deleteTeamMember(Resource):
	def post(self):
		args = delete_team_member_parser.parse_args()
		return dbengine.deleteTeamMember(args)
	
###########################################################################