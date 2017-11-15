from validate_email import validate_email
from flask_httpauth import HTTPTokenAuth
import re
from __init__ import dbengine 
import sys
from functools import wraps

auth = HTTPTokenAuth(scheme='Token')

@auth.verify_token
def verify_token(token):
    return dbengine.checkTokenIsValid(token)

def email(email_str):
	"""Return email_str if valid, raise an exception in other case."""
	if validate_email(email_str):
		return email_str
	else:
		raise ValueError('{} is not a valid email'.format(email_str))

def verify_request_token(token):
	if dbengine.checkTokenIsValid(token):
		return token
	else:
		raise ValueError('{} is not a valid token'.format(token))

def verify_isTenDigitNum(num):
	numStr = str(num)
	pattern = re.compile("^\d{10}$", re.IGNORECASE)
	if pattern.match(numStr) is not None:
		return numStr
	else:
		raise ValueError('{} is not a valid 10 digit phone number'.format(numStr))

def verify_isStrongPassword(password):
	passwordStr = str(password)
	pattern = re.compile(r"""(?#!py password Rev:20160831_2100)
    # Validate password: 1 upper, 1 special, 1 digit, 1 lower, 8 chars.
    ^                        # Anchor to start of string.
    (?=(?:[^A-Z]*[A-Z]){1})  # At least one uppercase.
    (?=[^!@#$&*]*[!@#$&*])   # At least one special.
    (?=(?:[^0-9]*[0-9]){1})  # At least one digit.
    .{8,}                    # Password length is 8 or more.
    $                        # Anchor to end of string.
    """, re.VERBOSE)
	if pattern.match(passwordStr) is not None:
		return passwordStr
	else:
		raise ValueError('{} is not a valid strong password'.format(passwordStr))

def verify_usernameExist(username):
	usernameStr = str(username)
	if dbengine.checkUsernameExists(usernameStr):
		return usernameStr
	else:
		raise ValueError('Username {} does not exist'.format(usernameStr))

def verify_usernameNotExist(username):
  usernameStr = str(username)
  if not dbengine.checkUsernameExists(usernameStr):
    return usernameStr
  else:
    raise ValueError('Username {} exists'.format(usernameStr))


def cors(func, allow_origin=None, allow_headers=None, max_age=None):
    if not allow_origin:
        allow_origin = "*"
    if not allow_headers:
        allow_headers = "content-type, accept"
    if not max_age:
        max_age = 60

    @wraps(func)
    def wrapper(*args, **kwargs):
        response = func(*args, **kwargs)
        cors_headers = {
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Methods": func.__name__.upper(),
            "Access-Control-Allow-Headers": allow_headers,
            "Access-Control-Max-Age": max_age,
        }
        if isinstance(response, tuple):
            if len(response) == 3:
                headers = response[-1]
            else:
                headers = {}
            headers.update(cors_headers)
            return (response[0], response[1], headers)
        else:
            return response, 200, cors_headers
    return wrapper