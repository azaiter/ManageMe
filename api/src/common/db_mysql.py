from flask import jsonify
from flask_restful import abort
import MySQLdb
import sys
import common.settings as settings
import simplejson as json
import re
from decimal import Decimal

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
	
	if args.wage is not None:
		if re.match("^\d+?\.\d+?$", args.wage) is None and re.match("\d+", args.wage) is None:
			args.wage = 0
		print("wage: " + str(args.wage))
		cur = db.cursor()
		cur.callproc('sp_createUser', [(str(args.first_name)), (str(args.last_name)), (str(args.email)), (str(args.phonenum)), (str(args.address)), (Decimal(args.wage)), (str(args.username)), (str(args.password))])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
	else:
		cur = db.cursor()
		cur.callproc('sp_registerUser', [(str(args.first_name)), (str(args.last_name)), (str(args.email)), (str(args.phonenum)), (str(args.address)), (str(args.username)), (str(args.password))])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	
	if db:
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
	cur.callproc('sp_createProject',[str(args.token), str(args.project_name), str(args.project_desc) ,str(args.team_id)])
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
	checkIfNotclockedIn(args.token, args.req_id)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_clockIn',[str(args.token), str(args.req_id)])
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
	print(len(r))
	print(len(r) > 0)
	if db:
		db.close()
	if len(r) > 0:
		abort(400, message="Error: user is already clocked in.")	
	return len(r) == 0
	
def checkIfUserNeedsToClockOut(token, req_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkClockOut',[str(token), req_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From clocked out: " + str(r))
	if db:
		db.close()
	if len(r) == 0:
		abort(400, message="Error: user is already clocked out.")	
	return len(r) == 0
	
	
'''
IN: token
OUT: the updated tuple
'''
def clockOut(args):
	checkHasPrivilage(args.token, 10)
	#checkIfUserNeedsToClockOut(args.token, args.req_id)
	checkIfUserNeedsToClockOut(args.token, args.req_id)
	#### check if user needs to clock out otherwise throw an error that he can't clock out twice.
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_clockOut',[str(args.token), str(args.req_id)])
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
	checkHasPrivilage(args.token, 15)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_viewProjectTime', [(args.uid)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
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
	checkAlreadyHasPrivilage(args.affected_user_id, args.privilage_id)
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

	
	
	
	
def readPermissionsUsers(user_id):
	db = dbConnect()
	cur = db.cursor()
	r = []
	cur = db.cursor()
	cur.callproc('sp_readPermissionsByIDChiipi',[str(user_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	cur.close()
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return r

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
	for x in r:
		x['permissions'] = readPermissionsUsers(x.get('uid'))
	return jsonify(r)
	
'''
	IN: token, estimate, desc, name, softcap, hardcap, priority
	OUT: JSON object message whether it is created or not
'''
def createReq(args):
	checkHasPrivilage(args.token, 16)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_createReq',[str(args.token), str(args.estimate), str(args.desc), str(args.name), str(args.softcap), str(args.hardcap), str(args.priority), str(args.proj_id)])
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
	
	if args.team_id is not None:
		cur = db.cursor()
		cur.callproc('sp_assignTeam',[str(args.project_id), str(args.team_id)])
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
# IN: token, user_id (optional)
def readPermissions(args):
	checkHasPrivilage(args.token, 18)
	db = dbConnect()
	cur = db.cursor()
	r = []
	if args.user_id is None:
		cur = db.cursor()
		cur.callproc('sp_readPermissions',[])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
	else: 
		cur = db.cursor()
		cur.callproc('sp_readPermissionsByID',[str(args.user_id)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

	
# IN: token, teamID, user_id
def createTeamMember(args):
	checkHasPrivilage(args.token, 2)
	checkMemberInTeam(args.teamID, args.user_id)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_addMember',[str(args.teamID), str(args.user_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
def checkMemberInTeam(teamID, user_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkMemberInTeam',[teamID, user_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print(len(r))
	print(len(r) > 0)
	if db:
		db.close()
	if len(r) > 0:
		abort(400, message="Error: User is already in team.")	
	return len(r) == 0

#IN: token, teamID, user_id
def updateTeamLead(args):
	checkHasPrivilage(args.token, 2)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_updateTeamLead',[str(args.teamID), str(args.user_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
# IN:token, teamID, user_id
def deleteTeamMember(args):
	checkHasPrivilage(args.token, 2)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_removeMembers',[str(args.teamID), str(args.user_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

# IN:token, teamID
def readTeamMembers(args):
	checkHasPrivilage(args.token, 17)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readMembers',[str(args.teamID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Team Members are found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
def checkIsValidFileType(fileTypeId):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkValidFileType',[fileTypeId])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		db.close()
	return len(r) > 0
	
# IN: token fileTypeId name desc blob
def createDocument(args):
	checkHasPrivilage(args.token, 20)
	checkIsValidFileType(args.fileTypeId)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_createFile',[str(args.token),str(args.fileTypeId), str(args.name), str(args.desc), str(args.blob.read())])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
#IN: token doc_id
def readDocument(args):
	checkHasPrivilage(args.token, 19)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readFiles',[str(args.doc_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Document found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
#IN: token project_uid doc_uid
def createProjectDocument(args):
	checkHasPrivilage(args.token, 20)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_createProjectFile',[str(args.project_uid), str(args.doc_uid)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
#IN: token, project_uid
def readProjectDocument(args):
	checkHasPrivilage(args.token, 19)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readProjectFiles',[str(args.project_uid)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No Files found for Project!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
#IN: token project_uid doc_uid
def deleteProjectDocument(args):
	checkHasPrivilage(args.token, 21)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_deleteProjectFile',[str(args.project_uid), str(args.doc_uid)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

#IN: token
def readDocumentFileTypes(args):
	checkHasPrivilage(args.token, 19)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getFileTypes',[])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if len(r) == 0:
		abort(400, message='No File Types are found!')
	if db:
		db.close()
		print(r)
	return jsonify(r)
	
	
	
def checkIfNotclockedInChippi(token, req_id):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_checkClockIn',[str(token), req_id])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	print("From clocked in: " + str(r))
	print(len(r))
	print(len(r) > 0)
	if db:
		db.close()
	return len(r)> 0

# IN: token, project_uid
def readReqByProjID(args):
	checkHasPrivilage(args.token, 15)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getAllReqsByProjectID', [(args.project_uid)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	for x in r:
		if (checkIfNotclockedInChippi(args.token, x.get('uid'))):
			x['clocked_in'] = "Y"
		else:
			x['clocked_in'] = "N"
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)
	
# IN: token, user_id
def deleteUser(args):
	return disableUser(args)
	
'''
IN REQUIRED: token, user_id
IN NOT REQUIRED: first_name, last_name, email, phone, address
'''
def updateUser(args):
	checkHasPrivilage(args.token, 11)
	db = dbConnect()
	cur = db.cursor()
	r = []
	
	if args.first_name is not None:
		cur = db.cursor()
		cur.callproc('sp_updateUserFirstName',[str(args.user_id), str(args.first_name)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.last_name is not None:
		cur = db.cursor()
		cur.callproc('sp_updateUserLastName',[str(args.user_id), str(args.last_name)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if args.email is not None:
		cur = db.cursor()
		cur.callproc('sp_updateUserEmail',[str(args.user_id), str(args.email)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if args.phone is not None:
		cur = db.cursor()
		cur.callproc('sp_updateUserPhone',[str(args.user_id), str(args.phone)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if args.address is not None:
		cur = db.cursor()
		cur.callproc('sp_updateUserAddress',[str(args.user_id), str(args.address)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.wage is not None: 
		if re.match("^\d+?\.\d+?$", args.wage) is None and re.match("\d+", args.wage) is None:
			args.wage = 0
		print("wage: " + str(args.wage))
		cur = db.cursor()
		cur.callproc('sp_updateUserWage',[str(args.user_id), Decimal(args.wage)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if len(r) == 0:
		abort(400, message='No Users are found with that ID!')
	if db:
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
# IN: token, req_id
def deleteReq(args):
	checkHasPrivilage(args.token, 22)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_deleteReq',[str(args.req_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

'''
IN REQUIRED: token, req_id
IN NOT REQUIRED: estimate, desc, name, softcap, hardcap, priority
'''
def updateReq(args):
	checkHasPrivilage(args.token, 22)
	db = dbConnect()
	cur = db.cursor()
	r = []
	
	if args.estimate is not None:
		cur = db.cursor()
		cur.callproc('sp_updateEstimate',[str(args.req_id), str(args.estimate)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.desc is not None:
		cur = db.cursor()
		cur.callproc('sp_updateReqDesc',[str(args.req_id), str(args.desc)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.name is not None:
		cur = db.cursor()
		cur.callproc('sp_updateReqName',[str(args.req_id), str(args.name)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.soft_cap is not None:
		cur = db.cursor()
		cur.callproc('sp_updateReqSoftCap',[str(args.req_id), str(args.soft_cap)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.hard_cap is not None:
		cur = db.cursor()
		cur.callproc('sp_updateReqHardCap',[str(args.req_id), str(args.hard_cap)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()

	if args.priority is not None:
		cur = db.cursor()
		cur.callproc('sp_updateReqPriority',[str(args.req_id), str(args.priority)])
		r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
		cur.close()
		
	if len(r) == 0:
		abort(400, message='No Requirements are found with that ID!')
	if db:
		db.commit()
		db.close()
		print(r)
	return jsonify(r)

	
	
# IN: token, OldreqID, estimate, desc, name, softcap, hardcap, priority
def createReqChangeRequest(args):
	checkHasPrivilage(args.token, 16)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_createChangeRequest',[str(args.token), str(args.estimate), str(args.desc), str(args.name), str(args.softcap), str(args.hardcap), str(args.priority), str(args.OldreqID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
# IN: token, reqID
def acceptReqChangeRequest(args):
	checkHasPrivilage(args.token, 16)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_acceptChangeRequest',[str(args.reqID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
# IN: token, reqID
def rejectReqChangeRequest(args):
	checkHasPrivilage(args.token, 16)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_rejectChangeRequest',[str(args.reqID)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
'''
IN: token, team_id
OUT: message
'''
def deleteTeam(args):
	checkHasPrivilage(args.token, 4)
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_deleteTeam',[str(args.team_id)])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
		print(r)
	return jsonify(r)
	
	
'''
	IN: paramArr, spName
	OUT: JSON object
'''
def customCall(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc(args.spName, args.paramArr)
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	return jsonify(r)

def readUserSystemInfo(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_readUserSysData', [args.token])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def getProjectComments(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getProjectComments', [args.projID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def addProjectComments(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_addProjectComment', [args.token, args.comment, args.projID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)

def getReqComments(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getReqComments', [args.reqID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def addReqComments(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_addReqComment', [args.token, args.comment, args.reqID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def getWeeklyHours(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getWeeklyHours', [args.token])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def getWageInfo(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getWageInfo', [args.teamID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)
	
def getReqHours(args):
	db = dbConnect()
	cur = db.cursor()
	cur.callproc('sp_getReqHours', [args.reqID])
	r = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
	if db:
		cur.close()
		db.commit()
		db.close()
	print(r)
	return jsonify(r)