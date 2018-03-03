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
    'req_id', dest='req_id',
    location='json', required=True,
    type=managemeutil.verify_valid_req_id,
    help='The req_id {error_msg}',
)

class clockout(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.clockOut(args)