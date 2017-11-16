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
    'first_name', dest='first_name',
    location='json', required=True,
    type=str,
    help='The user\'s first name {error_msg}',
)

post_parser.add_argument(
    'last_name', dest='last_name',
    location='json', required=True,
    type=str,
    help='The user\'s last name {error_msg}',
)
post_parser.add_argument(
    'email', dest='email',
    location='json', required=True,
    type=managemeutil.email,
    help='The user\'s email {error_msg}',
)
post_parser.add_argument(
    'phonenum', dest='phonenum',
    location='json', required=False,
    type=managemeutil.verify_isTenDigitNum,
    help='The user\'s phonenumber {error_msg}',
)
post_parser.add_argument(
    'address', dest='address',
    location='json', required=False,
    type=str,
    help='The user\'s address {error_msg}',
)

post_parser.add_argument(
    'username', dest='username',
    location='json', required=True,
    type=managemeutil.verify_usernameNotExist,
    help='The user\'s username {error_msg}',
)
post_parser.add_argument(
    'password', dest='password',
    location='json', required=True,
    type=managemeutil.verify_isStrongPassword,
    help='The user\'s password {error_msg}',
)


class register(Resource):
  def post(self):
    args = post_parser.parse_args()
    return dbengine.register(args)