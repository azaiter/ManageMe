from flask import jsonify, json
from flask_restful import abort
import MySQLdb
import sys
import common.settings as settings

# returns a mySQL connection object.
def dbConnect():
	return MySQLdb.connect(host=settings.dbHost,user=settings.dbUser,passwd=settings.dbPasswd,db=settings.dbDBName)

# DB Engine Functions:
'''
Notes:
	All DB functions shall start with a connection and ends with closing the connection (Mysql)
	All DB Engines shall implement all the required functions.
	
List of required functions:
	
'''

def getUser(args):
  db = dbConnect()
  cur = db.cursor()
  cur.callproc('sp_getUserById',[str(args.userid)])
  r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
  if len(r) == 0:
    abort(404, message='userid {} was not found!'.format(args.userid))
  if db:
    db.close()
  return jsonify(r)

  
  
'''
To Do Jaelyn:
2- implement login function
      INPUT: args is a json object with the following information
     
      username
      password
      
      OUTPUT: a json message and Token information
	  example:
	  {
		  "access_token": "eyJhbGciOiJIUzI1NiIsI.eyJpc3MiOiJodHRwczotcGxlL.mFrs3Zo8eaSNcxiNfvRh9dqKP4F1cB",
		  "expires_in":3600
	  }
      
3- implement checkTokenIsValid function
'''

def checkTokenIsValid(token):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkToken',[str(token)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0

def login(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkUser', [str(args.username), str(args.password)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	cur.close()
	cur = db.cursor()
	if len(r) != 0:
		intUID = [int(r[0]['uid'])]
		cur.callproc('sp_createSession', [intUID])
		rr = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		functionReturn = rr[0]
	else:
		abort(409, message="Error: username or password is invalid.")
		functionReturn = {"message": "Error: username or password is invalid."}
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(functionReturn)
  
def register(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_registerUser', [(str(args.first_name)), (str(args.last_name)), (str(args.email)), (str(args.phonenum)), (str(args.address)), (str(args.username)), (str(args.password))])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r[0])
  
  
  
def checkUsernameExists(username):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkUsernameExist', [str(username)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return len(r) > 0
	
	
	
	
'''
createProject
	INPUT:
		token
		project_name
		project_desc
	OUTPUT:
		Tuple of the project created.
	
	from the token you can check permissions and figure out "created_by" field.
'''
def createProject(args):
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_createProject',[str(args.token), str(args.project_name), str(args.project_desc)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return jsonify(r)
	
	
'''
getProjects:
	INPUT: 
		token
	OUTPUT:
		all projects related to the user
'''
def getProjects(args):
	checkTokenIsValid(args.token)
	return(args)