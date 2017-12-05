from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

post_parser = reqparse.RequestParser(bundle_errors=True)

post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

post_parser.add_argument(
    'user_id', dest='user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The user\'s ID {error_msg}',
)

class disableuser(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.disableUser(args)