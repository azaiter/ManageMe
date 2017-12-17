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
    abort(400, message='userid {} was not found!'.format(args.userid))
  if db:
    db.close()
  return jsonify(r)

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
		abort(400, message="Error: username or password is invalid.")
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
	
def getProjects(args):
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_getProjects',[str(args.token)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		if len(r) == 0:
			abort(400, message='No Projects are found for user!')
		if db:
			db.close()
			print(r)
	return jsonify(r)


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
	print(args)
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
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_viewTime',[str(args.token)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		if len(r) == 0:
			abort(400, message='No time entries are found for user!')
		if db:
			db.close()
			print(r)
	return jsonify(r)

'''
IN: token
OUT: the updated tuple (should have NULL out time.
'''
def clockIn(args):
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_clockIn',[str(args.token), str(56)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

'''
IN: token
OUT: the updated tuple
'''
def clockOut(args):
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_clockOut',[str(args.token), str(56)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

  
'''
IN: userID
out: true if user exists, otherwise false. (stored procedure just selects where uid of username = inUid)
'''
def checkUserIDExists(userID):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkUserIDExist', [userID])
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
	if checkTokenIsValid(args.token):
		db = dbConnect()
		cur = db.cursor()
		cur.callproc('sp_disableUser',[args.user_id])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)


'''
IN: token, uid
OUT: uid and time remaining on the project
'''
def getProjectHours(args):
  r = {
  "uid":"56",
  "remaining_hours":"5:12:00"
  }
  return jsonify(r)