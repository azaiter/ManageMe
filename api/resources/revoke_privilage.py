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
    'affected_user_id', dest='affected_user_id',
    location='json', required=True,
    type=managemeutil.verify_userIDNotExist,
    help='The affected user ID {error_msg}',
)

post_parser.add_argument(
    'privilage_id', dest='privilage_id',
    location='json', required=True,
    type=managemeutil.verify_valid_privilage,
    help='The user\'s privilage_id {error_msg}',
)

class revoke_privilage(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.revokePrivilage(args)