from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

# zaiter reqparse patch
from resources.__init__ import zaiterClass
reqparse.RequestParser = zaiterClass



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

updateProject_parser.add_argument(
    'team_id', dest='team_id',
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

###########################################################################

delete_project_document_parser = reqparse.RequestParser(bundle_errors=True)

delete_project_document_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

delete_project_document_parser.add_argument(
    'project_uid', dest='project_uid',
    location='json', required=True,
    type=managemeutil.verify_valid_project_id,
    help='The file\'s project id. {error_msg}',
)

delete_project_document_parser.add_argument(
    'doc_uid', dest='doc_uid',
    location='json', required=True,
    help='The document\'s doc_uid. {error_msg}',
)

class deleteProjectDocument(Resource):
	def post(self):
		args = delete_project_document_parser.parse_args()
		return dbengine.deleteProjectDocument(args)
	
###########################################################################

###########################################################################

delete_user_parser = reqparse.RequestParser(bundle_errors=True)

delete_user_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

delete_user_parser.add_argument(
    'user_id', dest='user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The file\'s project id. {error_msg}',
)


class deleteUser(Resource):
	def post(self):
		args = delete_user_parser.parse_args()
		return dbengine.deleteUser(args)
	
###########################################################################

###########################################################################

update_user_parser = reqparse.RequestParser(bundle_errors=True)

update_user_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

update_user_parser.add_argument(
    'user_id', dest='user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The user\'s ID. {error_msg}',
)

update_user_parser.add_argument(
    'first_name', dest='first_name',
    location='json', required=False,
    type=str,
    help='The user\'s first name {error_msg}',
)

update_user_parser.add_argument(
    'last_name', dest='last_name',
    location='json', required=False,
    type=str,
    help='The user\'s last name {error_msg}',
)
update_user_parser.add_argument(
    'email', dest='email',
    location='json', required=False,
    type=managemeutil.email,
    help='The user\'s email {error_msg}',
)
update_user_parser.add_argument(
    'phone', dest='phone',
    location='json', required=False,
    type=managemeutil.verify_isTenDigitNum,
    help='The user\'s phonenumber {error_msg}',
)
update_user_parser.add_argument(
    'address', dest='address',
    location='json', required=False,
    type=str,
    help='The user\'s address {error_msg}',
)
update_user_parser.add_argument(
    'wage', dest='wage',
    location='json', required=False,
    #type=str,
    help='The user\'s wage {error_msg}',
)

class updateUser(Resource):
	def post(self):
		args = update_user_parser.parse_args()
		return dbengine.updateUser(args)
	
###########################################################################

###########################################################################

delete_req_parser = reqparse.RequestParser(bundle_errors=True)

delete_req_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

delete_req_parser.add_argument(
    'req_id', dest='req_id',
    location='json', required=True,
    type=managemeutil.verify_valid_req_id,
    help='The req id. {error_msg}',
)


class deleteReq(Resource):
	def post(self):
		args = delete_req_parser.parse_args()
		return dbengine.deleteReq(args)
	
###########################################################################

###########################################################################

update_req_parser = reqparse.RequestParser(bundle_errors=True)

update_req_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

update_req_parser.add_argument(
    'req_id', dest='req_id',
    location='json', required=True,
    type=managemeutil.verify_valid_req_id,
    help='The req id. {error_msg}',
)


update_req_parser.add_argument(
    'estimate', dest='estimate',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s estimate. {error_msg}',
)

update_req_parser.add_argument(
    'desc', dest='desc',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s description. {error_msg}',
)

update_req_parser.add_argument(
    'name', dest='name',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s name. {error_msg}',
)

update_req_parser.add_argument(
    'soft_cap', dest='soft_cap',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s soft_cap. {error_msg}',
)
update_req_parser.add_argument(
    'hard_cap', dest='hard_cap',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s hard_cap. {error_msg}',
)
update_req_parser.add_argument(
    'priority', dest='priority',
    location='json', required=False,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s priority. {error_msg}',
)


class updateReq(Resource):
	def post(self):
		args = update_req_parser.parse_args()
		return dbengine.updateReq(args)
	
###########################################################################



###########################################################################

delete_team_parser = reqparse.RequestParser(bundle_errors=True)

delete_team_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

delete_team_parser.add_argument(
    'team_id', dest='team_id',
    location='json', required=True,
    type=managemeutil.verify_valid_team_id,
    help='The team\'s ID. {error_msg}',
)

class deleteTeam(Resource):
	def post(self):
		args = delete_team_parser.parse_args()
		return dbengine.deleteTeam(args)
	
###########################################################################