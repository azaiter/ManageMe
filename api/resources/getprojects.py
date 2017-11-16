from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

post_parser = reqparse.RequestParser(bundle_errors=True)

post_parser.add_argument(
    'token', dest='token',
    location='json', required=True,
    type=managemeutil.verify_request_token,
    help='The user\'s token {error_msg}',
)

class getprojects(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.getProjects(args)