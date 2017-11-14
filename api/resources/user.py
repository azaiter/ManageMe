from flask_restful import Resource, reqparse
from __init__ import dbengine


post_parser = reqparse.RequestParser(bundle_errors=True)


post_parser.add_argument(
    'userid', dest='userid',
    location='form', required=True,
    help='The user\'s userid {error_msg}',
)

class user(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.getUser(args)