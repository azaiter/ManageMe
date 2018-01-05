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

  
'''
Iteration 3:
'''

'''
IN: token, privilage_id, affected_user_id
OUT: a message indicating if the privilage has been assinged or not.
NOTES: privilage_id is the id of the privilage that the token user is giving to the other affected_user_id.
'''
def assignPrivilage(args):
	r = {"message": "Privilage has been assigned."}
	return jsonify(r)

'''
IN: token, privilage_id, affected_user_id
OUT: a message indicating if the privilage has been assinged or not.
NOTES: privilage_id is the id of the privilage that the token user is giving to the other affected_user_id.
'''
def revokePrivilage(args):
	r = {"message": "Privilage has been revoked."}
	return jsonify(r)

'''
IN: token and privilage_id
OUT: true is user has privilage specified by id, otherwise false.
NOTE: the purpose of this function is for example, if you change privilage, you need to check if user is an admin before assigning any privilages.
'''
def checkHasPrivilage(token, privilage_id):
	return True

'''
IN: privilage_id
OUT: true if privilage exists in the database and it's a valid one
'''
def checkIsValidPrivilage(privilage_id):
	return True

'''
IN: token, project_id
OUT: json of estimates for the project requirements.
'''
def readProjectEstimates(args):
	r=[
			{"req_id" : "1234", "estimate" : "3"},
			{"req_id" : "5678", "estimate" : "7"},
			{"req_id" : "9023", "estimate" : "1"}
		]
	return jsonify(r)

'''
IN: project_id
OUT: true if project_id is valid otherwise false
'''
def checkIsValidProjectId(project_id):
	return True

'''
IN: token, req_id
OUT: json of estimate for the requirement.
TODO: be able to send an array of req_id's
'''
def readRequirementEstimate(args):
	r=[
			{"req_id" : "1234", "estimate" : "3"}
		]
	return jsonify(r)

'''
IN: req_id
OUT: true if req_id is valid otherwise false
'''
def checkIsValidRequirementId(req_id):
	return True


'''
IN: token, project_id
OUT: json of soft and hard caps of each requirement in the project
'''
def readProjectTimeCaps(args):
	r=[
			{"req_id": "1234", "soft_cap" : "12:00:00", "soft_cap_used": "06:00:00", "hard_cap": "24:00:00", "hard_cap_used": "12:00:00"},
			{"req_id": "432", "soft_cap" : "11:00:00", "soft_cap_used": "03:00:00", "hard_cap": "24:00:00", "hard_cap_used": "23:00:00"},
			{"req_id": "679967", "soft_cap" : "17:00:00", "soft_cap_used": "05:00:00", "hard_cap": "66:00:00", "hard_cap_used": "67:00:00"},
		]
	return jsonify(r)





	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	