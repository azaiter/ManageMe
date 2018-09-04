from validate_email import validate_email
from flask_httpauth import HTTPTokenAuth
import re
from common.__init__ import dbengine 
import sys
from functools import wraps
from functools import update_wrapper
from datetime import timedelta
from flask import Response
from werkzeug.exceptions import HTTPException, Unauthorized, BadRequest, NotFound, _aborter
from flask_restful.utils import http_status_message, unpack
import json
from werkzeug.exceptions import HTTPException
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

class TokenError(ValueError):
	data = "test"
	message = "test"
	code = 200
	def __init__(self, message=None):
		self.message = "test"
		self.data = message
		self.code = 200
		
	
def verify_request_token(token):
	if dbengine.checkTokenIsValid(token):
		return token
	else:
		print("invalid token2")
		raise TokenError("token is invalid")

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
  if len(usernameStr) < 3:
    raise ValueError('Username {} has to be longer than 3 characters'.format(usernameStr))
  if not dbengine.checkUsernameExists(usernameStr):
    return usernameStr
  else:
    raise ValueError('Username {} exists'.format(usernameStr))

def verify_projectNotExist(projectName):
  projectNameStr = str(projectName)
  if not dbengine.checkProjectExist(projectNameStr):
    return projectNameStr
  else:
    raise ValueError('project {} exists'.format(projectNameStr))
    

def verify_teamNotExist(teamName):
  teamNameStr = str(teamName)
  if not dbengine.checkTeamExist(teamNameStr):
    return teamNameStr
  else:
    raise ValueError('team {} exists'.format(teamNameStr))

    
def verify_userIDNotExist(userID):
	userIDStr = str(userID)
	if dbengine.checkUserIDExists(userIDStr):
		return userIDStr
	else:
		raise ValueError('User with ID {} does not exist'.format(userIDStr))
		
def verify_valid_privilage(privilage_id):
	"""Return privilage_id if valid, raise an exception in other case."""
	if dbengine.checkIsValidPrivilage(privilage_id):
		return privilage_id
	else:
		raise ValueError('{} is not a valid privilage_id'.format(privilage_id))

def verify_valid_project_id(project_id):
	if dbengine.checkIsValidProjectId(project_id):
		return project_id
	else:
		raise ValueError('{} is not a valid project_id'.format(project_id))

def verify_valid_req_id(req_id):
	if dbengine.checkIsValidRequirementId(req_id):
		return req_id
	else:
		raise ValueError('{} is not a valid req_id'.format(req_id))

def verify_valid_team_id(team_id):
	if dbengine.checkIsValidTeamId(team_id):
		return team_id
	else:
		raise ValueError('{} is not a valid team_id'.format(team_id))

def verify_valid_file_type(fileTypeId):
	if dbengine.checkIsValidFileType(fileTypeId):
		return fileTypeId
	else:
		raise ValueError('{} is not a valid fileTypeId'.format(fileTypeId))