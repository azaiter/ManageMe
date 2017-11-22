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
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
	
'''
getProjects:
	INPUT: 
		token
	OUTPUT:
		all projects related to the user
'''
def getProjects(args):
	returnTestData = [
	{
		"uid":1,
		"name":"Test Project 1",
		"desc":"Some Desc 1",
		"created":"2017-11-15 08:43:24"
	},
	{
		"uid":2,
		"name":"Test Project 2",
		"desc":"Some Desc 2",
		"created":"2017-11-15 08:43:24"
	}
	]
	return(jsonify(returnTestData))


def checkProjectExist(projectName):
	strProjectName = str(projectName)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkProjectExist', [str(strProjectName)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return len(r) > 0
  

  
'''
Iteration 2:

- Create Team    -- API is DONE /team/create/
- View Projects  --  getProjects is DONE /project/get
- View Time (all clock ins and outs)  --  API DONE /clock/get
- Clock in       --  /clock/in -- API DONE
- Clock out      --  /clock/out --  API DONE
- disable user   --  /user/disable -- API DONE



For getting user information /user/
if you send token, it will give you your information tuple. if userid is included in the call, 
then check if the token holder has permissions to get that user's information.


'''
def checkTeamExist(teamName):
	strTeamName = str(teamName)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkTeamExist', [str(strTeamName)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return len(r) > 0
  
  
  
'''
createTeam
	INPUT:
		token
		team_name
		team_desc
	OUTPUT:
		Tuple of the team created.
	
	from the token you can check permissions and figure out "created_by" field.
'''
def createTeam(args):
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_createTeam',[str(args.token), str(args.team_name), str(args.team_desc)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
  
'''
IN: token
Out: user clock in/outs based on token

note that in the future, admin will send user_id to get other user's clocks.
'''

def getHours(args):
	returnTestData = [
	{
		"uid":1,
		"req_uid":"54", # Make the DB return dummy column for req_uid until we get into next iterations
		"in":"2017-11-15 00:43:24",
		"out":"2017-11-15 08:11:12",
		"user_id":"3"
	},
	{
		"uid":2,
		"req_uid":"56", # Make the DB return dummy column for req_uid until we get into next iterations
		"in":"2017-11-15 00:43:24",
		"out":"2017-11-15 08:11:12",
		"user_id":"3"
	}
	]
	return(jsonify(returnTestData))

'''
IN: token
OUT: the updated tuple (should have NULL out time.
'''
def clockIn(args):
	returnTestData = [
	{
		"uid":1,
		"req_uid":"54", # Make the DB return dummy column for req_uid until we get into next iterations
		"in":"2017-11-15 00:43:24",
		"out":"",
		"user_id":"3"
	}
	]
	return(jsonify(returnTestData))

'''
IN: token
OUT: the updated tuple
'''
def clockOut(args):
	returnTestData = [
	{
		"uid":1,
		"req_uid":"54", # Make the DB return dummy column for req_uid until we get into next iterations
		"in":"2017-11-15 00:43:24",
		"out":"",
		"user_id":"3"
	}
	]
	return(jsonify(returnTestData))

  
'''
IN: userID
out: true if user exists, otherwise false. (stored procedure just selects where uid of username = inUid)
'''
def checkUserIDExists(userID):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkUserIDExist', [str(userID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return len(r) > 0

'''
IN: token, user_id
OUT: a message
'''
def disableUser(args):
	returnTestData = [
	{
		"message":"user has been disabled"
	}
	]
	return(jsonify(returnTestData))
