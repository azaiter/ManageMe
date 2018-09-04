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
    'project_name', dest='project_name',
    location='json', required=True,
    type=managemeutil.verify_projectNotExist,
    help='The project\'s name {error_msg}',
)
post_parser.add_argument(
    'project_desc', dest='project_desc',
    location='json', required=True,
    type=str,
    help='The project\'s description {error_msg}',
)

post_parser.add_argument(
    'team_id', dest='team_id',
    location='json', required=True,
    type=str,
    help='The project\'s description {error_msg}',
)

class createproject(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.createProject(args)


