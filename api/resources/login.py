from flask_restful import Resource, reqparse
from resources.__init__ import dbengine, managemeutil

post_parser = reqparse.RequestParser(bundle_errors=True)

# post_parser.add_argument(
    # 'token', dest='token',
	# type=managemeutil.verify_request_token,
    # location='json', required=True,
    # help='The user\'s token {error_msg}',
# )

post_parser.add_argument(
    'username', dest='username',
    location='json', required=True,
    type=managemeutil.verify_usernameExist,
    help='The user\'s username {error_msg}',
)

post_parser.add_argument(
    'password', dest='password',
    location='json', required=True,
    type=str,
    help='The user\'s password {error_msg}',
)

class login(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.login(args)