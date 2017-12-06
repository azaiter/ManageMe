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
    'uid', dest='uid',
    location='json', required=True,
    help='The project\'s unique ID {error_msg}',
)

class viewprojecthours(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.getProjectHours(args)