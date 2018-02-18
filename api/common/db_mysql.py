from flask import jsonify
from flask_restful import abort
import MySQLdb
import sys
import common.settings as settings
import simplejson as json

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
	checkHasPrivilage(args.token, 3)
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
	checkHasPrivilage(args.token, 2)
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
	checkHasPrivilage(args.token, 10)
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
	checkHasPrivilage(args.token, 10)
	#checkIfNotclockedIn(args.token, args.req_id)
	checkIfNotclockedIn(args.token, 56)
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
	

	
	
def checkIfNotclockedIn(token, req_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkClockIn',[str(token), req_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From clocked in: " + str(r))
	if db:
		db.close()
	if len(r) > 0:
		pass
	else:
		abort(400, message="Error: user is already clocked in.")
	return len(r) > 0
	
def checkIfUserNeedsToClockOut(token, req_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkClockOut',[str(token), req_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From clocked out: " + str(r))
	if db:
		db.close()
	if len(r) > 0:
		pass
	else:
		abort(400, message="Error: user is already clocked out.")
	return len(r) > 0
	
	
'''
IN: token
OUT: the updated tuple
'''
def clockOut(args):
	checkHasPrivilage(args.token, 10)
	#checkIfUserNeedsToClockOut(args.token, args.req_id)
	checkIfUserNeedsToClockOut(args.token, 56)
	#### check if user needs to clock out otherwise throw an error that he can't clock out twice.
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
	checkHasPrivilage(args.token, 11)
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
	checkHasPrivilage(args.token, 11)
	checkAlreadyHasPrivilage(args.affected_user_id, privilage_id)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_assignPermission', [(args.privilage_id), (args.affected_user_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)

'''
IN: token, privilage_id, affected_user_id
OUT: a message indicating if the privilage has been assinged or not.
NOTES: privilage_id is the id of the privilage that the token user is giving to the other affected_user_id.
'''
def revokePrivilage(args):
	checkHasPrivilage(args.token, 11)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_removePermission', [(args.affected_user_id), (args.privilage_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)

'''
IN: token and privilage_id
OUT: true is user has privilage specified by id, otherwise false.
NOTE: the purpose of this function is for example, if you change privilage, you need to check if user is an admin before assigning any privilages.
'''
def checkHasPrivilage(token, privilage_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkPermission',[str(token), privilage_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From check prev: " + str(r))
	if db:
		db.close()
	if len(r) > 0:
		pass
	else:
		abort(400, message="Error: user doesn't have proper privilege.")
	return len(r) > 0
	
def checkAlreadyHasPrivilage(user_id, privilage_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkPermissionByID',[str(user_id), privilage_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From check prev: " + str(r))
	if db:
		db.close()
	if len(r) == 0:
		pass
	else:
		abort(400, message="Error: user already has privilege.")
	return len(r) == 0

'''
IN: privilage_id
OUT: true if privilage exists in the database and it's a valid one
'''
def checkIsValidPrivilage(privilage_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkValidPermissionID',[privilage_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0

'''
IN: token, project_id
OUT: json of estimates for the project requirements.
'''
def readProjectEstimates(args):
	checkHasPrivilage(args.token, 12)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readEstimateFromProject', [(args.project_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print("r is: " + str(r))
	return jsonify(r)

'''
IN: project_id
OUT: true if project_id is valid otherwise false
'''
def checkIsValidProjectId(project_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkValidProjectID',[project_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0

'''
IN: token, req_id
OUT: json of estimate for the requirement.
TODO: be able to send an array of req_id's
'''
def readRequirementEstimate(args):
	checkHasPrivilage(args.token, 12)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readEstimateFromReq', [(args.req_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)

'''
IN: req_id
OUT: true if req_id is valid otherwise false
'''
def checkIsValidRequirementId(req_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkValidReqID',[req_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0


'''
IN: token, project_id
OUT: json of soft and hard caps of each requirement in the project
'''
def readProjectTimeCaps(args):
	checkHasPrivilage(args.token, 13)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_viewTimeCaps', [(args.project_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)





'''
	IN: token, userID
	OUT: JSON object (user information)
'''
def readUserByID(args):
	checkHasPrivilage(args.token, 14)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getUserByID',[str(args.userID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Users are found with that ID!')
	if db:
		db.close()
		print(r)
	return jsonify(r)

'''
	IN: token
	OUT: JSON object (all user information)
'''
def readUsers(args):
	checkHasPrivilage(args.token, 14)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getAllUsers',[])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Users are found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: token, estimate, desc, name, softcap, hardcap, priority
	OUT: JSON object message whether it is created or not
'''
def createReq(args):
	checkHasPrivilage(args.token, 16)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_createReq',[str(args.token), str(args.estimate), str(args.desc), str(args.name), str(args.softcap), str(args.hardcap), str(args.priority)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: token, reqID
	OUT: JSON object (req info just for that one)
'''
def readReqByID(args):
	checkHasPrivilage(args.token, 15)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getReqByID',[str(args.reqID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Reqs are found with that ID!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: token
	OUT: JSON object (requirement info of everything)
'''
def readReqs(args):
	checkHasPrivilage(args.token, 15)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getAllReqs',[])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Reqs are found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: team_id
	OUT: true of false
'''
def checkIsValidTeamId(team_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkValidTeamID',[team_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0
	
'''
	IN: token, teamID
	OUT: JSON object (team info)
'''
def readTeamByID(args):
	checkHasPrivilage(args.token, 17)
	checkIsValidTeamId(args.teamID)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getTeamByID',[str(args.teamID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Teams are found with that ID!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: token
	OUT: JSON object (all teams info)
'''
def readTeams(args):
	checkHasPrivilage(args.token, 17)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getAllTeams',[])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Teams are found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
'''
	IN: token, reqID, estimateAmt
	OUT: JSON object message whether it is created or not
'''
def createEstimate(args):
	checkHasPrivilage(args.token, 6)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_updateEstimate',[str(args.reqID), str(args.estimateAmt)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Reqs are found with that ID!')
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

	
	
	
	
	
############## week 2

'''
IN: token, project_id, project_name, project_desc
OUT: updated row
'''
def updateProject(args):
	checkHasPrivilage(args.token, 3)
	db = dbConnect()
	cur = db.cursor()
	r = []
	
	if args.project_desc is not None:
		cur = db.cursor()
		cur.callproc('sp_updateProjDesc',[str(args.project_id), str(args.project_desc)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.project_name is not None:
		cur = db.cursor()
		cur.callproc('sp_updateProjName',[str(args.project_id), str(args.project_name)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if len(r) == 0:
		abort(400, message='No Projects are found with that ID!')
	if db:
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
	
'''
IN: token, project_id
OUT: message
'''
def deleteProject(args):
	checkHasPrivilage(args.token, 4)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_deleteProject',[str(args.project_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	

############# DONE WEEK 2
	
	
############## WEEK 3
def readPermissions(args):
	if args.user_id is not None:
		args.update({"Note":"user_id operation"})
	print("readPermissions(args)")
	args.update({"method":"readPermissions(args)"})
	return jsonify(args)

def createTeamMember(args):
	print("createTeamMember(args)")
	args.update({"method":"createTeamMember(args)"})
	return jsonify(args)

def updateTeamLead(args):
	print("updateTeamLead(args)")
	args.update({"method":"updateTeamLead(args)"})
	return jsonify(args)
	
	