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
    'project_id', dest='project_id',
    location='json', required=True,
    type=managemeutil.verify_valid_project_id,
    help='The project_id to read its time caps {error_msg}',
)

class read_timecaps_by_project_id(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.readProjectTimeCaps(args)