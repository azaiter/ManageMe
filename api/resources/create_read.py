from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

###########################################################################
read_user_post_parser = reqparse.RequestParser(bundle_errors=True)

read_user_post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

read_user_post_parser.add_argument(
    'userID', dest='userID',
    location='json', required=False,
    type=managemeutil.verify_userIDNotExist,
    help='The user\'s ID. {error_msg}',
)

class readUser(Resource):
	def post(self):
		args = read_user_post_parser.parse_args()
		if args.userID is not None:
			return dbengine.readUserByID(args)
		else:
			return dbengine.readUsers(args)

###########################################################################

create_requirement_post_parser = reqparse.RequestParser(bundle_errors=True)

create_requirement_post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

create_requirement_post_parser.add_argument(
    'estimate', dest='estimate',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s estimate. {error_msg}',
)

create_requirement_post_parser.add_argument(
    'desc', dest='desc',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s description. {error_msg}',
)

create_requirement_post_parser.add_argument(
    'name', dest='name',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s name. {error_msg}',
)

create_requirement_post_parser.add_argument(
    'softcap', dest='softcap',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s softcap. {error_msg}',
)
create_requirement_post_parser.add_argument(
    'hardcap', dest='hardcap',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s hardcap. {error_msg}',
)
create_requirement_post_parser.add_argument(
    'priority', dest='priority',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The req\'s priority. {error_msg}',
)

class createReq(Resource):
	def post(self):
		args = create_requirement_post_parser.parse_args()
		return dbengine.createReq(args)
	
###########################################################################

read_req_post_parser = reqparse.RequestParser(bundle_errors=True)

read_req_post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

read_req_post_parser.add_argument(
    'reqID', dest='reqID',
    location='json', required=False,
    type=managemeutil.verify_valid_req_id,
    help='The req\'s ID. {error_msg}',
)

class readReq(Resource):
	def post(self):
		args = read_req_post_parser.parse_args()
		if args.reqID is not None:
			return dbengine.readReqByID(args)
		else:
			return dbengine.readReqs(args)
	

###########################################################################

read_team_post_parser = reqparse.RequestParser(bundle_errors=True)

read_team_post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

read_team_post_parser.add_argument(
    'teamID', dest='teamID',
    location='json', required=False,
    type=managemeutil.verify_valid_team_id,
    help='The req\'s ID. {error_msg}',
)

class readTeam(Resource):
	def post(self):
		args = read_team_post_parser.parse_args()
		if args.teamID is not None:
			return dbengine.readTeamByID(args)
		else:
			return dbengine.readTeams(args)
	
###########################################################################

create_estimate_post_parser = reqparse.RequestParser(bundle_errors=True)

create_estimate_post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

create_estimate_post_parser.add_argument(
    'reqID', dest='reqID',
    location='json', required=True,
    type=managemeutil.verify_valid_req_id,
    help='The req\'s ID. {error_msg}',
)

create_estimate_post_parser.add_argument(
    'estimateAmt', dest='estimateAmt',
    location='json', required=True,
    #type=managemeutil.verify_projectNotExist,
    help='The estimate\'s amount. {error_msg}',
)

class createEstimate(Resource):
	def post(self):
		args = create_estimate_post_parser.parse_args()
		return dbengine.createEstimate(args)
	
###########################################################################