from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

# zaiter reqparse patch
from resources.__init__ import zaiterClass
reqparse.RequestParser = zaiterClass


post_parser = reqparse.RequestParser(bundle_errors=True)

post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

post_parser.add_argument(
    'team_name', dest='team_name',
    location='json', required=True,
    type=managemeutil.verify_teamNotExist,
    help='The team\'s name {error_msg}',
)

post_parser.add_argument(
    'team_desc', dest='team_desc',
    location='json', required=True,
    type=str,
    help='The team\'s description {error_msg}',
)

class createteam(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.createTeam(args)