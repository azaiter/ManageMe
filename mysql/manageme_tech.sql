-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: mysql.manageme.tech
-- Generation Time: May 15, 2018 at 04:32 PM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `manageme_tech`
--
CREATE DATABASE manageme_tech;
USE manageme_tech;

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `sp_acceptChangeRequest` (IN `r_id` INT)  NO SQL
BEGIN
	DECLARE changedVar INT;
    SET @changedVar = (select `changed` from Req where uid = r_id limit 1);
    
	UPDATE Req SET `status`= 4, `changed` = r_id WHERE uid = @changedVar;
    
	UPDATE Req SET `status`= 1, `changed` = NULL WHERE uid = r_id; 
    
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = r_id;
END$$

CREATE PROCEDURE `sp_addMember` (IN `t_id` INT, IN `u_id` INT)  NO SQL
BEGIN
    INSERT INTO TeamMember VALUES(NULL, t_id, u_id, false);
        SELECT * from `TeamMember` where `team_uid` = t_id AND `user_uid` = u_id limit 1;
END$$

CREATE PROCEDURE `sp_addProjectComment` (IN `in_token` VARCHAR(256), IN `in_comment` VARCHAR(21000), IN `in_project_uid` INT)  NO SQL
Insert INTO ProjectComments
    (comment,enteredby,project_uid) 
    values (in_comment,(SELECT user_uid from Session where token = in_token),in_project_uid)$$

CREATE PROCEDURE `sp_addReqComment` (IN `in_token` INT, IN `in_comment` VARCHAR(21000), IN `in_req_uid` INT)  NO SQL
Insert INTO ReqComments
    (comment,enteredby,req_uid) 
    values (in_comment,(SELECT user_uid from Session where token = in_token),in_req_uid)$$

CREATE PROCEDURE `sp_assignPermission` (IN `p_id` INT, IN `u_id` INT)  NO SQL
BEGIN
	INSERT INTO UserPermission VALUES (NULL, u_id, p_id);
    SELECT "The permission has been added." as message;
END$$

CREATE PROCEDURE `sp_assignTeam` (IN `p_id` INT, IN `team` INT)  NO SQL
BEGIN
    UPDATE Project SET assigned_team = team WHERE uid = p_id;
	SELECT `name`, `desc`, `created` FROM Project WHERE uid = p_id;
END$$

CREATE PROCEDURE `sp_checkClockIn` (IN `tok` VARCHAR(255), IN `r_id` INT)  NO SQL
SELECT uid FROM TimeEntry 
WHERE req_uid = r_id AND out_time IS NULL AND 
user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) LIMIT 1$$

CREATE PROCEDURE `sp_checkClockOut` (IN `tok` VARCHAR(255), IN `r_id` INT)  NO SQL
SELECT uid FROM TimeEntry 
WHERE req_uid = r_id AND out_time IS NULL AND 
user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) LIMIT 1$$

CREATE PROCEDURE `sp_checkMemberInTeam` (IN `team_id` INT, IN `user_id` INT)  NO SQL
SELECT uid FROM TeamMember 
WHERE user_uid = user_id AND team_uid = team_id$$

CREATE PROCEDURE `sp_checkPermission` (IN `tok` VARCHAR(255), IN `perm` INT)  NO SQL
SELECT * FROM UserPermission WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND permission_uid=perm$$

CREATE PROCEDURE `sp_checkPermissionByID` (IN `u_id` INT, IN `p_id` INT)  NO SQL
SELECT * FROM UserPermission WHERE user_uid = u_id AND permission_uid=p_id$$

CREATE PROCEDURE `sp_checkProjectExist` (IN `projName` VARCHAR(255))  NO SQL
select name from Project where name = projName$$

CREATE PROCEDURE `sp_checkTeamExist` (IN `inTeamName` VARCHAR(255))  NO SQL
SELECT * from Team where name = inTeamName$$

CREATE PROCEDURE `sp_checkToken` (IN `tok` VARCHAR(255))  NO SQL
SELECT * FROM Session WHERE token = tok and Session.end > CURRENT_TIMESTAMP$$

CREATE PROCEDURE `sp_checkUser` (IN `usern` VARCHAR(255), IN `pass` VARCHAR(255))  NO SQL
SELECT uid FROM User WHERE username = usern AND password = SHA2(CONCAT((SELECT salt from User where username = usern),pass), 256) AND enabled=1$$

CREATE PROCEDURE `sp_checkUserIDExist` (IN `inUserID` INT)  NO SQL
SELECT * from User where uid = inUserID$$

CREATE PROCEDURE `sp_checkUsernameExist` (IN `userN` VARCHAR(255))  NO SQL
SELECT uid FROM User where username = userN$$

CREATE PROCEDURE `sp_checkValidFileType` (IN `f_type` INT)  NO SQL
SELECT * from FileType where uid = f_type$$

CREATE PROCEDURE `sp_checkValidPermissionID` (IN `p_id` INT)  NO SQL
SELECT * from Permission where uid = p_id$$

CREATE PROCEDURE `sp_checkValidProjectID` (IN `p_id` INT)  NO SQL
SELECT * from Project where uid = p_id$$

CREATE PROCEDURE `sp_checkValidReqID` (IN `r_id` INT)  NO SQL
SELECT * from Req where uid = r_id$$

CREATE PROCEDURE `sp_checkValidTeamID` (IN `t_id` INT)  NO SQL
SELECT * from Team where uid = t_id$$

CREATE PROCEDURE `sp_clockIn` (IN `tok` VARCHAR(255), IN `ruid` INT)  NO SQL
BEGIN
    INSERT INTO TimeEntry VALUES(NULL, ruid, Now(), NULL, (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1));
        SELECT * from `TimeEntry` where `req_uid` = ruid AND `user_uid` = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) ORDER by in_time desc limit 1;
END$$

CREATE PROCEDURE `sp_clockOut` (IN `tok` VARCHAR(255), IN `ruid` INT)  NO SQL
BEGIN
	UPDATE TimeEntry SET out_time=Now() WHERE req_uid = ruid and user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) and out_time is null;
    SELECT * FROM TimeEntry WHERE req_uid = ruid and user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) order by out_time desc limit 1 ;
END$$

CREATE PROCEDURE `sp_completeReq` (IN `in_reqID` INT)  NO SQL
Update Req Set status = 2 Where Req.uid = in_reqID$$

CREATE PROCEDURE `sp_createChangeRequest` (IN `tok` VARCHAR(255), IN `est` INT, IN `descr` VARCHAR(255), IN `reqName` VARCHAR(255), IN `softcap` INT, IN `hardcap` INT, IN `pr` INT, IN `chng` INT)  NO SQL
BEGIN
    DECLARE projID INT;
    DECLARE reqID INT;
    INSERT INTO Req VALUES(NULL, est, descr, reqName, Now(), 3, softcap, hardcap, (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1), 0, pr, chng, NULL);
    SET @projID = (select `project_uid` from ProjectReq where req_uid = chng limit 1);
    SET @reqID = (SELECT uid from `Req` where `estimate` = est AND `desc` = descr AND `reqName` = name AND `soft_cap` = softcap AND `hard_cap` = hardcap AND `priority` = pr limit 1);
    INSERT INTO ProjectReq VALUES(NULL, @projID, @reqID);
    SELECT * from `Req` where `estimate` = est AND `desc` = descr AND `reqName` = name AND `soft_cap` = softcap AND `hard_cap` = hardcap AND `priority` = pr limit 1;
END$$

CREATE PROCEDURE `sp_createFile` (IN `tok` VARCHAR(255), IN `type_id` INT, IN `f_name` VARCHAR(255), IN `f_desc` VARCHAR(255), IN `f_blob` BLOB)  NO SQL
BEGIN
    INSERT INTO File VALUES(NULL, f_name, f_desc, NULL, type_id, f_blob, Now(), (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1));
        SELECT * from `File` where `name` = f_name AND `description` = f_desc AND type = type_id limit 1;
END$$

CREATE PROCEDURE `sp_createProject` (IN `tok` VARCHAR(255), IN `projName` VARCHAR(255), IN `projDesc` VARCHAR(255), IN `team` INT)  NO SQL
BEGIN
    INSERT INTO Project VALUES(NULL, projName, projDesc, team, Now(), (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1), 0);
        SELECT * from `Project` where `name` = projName AND `desc` = projDesc limit 1;
END$$

CREATE PROCEDURE `sp_createProjectFile` (IN `p_id` INT, IN `f_id` INT)  NO SQL
BEGIN
    INSERT INTO ProjectFiles VALUES(NULL, p_id, f_id);
        SELECT * from `ProjectFiles` where `project_uid` = p_id AND `file_uid` = f_id limit 1;
END$$

CREATE PROCEDURE `sp_createReq` (IN `tok` VARCHAR(255), IN `est` INT, IN `descr` VARCHAR(255), IN `reqName` VARCHAR(255), IN `softcap` INT, IN `hardcap` INT, IN `pr` INT, IN `p_id` INT)  NO SQL
BEGIN
    DECLARE r_id INT;
    SET @r_id = (SELECT max(uid)+1 from Req);
    INSERT INTO Req VALUES(@r_id, est, descr, reqName, Now(), 1, softcap, hardcap, (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1), 0, pr, NULL, NULL);
    
    INSERT INTO ProjectReq VALUES(NULL, p_id, @r_id);
        SELECT * from `Req` where uid = @r_id;
END$$

CREATE PROCEDURE `sp_createSession` (IN `in_uid` BIGINT)  NO SQL
BEGIN
	DECLARE hashtime VARCHAR(255);
    DECLARE hashedtoken VARCHAR(255);
	SET @hashtime = 
    CONCAT(char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    UNIX_TIMESTAMP(),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97));
	SET @hashedtoken = SHA2(@hashtime, 256);
	SET @timeselect = NOW();
    SET @newTime = @timeselect + INTERVAL 12 HOUR;
	INSERT INTO Session 
    VALUES(NULL, in_uid, @timeselect, @newTime, @hashedtoken, true);
    #SELECT CAST(@newTime AS DATETIME) as `token`, CAST(@newTime AS DATETIME) as `expire`;
	
    SELECT Session.token , Session.end as expire , User.uid, User.first_name, User.last_name, User.username, User.email FROM Session Inner Join User on Session.user_uid = User.uid where User.uid = in_uid and User.enabled = 1 and Session.end > CURRENT_TIMESTAMP order by Session.end desc limit 1;
	#from Session, User 
	#where `Session`.`user_uid` = in_uid order by `Session`.`end` desc limit 1;
END$$

CREATE PROCEDURE `sp_createTeam` (IN `tok` VARCHAR(255), IN `teamName` VARCHAR(255), IN `teamDesc` VARCHAR(255))  NO SQL
BEGIN
    INSERT INTO Team VALUES(NULL, teamName, teamDesc, 	Now(), (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1));
        SELECT * from `Team` where `name` = teamName AND `desc` = teamDesc limit 1;
END$$

CREATE PROCEDURE `sp_createUser` (IN `fName` VARCHAR(255), IN `lName` VARCHAR(255), IN `email` VARCHAR(255), IN `phone` VARCHAR(255), IN `address` VARCHAR(255), IN `wage` DECIMAL(10,2), IN `username` VARCHAR(255), IN `password` VARCHAR(255))  NO SQL
BEGIN
	DECLARE hashtime VARCHAR(255);
    DECLARE hashedpass VARCHAR(255);
	SET @hashtime = 
    CONCAT(UNIX_TIMESTAMP(),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97));
	SET @hashedpass = SHA2(CONCAT(@hashtime,password), 256);
	INSERT INTO User
	VALUES (NULL, fName, lName, email, phone, address, username, @hashedpass, @hashtime, wage, true, NOW());
    SELECT "User has been created" as "message";
END$$

CREATE PROCEDURE `sp_deleteProject` (IN `p_id` INT)  NO SQL
BEGIN
	DELETE FROM Project WHERE uid = p_id;
    SELECT "Project has been deleted." as "message";
END$$

CREATE PROCEDURE `sp_deleteProjectFile` (IN `p_id` INT, IN `f_id` INT)  NO SQL
BEGIN
	DELETE FROM ProjectFiles WHERE project_uid = p_id AND file_uid = f_id;
    SELECT "Project has been deleted." as "message";
END$$

CREATE PROCEDURE `sp_deleteReq` (IN `r_id` INT)  NO SQL
BEGIN
	DELETE FROM Req WHERE uid = r_id;
    SELECT "Requirement has been deleted." as "message";
END$$

CREATE PROCEDURE `sp_deleteTeam` (IN `t_id` INT)  NO SQL
BEGIN
	DELETE FROM Team WHERE uid = t_id;
    SELECT "Team has been deleted." as "message";
END$$

CREATE PROCEDURE `sp_disableUser` (IN `id` INT)  NO SQL
BEGIN
	UPDATE User SET enabled=0 WHERE uid=id;
    SELECT "User has been disabled" as "message";
END$$

CREATE PROCEDURE `sp_getAllReqs` ()  NO SQL
SELECT DISTINCT Req.uid, Req.estimate, Req.desc, Req.status, Req.name, Req.soft_cap, Req.hard_cap, Req.priority, (SELECT SUM(TIMESTAMPDIFF(SECOND, TimeEntry.in_time, TimeEntry.out_time) / 3600) FROM TimeEntry WHERE TimeEntry.req_uid = Req.uid) as total_hours 
FROM Req JOIN TimeEntry ON TimeEntry.req_uid = Req.uid$$

CREATE PROCEDURE `sp_getAllReqsByProjectID` (IN `projID` INT)  NO SQL
Select Req.*, User.last_name, User.first_name From Req 
Left Join User On Req.created_by = User.uid
Inner Join ProjectReq on ProjectReq.req_uid = Req.uid 
where ProjectReq.project_uid = projID$$

CREATE PROCEDURE `sp_getAllTeams` ()  NO SQL
SELECT `uid`, `name`, `desc` FROM Team$$

CREATE PROCEDURE `sp_getAllTeams2` (IN `in_token` VARCHAR(256))  NO SQL
SELECT `uid`, `name`, `desc` From Team
WHERE
(Select count(*) From Session 
	where Session.token = in_token 
 	and Session.enabled = 1 
 	and Session.end > CURRENT_TIMESTAMP) > 0$$

CREATE PROCEDURE `sp_getAllUsers` ()  NO SQL
SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`,`wage`, `username` FROM User WHERE enabled = 1$$

CREATE PROCEDURE `sp_getFileTypes` ()  NO SQL
SELECT * FROM FileType$$

CREATE PROCEDURE `sp_getMyInfo` (IN `in_token` VARCHAR(256))  NO SQL
SELECT User.address, User.created, User.email, User.first_name as firstName, User.last_name as lastName, User.phone as phone, User.uid, User.username FROM Session Inner Join User on Session.user_uid = User.uid where Session.token = in_token and User.enabled = 1 and Session.end > CURRENT_TIMESTAMP$$

CREATE PROCEDURE `sp_getProjectComments` (IN `in_project_uid` INT)  NO SQL
SELECT PC.*, MONTH(PC.entered) as nice_entered, Concat(CONCAT(U.first_name,' '),U.last_name) as fullName from ProjectComments As PC Inner Join User As U on U.uid = PC.enteredby where project_uid = in_project_uid order by entered desc$$

CREATE PROCEDURE `sp_getProjectInfo` (IN `in_token` VARCHAR(255), IN `proj_id` INT)  NO SQL
Select * from Project As P
Where P.uid = proj_id 
And (SELECT count(User.uid) FROM Session
             Inner Join User on Session.user_uid = User.uid 
             Where Session.token = in_token
             And User.enabled = 1 
             And Session.end > CURRENT_TIMESTAMP) > 0$$

CREATE PROCEDURE `sp_getProjects` (IN `tok` VARCHAR(255))  NO SQL
SELECT `uid`, `name`, `desc`, `created` FROM Project WHERE assigned_team in (SELECT team_uid FROM TeamMember WHERE user_uid=(SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1)) OR created_by = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1)$$

CREATE PROCEDURE `sp_getProjectsWithPendingApprovalReqs` (IN `in_token` VARCHAR(255))  NO SQL
SELECT UProj.Uid, Proj.Name From 
	(Select DISTINCT(P.Uid) from Req As R
		Inner Join ProjectReq As PR on R.uid = PR.req_uid
		Inner Join Project As P on PR.project_uid = P.uid
		Where R.status = 3
    	And ((SELECT User.uid FROM Session
             Inner Join User on Session.user_uid = User.uid 
             Where Session.token = in_token
             And User.enabled = 1 
             And Session.end > CURRENT_TIMESTAMP)
     		In (Select TM.user_uid From TeamMember As TM
                Inner Join Team As T on T.uid = TM.team_uid 
                Where T.uid = 52) 
             OR
             (SELECT User.uid FROM Session
             Inner Join User on Session.user_uid = User.uid 
             Where Session.token = in_token 
             And User.enabled = 1 
             And Session.end > CURRENT_TIMESTAMP) = P.created_by)
    ) As UProj
Inner Join Project As Proj On Proj.uid = UProj.uid$$

CREATE PROCEDURE `sp_getRecentActivity` (IN `in_token` VARCHAR(256))  NO SQL
Select * From (Select Times.in_time as `time`, CONCAT('You clock into requirement ',Req.name) as activity
From TimeEntry as Times
Inner Join Req as Req on Req.uid = Times.req_uid
WHERE Times.user_uid = (Select Ses.user_uid From Session as Ses
                        Where Ses.token = in_token 
                        and Ses.enabled = 1 
                        and Ses.end > CURRENT_TIMESTAMP LIMIT 1)
      and (Req.Status = 1 or Req.Status = 2)
UNION
Select Times.out_time as `Time`, CONCAT('You clock out of requirement ',Req.name) as activity
From TimeEntry as Times
Inner Join Req as Req on Req.uid = Times.req_uid
WHERE Times.user_uid = (Select Ses.user_uid From Session as Ses
                        Where Ses.token = in_token 
                        and Ses.enabled = 1 
                        and Ses.end > CURRENT_TIMESTAMP LIMIT 1)
      and (Req.Status = 1 or Req.Status = 2)) as Activity
Order By time desc
Limit 10$$

CREATE PROCEDURE `sp_getRecentProjects` (IN `in_token` VARCHAR(255))  NO SQL
Select Proj.Name as projName, Proj.uid as projID from TimeEntry as Times
Inner Join ProjectReq as ProjReq on Times.req_uid = ProjReq.req_uid
Inner Join Req as Req on Req.uid = ProjReq.req_uid
Inner Join Project as Proj on ProjReq.project_uid = Proj.uid
WHERE Times.user_uid = (Select Ses.user_uid From Session as Ses
                        Where Ses.token = in_token 
                        and Ses.enabled = 1 
                        and Ses.end > CURRENT_TIMESTAMP LIMIT 1)
Order by Times.in_time desc
LIMIT 250$$

CREATE PROCEDURE `sp_getRecentReqs` (IN `in_token` VARCHAR(256))  NO SQL
Select Req.uid as reqID, Req.name as reqName, Proj.Name as projName, Proj.uid as projID from TimeEntry as Times
Inner Join ProjectReq as ProjReq on Times.req_uid = ProjReq.req_uid
Inner Join Req as Req on Req.uid = ProjReq.req_uid
Inner Join Project as Proj on ProjReq.project_uid = Proj.uid
WHERE Times.user_uid = (Select Ses.user_uid From Session as Ses
                        Where Ses.token = in_token 
                        and Ses.enabled = 1 
                        and Ses.end > CURRENT_TIMESTAMP LIMIT 1)
      and (Req.status = 1 or Req.status = 2)
Order by Times.in_time desc
LIMIT 250$$

CREATE PROCEDURE `sp_getReqByID` (IN `id` INT)  NO SQL
SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id$$

CREATE PROCEDURE `sp_getReqComments` (IN `in_req_uid` INT)  NO SQL
SELECT RC.*, Concat(CONCAT(U.first_name,' '),U.last_name) as fullName from ReqComments As RC Inner Join User As U on U.uid = RC.enteredby where req_uid = in_req_uid order by entered desc$$

CREATE PROCEDURE `sp_getReqHours` (IN `r_id` INT)  NO SQL
SELECT SUM(TIMESTAMPDIFF(SECOND, in_time, out_time) / 3600) as total_hours FROM TimeEntry WHERE req_uid = r_id$$

CREATE PROCEDURE `sp_getTeamByID` (IN `id` INT)  NO SQL
SELECT `uid`, `name`, `desc` FROM Team WHERE uid = id$$

CREATE PROCEDURE `sp_getUserById` (IN `id` INT)  NO SQL
SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`, `username` FROM User WHERE uid = id AND enabled = 1$$

CREATE PROCEDURE `sp_getWageInfo` (IN `t_id` INT)  NO SQL
SELECT (SELECT CONCAT(User.first_name, " ", User.last_name) FROM User WHERE uid = TeamMember.user_uid) as name, Project.name as project_name, (SELECT name FROM Req WHERE uid = ProjectReq.req_uid) as req_name, (SELECT SUM(TIMESTAMPDIFF(SECOND, in_time, out_time) / 3600) FROM TimeEntry WHERE req_uid=ProjectReq.req_uid) as hours, (SELECT (SELECT wage FROM User WHERE uid=TeamMember.user_uid LIMIT 1) * SUM(TIMESTAMPDIFF(SECOND, in_time, out_time) / 3600) FROM TimeEntry WHERE req_uid=ProjectReq.req_uid) as money_earned FROM Project
JOIN TeamMember ON Project.assigned_team = TeamMember.team_uid
JOIN ProjectReq on ProjectReq.project_uid = Project.uid
WHERE assigned_team = t_id$$

CREATE PROCEDURE `sp_getWeeklyHours` (IN `tok` VARCHAR(255))  NO SQL
SELECT
	(SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), " ", MAKETIME(23, 59, 59))) as Day1,
	(SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), " ", MAKETIME(23, 59, 59))) as Day2,
    (SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), " ", MAKETIME(23, 59, 59))) as Day3,
	(SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), " ", MAKETIME(23, 59, 59))) as Day4,
    (SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), " ", MAKETIME(23, 59, 59))) as Day5,
	(SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), " ", MAKETIME(23, 59, 59))) as Day6,
    (SELECT  SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) AND in_time between CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 0 DAY), " ", MAKETIME(0, 0, 0)) and CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 0 DAY), " ", MAKETIME(23, 59, 59))) as Day7$$

CREATE PROCEDURE `sp_readEstimateFromProject` (IN `p_id` INT)  NO SQL
SELECT Req.uid, Req.estimate
FROM Req
INNER JOIN ProjectReq ON Req.uid = ProjectReq.req_uid
WHERE ProjectReq.project_uid = p_id$$

CREATE PROCEDURE `sp_readEstimateFromReq` (IN `r_id` INT)  NO SQL
SELECT uid, estimate FROM Req WHERE uid = r_id$$

CREATE PROCEDURE `sp_readFiles` (IN `f_id` INT)  NO SQL
SELECT uid, name, description, location, type, file_blob FROM File WHERE uid = f_id$$

CREATE PROCEDURE `sp_readMembers` (IN `t_id` INT)  NO SQL
SELECT User.uid, User.username, User.first_name, User.last_name, User.email, TeamMember.isLead
FROM TeamMember
JOIN User ON TeamMember.user_uid=User.uid
WHERE TeamMember.team_uid = t_id$$

CREATE PROCEDURE `sp_readPermissions` ()  NO SQL
SELECT `uid` AS `value`, `desc` as `label` FROM Permission$$

CREATE PROCEDURE `sp_readPermissionsByID` (IN `u_id` INT)  NO SQL
SELECT * FROM Permission WHERE uid in (select permission_uid from UserPermission where user_uid = u_id) ORDER BY `desc`$$

CREATE PROCEDURE `sp_readPermissionsByIDChiipi` (IN `u_id` INT)  NO SQL
SELECT * FROM Permission WHERE uid in (select permission_uid from UserPermission where user_uid = u_id) ORDER BY `desc`$$

CREATE PROCEDURE `sp_readProjectFiles` (IN `p_id` INT)  NO SQL
SELECT * FROM ProjectFiles where project_uid = p_id$$

CREATE PROCEDURE `sp_readUserSysData` (IN `tok` VARCHAR(255))  NO SQL
SELECT
	(SELECT SUM(TIMESTAMPDIFF(SECOND, in_time, out_time)) / 3600 FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1)) AS hours_cloked,
	(SELECT COUNT(*) FROM TimeEntry WHERE out_time IS NULL AND user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1) LIMIT 1) AS is_clocked,
	(SELECT COUNT(*) FROM TeamMember WHERE user_uid=(SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1)) AS num_teams,
	(SELECT COUNT(*) FROM Project WHERE assigned_team in (SELECT team_uid FROM TeamMember WHERE user_uid=(SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1))) AS num_projects$$

CREATE PROCEDURE `sp_registerUser` (IN `fName` VARCHAR(255), IN `lName` VARCHAR(255), IN `email` VARCHAR(255), IN `phone` VARCHAR(255), IN `address` VARCHAR(255), IN `username` VARCHAR(255), IN `password` VARCHAR(255))  NO SQL
BEGIN
	DECLARE hashtime VARCHAR(255);
    DECLARE hashedpass VARCHAR(255);
	SET @hashtime = 
    CONCAT(UNIX_TIMESTAMP(),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97),
    char(round(rand()*25)+97));
	SET @hashedpass = SHA2(CONCAT(@hashtime,password), 256);
	INSERT INTO User
	VALUES (NULL, fName, lName, email, phone, address, username, @hashedpass, @hashtime, 0.00, true, NOW());
    SELECT "User has been created" as "message";
END$$

CREATE PROCEDURE `sp_rejectChangeRequest` (IN `r_id` INT)  NO SQL
BEGIN
	DELETE FROM Req WHERE uid = r_id;
    DELETE FROM ProjectReq WHERE req_uid = r_id;
    SELECT "Requirement changed has been rejected." as "message";
END$$

CREATE PROCEDURE `sp_removeMembers` (IN `t_id` INT, IN `u_id` INT)  NO SQL
BEGIN
	DELETE FROM TeamMember WHERE `team_uid` = t_id AND `user_uid` = u_id limit 1;
    SELECT "The user has been removed from the team." as message;
END$$

CREATE PROCEDURE `sp_removePermission` (IN `u_id` INT, IN `p_id` INT)  NO SQL
BEGIN
    DELETE FROM UserPermission WHERE user_uid=u_id AND permission_uid=p_id;
    SELECT "The permission has been revoked." as message;
END$$

CREATE PROCEDURE `sp_updateEstimate` (IN `r_id` INT, IN `est` INT)  NO SQL
BEGIN
	UPDATE Req SET estimate = est WHERE uid = r_id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = r_id;
END$$

CREATE PROCEDURE `sp_updateHardCap` (IN `id` INT, IN `h_cap` INT)  NO SQL
BEGIN
	UPDATE Req SET hard_cap = h_cap WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateMyInfo` (IN `in_token` VARCHAR(256), IN `in_firstname` VARCHAR(256), IN `in_lastname` VARCHAR(256), IN `in_email` VARCHAR(256), IN `in_phonenumber` VARCHAR(256), IN `in_address` VARCHAR(256), IN `uid` INT)  NO SQL
BEGIN

    Update User as U
    Inner Join Session As S on S.user_uid = U.uid 
    Set U.first_name = in_firstname, U.last_name = in_lastname, U.email = in_email, U.phone = in_phonenumber, U.address = in_address 
    where S.token = in_token and U.enabled = 1 and S.end > CURRENT_TIMESTAMP and U.uid = in_uid;

    SELECT User.address, User.created, User.email, User.first_name as firstName, User.last_name as lastName, User.phone, User.uid, User.username 
    FROM Session Inner Join User on Session.user_uid = User.uid 
    where Session.token = in_token and User.enabled = 1 and Session.end > CURRENT_TIMESTAMP;
END$$

CREATE PROCEDURE `sp_updateProjDesc` (IN `p_id` INT, IN `p_desc` VARCHAR(255))  NO SQL
BEGIN
    UPDATE Project SET `desc` = p_desc WHERE uid = p_id;
	SELECT `name`, `desc`, `created` FROM Project WHERE uid = p_id;
END$$

CREATE PROCEDURE `sp_updateProjName` (IN `p_id` INT, IN `p_name` VARCHAR(255))  NO SQL
BEGIN
    UPDATE Project SET name = p_name WHERE uid = p_id;
	SELECT `name`, `desc`, `created` FROM Project WHERE uid = p_id;
END$$

CREATE PROCEDURE `sp_updateReqDesc` (IN `id` INT, IN `descr` VARCHAR(255))  NO SQL
BEGIN
	UPDATE Req SET `desc` = descr WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateReqHardCap` (IN `id` INT, IN `h_cap` INT)  NO SQL
BEGIN
	UPDATE Req SET hard_cap = h_cap WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateReqName` (IN `id` INT, IN `r_name` VARCHAR(255))  NO SQL
BEGIN
	UPDATE Req SET name = r_name WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateReqPriority` (IN `id` INT, IN `pri` INT)  NO SQL
BEGIN
	UPDATE Req SET priority = pri WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateReqSoftCap` (IN `id` INT, IN `s_cap` INT)  NO SQL
BEGIN
	UPDATE Req SET soft_cap = s_cap WHERE uid = id;
    SELECT `uid`, `estimate`, `desc`, `name`, `soft_cap`, `hard_cap`, `priority` FROM Req WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateTeamLead` (IN `t_id` INT, IN `u_id` INT)  NO SQL
BEGIN
	UPDATE TeamMember SET isLead = false WHERE user_uid = (SELECT user_uid FROM (SELECT * FROM TeamMember) AS Member WHERE isLead = true AND team_uid = t_id LIMIT 1);
	UPDATE TeamMember SET isLead = true WHERE user_uid = u_id;
    SELECT "The Team Lead has been updated." as message;
END$$

CREATE PROCEDURE `sp_updateUserAddress` (IN `id` INT, IN `addr` VARCHAR(255))  NO SQL
BEGIN
    UPDATE User SET address = addr WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`, `wage`,`username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateUserEmail` (IN `id` INT, IN `e` VARCHAR(255))  NO SQL
BEGIN
    UPDATE User SET email = e WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`, `wage`, `username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateUserFirstName` (IN `id` INT, IN `f_name` VARCHAR(255))  NO SQL
BEGIN
    UPDATE User SET first_name = f_name WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`,`wage`, `username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateUserLastName` (IN `id` INT, IN `l_name` VARCHAR(255))  NO SQL
BEGIN
    UPDATE User SET last_name = l_name WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`,`wage`, `username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateUserPhone` (IN `id` INT, IN `p_num` VARCHAR(255))  NO SQL
BEGIN
    UPDATE User SET phone = p_num WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`,`wage`, `username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_updateUserWage` (IN `id` INT, IN `rate` DECIMAL(10,2))  NO SQL
BEGIN
    UPDATE User SET wage = rate WHERE uid = id;
	SELECT `uid`, `first_name`, `last_name`, `email`, `phone`, `address`, `wage`, `username` FROM User WHERE uid = id;
END$$

CREATE PROCEDURE `sp_viewProjectTime` (IN `p_id` INT)  NO SQL
SELECT p_id AS uid, SUM(soft_cap), SUM(hard_cap) FROM Req WHERE status = 1 AND uid IN (SELECT req_uid FROM ProjectReq WHERE project_uid=p_id) UNION Select p_id AS uid, SUM(soft_cap), SUM(hard_cap) FROM Req where uid in (SELECT req_uid FROM ProjectReq where project_uid = p_id)$$

CREATE PROCEDURE `sp_viewTime` (IN `tok` VARCHAR(255))  NO SQL
SELECT * FROM TimeEntry WHERE user_uid = (SELECT user_uid FROM Session WHERE token=tok and enabled=1 LIMIT 1)$$

CREATE PROCEDURE `sp_viewTimeCaps` (IN `p_id` INT)  NO SQL
SELECT uid, name, soft_cap, hard_cap
FROM Req 
INNER JOIN ProjectReq ON Req.uid = ProjectReq.req_uid 
WHERE ProjectReq.project_uid = p_id$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `File`
--

CREATE TABLE `File` (
  `uid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `file_blob` blob NOT NULL,
  `created` datetime NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `File`
--

INSERT INTO `File` (`uid`, `name`, `description`, `location`, `type`, `file_blob`, `created`, `created_by`) VALUES
(2, 'File', 'Desccccc Boi', NULL, 1, 0x3c46696c6553746f726167653a20274d4f5444272028276170706c69636174696f6e2f6f637465742d73747265616d27293e, '2018-02-24 08:10:00', 84),
(3, 'File', 'Desccccc Boi', NULL, 1, 0x3c46696c6553746f726167653a2027696d616765202834292e706e6727202827696d6167652f706e6727293e, '2018-02-24 08:12:27', 84),
(4, 'File', 'Desccccc Boi', NULL, 1, 0x622220205f5f20205f5f2020202020202020202020202020202020202020202020202020202020205f5f20205f5f2020202020205c6e207c20205c5c2f20207c202020202020202020202020202020202020202020202020202020207c20205c5c2f20207c20202020205c6e207c205c5c20202f207c205f5f205f205f205f5f2020205f5f205f20205f5f205f20205f5f5f7c205c5c20202f207c205f5f5f205c6e207c207c5c5c2f7c207c2f205f60207c20275f205c5c202f205f60207c2f205f60207c2f205f205c5c207c5c5c2f7c207c2f205f205c5c5c6e207c207c20207c207c20285f7c207c207c207c207c20285f7c207c20285f7c207c20205f5f2f207c20207c207c20205f5f2f5c6e207c5f7c20207c5f7c5c5c5f5f2c5f7c5f7c207c5f7c5c5c5f5f2c5f7c5c5c5f5f2c207c5c5c5f5f5f7c5f7c20207c5f7c5c5c5f5f5f7c5c6e202020202020202020202020202020202020202020202020202020205f5f2f207c20202020202020202020202020202020205c6e2020202020202020202020202020202020202020202020202020207c5f5f5f2f2020202020202020202020202020202020205c6e5c6e444f4e5420464f5247455420544f20434f4d4d495420494620594f55204348414e47452053545546465c6e22, '2018-02-24 08:18:37', 84);

-- --------------------------------------------------------

--
-- Table structure for table `FileType`
--

CREATE TABLE `FileType` (
  `uid` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `name` int(255) NOT NULL,
  `prefix` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `FileType`
--

INSERT INTO `FileType` (`uid`, `description`, `name`, `prefix`) VALUES
(1, 'File', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifier`
--

CREATE TABLE `notifier` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `req_id` int(11) NOT NULL DEFAULT '0',
  `soft_cap` int(11) DEFAULT NULL,
  `hard_cap` int(11) DEFAULT NULL,
  `time_spent` double DEFAULT NULL,
  `soft_cap_notified` tinyint(1) DEFAULT NULL,
  `hard_cap_notified` tinyint(1) DEFAULT NULL,
  `clocked_in` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notifier`
--

INSERT INTO `notifier` (`user_id`, `req_id`, `soft_cap`, `hard_cap`, `time_spent`, `soft_cap_notified`, `hard_cap_notified`, `clocked_in`) VALUES
(84, 1, 45, 75, 1086.7541666666668, 1, 1, 1),
(84, 2, 20, 50, 0.35861111111111105, NULL, NULL, 1),
(84, 56, 2, 2, 90.56277777777778, 1, 1, 1),
(84, 57, 2, 2, 0, NULL, NULL, 0),
(84, 64, 1, 2, 0.016944444444444443, NULL, NULL, 1),
(84, 65, 20, 30, 0, NULL, NULL, 0),
(84, 66, 20, 30, 0, NULL, NULL, 0),
(116, 64, 1, 2, 0, NULL, NULL, 0),
(116, 65, 20, 30, 0, NULL, NULL, 0),
(116, 66, 20, 30, 0, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Permission`
--

CREATE TABLE `Permission` (
  `uid` int(11) NOT NULL,
  `desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Permission`
--

INSERT INTO `Permission` (`uid`, `desc`) VALUES
(1, 'Add a team'),
(2, 'Edit a team'),
(3, 'Edit a project'),
(4, 'Remove a project'),
(5, 'Request for change'),
(6, 'Approve Requirements/Estimates'),
(7, 'See reports'),
(8, 'Set hard/soft caps'),
(9, 'Change cap request'),
(10, 'Clock in/out'),
(11, 'Edit a User'),
(12, 'Read Estimates'),
(13, 'View Time Caps'),
(14, 'View user data'),
(15, 'View Req data'),
(16, 'Create Req'),
(17, 'View Team data'),
(18, 'View Permissions'),
(19, 'View File data'),
(20, 'Create Files'),
(21, 'Remove files'),
(22, 'Edit a Req'),
(23, 'Remove a team'),
(24, 'Add a User');

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `uid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `assigned_team` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `archived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`uid`, `name`, `desc`, `assigned_team`, `created`, `created_by`, `archived`) VALUES
(9, 'projectN', 'Project DEsc', 0, '2017-11-16 07:23:18', 5, 0),
(10, 'projectN', 'Project DEsc', 0, '2017-11-16 07:24:39', 5, 0),
(11, 'ManageME', 'its manage me bro', 0, '2017-11-16 07:37:38', 5, 0),
(13, 'ManageME', 'its manage me bro', 0, '2017-11-16 07:38:21', 5, 0),
(14, 'ManageME', 'its manage me bro', 0, '2017-11-16 07:38:28', 5, 0),
(15, 'Project', 'desc', 0, '2017-11-16 08:11:01', 5, 0),
(16, 'asdasdf', 'asdfasdfasdf', 0, '2017-11-17 18:03:43', 83, 0),
(17, 'testingsss', 'saasdasd', 0, '2017-11-17 18:06:55', 83, 0),
(18, 'testidngsss', 'saasdasd', 0, '2017-11-17 18:11:12', 83, 0),
(19, '', '', 0, '2017-11-18 09:03:29', 81, 0),
(20, 'such dud', 'lkjaksdflkjadksfjadsfkjl', 0, '2017-11-21 08:42:42', 83, 0),
(21, 'such dud adsfasdf', 'lkjaksdflkjadksfjadsfkjl', 0, '2017-11-21 08:42:48', 83, 0),
(22, 'aldkjfkajsdfjklj', 'kkljasdfjkljaskdlfj', 0, '2017-11-21 09:21:43', 83, 0),
(23, 'adfasdfadf', 'asdfadfadsf', 0, '2017-11-21 09:25:28', 83, 0),
(24, 'adfasdfadfadsfadfsadsf', 'asdfadfadsf', 0, '2017-11-21 09:25:41', 83, 0),
(25, 'adsfadfadsflkjfjlkjiurirur', 'dfadfasdf', 0, '2017-11-21 09:26:14', 83, 0),
(26, 'asdfjkfdl8888', 'adsfadfsadf', 0, '2017-11-21 09:27:09', 83, 0),
(27, 'kjadsklfjkljsdfkljkljjlkjklj', 'kasndfkljaksfdjklajsf', 0, '2017-11-21 09:28:17', 83, 0),
(28, 'adfakdjsflkj', 'kljasdkljklajdfskljalsdfj', 0, '2017-11-21 09:30:27', 83, 0),
(29, 'adfkljasdfklj jkladsjfkj ', 'lkasjdfljasldfjalsfjklaf', 0, '2017-11-21 09:30:34', 83, 0),
(30, 'this is a project', 'lkjasdklfjajsfkljasdfkjl', 0, '2017-11-21 09:32:19', 88, 0),
(31, 'yooooooooo', 'jaklsdjfkajlsdfjkljadf', 0, '2017-11-21 09:40:50', 83, 0),
(32, 'adadfasdf adf', 'adsfadfsdaf', 0, '2017-11-21 09:50:19', 89, 0),
(33, 'asdfllksjfkj lkjsadlfjklj', 'clkasdjfkjalksdjf', 0, '2017-11-21 09:57:18', 89, 0),
(34, 'a', 'a', 0, '2017-11-21 10:21:10', 88, 0),
(35, 'asdfasdf', 'aasdfasdf', 0, '2017-11-21 10:23:45', 88, 0),
(36, 'adfadsf', 'adsfasdfasfd', 0, '2017-11-21 10:29:45', 90, 0),
(37, 'Hello World', 'lkasjdkflkasdjfkl', 0, '2017-11-21 10:52:58', 91, 0),
(39, 'JTest', 'Testing by Jaelyn', 0, '2017-11-27 11:39:50', 94, 0),
(47, 'Trent\'s Project8', 'Trent is awsome!', 0, '2017-12-02 13:22:13', 95, 0),
(151, 'My first project', 'first ever project', 12, '2018-03-26 08:10:16', 116, 0),
(156, 'Ryan\'s Project', 'Something meaningful', 11, '2018-04-03 22:21:58', 84, 0),
(158, 'Project 10', 'Dummy', 36, '2018-04-21 19:17:09', 118, 0),
(166, 'Rocket 2.0', 'rocckkkkeetttttt', 59, '2018-04-24 21:24:05', 84, 0),
(175, 'Blue Fox', 'Moving on-prem to cloud', 59, '2018-04-24 22:53:31', 95, 0),
(176, 'Falcon111', 'somthing', 60, '2018-04-25 08:24:11', 84, 0),
(178, 'Fox Blue', 'Desc', 60, '2018-04-25 10:34:19', 95, 0),
(179, 'Red Cube', '123', 59, '2018-04-26 08:19:57', 95, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ProjectComments`
--

CREATE TABLE `ProjectComments` (
  `uid` bigint(20) NOT NULL,
  `project_uid` int(11) NOT NULL,
  `comment` varchar(21000) NOT NULL,
  `enteredby` int(11) NOT NULL,
  `entered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ProjectComments`
--

INSERT INTO `ProjectComments` (`uid`, `project_uid`, `comment`, `enteredby`, `entered`) VALUES
(4, 47, 'Hug me in my love hole.', 95, '2018-04-22 10:12:50'),
(5, 47, 'Test', 95, '2018-04-22 12:05:32'),
(6, 47, 'Test', 95, '2018-04-22 12:23:56'),
(7, 47, 'Test', 95, '2018-04-22 12:25:05'),
(8, 47, 'Test', 95, '2018-04-22 12:25:09'),
(9, 47, 'Test', 95, '2018-04-22 12:25:13'),
(10, 47, 'Test', 95, '2018-04-22 12:25:17'),
(11, 47, 'Test', 95, '2018-04-22 12:25:23'),
(12, 47, 'Test', 95, '2018-04-22 12:25:26'),
(13, 47, 'Test', 95, '2018-04-22 12:25:29'),
(14, 47, 'Bloopers', 95, '2018-04-22 12:34:53'),
(15, 155, 'Test', 95, '2018-04-23 17:08:14'),
(16, 178, 'Comment', 95, '2018-04-25 10:35:37');

-- --------------------------------------------------------

--
-- Table structure for table `ProjectFiles`
--

CREATE TABLE `ProjectFiles` (
  `uid` int(11) NOT NULL,
  `project_uid` int(11) NOT NULL,
  `file_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ProjectFiles`
--

INSERT INTO `ProjectFiles` (`uid`, `project_uid`, `file_uid`) VALUES
(6, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `ProjectReq`
--

CREATE TABLE `ProjectReq` (
  `uid` int(11) NOT NULL,
  `project_uid` int(11) NOT NULL,
  `req_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ProjectReq`
--

INSERT INTO `ProjectReq` (`uid`, `project_uid`, `req_uid`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 131, 2),
(4, 131, 4),
(5, 131, 6),
(6, 131, 7),
(7, 9, 12),
(8, 135, 13),
(9, 135, 14),
(10, 135, 15),
(11, 135, 16),
(12, 135, 16),
(13, 142, 17),
(14, 148, 18),
(15, 148, 19),
(16, 148, 20),
(17, 148, 21),
(29, 150, 22),
(30, 150, 23),
(31, 150, 24),
(34, 150, 27),
(35, 150, 28),
(36, 150, 29),
(37, 150, 30),
(38, 150, 31),
(39, 150, 32),
(40, 47, 33),
(41, 47, 34),
(42, 47, 35),
(43, 47, 36),
(45, 47, 45),
(46, 47, 46),
(48, 47, 47),
(49, 47, 48),
(52, 46, 49),
(53, 45, 50),
(54, 44, 51),
(56, 156, 53),
(57, 156, 54),
(58, 47, 55),
(59, 158, 56),
(60, 158, 57),
(61, 47, 55),
(62, 47, 59),
(64, 47, 61),
(65, 166, 62),
(66, 175, 63),
(67, 176, 64),
(68, 178, 65),
(69, 178, 66);

-- --------------------------------------------------------

--
-- Table structure for table `Req`
--

CREATE TABLE `Req` (
  `uid` int(11) NOT NULL,
  `estimate` decimal(10,0) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `soft_cap` int(11) NOT NULL,
  `hard_cap` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `accepted_by` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `changed` int(11) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Req`
--

INSERT INTO `Req` (`uid`, `estimate`, `desc`, `name`, `created`, `status`, `soft_cap`, `hard_cap`, `created_by`, `accepted_by`, `priority`, `changed`, `notes`) VALUES
(1, '65', 'oooh Decline this ', 'Decline', '2017-12-20 11:00:00', 1, 45, 75, 1, 1, 3, NULL, NULL),
(2, '10', 'Test1', 'Test1', '2018-02-24 11:23:01', 4, 20, 50, 84, 0, 5, 8, NULL),
(5, '5', 'zaiter desc test api', 'bomba', '2018-02-04 09:38:45', 1, 12, 13, 84, 0, 14, NULL, NULL),
(7, '10', 'Test2', 'Test2', '2018-02-24 11:23:38', 1, 15, 45, 84, 0, 5, NULL, NULL),
(8, '500', 'NewNew ', 'NewNew', '2018-02-24 12:08:24', 0, 200, 700, 84, 0, 3, NULL, NULL),
(10, '0', 'adsfadsfadf', 'asdfadf', '2018-03-03 13:38:38', 1, 3, 3, 84, 0, 0, NULL, NULL),
(11, '3', 'asdfadsfadfadfadfsdf', 'adsfasdfasdf', '2018-03-03 13:39:36', 1, 4, 5, 84, 0, 5, NULL, NULL),
(12, '2', 'asdfadf', 'asdfadf', '2018-03-03 13:55:56', 1, 2, 2, 84, 0, 2, NULL, NULL),
(13, '1', 'adfadf', 'adfadf', '2018-03-03 13:57:01', 1, 1, 1, 84, 0, 1, NULL, NULL),
(14, '5557', 'booi', 'zaiter', '2018-03-03 13:57:16', 1, 555, 555, 84, 0, 5, NULL, NULL),
(15, '1', 'adsfasdf', 'chipp', '2018-03-03 14:00:23', 1, 1, 1, 84, 0, 1, NULL, NULL),
(16, '1', 'dsadsa', 'sdad', '2018-03-03 15:30:12', 1, 12, 13, 84, 0, 11, NULL, NULL),
(17, '2', 'asdfasdf', 'adsfasdf', '2018-03-10 13:31:49', 1, 2, 2, 84, 0, 2, NULL, NULL),
(20, '1', 'showing reqs', 'Add Docs', '2018-03-12 20:53:27', 1, 1, 1, 84, 0, 1, NULL, NULL),
(21, '3', 'asdfasdf', 'dsfadsf', '2018-03-13 21:52:13', 1, 3, 3, 84, 0, 3, NULL, NULL),
(24, '1', 'test', 'test', '2018-03-14 07:53:34', 1, 1, 1, 84, 0, 1, NULL, NULL),
(25, '1', 'something', 'something', '2018-03-14 08:06:48', 1, 1, 1, 84, 0, 1, NULL, NULL),
(26, '1', 'something2', 'something2', '2018-03-14 08:07:39', 1, 1, 1, 84, 0, 1, NULL, NULL),
(27, '1', 'something', 'something', '2018-03-14 08:10:09', 1, 1, 1, 84, 0, 1, NULL, NULL),
(28, '1', 'test', 'test', '2018-03-14 08:11:29', 1, 1, 1, 84, 0, 1, NULL, NULL),
(29, '1', 'test', 'test', '2018-03-14 08:14:16', 1, 1, 1, 84, 0, 1, NULL, NULL),
(30, '1', 'test', 'test', '2018-03-14 08:23:28', 1, 1, 1, 84, 0, 1, NULL, NULL),
(31, '1', 'test', '50', '2018-03-14 08:27:15', 1, 1, 1, 84, 0, 1, NULL, NULL),
(32, '1', 'this', '12:52pm test', '2018-03-26 09:52:28', 1, 1, 1, 84, 0, 1, NULL, NULL),
(33, '25000', 'Hi', '#TeamTrent', '2018-03-31 11:00:15', 4, 50, 50, 95, 0, 1, 55, NULL),
(34, '30', 'Test', 'Eat', '2018-03-31 15:11:12', 1, 20, 40, 95, 0, 1, NULL, NULL),
(35, '1', 'Test 3', 'Trent 3', '2018-03-31 15:18:43', 4, 1, 2, 95, 0, 0, 45, NULL),
(37, '100', 'Test', 'Trent Test 3', '2018-04-01 11:47:31', 3, 1, 2, 95, 0, 0, 35, NULL),
(38, '100', 'Test', 'Trent Test 3', '2018-04-01 11:47:58', 3, 1, 2, 95, 0, 0, 35, NULL),
(39, '1', 'Test', 'Trent Test 333333', '2018-04-01 11:49:35', 3, 1, 2, 95, 0, 0, 35, NULL),
(40, '1', 'Test', 'Trent Test 333333333333333333', '2018-04-01 17:11:53', 3, 1, 2, 95, 0, 0, 35, NULL),
(44, '50', 'Testing', 'Jaelyn Test', '2018-04-01 17:29:24', 3, 10, 25, 95, 0, 5, 35, NULL),
(45, '1', 'Test', 'Trent Test 3!', '2018-04-01 17:29:57', 0, 1, 2, 95, 0, 0, NULL, NULL),
(46, '1', 'Test 3', 'Learn React', '2018-04-02 17:51:26', 1, 1, 1, 95, 0, 1, NULL, NULL),
(47, '1', 'Test 4', 'Test 4', '2018-04-02 17:53:37', 4, 1, 1, 95, 0, 1, 48, NULL),
(48, '1', 'Test 4', 'Test 4!', '2018-04-02 17:54:27', 0, 1, 1, 95, 0, 1, NULL, NULL),
(49, '1', 'None', 'Requirement 1', '2018-04-03 13:04:53', 1, 1, 1, 95, 0, 1, NULL, NULL),
(50, '1', 'None', 'Create A Team', '2018-04-03 14:22:08', 1, 1, 1, 95, 0, 1, NULL, NULL),
(51, '1', 'None', 'Become Less Awsome', '2018-04-03 14:23:39', 1, 1, 1, 95, 0, 1, NULL, NULL),
(53, '14', 'qaaa', 'bfe111', '2018-04-03 22:35:03', 1, 12, 13, 84, 0, 1, NULL, NULL),
(54, '14', 'qaaa', 'bfe111', '2018-04-03 22:41:47', 3, 12, 131, 84, 0, 1, 53, NULL),
(55, '25000', 'Bye', '#TeamTrent', '2018-04-04 10:39:40', 4, 50, 50, 95, 0, 1, 59, NULL),
(56, '3', 'world', 'hello', '2018-04-05 12:31:38', 1, 2, 2, 95, 0, 2, NULL, NULL),
(57, '3', 'world', 'hello', '2018-04-05 12:32:21', 3, 2, 2, 95, 0, 3, 56, NULL),
(58, '25000', 'Bye', '#TeamTrent', '2018-04-24 19:00:19', 3, 50, 50, 95, 0, 1, 55, NULL),
(59, '25000', 'Bye', '#TeamTrent', '2018-04-24 19:01:34', 2, 50, 51, 95, 0, 1, NULL, NULL),
(61, '25000', 'Bye', '#TeamTrent', '2018-04-24 19:05:00', 3, 50, 52, 95, 0, 1, 59, NULL),
(62, '20', 'moar power', 'Adding thrusters', '2018-04-24 21:24:38', 1, 50, 60, 84, 0, 100, NULL, NULL),
(63, '5', 'n/a', 'Move on-prem to cloud', '2018-04-24 22:53:58', 1, 50, 60, 95, 0, 1, NULL, NULL),
(64, '3', 'Something', 'req', '2018-04-25 08:24:58', 1, 1, 2, 84, 0, 1, NULL, NULL),
(65, '5', 'Just do it.', 'Make The Fox Blue', '2018-04-25 10:34:56', 4, 20, 30, 95, 0, 1, 66, NULL),
(66, '5', 'Just do it please.', 'Make The Fox Blue', '2018-04-25 10:35:50', 2, 20, 30, 95, 0, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ReqComments`
--

CREATE TABLE `ReqComments` (
  `uid` bigint(20) NOT NULL,
  `enteredby` int(11) NOT NULL,
  `comment` varchar(21000) NOT NULL,
  `req_uid` int(11) NOT NULL,
  `entered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ReqComments`
--

INSERT INTO `ReqComments` (`uid`, `enteredby`, `comment`, `req_uid`, `entered`) VALUES
(7, 95, 'Test', 34, '2018-04-22 12:06:54'),
(8, 95, 'Comment :D', 65, '2018-04-25 10:35:31'),
(9, 95, 'Comment 2 :D\n', 65, '2018-04-25 10:44:08'),
(10, 95, 'Hello Class!!!', 65, '2018-04-25 11:01:55');

-- --------------------------------------------------------

--
-- Table structure for table `ReqStatus`
--

CREATE TABLE `ReqStatus` (
  `uid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Session`
--

CREATE TABLE `Session` (
  `uid` int(11) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `token` varchar(255) NOT NULL,
  `enabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Session`
--

INSERT INTO `Session` (`uid`, `user_uid`, `start`, `end`, `token`, `enabled`) VALUES
(128, 72, '2017-11-16 09:51:45', '2017-11-16 10:51:45', '1d81f3760f146b025097a5e8044394960d5dd825e2bb4b4871d7e1a970a75adf', 1),
(129, 72, '2017-11-16 09:52:45', '2017-11-16 10:52:45', '5ff5e972c72fd1e14f577017e28dd54c15b52b303a52a7f01284fe7f30c52728', 1),
(130, 72, '2017-11-16 09:52:49', '2017-11-16 10:52:49', '1c00dc5220a8794f3adb8e22e91a24eac2656d32fe195c89dcd91211884d7b7d', 1),
(131, 72, '2017-11-16 09:52:59', '2017-11-16 10:52:59', 'e592fc1e60183e46102e22c3ceaaea5c33bacccd7bee6a8db150a9a074751d3c', 1),
(132, 72, '2017-11-16 09:53:19', '2017-11-16 10:53:19', '7ff3a162b6e0faf085141a2cce5ad980d040218392d745e113b619fae18f307d', 1),
(133, 72, '2017-11-16 09:53:37', '2017-11-16 10:53:37', '9d863d678df8f64049fb011d9e39ac25e713809b67701384bfe78aadd37e09d0', 1),
(134, 72, '2017-11-16 10:32:00', '2017-11-16 11:32:00', '77552e4e39dd44fee7f333f0c5a84e17010518bf0a744c91f8c42864ce8ac7fb', 1),
(135, 72, '2017-11-16 10:32:07', '2017-11-16 11:32:07', '21a864d94470979365eeb2437788ccb9c2371d2247867721be85e3719cf9cafc', 1),
(136, 72, '2017-11-16 10:32:16', '2017-11-16 11:32:16', '6b4879d355093326256aeac3a7871c97bfd6fa5057b6a94725de49fcbf16895c', 1),
(137, 72, '2017-11-16 10:32:17', '2017-11-16 11:32:17', 'ad0887f59a3d8f4be68a43ae3a98c562be40c4e8073ce40177d9ce0ff7cb27d6', 1),
(138, 72, '2017-11-16 10:32:17', '2017-11-16 11:32:17', 'abcc4ef2b6a48ef74fbea7c55e5ef80e3b5911cea49819a986a9d29e7273c3a2', 1),
(139, 72, '2017-11-16 10:32:17', '2017-11-16 11:32:17', '1fa94da730cced15fcc71910133df4f06c30cde2191fb8a36032f110ee38d3fb', 1),
(140, 72, '2017-11-16 10:32:17', '2017-11-16 11:32:17', '39132889e13abc4221139bb1df6acb82784a500d3ce6ea711dbebc91339f84cc', 1),
(141, 72, '2017-11-16 10:33:01', '2017-11-16 11:33:01', '2809110eb39609cecc51107190ecdf4c2d731127d42e0418ba9bc3e270dbb905', 1),
(142, 72, '2017-11-16 10:33:19', '2017-11-16 11:33:19', '25072ee0affa4a3d69110aa10f97daedbd8f3972c729d0be4de21947910a23ab', 1),
(143, 72, '2017-11-16 10:36:26', '2017-11-16 11:36:26', '85abec0f278998928165d05e5fd66385b73143bd76d0f6cdded0ac82051c9edd', 1),
(144, 72, '2017-11-16 10:36:59', '2017-11-16 11:36:59', 'a667f0187c177c49bfaf7022d922e6a59c67bbb31bbec74319ade5722b60c8b9', 1),
(145, 72, '2017-11-16 11:00:24', '2017-11-16 12:00:24', 'b749e2cc246a870f8dc8b89490b3e35d43e402af39d4796bc9210da4a3c8c288', 1),
(146, 72, '2017-11-17 15:35:19', '2017-11-17 16:35:19', 'f5d70abcc2b87e298ca4ef5ca0190ffc5cc70e97f59f782c24b2deb568e0cf76', 1),
(147, 83, '2017-11-17 17:48:35', '2017-11-17 18:48:35', '7695b43d2a88ab1382174e2e5ff5dc604932c042626d8076abdf260b3102b2bc', 1),
(148, 83, '2017-11-17 18:04:41', '2017-11-17 19:04:41', 'b8f4ac5e42c7272eaf86f78c6b1fe2e543560dcb2a71bf5adfd430004d665489', 1),
(149, 81, '2017-11-18 09:02:46', '2017-11-18 10:02:46', '3e78f6278a523ec13de063bd63fcd07b6fc43832b5311a4266b151c89bb10fee', 1),
(150, 81, '2017-11-19 18:50:58', '2017-11-19 19:50:58', '1b7b467a0ee330dd084b24cc254f40d71204b9585ae4ba6fc495f6956807e58a', 1),
(151, 84, '2017-11-20 11:50:44', '2017-11-20 12:50:44', 'ee163dae83e7845c37baddd6704ebcd59dc13609016ede7d2a45dffc6e49202b', 1),
(152, 86, '2017-11-21 08:23:38', '2017-11-21 09:23:38', '16c4427c75be16f056770261d0c6846bd9ae4bf575a3709fb61c3e00b498b77c', 1),
(153, 87, '2017-11-21 08:36:49', '2017-11-21 09:36:49', '57e3c3b0413e78ebc79921d12ac6c2f0491cb2570f170fcdae4492796c85012c', 1),
(154, 87, '2017-11-21 08:37:57', '2017-11-21 09:37:57', '7fd2b7ae5c20d12a842b5c5318c2b8561eb2184b1ef0154da39cf87830a40074', 1),
(155, 87, '2017-11-21 08:40:21', '2017-11-21 09:40:21', '9623c23c14aeb20ff3635507d7262f8cdafc112118afbcb55f66e18184f0f71b', 1),
(156, 87, '2017-11-21 08:41:39', '2017-11-21 09:41:39', 'ef1f189f4eeada5e7da4e5a19d19e5b566560759406b5a5c252d3bcfae846b03', 1),
(157, 83, '2017-11-21 08:42:24', '2017-11-21 09:42:24', '4847981e03a0e16babe401469b9aa825a40ae5b156335f48bd7284616032f9f0', 1),
(158, 87, '2017-11-21 08:43:40', '2017-11-21 09:43:40', 'e2e2ec9ca591656ec06ed5253916ee413a1c4b0e1d0eec222f917f656e8af2e2', 1),
(159, 87, '2017-11-21 08:56:45', '2017-11-21 09:56:45', '7fc483d09cc917f6930c004b9155b8985c77f1b0d8aec6353f1f6354ff15387f', 1),
(160, 83, '2017-11-21 09:12:15', '2017-11-21 10:12:15', 'aba0bae49e1bb76aed2bf7726e02eab9cfa92bb7cd2966daf71a890f25dee9a6', 1),
(161, 83, '2017-11-21 09:12:18', '2017-11-21 10:12:18', '2b82221cb2b79a85f043547387a932049a83a115d4d5df4700c9fd937ea58aa1', 1),
(162, 83, '2017-11-21 09:12:25', '2017-11-21 10:12:25', 'ac2df5b52f405deff8f7dc056d49c64161b5d1bc0eb1ce507a1c4b92ecdac178', 1),
(163, 83, '2017-11-21 09:21:36', '2017-11-21 10:21:36', '7334aea588b2ab99c0123517cfa6e1463a333fbde4863d734fa6bd0fa35d6b79', 1),
(164, 83, '2017-11-21 09:25:20', '2017-11-21 10:25:20', '0153b81d6bac45453d81f31c70331e8728af29d8e11eedde92d973851a99c56d', 1),
(165, 88, '2017-11-21 09:31:58', '2017-11-21 10:31:58', '1586e2ca7db91f7278231fd3421d595ecfa74c17b20523a46072b38b0eb86190', 1),
(166, 89, '2017-11-21 09:50:11', '2017-11-21 10:50:11', 'a0c1ac3a7674a865c439d3aa7d835c0d533e20e87f00a9acb50e28373ff497a6', 1),
(167, 84, '2017-11-21 10:01:29', '2017-11-21 11:01:29', '758da1e1efb1f7eed7b168a442ed7e1f32a6f35c60fea4b9d3c37f9bd67f91e5', 1),
(168, 90, '2017-11-21 10:29:39', '2017-11-21 11:29:39', '275776578dcc0f4789a81dc3b3033ce70785160291b0b4c623f17d5bafc7059c', 1),
(169, 91, '2017-11-21 10:52:31', '2017-11-21 11:52:31', 'a5519eefbf75302baf604837daf4b89aac8a201dbdaa887fdacf80602560f73f', 1),
(170, 84, '2017-11-21 10:55:04', '2017-11-21 11:55:04', '5c16ef765f78a347aac4fdc4ba9601860adc703bd7ea3a61bda616835964966e', 1),
(171, 87, '2017-11-21 11:02:43', '2017-11-21 12:02:43', '119e8a7c2d8a569389f0547ed8067506c0217aaa4505168fea515fb311c6aa87', 1),
(172, 84, '2017-11-21 12:52:29', '2017-11-21 13:52:29', 'bd9f74a9e084271cdc045359f7ad153f059ca2f2dc0975d02a595bf5d068a142', 1),
(173, 84, '2017-11-21 17:30:42', '2017-11-21 18:30:42', 'b53e993ba399fd1c3c4de0b2b2878e46962cc7c59ac17e4bae1582df3bf0ec18', 1),
(174, 84, '2017-11-21 17:41:26', '2017-11-21 18:41:26', '994ab471d245d8d8acc91d02b6d08ebd374ad5b1312078c3ea46676ca49e7a58', 1),
(175, 94, '2017-11-22 06:26:49', '2017-11-22 07:26:49', '7fe20c55362209b41ad5f48a39e63a367ec77dc8bf4b33db2b63816a1922529c', 1),
(176, 94, '2017-11-22 07:01:32', '2017-11-22 08:01:32', 'b0d242782774a0dbc980ede15bc80316807a374eac55197f748dbeb17e96f9e8', 1),
(177, 84, '2017-11-24 17:37:57', '2017-11-24 18:37:57', 'a58a4a1d7f0ef79bd1741c225a8bffc8890769801a112c7262138fe4663e915c', 1),
(178, 95, '2017-11-24 20:19:33', '2017-11-24 21:19:33', 'baff1b3e57d1e6393626fbe12b1c339c6a27ffa5df7f6ef382a4a4c7dba814fd', 1),
(179, 95, '2017-11-24 20:22:07', '2017-11-24 21:22:07', '84a994e47b285c9f7c15a7b7171e40064f1f472916350077db81ff999c808c44', 1),
(180, 95, '2017-11-24 20:41:22', '2017-11-24 21:41:22', '1c502c396f48fabf348e8753aacf3b014562d05e09e1b3b54d9fcc32762e11a9', 1),
(181, 95, '2017-11-24 20:42:28', '2017-11-24 21:42:28', '298d9e8e5f358ec3d15b1a59ff0e4fb7fce90e0e12531bc06714a42606dc1c7b', 1),
(182, 95, '2017-11-24 20:55:26', '2017-11-24 21:55:26', '91c30867ed7e1988dbe003b9918646898b748aaaecf3254d4339ecdc38cced04', 1),
(183, 95, '2017-11-24 21:06:01', '2017-11-24 22:06:01', '6e57236e8aeed17215f604008976166bc160b4c94328d31d6370097ddadede85', 1),
(184, 95, '2017-11-24 21:07:23', '2017-11-24 22:07:23', 'aadd71fb6fc40265c61c5fc0536244e7064e3e342cb2421e7b3b817fc18f8af9', 1),
(185, 95, '2017-11-25 09:57:19', '2017-11-25 10:57:19', '56f2a385a005a4e544f0cd8e00f90d767d146df4af884e631c5515c54930f64b', 1),
(186, 95, '2017-11-25 10:00:07', '2017-11-25 11:00:07', '8a3978b1497f195b64a4a8a2d3fbff8ad66b5d3e83ec796f2e7bca3d8a8607e4', 1),
(187, 95, '2017-11-25 10:01:50', '2017-11-25 11:01:50', '83515f9ec1a1550a48643c9b8a1d09253f6db61d6cd9417d5588a5e00372fabd', 1),
(188, 95, '2017-11-25 10:06:26', '2017-11-25 11:06:26', '99098dedabfe8f559240aace78e732e4724925c2880419b528cdacef31f6e747', 1),
(189, 95, '2017-11-25 10:08:31', '2017-11-25 11:08:31', '5a2febfcc1b0b3e5ee5f023d3c7a40b653ce3a887b3ba568615a61873e1b61e3', 1),
(190, 95, '2017-11-25 10:09:48', '2017-11-25 11:09:48', '7b14f4a7e251ed5f639c85a3aaba85c5f988f6892a8a51a649ae80aaf76a26d5', 1),
(191, 95, '2017-11-25 10:10:56', '2017-11-25 11:10:56', 'd9880995a9349d0ebfa11703cb6923f641352724dab655b37721c9a5ac9a23fc', 1),
(192, 95, '2017-11-25 10:12:20', '2017-11-25 11:12:20', '23d1f71bd621f4a3a461b70fc873f08edc992f790a6f21eec96ae0e432da1e09', 1),
(193, 95, '2017-11-25 10:12:53', '2017-11-25 11:12:53', 'a2805ea5911230564b826af13d48c89f3be0a30e765314f9ffdb942d8c312708', 1),
(194, 95, '2017-11-25 11:30:13', '2017-11-25 12:30:13', 'a1dd18f324e4756091d3bd888cf7c9512c343c4b89d04306165516ab400a3f9a', 1),
(195, 95, '2017-11-25 11:36:06', '2017-11-25 12:36:06', '2839db16c15f1b13288c6b1245e5a3ce4bce4fa7359e20260c6867d75fb9abc6', 1),
(196, 95, '2017-11-25 13:08:38', '2017-11-25 14:08:38', 'd7b6992db929d2a4610e73d092a5b0f49d2d48b182eedb9b979535ad9fd2ea7a', 1),
(197, 95, '2017-11-25 13:56:13', '2017-11-25 14:56:13', '4206daf07fb3a5dca59cdf16b828aa9411ad0305b7d684f4c825c92531e3ed1f', 1),
(198, 95, '2017-11-25 13:57:06', '2017-11-25 14:57:06', '488921b780471ce2eadf6ff07e54d276ab0a2bd77f1589c383599fdbe101196b', 1),
(199, 95, '2017-11-25 13:58:41', '2017-11-25 14:58:41', '55dd59f768f7eca395cab6bc1298dd9619199281bb3e38bb9c02f38b8165c08f', 1),
(200, 95, '2017-11-25 14:02:41', '2017-11-25 15:02:41', 'f9441d6e86fedc5f19fb252627ce7c6c362f1db438b33d89920b6d07cccb09b1', 1),
(201, 84, '2017-11-27 05:19:28', '2017-11-27 06:19:28', 'c2ab03e878b3b069c1396927f077f4ac946d6dede3f3f75d62793026cb3d1001', 1),
(202, 94, '2017-11-27 11:39:04', '2017-11-27 12:39:04', '31e73e425b7028382965cd92b6122868a4b2195439448214d250beeceb882ef1', 1),
(203, 84, '2017-11-28 08:26:49', '2017-11-28 09:26:49', '99f8637dc47a33ad6584204d15004c76486af9c4b1ae07580e0898ca9dd2277b', 1),
(204, 83, '2017-11-28 10:43:45', '2017-11-28 11:43:45', 'b559f25dbf590bfa37c4eb94a592a3560ac7c4a31f147b3fbe6f02cb32968049', 1),
(205, 83, '2017-11-28 10:43:48', '2017-11-28 11:43:48', 'e0c64d26ec8f1698460760d8c4dfb0adf5ff180bc30d1ea8dffd59e171d0a7a2', 1),
(206, 83, '2017-11-28 10:45:23', '2017-11-28 11:45:23', 'a825da09ddc3cb91475b3c0190696590a256e5cb42a608ac91f89b486051c793', 1),
(207, 84, '2017-11-29 05:44:50', '2017-11-29 06:44:50', 'b7b681438246068d62b110c0b4101189dbed0e46caae7091807631569b934846', 1),
(208, 84, '2017-11-29 05:45:22', '2017-11-29 06:45:22', '920534373dde0cf2863db82c5c2e408f15e7cea5d08e329023c33bb74a2186d4', 1),
(209, 84, '2017-11-29 05:47:07', '2017-11-29 06:47:07', 'bda977c446adfd59d9ac2c1eebb04e54c9d9f71ff093f6623c379efe380cb465', 1),
(210, 95, '2017-12-02 13:18:37', '2017-12-02 14:18:37', 'f3993d54f8b7a9c7b5d2f6c50500c8818a8b30186c9378a37d073adb49062c20', 1),
(211, 95, '2017-12-02 13:49:02', '2017-12-02 14:49:02', '0604c43d48313662ca87c22efc090c5c319965fd0f1fe958ffcb3e8676611b07', 1),
(212, 95, '2017-12-02 13:52:35', '2017-12-02 14:52:35', '086768cc854c4d2f56219d3a3ed6a6a4453f9675f9cb8a7c01f90af3b7422b4c', 1),
(213, 95, '2017-12-02 13:54:36', '2017-12-02 14:54:36', '3a2726ed7989adc1fc0ecf6981aa2ecbf4337f92da11a435d030530c0f03e415', 1),
(214, 95, '2017-12-02 13:55:40', '2017-12-02 14:55:40', '8ec44053da99ee78e2f3e31254d17839e06e406a05cf98854071872b841a92e4', 1),
(215, 95, '2017-12-02 13:58:16', '2017-12-02 14:58:16', 'fcaf91ad3ce43885411487d20ef91a98117a660d381b12cfe34c004e0f236ed8', 1),
(216, 95, '2017-12-03 18:57:09', '2017-12-03 19:57:09', '589968e34bf13d3cef00c915fb2749fb188fc1261746f2710ee9e86c7ec0ae39', 1),
(217, 95, '2017-12-04 17:38:16', '2017-12-04 18:38:16', '06f665f8826dea61ab6c0d99d00045ae5cb48724ca201f0e3061206bd401dc98', 1),
(218, 84, '2017-12-05 10:23:52', '2017-12-05 11:23:52', 'dafcf107a68092793130f96ba6c3938de72ee6a1d282eeac16e9753d46cd0178', 1),
(219, 84, '2017-12-05 10:25:08', '2017-12-05 11:25:08', '3049c9dc20e07159f05b3b3eacbcc40da4e997dd5b7fe486c94b7601ba5874d6', 1),
(220, 95, '2017-12-05 19:24:24', '2017-12-05 20:24:24', '057bfb64817447ab8153d8bce471e668f9f3240be8381be62b18ece806bba993', 1),
(221, 95, '2017-12-05 19:33:58', '2017-12-05 20:33:58', 'fa80da0c6c7dd65dc63bb892d523bb65bc28909804e6e44931fd29af331b325d', 1),
(222, 95, '2017-12-05 19:36:02', '2017-12-05 20:36:02', '12abaeb3a894ca69bf85fe98f5b93911efcec956bc77108f410ec70b3ff3f3ba', 1),
(223, 95, '2017-12-05 19:37:10', '2017-12-05 20:37:10', '6f1a4afe1991bdb45f09d310d683fea02b55a9f5214fded741ba5c93de5c368e', 1),
(224, 95, '2017-12-05 19:38:40', '2017-12-05 20:38:40', '7111fc257d2a11550c29e1bd638aeccdbf3dcdd7b7a517804485100fe69d6b86', 1),
(225, 95, '2017-12-05 19:38:56', '2017-12-05 20:38:56', 'ba4179da4798371efc4a5703132618c9a71eedef6dab4718ff3e470fc0f637d7', 1),
(226, 95, '2017-12-05 19:41:29', '2017-12-05 20:41:29', 'e5271e8137b34ea5abf5e02316e5e7c683db99eea4ea304cfeecc076a895d63f', 1),
(227, 83, '2017-12-06 07:22:37', '2017-12-06 08:22:37', '58d7735551e772275f6bd4494572804eeb11bfc7da51745b7ecb53384141bc06', 1),
(228, 84, '2017-12-06 12:37:12', '2017-12-06 13:37:12', 'cec8104024dac09b424eff0a41d9f77a11bf0b5f8a56b44bd5e4304639233d68', 1),
(229, 95, '2017-12-06 16:08:33', '2017-12-06 17:08:33', 'df5c4cc006158f3bf9ca421dfb0837d9598d3cf2c85717a09d1f01a07f42ae24', 1),
(230, 95, '2017-12-06 16:24:04', '2017-12-06 17:24:04', '25caf543eda4c570958792a570fefe4d377952e945c21485eedeb5b8d675a4d9', 1),
(231, 95, '2017-12-06 16:24:39', '2017-12-06 17:24:39', 'cbdaff1892a189216b6e4235a581347a3d911483c7f29b6cc88205890f1efed1', 1),
(232, 95, '2017-12-06 16:25:45', '2017-12-06 17:25:45', 'f731a7847c7a657e483b1411b78408fa9d373272a2773e053d2fff7224204516', 1),
(233, 95, '2017-12-06 16:49:02', '2017-12-06 17:49:02', 'b5a9ea5c0a23771183f6f9ae80eccbe3a5fb1eb3a7060f5563e1554e517f921a', 1),
(234, 95, '2017-12-06 16:50:17', '2017-12-06 17:50:17', 'a51228d0be9636cccba345892414a302fdf6a40aedc225cba0cc762e59bd824c', 1),
(235, 95, '2017-12-06 17:00:57', '2017-12-06 18:00:57', 'cb977d5c44592a3d941234f67d016c585fa320bbcff0e09fdfd3df8ed194013b', 1),
(236, 95, '2017-12-06 17:13:02', '2017-12-06 18:13:02', 'd5dad3997a8464811d38f1cf187c0c49aa42a0b0337eae6cf67da84ac979e559', 1),
(237, 95, '2017-12-06 17:14:29', '2017-12-06 18:14:29', 'f60ef4f45147e02715cb3392403a8708f566b8992451e2f57493a4f8d90e21ee', 1),
(238, 95, '2017-12-06 17:27:20', '2017-12-06 18:27:20', '6fb8d53f01365e5c97288a4001a446c7642313a944262ecc4113afab01bef90a', 1),
(239, 95, '2017-12-06 17:30:54', '2017-12-06 18:30:54', '9adb6aeee9c57ee334cf1fa88f1aa69d1d0202e6c1ae78d827017b52aa2b2521', 1),
(240, 95, '2017-12-06 17:36:13', '2017-12-06 18:36:13', 'f78fe9e10bb2372ba6e297792290dcdc8d041f82d0adcc92067268ac116a5a92', 1),
(241, 95, '2017-12-06 17:37:04', '2017-12-06 18:37:04', 'b6547bbb94dabc64fbd2a6f598a351e679a99c5e209213d29cf7d13644bcc720', 1),
(242, 95, '2017-12-06 17:41:21', '2017-12-06 18:41:21', 'c3d9bdea6a30cf2f7a250ef727c18bd87f0a9d4c00de55137b2fca5ee7b24067', 1),
(243, 95, '2017-12-06 18:02:56', '2017-12-06 19:02:56', '8a3f903ec96af5489df221326c1183bf4ff7ddea4fdc96e02b09106fd83cbc24', 1),
(244, 95, '2017-12-06 18:03:40', '2017-12-06 19:03:40', '6bf31bf7dba3cd99cf4d5179a084207b3e0c8827d598649ef72a2b1273150d9a', 1),
(245, 95, '2017-12-06 18:06:45', '2017-12-06 19:06:45', '9ec1040a3e04e3e10cd289ddd6ef06fee5944d8b25186bdc35e8a348536af295', 1),
(246, 95, '2017-12-06 18:08:12', '2017-12-06 19:08:12', 'fe5d3a55a4dd20781eeb31be18be2ef4f92bf130a4b1e6efaa499d1e71b23eed', 1),
(247, 95, '2017-12-06 18:09:17', '2017-12-06 19:09:17', 'af2750c3dff855f5d7cf7fe4c7941c4c7454058404a693cc70db2121bf53776e', 1),
(248, 95, '2017-12-06 18:09:17', '2017-12-06 19:09:17', '2fe5923d6d522b88bdb970c105b8935ff547a2b30d24cd8687a874f4a9fd0668', 1),
(249, 95, '2017-12-06 18:19:06', '2017-12-06 19:19:06', '04f1d27951a129c1be01d48b000a6cbfba220a4c87de7d5b86e58e71d827b175', 1),
(250, 95, '2017-12-06 18:20:14', '2017-12-06 19:20:14', '476d9fe33835795b5b4b5a858ba8883dcc364df9c77c55e65925524e835bbf6f', 1),
(251, 83, '2017-12-07 10:24:15', '2017-12-07 11:24:15', 'b110b6978518e02b09e68d0ba047bd6c19e82dfd5774bfcaf73e66adf8714ad6', 1),
(252, 84, '2017-12-07 10:42:46', '2017-12-07 11:42:46', '66e0980e4f0845864300506235c7723a37591f59035a4bf5580dd57d0ab5e2fb', 1),
(253, 84, '2017-12-07 10:42:46', '2017-12-07 11:42:46', '3da701428229df6068fb100b06525e313836b8c1f411bd87a113b39a126d6acc', 1),
(254, 84, '2017-12-07 10:43:18', '2017-12-07 11:43:18', 'a8a59c3adb8445c02cbd30cb9f225dd41223b0d8521aec97ed07fbe0c5d26c4f', 1),
(255, 84, '2017-12-07 10:43:51', '2017-12-07 11:43:51', 'd54f13d510e374a50d9db0e432ae7ecc3ae04022f026960323a0ac8dc496ddc4', 1),
(256, 84, '2017-12-07 10:44:11', '2017-12-07 11:44:11', '9bb7fcca373836fdb3e7d7b1d50c8f6da448f184d1b93fd5a40783f0f6ff27f7', 1),
(257, 83, '2017-12-07 10:54:48', '2017-12-07 11:54:48', 'a9d5bd237ca7980e2b381b68372b9cd72b9c372f7eda7f66602cd9eda1ad79bb', 1),
(258, 84, '2017-12-07 11:03:00', '2017-12-07 12:03:00', '3044a73141fd92b656be0dc9584ed0cb6f49778e32c4ed0eeb9bd683f4e6f623', 1),
(259, 83, '2017-12-07 11:03:54', '2017-12-07 12:03:54', 'faeb7f2d459d19b4cfc3fbcbb240328edaa36b29015d74baf27d44d385440f01', 1),
(260, 83, '2017-12-07 11:04:13', '2017-12-07 12:04:13', '5be07f4d1c06bb64ccc52c95f500c316af3ae4b7ccbbad8b54771cc28bfcaa91', 1),
(261, 84, '2017-12-07 11:04:39', '2017-12-07 12:04:39', '5529bc3b07165711dd03b4ecc2eff2113cd7278eaf7870616d6f18e101994a1a', 1),
(262, 83, '2017-12-07 11:06:25', '2017-12-07 12:06:25', '375cf882b7a757c5c0f850914240c9d90cf3b4f229617ad5d3f4d4e4885a43b6', 1),
(263, 83, '2017-12-07 11:06:54', '2017-12-07 12:06:54', '825d8ed2843ec467744dce59ce20232dc337671810d202269302a58f64903ea4', 1),
(264, 83, '2017-12-07 11:08:39', '2017-12-07 12:08:39', '44bd0e291ea64576a79f5118ec32fec1e0767e17023094343446722166f302ef', 1),
(265, 97, '2017-12-07 11:10:32', '2017-12-07 12:10:32', '9f6c22c001e06abeba4ecba6e840f528daf678295fc5ff89f5b87069519ab834', 1),
(266, 95, '2017-12-08 06:22:05', '2017-12-08 07:22:05', 'b2426ee8c0ed72aac9c78543ad1177cab072b07ebc298ac7eaa6841e969920e0', 1),
(267, 84, '2017-12-09 10:18:52', '2017-12-09 11:18:52', '38082a9641c4961824d3aed2f7277d8d6f61c89e46574a75671ea43ca29fc1d6', 1),
(268, 84, '2017-12-09 10:19:17', '2017-12-09 11:19:17', 'a45ed08a060aff5e469048e62fc8ef33519b6cc6f025e1ec7389cf96f79b05b4', 1),
(269, 98, '2017-12-24 11:58:00', '2017-12-24 12:58:00', '1f3d263e3a583a0a56f3fa26b424aef0400198e61a3e9f976d0676c716425011', 1),
(270, 95, '2018-01-06 16:46:27', '2018-01-06 17:46:27', '6efbafc89078e800d9c8a62a82dee90340a07d462d1b367a7f0c63a014e91be9', 1),
(271, 95, '2018-01-06 16:47:48', '2018-01-06 17:47:48', 'bec46b9ba5ea8add5f366e3ff4cd402c2aba635eae96103ba19e5af8406437cd', 1),
(272, 95, '2018-01-06 19:30:27', '2018-01-06 20:30:27', '6651bbfdd733abe8d12056c55f01c9694ccdbfae9499334bf9681131d787dc91', 1),
(273, 95, '2018-01-14 10:34:38', '2018-01-14 11:34:38', '07278d777dd76854b7b3266a965455ce98484a0f6c1af4c413701ae7ac10ce8b', 1),
(274, 95, '2018-01-14 10:35:47', '2018-01-14 11:35:47', '05f5189688e663637d7068c62f9bf887112cae23149ea7e83590888ff8ea80a7', 1),
(275, 95, '2018-01-14 10:38:57', '2018-01-14 11:38:57', '125de060d3811c5717f0ffed15227536e16a7930ec2786b407094c6372bc04de', 1),
(276, 95, '2018-01-16 14:50:10', '2018-01-16 15:50:10', '1053fcd82b06205e33a7e2d1c921663f9e6266347b9d2879ee5fdc7bb4b19e74', 1),
(277, 95, '2018-01-16 14:51:29', '2018-01-16 15:51:29', 'a503a0aef98d78c81290e889c395ac09a4790e81073a29bd90147e0ccb2a7475', 1),
(278, 95, '2018-01-16 14:56:39', '2018-01-16 15:56:39', 'c4d1b8e1c22c8bc8844f71cf04e2d3004246eacbdbbde16c765ebc24cded63ee', 1),
(279, 95, '2018-01-16 15:00:40', '2018-01-16 16:00:40', 'de38755122943f1fc76e1231733fade01fb8e1e1f9e3bcd9df5fd3ef6b008a3b', 1),
(280, 95, '2018-01-16 15:01:22', '2018-01-16 16:01:22', '720e517373462f1afbe5cbbd3f3f3b755a6a9b9aa34df322133de95574e80813', 1),
(281, 95, '2018-01-16 15:01:46', '2018-01-16 16:01:46', 'b51b6f430ea94b779b46f85e4c7eec4da237009e8c66776a6fee9e5505ee626c', 1),
(282, 95, '2018-01-16 15:07:43', '2018-01-16 16:07:43', 'a095e8d8ca77ddf1f503513a89f20f6b7ce65a5189999325e02485bbedd858c7', 1),
(283, 95, '2018-01-16 15:08:09', '2018-01-16 16:08:09', '14a057efed6f41159e47564ce731fe2bbecdf891ee4e6390d22eae09b1dd8114', 1),
(284, 95, '2018-01-16 15:09:38', '2018-01-16 16:09:38', '498fd5936a3244815277511d58f829e9975bc0b344800e758e01cb4ad649bf79', 1),
(285, 95, '2018-01-16 15:13:08', '2018-01-16 16:13:08', '837c9f58d5e682ce6d368f31ce24a8a5723bdd67effd6717b63a23142c2c65e3', 1),
(286, 95, '2018-01-16 15:14:55', '2018-01-16 16:14:55', 'ac4c68434649c61a6c0595eeeae96d195bf3be0ba22177e3030307a23b3b2b31', 1),
(287, 95, '2018-01-16 15:19:21', '2018-01-16 16:19:21', '91f0eca877f72fa115355564b81ae93fc914a37d34a7fe8a2335ad7ef2bf5fd7', 1),
(288, 95, '2018-01-16 15:39:39', '2018-01-16 16:39:39', '58cf9a055a0646affcc222b09fb46b2feefb8b0541751813ab17b6af5d021775', 1),
(289, 95, '2018-01-16 15:43:21', '2018-01-16 16:43:21', '571d62011d37f378980f860cb134474fa56f6ef2ca92c674722349838043b344', 1),
(290, 95, '2018-01-16 15:58:04', '2018-01-16 16:58:04', '9311085089a4c129f47bd4e7ebf6e19c66cba6c7ff905b5f501a8af03d4525fa', 1),
(291, 95, '2018-01-16 16:03:28', '2018-01-16 17:03:28', '9f3fba74635e15734e2c1e109b7be92faa4aed533622d53f04f073e4ff47c80b', 1),
(292, 95, '2018-01-16 16:07:52', '2018-01-16 17:07:52', '79ba18d12401dd44a93f5e03d465b439b39dd2a9adf4239db3e97fca72f60e6b', 1),
(293, 95, '2018-01-16 16:44:38', '2018-01-16 17:44:38', 'cc6d9cb00ce488014c8a4f2ef7e3a4a857ffb4696be34ba0f7f5f762ef6a9480', 1),
(294, 95, '2018-01-16 16:45:50', '2018-01-16 17:45:50', '5940630003151890c64a131cd0ebc320974638026355f2e08542001dac51cd90', 1),
(295, 95, '2018-01-16 16:51:03', '2018-01-16 17:51:03', '94cb3f01594b5d1e6907d539fd1953cf38934eb6cb90d0bd107db5f6800b9211', 1),
(296, 95, '2018-01-16 16:52:24', '2018-01-16 17:52:24', '0331be37c7f5dbeaceeee15e22376e0564b37ddb72bd76be90db4e22d4aa762a', 1),
(297, 95, '2018-01-16 16:58:27', '2018-01-16 17:58:27', '6958d4a373b4147b00f748067157dfd707918ee06630d0376854a9cfb2f1422f', 1),
(298, 95, '2018-01-16 17:02:50', '2018-01-16 18:02:50', 'fe01abdb67616192ac4d038c8ebe29e7307f4b926aace994bf4f9ea80a6577ce', 1),
(299, 95, '2018-01-16 17:13:13', '2018-01-16 18:13:13', 'b31888c26dc54566a10dd98d5c747bb4d2ff9db6fbc27b1401ac6a3ab81ba6c7', 1),
(300, 95, '2018-01-16 17:14:53', '2018-01-16 18:14:53', '7d8087faff5d1b536462d5807ba43fab6fa0821305cd7b92504b6cf572077a14', 1),
(301, 95, '2018-01-16 17:15:59', '2018-01-16 18:15:59', '50794e88d1ae15eff75014c7375516219621c0169f690511cc6f73ffa0d00e63', 1),
(302, 95, '2018-01-16 17:16:28', '2018-01-16 18:16:28', '5485c305d547755586f5016642b069c91673ecb0a0d6199c3ba6f4e92674f57b', 1),
(303, 95, '2018-01-16 17:17:04', '2018-01-16 18:17:04', 'a0cbc18a5b933d8ceb71971fef163f2b49e5fc14f5ff5d62c7bb3638a119989b', 1),
(304, 95, '2018-01-16 17:23:20', '2018-01-16 18:23:20', 'cdbc8deeb35411f778a63b852412b8f42ed53df0cea4b9f617fda78d52a80ad6', 1),
(305, 95, '2018-01-16 17:25:30', '2018-01-16 18:25:30', '283d89a1f046359fbd8cfb25f651ae14b6622244d59d50d1f8b9326261f81c43', 1),
(306, 95, '2018-01-16 17:35:32', '2018-01-16 18:35:32', 'd64ef536fd0dfb8f827fa4aa35b73395a4c5b87282be64763f600cf65500dd2b', 1),
(307, 95, '2018-01-16 17:42:39', '2018-01-16 18:42:39', '3e7ec37c4ac52b6e9b306f8da77d3bc2f5b24035572d6df81701e1fff94bdb34', 1),
(308, 95, '2018-01-16 18:06:38', '2018-01-16 19:06:38', 'a3a5d11c27bfa529f9c9a25d745879eae8c65adad00b8bcc62673ad9cfe33e79', 1),
(309, 95, '2018-01-16 18:12:45', '2018-01-16 19:12:45', '326a183054d82cec3e2beb8010da1e6a2f81d660a40d4164eb2864a63df7c791', 1),
(310, 95, '2018-01-16 18:16:53', '2018-01-16 19:16:53', '863e39dc1e3fa7efe39b6b90ff1e32c57bc09f0c3d77f872e561908e58100de3', 1),
(311, 95, '2018-01-16 18:19:46', '2018-01-16 19:19:46', '5626be0d85d1cd632eabb0ebbfa9e1cf7940ca5d4ceea79c6cbe64effbf3e868', 1),
(312, 95, '2018-01-16 18:31:17', '2018-01-16 19:31:17', '41675fbfc96e696db99cc2e051dfc2c3d27d5ccdebd7f4ef674ebbd0e38b9f5e', 1),
(313, 95, '2018-01-16 18:31:53', '2018-01-16 19:31:53', '763354702fbdd435c4943df243152d97866774966dae5f57f91fc532879fed12', 1),
(314, 95, '2018-01-16 18:32:38', '2018-01-16 19:32:38', '32686c56c482018af4328a1b884164f6aa56af2ce515425ff0a19676926a9d13', 1),
(315, 95, '2018-01-16 18:35:15', '2018-01-16 19:35:15', '8625b479e1ecfeed6e4164cead274867767c30dff6d1b1d00fece20b898dfdb4', 1),
(316, 95, '2018-01-16 18:38:15', '2018-01-16 19:38:15', '48e1e204fc83aa4547b2cc8030abd77c8460b94cbb60347cbc23a980cd201d00', 1),
(317, 95, '2018-01-16 18:40:46', '2018-01-16 19:40:46', '3be47d327d428453531892d8dd371b2f39d1c5058cb2c7b96736bcee3ecd738b', 1),
(318, 95, '2018-01-16 20:07:18', '2018-01-16 21:07:18', 'af1cc5ec5547d40764c679bd419c4cb60b360fff84eaac84898595a806623583', 1),
(319, 83, '2018-01-17 14:25:17', '2018-01-17 15:25:17', 'e982f1c757d79399a1d1938ce6076f377f4ccac60f27bcc7e01cf993172c6200', 1),
(320, 99, '2018-01-17 14:26:13', '2018-01-17 15:26:13', '4871eb7ddd1838bdc4de21932463e19570e3c5f6ff245038c0fe75b5055bec08', 1),
(321, 99, '2018-01-17 14:26:17', '2018-01-17 15:26:17', 'eaf41a32d4cb43c75bab7fb2a4a798a3dc230e8e98f6683c04841859ba4e4488', 1),
(322, 99, '2018-01-17 14:26:54', '2018-01-17 15:26:54', 'ed9e466eb2bf5989829d3b8d2c893723fed0619ef3582db9810daddeb7aa5e39', 1),
(323, 99, '2018-01-17 14:27:43', '2018-01-17 15:27:43', '2c86223c4ac87de70f8306f78dccc51e9e74563682a342d91686a2edf10a365c', 1),
(324, 99, '2018-01-17 14:27:44', '2018-01-17 15:27:44', 'be1189ec0b4f3531c5a13f96de259778e18219dd48bcf9fe1001fb97db6b9e46', 1),
(325, 99, '2018-01-17 14:27:45', '2018-01-17 15:27:45', '96d480996b148944e58d99b9ea2afc5283eb1aa93d19f3c92c4d0edfc8b779ea', 1),
(326, 99, '2018-01-17 14:27:50', '2018-01-17 15:27:50', '9adfa2a91a5bfd8214280b8ece11070aa6c382fb3d6b9516b3491827838cf3b8', 1),
(327, 99, '2018-01-17 14:27:50', '2018-01-17 15:27:50', '870dfc381fab0f56a2da2a3084f717007cacb4da0d1aab2fd8ecd2c72d83ad28', 1),
(328, 99, '2018-01-17 14:27:50', '2018-01-17 15:27:50', 'eaa007a50a791331b67dee18bec1245e3e8c73731caa6de7b9976a92edd70322', 1),
(329, 99, '2018-01-17 14:27:50', '2018-01-17 15:27:50', '4790218cfb727291b8cc16f99ac7bce741f6b6f2fe15f4d16db51bc1693b6ccc', 1),
(330, 99, '2018-01-17 14:30:00', '2018-01-17 15:30:00', 'e26376b19635ff71c05a6c4f4350095117b2662d0f5207fc173d48db1a4ce369', 1),
(331, 99, '2018-01-17 14:31:45', '2018-01-17 15:31:45', 'f5c13fe33b685f41ca32ccb716e765c07e0e3dee15b66bcc30acc8415b8fc9e6', 1),
(332, 99, '2018-01-17 14:32:49', '2018-01-17 15:32:49', '8b5c4ff855482b28a67a3091a2e4a1a067745b26e483b1e537c2bc1a550ee56c', 1),
(333, 99, '2018-01-17 14:32:53', '2018-01-17 15:32:53', 'b3f6cea6e863937af72acd8496bc5f7f65a38b8c40a80637f64ccd93a698d7cf', 1),
(334, 99, '2018-01-17 14:32:55', '2018-01-17 15:32:55', '4e23e80122b957255bce8271ceda9af18f5de804be78938a7852aa0d898303f6', 1),
(335, 99, '2018-01-17 14:33:18', '2018-01-17 15:33:18', 'f97e4a850b7aad97617490df17eefac993b93fb2bfe6c8126e0e0257ff40260b', 1),
(336, 99, '2018-01-17 14:34:08', '2018-01-17 15:34:08', '53c57fbe142ff7a0f4d97d2780ff9eec625eff33b3cd784064bac9c21c0ca48d', 1),
(337, 99, '2018-01-17 14:34:18', '2018-01-17 15:34:18', 'c08f4082355e85158534416e3cb743e9a3dc56b3e95576695a9da3c8ef336838', 1),
(338, 99, '2018-01-17 14:35:08', '2018-01-17 15:35:08', '6cf63fd2ef76f767666020b225a6669b719debe75ed1d4c79fc8da05616118d3', 1),
(339, 99, '2018-01-17 14:35:28', '2018-01-17 15:35:28', 'efe2fa341760c29507b0620a8eeb37a40a2914a2a256294dc2c25ef4d074b7c9', 1),
(340, 99, '2018-01-17 14:36:56', '2018-01-17 15:36:56', 'a044a17f6dfd337194e7f0afc7ec83d9fa5fc8639fdf2b779c7555bd87a748d7', 1),
(341, 99, '2018-01-17 14:37:12', '2018-01-17 15:37:12', '06bd4d6b0f41385e5a7c1cfbbc0543d7ab90fa18d4226f0dc659cc18c859a55f', 1),
(342, 99, '2018-01-17 14:49:58', '2018-01-17 15:49:58', '18ec9c3fb49e56d37479f9f656a3cf75ac425373843b11f564251e32ec05b842', 1),
(343, 95, '2018-01-17 16:08:21', '2018-01-17 17:08:21', '3082c7c200e6cd28d40bd12730c5e7b0cd04b8fe3cad5fb489da79819d8b0a8e', 1),
(344, 95, '2018-01-17 16:28:51', '2018-01-17 17:28:51', 'e12de91f550741b8e62b893c1ef66e2c8fff6b33d8388bc2ec9e2fce3593fb8d', 1),
(345, 95, '2018-01-17 16:30:31', '2018-01-17 17:30:31', '0f32e69a602f9bb35e078234441ebf88f821163acf354113c78605eb16debb48', 1),
(346, 84, '2018-01-17 16:31:31', '2018-01-17 17:31:31', 'f5e008abe64956fab1a0c411f3c1b29467471799504f9295847fbbbb14f667ac', 1),
(347, 95, '2018-01-17 16:39:09', '2018-01-17 17:39:09', '1b4c0a75fed5bd49f167f20e42b6df05b1634588cace068442b3a64c63815af4', 1),
(348, 95, '2018-01-17 17:01:04', '2018-01-17 18:01:04', '0ffdd37da09b89cbc14adad8a4c1a5d51d75aad5d553c509b717e049f7ce3f81', 1),
(349, 95, '2018-01-17 17:02:40', '2018-01-17 18:02:40', '3e3cbc65f224f41e10c9a4f764e450931e5c3e5b38584d390aba47180919dd10', 1),
(350, 95, '2018-01-17 17:17:40', '2018-01-17 18:17:40', '10f683cb4e465d2c286fa378a3e54ecfc0303df60fe294f04bd85195c1727b5b', 1),
(351, 95, '2018-01-17 17:17:59', '2018-01-17 18:17:59', 'ffacb5870a74b0f48bbfd89aaa2b9e171298f59d3a8b9a32c5a971e31c93e90f', 1),
(352, 95, '2018-01-17 17:18:37', '2018-01-17 18:18:37', 'a0645077d85181d8eeae8dc0426458328118e961b493cb833e645080eeb57476', 1),
(353, 95, '2018-01-17 17:18:37', '2018-01-17 18:18:37', 'f0cea1caa37f5384b095cc43bf1e18f8f42b202cda47c58cf74e47cf8b58a00d', 1),
(354, 95, '2018-01-17 17:20:03', '2018-01-17 18:20:03', 'f1a2008ae8cae652baf2e59cae8efe407b4f793e6db072ea6cdd6be929bddc34', 1),
(355, 95, '2018-01-17 17:27:25', '2018-01-17 18:27:25', '8b28a63e8959b4f218d1a438cdabc271f2d39cba8453ab0b08eabc0799033ac4', 1),
(356, 95, '2018-01-17 17:28:53', '2018-01-17 18:28:53', 'ecfd878e590e056a8286a6b8d85844e6c50e30c5aed07851770ebd053e245c7a', 1),
(357, 95, '2018-01-17 17:28:54', '2018-01-17 18:28:54', '32415aaa89914399f50a3ac3893db1872eaa4dafd39baf346b411a0f98700298', 1),
(358, 95, '2018-01-17 17:48:33', '2018-01-17 18:48:33', 'e9afc9b6f0e0b83dbabcd8b82ad3bc8a60a05cde8481e2861b145e0da632f3c8', 1),
(359, 84, '2018-01-17 19:10:31', '2018-01-17 20:10:31', '43cf0a291d8612c885c899c00ef4378d742e5dc4e12b030956314c9140df77c2', 1),
(360, 95, '2018-01-18 07:30:22', '2018-01-18 08:30:22', '20e278f04690039742da6797b24c11f6d0f943290af4b986c1550ff3d9a6c3df', 1),
(361, 84, '2018-01-18 15:37:28', '2018-01-18 16:37:28', '7733371febfe58e930bc28cdda8a9b5c1adab7d46a7216a8c5c7b9a0e2ed7813', 1),
(362, 84, '2018-01-18 15:38:41', '2018-01-18 16:38:41', 'b8aeb0930cdfea023577a3c630c3c8ff09864a5adc6ff31c77618d322793abdc', 1),
(363, 84, '2018-01-18 15:44:46', '2018-01-18 16:44:46', '58597888681cce30f8739da23e12524ada25a338b0c29844a9c3807e27716611', 1),
(364, 98, '2018-01-18 18:06:18', '2018-01-18 19:06:18', '37da5e9183af9a1e3bcb19306ade8a8e7db53c666f6aae4b653d92c1a93574d9', 1),
(365, 75, '2018-01-28 19:05:51', '2018-01-28 20:05:51', '8f82d2f9f0806c9d55d81e0eea539b64614d54955b3b1e41ee5efa115885e376', 1),
(366, 84, '2018-02-03 19:08:32', '2018-02-03 20:08:32', '1464f78cf06fe9cdf301f2f5a42c10b3c4b0276b5920ead443ccbad0c819600d', 1),
(367, 100, '2018-02-08 19:46:48', '2018-02-08 20:46:48', 'c784c303242143a8bf6aa5f98c5d83341ee2a59888056e76465a5119ca27bdd5', 1),
(368, 100, '2018-02-08 19:49:36', '2018-02-08 20:49:36', '93f320a58e599ccaf8f694bc97c8835be892db91ae82191cf3d30ab37123b121', 1),
(369, 100, '2018-02-08 19:50:17', '2018-02-08 20:50:17', 'f99509c44d96f1373be3e2e1e34fbca28c66b96eb8b1cf032b1d6db615e55ebd', 1),
(370, 100, '2018-02-08 19:50:43', '2018-02-08 20:50:43', '134fa08c40bab332446a33c26ae9e29c1377ce38d5ef22904e2067a20f61fa49', 1),
(371, 100, '2018-02-08 19:52:01', '2018-02-08 20:52:01', 'e8fb2c48746356e15297892f6256d68cc1aea66cc10f80f3e65672f88a90bcc2', 1),
(372, 100, '2018-02-08 19:59:24', '2018-02-08 20:59:24', '364df261e005eb831dc10fd2b2fe8c1ead55c41a8efbedbd96ed4065c339c758', 1),
(373, 100, '2018-02-10 17:13:23', '2018-02-10 18:13:23', 'b7574c0a196927dd884b5421a696c448a18a7c76fa4e0a67b499cb93c5bd9fd4', 1),
(374, 100, '2018-02-10 17:13:45', '2018-02-10 18:13:45', 'ff673f9b04b29e93daa35bc1c739901930673080b1cd6b32ade5a9946621a098', 1),
(375, 100, '2018-02-10 17:14:15', '2018-02-10 18:14:15', 'fea3080286f69f2043b9b51dfe90253a4aa145075e32b9e4c98b2c8ed582438b', 1),
(376, 100, '2018-02-10 17:15:35', '2018-02-10 18:15:35', '8cc2e4a9eef2324b9e201961203dde8e84f57d26b991013c03545b9d0b9481e5', 1),
(377, 100, '2018-02-10 17:16:54', '2018-02-10 18:16:54', '38884a59e6424134e54d02691190955eff2af2f4817be7756d4edd7466939aa4', 1),
(378, 100, '2018-02-10 17:17:26', '2018-02-10 18:17:26', '603d1961f9b9c83a42632e2a69af4e7916d4e69fe27778cfb8df11701a744cf5', 1),
(379, 100, '2018-02-10 17:20:33', '2018-02-10 18:20:33', '7db4f74980b3e89aa6f166bee00539acf89d588922462f4e364800176a2c63e0', 1),
(380, 100, '2018-02-10 17:22:04', '2018-02-10 18:22:04', '5b072dc92c7cb0694c1a67e1b75c996f9e5f2a91ed82b85b0a7d3a357420bdfc', 1),
(381, 100, '2018-02-10 17:38:28', '2018-02-10 18:38:28', '5f2610d8f817d1c5104f5719db60028e7d62246f2c9e01596e67922d0095c8d7', 1),
(382, 95, '2018-02-11 10:57:27', '2018-02-11 11:57:27', '37af7c37e7c8ed6f525d37480527ba01d1e0460f3b1f3fa22ffaa4e17a312d9e', 1),
(383, 95, '2018-02-11 12:43:53', '2018-02-11 13:43:53', '1d313dc6e760fbe47f6ba5884cb9f81bfc77c7acd947e8e7c1eefe778e06deca', 1),
(384, 95, '2018-02-11 12:56:07', '2018-02-11 13:56:07', '753eb6a7d818f79aa27a113cc5c37abb7ea582b7194317710f64021e507f73aa', 1),
(385, 95, '2018-02-11 12:58:29', '2018-02-11 13:58:29', '6bb634d2a8760ee0f2f5bff1b722d124c451fce48c9de7e95dabd9a379cb94c3', 1),
(386, 95, '2018-02-11 14:26:49', '2018-02-11 15:26:49', 'd046ec8c44c730ead210156b5e7874bd95eeac43a8aab7b3a4fded2a42ee49a6', 1),
(387, 84, '2018-02-12 05:53:46', '2018-02-12 06:53:46', '1d3273d51bd84363a696ce079c14d1bf22cd7b21370d2c92c424c341ebd8caf4', 1),
(388, 95, '2018-02-13 15:50:01', '2018-02-13 16:50:01', '71159a62f0b2fb54fd4d1769245ba1763e2d6efe025ebe46f95ab150c2160ce4', 1),
(389, 95, '2018-02-13 15:53:33', '2018-02-13 16:53:33', '6b626ec1e836083d2374625fc3847e1958071adabe5628c70bacec919041e41a', 1),
(390, 95, '2018-02-13 15:56:33', '2018-02-13 16:56:33', '088c5ff04d5795793db534263ee82d0495792f437e0a8019692c6ea885775de2', 1),
(391, 95, '2018-02-13 15:59:16', '2018-02-13 16:59:16', '16f377ad25e9d539871ddd6ca4264b708d7176615d91f493b807d5e8199deb9e', 1),
(392, 95, '2018-02-13 15:59:43', '2018-02-13 16:59:43', '38f1a36c253f9981ec26c455475c85f7f0e54d9cf57acdadbd199d40d6fb9ca4', 1),
(393, 95, '2018-02-13 16:00:16', '2018-02-13 17:00:16', 'b82fbdc17e0403fa3cf90de1e08da9c8a8da8f5fb7b1013db94455e4a0bbe761', 1),
(394, 95, '2018-02-13 16:02:29', '2018-02-13 17:02:29', 'da826357774027c6f31403077ab5ad3b701f16e7c7ce3dd7e6b1291959d196dd', 1),
(395, 95, '2018-02-13 16:03:48', '2018-02-13 17:03:48', '6a8cbd08cacd495eab905aa4d9d721cf973d36be64f193abe635a378dc9758cc', 1),
(396, 95, '2018-02-13 16:22:33', '2018-02-13 17:22:33', '851de23834de7c2765c7c63877709c390a9de2d4ddad3f26297cee71057a21ef', 1),
(397, 95, '2018-02-13 16:23:47', '2018-02-13 17:23:47', '1e11241287fe9ef5181837d9b769f3198d089711bfd0972608253b6da8299f1d', 1),
(398, 95, '2018-02-13 16:25:58', '2018-02-13 17:25:58', 'fc7deb1f2f83e97a0300a14285defd3060d2169388340d2aec95ba88b54a75d1', 1),
(399, 95, '2018-02-13 16:48:04', '2018-02-13 17:48:04', '5ae3480e631cf90469390e638c0e0504a04e1e81edb5780934abbc2dfc3efe21', 1),
(400, 95, '2018-02-13 16:49:06', '2018-02-13 17:49:06', '030de07f3f1c00794c076f454bcfee97eb881ffc066b9e75a7fb20c12ad63696', 1),
(401, 95, '2018-02-13 16:53:56', '2018-02-13 17:53:56', 'e5a669144d4f7437de7ff617c06e97d08e34932cc04d2d6fe558192893ea0727', 1),
(402, 95, '2018-02-13 17:04:35', '2018-02-13 18:04:35', '8b65b897baa1b55d416fdbf22e993769aac6c95acd78d60464348d5d8dcbced4', 1),
(403, 95, '2018-02-13 17:06:11', '2018-02-13 18:06:11', 'bf19328eb1319c394629e3918c12b6e94fee7956ad5d1eaf476de0ecfbc9687d', 1),
(404, 95, '2018-02-13 17:21:06', '2018-02-13 18:21:06', '38447d8908be1b68053f883c39c8f06a1089b7f5fa8bc6be6cc290f178f53492', 1),
(405, 95, '2018-02-13 17:23:31', '2018-02-13 18:23:31', '914e78d022ffcc28d1175c2e9a7cafb3b7819f0375e074f2d228d7948cc2f5ef', 1),
(406, 95, '2018-02-13 17:34:41', '2018-02-13 18:34:41', 'e0f2846f1c118f09abad9c3f37408dcf612eb8df0663e921f748270bf0c9cdcd', 1),
(407, 95, '2018-02-13 17:36:18', '2018-02-13 18:36:18', '109a8bcee0eff975b9c2324ee583bc0b7e1613f43e218d4c606cf01a21f499f6', 1),
(408, 95, '2018-02-13 17:38:43', '2018-02-13 18:38:43', 'a907b85c4b9b07b76a9fe8f9f1a32436d34cf0337b5f76381c4e3ec2cf2c4b93', 1),
(409, 95, '2018-02-13 17:39:37', '2018-02-13 18:39:37', 'ed181db500cd39638f689751a07cc19af6c4daeabf24395703a1dff18185ccae', 1),
(410, 95, '2018-02-13 17:45:20', '2018-02-13 18:45:20', 'cf33d6d22430a7e7663d96f2514163e7b1b99bf7487ff0cb42d910021de7a938', 1),
(411, 95, '2018-02-13 19:13:21', '2018-02-13 20:13:21', '1f58c3d3964c51fcd5a0eafa2cf9b0214235b0aaaa04e0858f59553ece817560', 1),
(412, 95, '2018-02-13 19:14:16', '2018-02-13 20:14:16', 'a8748eabfabf7d315d482a67fe493509a44dd03f14a4423a25b741f86b696671', 1),
(413, 95, '2018-02-13 19:14:53', '2018-02-13 20:14:53', '58610d43124e47846c02127c566b2c63d118d27e29f73131ee19c8f682ddba96', 1),
(414, 95, '2018-02-13 19:15:45', '2018-02-13 20:15:45', '9fd470d27c80983e15a03cb5e2b4858cc09f2f3ce0bc7403c5ee12028fb49c7d', 1),
(415, 95, '2018-02-13 19:16:45', '2018-02-13 20:16:45', 'e8106547f89cecb44ddf6788610026065b6db91e0f21560dc7a40d04421c18eb', 1),
(416, 95, '2018-02-13 19:17:28', '2018-02-13 20:17:28', '010215d918f465dda989895ed6cc89d6ab33201ac04103b082dd5cec42ec1527', 1),
(417, 95, '2018-02-13 19:18:08', '2018-02-13 20:18:08', 'e83806964e54e8b0d1d6eb9d9e97aa25ba9a8ed398947d805ed304374e5883cf', 1),
(418, 95, '2018-02-13 19:19:28', '2018-02-13 20:19:28', '477ad97501412cb7df04123302ba79b210eedabbf22a912ccb04021d96ec2f9c', 1),
(419, 95, '2018-02-13 19:22:49', '2018-02-13 20:22:49', '48b5a219366c45508d10732a6a48531c5e84d8afedb66bb4928dac947fd1782a', 1),
(420, 95, '2018-02-13 19:25:49', '2018-02-13 20:25:49', '37566cd856f35b1efe1d38b049e1f950b23a81ba7d1ed5f21ca75d360283b203', 1),
(421, 95, '2018-02-13 19:26:21', '2018-02-13 20:26:21', 'c77354d96153e83ffd22b8a58da436c5ca07e07c0a30fc38337c440fe14dd94e', 1),
(422, 95, '2018-02-13 19:27:00', '2018-02-13 20:27:00', 'f588e11438c7b3b5c9b72f67bbaa02e5b3fb37c1ef8365ec16b2ce7429d5d93a', 1),
(423, 95, '2018-02-13 19:27:23', '2018-02-13 20:27:23', 'f9a2b153ce3e809cc967408199bc5be08be86e11686485eeacfa63dc1e2874fb', 1),
(424, 95, '2018-02-13 19:28:11', '2018-02-13 20:28:11', '29838d394a6cebcd8fd658a2f772b89fe5caa9a2a12fc6fd80dd132b3481f9ee', 1),
(425, 95, '2018-02-13 19:32:39', '2018-02-13 20:32:39', 'f0f0960f944cc0470905607e6df21d1824d70e196c411e7ee820566a91405f44', 1),
(426, 95, '2018-02-13 19:35:43', '2018-02-13 20:35:43', '1228382b28d45d98eb191af02cdeb116f20bd58481da62bf45f7d6852d615a73', 1),
(427, 95, '2018-02-13 19:42:46', '2018-02-13 20:42:46', '605152f39e070b1c4f6a1872ec33aece096dcbc68eedacdf782f700542062286', 1),
(428, 95, '2018-02-13 19:45:09', '2018-02-13 20:45:09', 'dcf341758f58ceb2898e36f099f611aacaacfc7cbd5f9eb2e78dcbdfcabdecd6', 1),
(429, 95, '2018-02-13 19:45:24', '2018-02-13 20:45:24', '2ba92f9ec8add3677979c5fd1136a84b616527e842a2e0d23119af453be89c2a', 1),
(430, 95, '2018-02-13 19:46:30', '2018-02-13 20:46:30', 'e442ff86e82fc329c0c236555f9b18e704e9869c714c3c529a4832ddd416852c', 1),
(431, 95, '2018-02-13 19:49:30', '2018-02-13 20:49:30', 'f75e52059b4dc4854c31f5c0fe4f872f8f03fffd7afbfbb4691f781ba4726fa5', 1),
(432, 95, '2018-02-13 19:49:58', '2018-02-13 20:49:58', 'fae3c6d658c07eddc50e5f92b9a16c966726b4b29508e32f65b9aa90eff63a2f', 1),
(433, 95, '2018-02-13 19:50:53', '2018-02-13 20:50:53', '257ca16729accfd895446627689a44bc76765cbda5ba58d2cbba9dafd7a4e054', 1),
(434, 95, '2018-02-13 19:51:49', '2018-02-13 20:51:49', 'd2b0bcc73f1c0e7fca9113a7390801e0dcb340b75d9e9941002daec60c75ad3a', 1),
(435, 95, '2018-02-13 19:53:44', '2018-02-13 20:53:44', '8466a2b5c8b48c9ce14064badc5c8c96bd6b1eed0853758e6b06e90899d127fc', 1),
(436, 95, '2018-02-13 19:55:36', '2018-02-13 20:55:36', '2a1df8331902ac8dbddcfd218d2ea883f2e0d14beb5d8b8b054e863c303d8482', 1),
(437, 95, '2018-02-13 20:00:44', '2018-02-13 21:00:44', 'a79e8b377b2bc3daf3f813739e8aa99e34624691fbb05b9635005f5c8873e62e', 1),
(438, 95, '2018-02-13 20:02:32', '2018-02-13 21:02:32', '352d170bffbac4df2608e44f618693752bdd7d169ccc5801b7c4e5e7102d73b5', 1),
(439, 95, '2018-02-13 20:05:06', '2018-02-13 21:05:06', 'db66c645f9535212e4e5e98a29c3104abdeb7247472b4a17612aaaa07a8286be', 1),
(440, 95, '2018-02-13 20:12:42', '2018-02-13 21:12:42', '37d8e101d976a481b0d0d1085c2f72a7d578d3d2e6f44c289d9a85f20c74f147', 1),
(441, 95, '2018-02-13 20:13:01', '2018-02-13 21:13:01', '9c4f82154d5139ac60b36e1e65d77206b3d86344d93c8ebdcc61d086a71d1b12', 1),
(442, 95, '2018-02-13 20:13:32', '2018-02-13 21:13:32', 'ccf2c6bafde355e4c90bb64ff216c4e49c7e49d0e36bc39ddebc9bcdc56c6e6d', 1),
(443, 95, '2018-02-13 20:14:25', '2018-02-13 21:14:25', 'afddaf7a89fa4ee2d87bb362f7fcd8e3b804195d8d29a2739bf9e64a739e6e3d', 1),
(444, 95, '2018-02-13 20:16:12', '2018-02-13 21:16:12', '0f8dca22116e856f18bbc14dda7066f46bb908b215d763cbf4a7a5f0bff225a7', 1),
(445, 95, '2018-02-13 20:28:04', '2018-02-13 21:28:04', 'cf61f8c7263573f2c220518555e2a793a443799fc8df3591634f3970ccd79e61', 1),
(446, 95, '2018-02-14 16:28:25', '2018-02-14 17:28:25', 'cb3255e73d2799f11d92b8930cdfdf2634e44faa150eb6295b59d94c09cae9a1', 1),
(447, 95, '2018-02-14 16:28:26', '2018-02-14 17:28:26', 'd1fe06554f4c22e947b2b2d50fbe63d35bc4bd7aa401733f77d1b030015b9522', 1),
(448, 95, '2018-02-14 16:29:09', '2018-02-14 17:29:09', '5aaeb5a8177bb18843dc7725882ec83c8a5eb528132bea52eb5827760ef6e900', 1),
(449, 95, '2018-02-14 16:30:48', '2018-02-14 17:30:48', '61b0420da5dfcdd53523e438b45dcca775d39e3c9aa64fdec66751dd621070ba', 1),
(450, 95, '2018-02-18 09:45:01', '2018-02-18 10:45:01', 'dd49e243997bc814ee3e5e35ea7d1319eafdfb1b13839b73d41540329fc48fd6', 1),
(451, 95, '2018-02-18 09:45:35', '2018-02-18 10:45:35', '288cdf1a3119c3b0d957f1b88ffe568b56a8ec49fc4eec88e2f88189b98c4ae2', 1),
(452, 95, '2018-02-18 09:46:07', '2018-02-18 10:46:07', 'c959fd5915442fe6c37d92864a16893fb11d7a27ee698e0d4b236bdefdc7699e', 1),
(453, 95, '2018-02-18 09:49:13', '2018-02-18 10:49:13', 'b84945df563db70b30d61c8b41ffa4d2df88c30b72e8919680e18e3b91e2a994', 1),
(454, 95, '2018-02-18 09:49:45', '2018-02-18 10:49:45', 'b87801ec847555c8999872e794a2b246f0211e4738bdbf52633172852e984883', 1),
(455, 95, '2018-02-18 09:51:37', '2018-02-18 10:51:37', 'd048ba4d71dbc29ada9396634bde7d7806e3ae9210189a877114aac795bf1545', 1),
(456, 95, '2018-02-18 09:52:37', '2018-02-18 10:52:37', '85c7830087f48ea8720c1cea78fb72de95289f77dfbde7e33e591da07d3f31ba', 1),
(457, 95, '2018-02-18 09:57:15', '2018-02-18 10:57:15', 'f8fc3285e441b7a09288be7d9297af904eb0a52f7c401d0244cf4b55c7a245ea', 1),
(458, 95, '2018-02-18 09:58:43', '2018-02-18 10:58:43', 'e48315f18254f1a70ff49b5885f52963a3423623d3b17278a832722c39a2d67f', 1),
(459, 95, '2018-02-18 09:59:10', '2018-02-18 10:59:10', '9dd71e24431d8144e2bfd0c531e80c2191912542556de7631cefe57a53a3e9dd', 1),
(460, 95, '2018-02-18 10:01:42', '2018-02-18 11:01:42', 'd8ff84606d2cff7f425306c15954b7011bd8fc94ca0694cedd8347b4ada4b647', 1),
(461, 95, '2018-02-18 10:02:35', '2018-02-18 11:02:35', 'd6f4e48a834a59168530150196557208ef090846a098f0b4783e32e6f3b9ed74', 1),
(462, 95, '2018-02-18 10:04:03', '2018-02-18 11:04:03', '5aadafc7963f75d4611154545ef2d123dead7eb48023eae24231cd7dd30fa190', 1),
(463, 95, '2018-02-18 10:05:51', '2018-02-18 11:05:51', 'f47d033ab05ff84c1622b5dd0cdeb53a474d48f9a3cd69d5b8a26becc96f8d9b', 1),
(464, 95, '2018-02-18 10:11:04', '2018-02-18 11:11:04', 'aa52ae815dcc14de0ecbce238884f3744bf38199f479249be3b9bd7a7d211110', 1),
(465, 95, '2018-02-18 10:12:25', '2018-02-18 11:12:25', '4c9acffe816ace2f20c5e578bd4271280f85fb01a2984d527b02cdf510e43e8e', 1),
(466, 95, '2018-02-18 10:14:44', '2018-02-18 11:14:44', '0b010c5a3f1f92711cc3e1504273db41f2c17364784278e81e2cae273ff1d68f', 1),
(467, 95, '2018-02-18 10:16:03', '2018-02-18 11:16:03', '385c5280f0e0bef5479569eeede5ad267d79b323850ab8f508114e444368093a', 1),
(468, 95, '2018-02-18 10:16:58', '2018-02-18 11:16:58', '0d47f347c4a4a16df16617b5a78974b9d0d6ddef33128104a19bec3d920a0a57', 1),
(469, 95, '2018-02-18 10:17:43', '2018-02-18 11:17:43', '2c7cff2473973f7f28746811643493b00088f6c19616452c3d7db60f11c586c3', 1),
(470, 95, '2018-02-18 10:18:52', '2018-02-18 11:18:52', '0e88ab9f6b6436cbba135c90ec65b9c4a6ddf984247b974cf89b39d0ae0de243', 1),
(471, 95, '2018-02-18 10:19:44', '2018-02-18 11:19:44', '1bf0b314ca94d5d619380de16641775af85d67b452bb2ec109a27fcc621d95a0', 1),
(472, 95, '2018-02-18 10:24:38', '2018-02-18 11:24:38', '4c5e05f7c0f3cfac634bb19efecb59afd7301b1e9847488a7765246710854549', 1),
(473, 95, '2018-02-18 10:25:04', '2018-02-18 11:25:04', 'd7226b42cf05c39b313f58c3c09751c1b16028dda4fae0849986a1abe038c133', 1),
(474, 95, '2018-02-18 10:34:27', '2018-02-18 11:34:27', '376b2c632ac06f220431ff0746b3a01268e70cf74b1a7f040a310a358b8442ba', 1),
(475, 101, '2018-02-18 11:25:10', '2018-02-18 12:25:10', 'c99da9bbf227a6bfce2c5417d428dc2de75a91b447201eed52dd40abf4445750', 1),
(476, 102, '2018-02-18 14:37:11', '2018-02-18 15:37:11', 'e4dbeb2398835bc7b755dbfa1222d5b8390538ff34319cfbf95a6c4984935527', 1),
(477, 84, '2018-02-18 14:56:00', '2018-02-18 15:56:00', '690e821babde6430018f2868d61ef58f9782a60d34c7cb9498ad05b4640e5065', 1),
(478, 84, '2018-02-18 18:24:09', '2018-02-18 19:24:09', 'ceb66822fead38de9b9eadfa858f46c8fcd0a47118ec8d28ec292344684004f7', 1),
(479, 84, '2018-02-18 18:25:17', '2018-02-18 19:25:17', '459bc3608a1471bd71fa8c84c4d1f4773eaefb2e18457d7ad2a76079d98b0674', 1),
(480, 84, '2018-02-18 18:28:08', '2018-02-18 19:28:08', 'c51e4b88386665ae42718d98013d02f227cc6588ce29f5efe0718cf0662986a7', 1),
(481, 98, '2018-02-19 05:28:51', '2018-02-19 06:28:51', 'be63208f518e7eb034258b55590f6d442cf46f28ec3f692ba57d3551d995dacc', 1),
(482, 84, '2018-02-19 09:15:05', '2018-02-19 10:15:05', '7b45f232855d929cdcb40611a0fe0d9201c23fe9a12c76c60f2b4ade66cc8dda', 1),
(483, 84, '2018-02-19 09:36:21', '2018-02-19 10:36:21', '528eea9495c5fc373b8f27ad9f6d143dc460ef7a9b531e8a7898f2fb1c925e89', 1),
(484, 84, '2018-02-19 10:58:11', '2018-02-19 11:58:11', 'd74d0af36aba55cf98783d7fee7c96efb207ab823865ea13424d3ba99287ecdf', 1),
(485, 84, '2018-02-24 07:37:43', '2018-02-24 08:37:43', '7766bc5dbb552237311040bdaff04d743ca2baba363d4dcf6e0634ed718f8557', 1),
(486, 84, '2018-02-24 08:05:10', '2018-02-24 09:05:10', 'cb97246c212ff0630dd11d7c025c8f9bb3f7c4989a80d7f65da28d334bbfcc0d', 1),
(487, 95, '2018-02-24 08:51:29', '2018-02-24 09:51:29', 'a3f914ff020ad8725819e3fb77d18fb0e6b9b41f1eb3cf4a5ad5ab658393fba9', 1),
(488, 95, '2018-02-24 10:07:06', '2018-02-24 11:07:06', '285ae07914953cb7bf647667139a162e12a2393328b94421530ae01993ff0ced', 1),
(489, 95, '2018-02-24 10:11:56', '2018-02-24 11:11:56', 'd72b37e125127434be7a5146c53244270f6c756d0f5a442d5794628271a19d6f', 1),
(490, 95, '2018-02-24 10:18:01', '2018-02-24 11:18:01', '127e806d107b87637267219873cd0ead475467335bb492da464092ddbf524768', 1),
(491, 95, '2018-02-24 10:22:55', '2018-02-24 11:22:55', '6fd942eb5550ad3dd47e42ed9e282d1495f0e85f4bd7fe9876c2165ffd7378f8', 1),
(492, 95, '2018-02-24 10:23:42', '2018-02-24 11:23:42', 'd22f8efaa70a4f1f7a586cb0690d91bb3771e25934f90df37ebecf39bc5976da', 1),
(493, 95, '2018-02-24 10:40:27', '2018-02-24 11:40:27', 'faf663fc1cf299176eb32d86c0b93b42c9b3278786bdb2f93e241635aabf0f5f', 1),
(494, 95, '2018-02-24 10:41:13', '2018-02-24 11:41:13', '8931e1c99526cb6aa731e9cb2c85dbcecaeb59f8e079e11f17c552e86b2dba83', 1),
(495, 95, '2018-02-24 10:41:24', '2018-02-24 11:41:24', '91cc8dac74ca9cd14a6adaf4ddd3fbd3a460de48311bb77e09068a9253c223ba', 1),
(496, 95, '2018-02-24 11:37:27', '2018-02-24 12:37:27', 'dbf31729a7237d8d8766e9d315080a5dfcbd934ee9ec4f9a0d65364bc12ce6bc', 1),
(497, 84, '2018-02-24 15:51:16', '2018-02-24 16:51:16', '403b30c9b9a77c2d0f63c69dcb2a194bcd54f0fb18c1dbba53e5c673705896d5', 1),
(498, 98, '2018-03-01 11:32:21', '2018-03-01 12:32:21', 'a9c1991550762cfef174d4515ade1830276d606b8411eebfeef76d743b1c497c', 1),
(499, 98, '2018-03-01 11:35:26', '2018-03-01 12:35:26', '3dccac74247f3707aa425633b42f885cb3c0413b78fbec9f4a967bdbe9cec37d', 1),
(500, 84, '2018-03-03 07:49:52', '2018-03-03 08:49:52', 'a9a4dd7ddeb55aad0ebb0db218bf171859bbfe47e0561a9ebbdcb94291fc8906', 1),
(501, 84, '2018-03-03 07:51:31', '2018-03-03 08:51:31', '5d0351d1abf68c4287de5926a5c1fe510c2ca2c7adaaadca81d3a1fbe1da9503', 1),
(502, 95, '2018-03-03 11:00:27', '2018-03-03 12:00:27', '0765ab094030ff151a68546a299cbd51117c3081e2384e29c47258aca32bd991', 1),
(503, 84, '2018-03-03 11:26:10', '2018-03-03 12:26:10', '54bd233ced688b303b4812b0cf64371c249163ba825df5aaca050c2df06dd0d9', 1),
(504, 84, '2018-03-03 11:41:51', '2018-03-03 12:41:51', '8cb4285621cb3d34a140ecbe35e7acd613a328ee754fdcc0e59eb38599c49709', 1),
(505, 84, '2018-03-03 11:43:24', '2018-03-03 12:43:24', '3236ff96766bfaceda46b60c5496142e41731ca8c627949e8423480e31714b0b', 1),
(506, 84, '2018-03-03 11:48:07', '2018-03-03 12:48:07', 'fa880b834de74ed8ab10c04b768c168b852dff43fd35eac5b9b4740e5ba2f0e5', 1),
(507, 84, '2018-03-03 11:53:23', '2018-03-03 12:53:23', '44d12d3fec9b4b15c66e996896dc2ba9c0937bacd4e63b4fc66a79c7e968c4eb', 1),
(508, 84, '2018-03-03 12:48:31', '2018-03-03 13:48:31', '0e2a4018b09c01ccf2fb32c035d1804ed77b9d21fa4ea50bbd1edcfab4e7552b', 1),
(509, 84, '2018-03-03 12:51:55', '2018-03-03 13:51:55', '7622c1e71142e3b9909a49f3d8f4643ae484af50835db2d1007244c549eb4e9a', 1),
(510, 84, '2018-03-03 13:10:08', '2018-03-03 14:10:08', 'c611cea6ffee0a4d0393272bdd31500a17629ea02472379cacd7b9e199df0c4a', 1),
(511, 84, '2018-03-03 15:28:40', '2018-03-03 16:28:40', '51bc4d3131074f835e4b9bbbce9810439be6932e8be092e85f659c3d489c60a6', 1),
(512, 84, '2018-03-03 15:39:19', '2018-03-03 16:39:19', '6afc22c7d26e7a437fd3f7820e785e89e4bb2a356fc170afcbd2cf148b8add54', 1),
(513, 84, '2018-03-05 10:09:53', '2018-03-05 11:09:53', '2a0db3a1747d5735a3aae2beca7257f0c50126678723daede479598d40b6e60b', 1),
(514, 84, '2018-03-05 10:11:53', '2018-03-05 11:11:53', 'ddc71561dcc6806d855ded9a91121f04ce7f34e0733efc79ebdf03d4f4d994ee', 1),
(515, 95, '2018-03-05 18:49:33', '2018-03-05 19:49:33', '89a89d68a31643968f4ec032879a9475705a1287daa72e4b14191d1dbda9a777', 1),
(516, 95, '2018-03-05 18:52:56', '2018-03-05 19:52:56', 'a53841ab7f0674d998c6f1596958d4dc135ab1077fcf19af84b74f09ac5552b8', 1),
(517, 95, '2018-03-05 18:54:49', '2018-03-05 19:54:49', '97303641a518f274a54940ef661ba5fe126c6f78ea1705e6331993b865a1c7ca', 1),
(518, 106, '2018-03-05 18:56:31', '2018-03-05 19:56:31', '75fe9a3ed0af6cef57504881de2dbaa9fb886adb7d43574b4ad83a62d36084a4', 1),
(519, 84, '2018-03-05 19:00:14', '2018-03-05 20:00:14', '7742226b43b17b99d716c55189ce9dafc75b4c1de6f381dd97ebfd6192ae70d1', 1),
(520, 84, '2018-03-05 19:23:48', '2018-03-05 20:23:48', '4f6ae863a7939ad6861a769cd1559d1b47f804cc1cf5deaa6ca2884ba52e8c9a', 1),
(521, 84, '2018-03-05 19:24:17', '2018-03-05 20:24:17', '36f4c42de7d11ce17bc83d83bb700c5bc0b2de468c66cc81553598a8c16e64ff', 1),
(522, 84, '2018-03-05 19:40:11', '2018-03-05 20:40:11', '0fa5a0baa1691b711aa788c70bf2d1f2ef3e61776d0021ac7b49c72963bbc2c4', 1),
(523, 95, '2018-03-07 10:43:04', '2018-03-07 11:43:04', 'f78c25513c11b3369312f38b8d89a0d3d77f9f19c41fd28b188e9124da8d7f5c', 1);
INSERT INTO `Session` (`uid`, `user_uid`, `start`, `end`, `token`, `enabled`) VALUES
(524, 84, '2018-03-07 10:43:35', '2018-03-07 11:43:35', 'a1728fc52bfc068c807d5c9791ead068ca77a8e3477bf15911b95d86e94d5aa1', 1),
(525, 84, '2018-03-07 10:47:00', '2018-03-07 11:47:00', '25e03e3a0f3c579a83a3c83db0d8ce10e5e2859e24870a29607706bf2f876caf', 1),
(526, 84, '2018-03-07 17:29:52', '2018-03-07 18:29:52', 'c9baffb5229ee97db4194b4941aa1d0e7baf25e4eb58b2d4da2d3600bb8dd0e8', 1),
(527, 84, '2018-03-09 17:01:03', '2018-03-09 18:01:03', '99855c8e9fb5b1069c79f1536bb6f4d77eacd052ee78f2572f10718fd27b79e3', 1),
(528, 84, '2018-03-09 22:56:35', '2018-03-09 23:56:35', 'f27d76b7d140a06931f830b7a9925ceacf85fd73549e1442b66fd6653847575f', 1),
(529, 84, '2018-03-09 23:23:06', '2018-03-10 00:23:06', '38cc8b89103a155e184be11ca9d28ae06c180501c89c97a01813c8c94f02c58d', 1),
(530, 84, '2018-03-10 08:34:15', '2018-03-10 09:34:15', '4a25fd0af58ce63574d578599f430eb1fdd66d32c55bb9ae8eb1da15a9183334', 1),
(531, 84, '2018-03-10 08:50:35', '2018-03-10 09:50:35', 'ea6f507c9ba66cf46a73835fe920a7b8e9d5dda66f23880a974e00a4c6496a56', 1),
(532, 84, '2018-03-10 08:54:00', '2018-03-10 09:54:00', '0aad810ca5e58bc91e1d9d7cd2d25c724b774fcdccb9e90a4b5ba9229bf372cd', 1),
(533, 112, '2018-03-10 11:39:50', '2018-03-10 12:39:50', '43bcc27b26024ae5b01ad308ffa5a8dd90ed8a9e0337d8d851fe8de69fb1bc02', 1),
(534, 112, '2018-03-10 11:40:39', '2018-03-10 12:40:39', 'de81cc2ca994c62977645bffb921637498c8223caf6987162f30186b4a9d80a7', 1),
(535, 95, '2018-03-11 11:39:20', '2018-03-11 12:39:20', '95ff21aea213b426fe2b8a0311a5f617a18639ee7d36032bad711334e59685c3', 1),
(536, 95, '2018-03-11 12:56:40', '2018-03-11 13:56:40', 'f2d6291892fc503562e5378d6f46cab98cbc7a366ee63ff67b70fef73b9552f7', 1),
(537, 95, '2018-03-11 13:03:30', '2018-03-11 14:03:30', 'f0c737c3fe20d1e3477c233f5f71af91687a46e6e45c76cb73743b73dca40916', 1),
(538, 95, '2018-03-11 14:08:11', '2018-03-11 15:08:11', 'b8883ddcfd90e262bde04ba47b027de7ffff2a7a6d22885c71fe0efc5edc96ec', 1),
(539, 95, '2018-03-11 15:26:46', '2018-03-11 16:26:46', 'e8d4dfe4ec20234dee0fa3b7b75fbcdf9d1b718518be33df7714b0bd17f93637', 1),
(540, 95, '2018-03-11 15:30:57', '2018-03-11 16:30:57', '15fda11cac1759847401e98d728b1671bd628846d48ee6ba6171ae6bc9b92257', 1),
(541, 95, '2018-03-11 20:02:56', '2018-03-11 21:02:56', 'b0402b0373df3c0cdf4c8c339db0658e1464d444f56c1d0a4fb1446dedbcba1c', 1),
(542, 95, '2018-03-12 05:58:11', '2018-03-12 06:58:11', '50d68d738a122b4226cab0c8f891b82e3fa5db90c1e671c91e69ba8a8c64128a', 1),
(543, 84, '2018-03-12 14:15:31', '2018-03-12 15:15:31', '155bb87de35175336bb8756713cef1edb038986b9cc31e558257123ac1358c9d', 1),
(544, 84, '2018-03-12 14:33:30', '2018-03-12 15:33:30', 'c6c9828c746b995906d1b354ab4606c0e6c8af71b72f21d04aaa47d893c44f4c', 1),
(545, 84, '2018-03-12 14:34:16', '2018-03-12 15:34:16', '698c985a1368f2d7a8e8edde4002b06322301d77bb09d7b9d15ff6686e733a78', 1),
(546, 84, '2018-03-12 15:22:01', '2018-03-12 16:22:01', 'bcc6f272eee3df609b3d6f9eb72ee5a91aa5e9cf9048112bd37e8c2d9fec29bb', 1),
(547, 95, '2018-03-13 07:32:43', '2018-03-13 08:32:43', '6606ab77b98ac09f4c07c59dc9dcc3cc0d066937b68e2f550e9a9f76eef8cdc5', 1),
(548, 95, '2018-03-13 09:26:05', '2018-03-13 10:26:05', '39c3d2b0520cfa9448a4475d954656ef36f639d3cf9b1679ab8010e85bcd95a6', 1),
(549, 95, '2018-03-13 11:46:01', '2018-03-13 12:46:01', 'ac624025fcd83d3e7686668426adabea87df7047e0364d95f0c5ac8e16f4cd57', 1),
(550, 84, '2018-03-13 18:01:07', '2018-03-13 19:01:07', '268d338c79e79e0892afc9d4a6d38f34355661710efface076e69311b68cad13', 1),
(551, 84, '2018-03-13 20:01:45', '2018-03-13 21:01:45', 'a4d8174c62086c51a669ef8b7761bafb722c7e1b5a966f1aa21b2cc8cbefb19a', 1),
(552, 84, '2018-03-13 20:01:46', '2018-03-13 21:01:46', '845200f7dc96c3ebea39fb68d9d47d291f63b77406ba8b6a502644f8489bb1d3', 1),
(553, 84, '2018-03-13 20:03:29', '2018-03-13 21:03:29', '884716c56aac6e9c773944ebd06156bcdf9078b763b5787bca2ece4f524252e8', 1),
(554, 84, '2018-03-14 00:14:51', '2018-03-14 01:14:51', 'afe7dca218a626ca0effbf003c9730f176d31cff79ba9697ab13b8fae9f70ea2', 1),
(555, 84, '2018-03-14 07:29:30', '2018-03-14 08:29:30', '2694827e6d165daf9c4e533835c6330f1da6c26bf67d6fd46260766d9786f38f', 1),
(556, 84, '2018-03-14 08:15:45', '2018-03-14 09:15:45', 'd219f736ca08f3df81cdc785131e4df17e739f7431f16c35f743205a9f3bc9d4', 1),
(557, 84, '2018-03-14 08:22:34', '2018-03-14 09:22:34', '26c877c2bcdcc43f3c8e2c9bca170a237ce96688dd1877da7186844518d2579c', 1),
(558, 95, '2018-03-14 09:45:17', '2018-03-14 10:45:17', '21270a4d0fc8399772a003ff15101873f46d4d53b0a3091108a904de96cde101', 1),
(559, 95, '2018-03-14 09:45:56', '2018-03-14 10:45:56', 'c9599817641ed3b06d1f1ac672d3e291c4c1efef77dd3486f90bcc055b4c0846', 1),
(560, 95, '2018-03-14 09:47:20', '2018-03-14 10:47:20', 'bbe0ff97e21222bb3ed92129224c6acdc9d5f5d5d2c87478790d3bc2a6b68748', 1),
(561, 84, '2018-03-14 10:04:26', '2018-03-14 11:04:26', '441a85757803d92f735b4d4d09c23bccedace1d680d8ae25d6e96739bfee3f38', 1),
(562, 84, '2018-03-14 10:13:58', '2018-03-14 11:13:58', '2acc8052551f9a9c8e6eb1e2baee9957d5cff58946ed720cb981da16dc346e1c', 1),
(563, 95, '2018-03-14 10:57:03', '2018-03-14 11:57:03', 'b4be98646804d6feaae879420ff4dbe34af9bc103ad7dbab4cc0dd9383a3c534', 1),
(564, 116, '2018-03-14 17:45:13', '2018-03-14 18:45:13', 'c6de41f5ba69130b1861ce8b60f60bca82cd0c472c3eeac0335794f0697afa01', 1),
(565, 95, '2018-03-15 08:23:31', '2018-03-15 09:23:31', '4ce2ed800ee29917b95ec1c6b5dfa042178bcabf948d41c1e4cca3a7a6229404', 1),
(566, 95, '2018-03-15 08:25:17', '2018-03-15 09:25:17', '23ccaf023be1fac9412b9ecd03e9d44739679263d13a32325e627c824368003e', 1),
(567, 84, '2018-03-15 10:50:11', '2018-03-15 11:50:11', '8f187dc3f86ac5f08b24d098f0797f82f9b3e6489501f3ba1bfd0ed5946679b9', 1),
(568, 95, '2018-03-15 14:41:37', '2018-03-15 15:41:37', 'c15e5ca80b948d1348412049e5b77f440c6c1efd56ee6cc3a466b57014e93bb4', 1),
(569, 84, '2018-03-15 14:56:24', '2018-03-15 15:56:24', '5fdd30c7a7ca060f5d7e67f81bd234ae7a61bca7f01b4c7131d720339fbe73e2', 1),
(570, 84, '2018-03-15 15:42:50', '2018-03-15 16:42:50', '6647e314dd39527cd819c1ce6f4c8b4ef8fc7c79d57a40549cfe7b9880be5157', 1),
(571, 95, '2018-03-15 16:13:51', '2018-03-15 17:13:51', 'ebf7c7b03b4a8d8accdcefd71bac7be1e295b744880137fcb69a4aaf3e1c9320', 1),
(572, 95, '2018-03-16 16:39:43', '2018-03-16 17:39:43', 'c28e761b78921ed0ee2c688d195f2818819c88b158347c9b564add3a00348b52', 1),
(573, 84, '2018-03-19 09:09:59', '2018-03-19 10:09:59', '3305e1dd6b3ede38954b7695abc9246b432b3f99db7d0264c1f7442c131bbf5c', 1),
(574, 95, '2018-03-20 19:00:51', '2018-03-20 20:00:51', '58b16df134410b9a55344b8232e16f4a558ad777aa58dd8059cd8466802fe347', 1),
(575, 95, '2018-03-20 20:03:42', '2018-03-20 21:03:42', '0e688edd7acd5bded39ef748b4a5c809506946c5f524d7c684662dc91f4139c7', 1),
(576, 84, '2018-03-20 20:44:27', '2018-03-20 21:44:27', 'f966bd04446076c8d0b712192d373ec03e0bcca732a8d7d99db5e5585e928c8a', 1),
(577, 95, '2018-03-20 20:47:58', '2018-03-20 21:47:58', '8e1eb18e29026b2188643929300befd0f5b9492de61d35aeca6a9d839ad736c2', 1),
(578, 84, '2018-03-21 09:39:52', '2018-03-21 10:39:52', '7d5b45547be15984519a1392d4acd49d308f22ae508b618f7bccdfc917bb26c2', 1),
(579, 95, '2018-03-22 15:22:42', '2018-03-22 16:22:42', '94904c39253feca25c0de98b4b95b83e675a46e7adc772795ea0a9dee4bf0020', 1),
(580, 95, '2018-03-22 17:37:29', '2018-03-22 18:37:29', '8849bf90fa7b122b41f91d5cd21960a8950e7f5edb3266de3c4ade2d0cfdcc5e', 1),
(581, 84, '2018-03-26 08:00:00', '2018-03-26 09:00:00', '4e567771d8a57a0c88935bdff30018db6be87d7f6eed27b80c21c855c2a29911', 1),
(582, 116, '2018-03-26 08:04:52', '2018-03-26 09:04:52', 'cf1fdd61285013a476ff6ac45772b22a009c31294d6ef5e1e25ec1bc7e14aec5', 1),
(583, 84, '2018-03-26 08:13:36', '2018-03-26 09:13:36', '85f82ea04350537e476b4ae5e6e081b44d4dbdbb742ed54ae582a37c230bba44', 1),
(584, 84, '2018-03-26 09:50:24', '2018-03-26 10:50:24', '079c7e7e725cd64ed186df6ed2793373a52fda2af96f52159579f71b12299b12', 1),
(585, 84, '2018-03-26 10:53:59', '2018-03-26 11:53:59', 'f81a9b85807e15e73f2f27a0acdc8aa8ac7d25fe600168a50ce471d3114e7bc1', 1),
(586, 84, '2018-03-26 11:55:57', '2018-03-26 12:55:57', 'aedb826757fcc9e2cec871c9ef21817f51b800e282d7c34d7a34167ffb7b06e3', 1),
(587, 95, '2018-03-27 09:15:13', '2018-03-27 10:15:13', 'c5fc97f72800e138e50c5e32940331519555031368863cb48c517d82e5deda8b', 1),
(588, 95, '2018-03-31 10:55:40', '2018-03-31 11:55:40', '2e120534e5158d07afd6e2e33bbf3630380ba05029ce4884a07475c919fbc43b', 1),
(589, 95, '2018-03-31 11:56:57', '2018-03-31 12:56:57', 'e2abae193f5c646b537cb187854b7fe09bf45ee80cc1ffe2d1dcbb8e3b3dc7ab', 1),
(590, 95, '2018-03-31 13:09:26', '2018-03-31 14:09:26', 'd06637a83f5869a07688c0c143ec8a56b6bbcb2f8ba3ed3c374f54564118f64e', 1),
(591, 95, '2018-03-31 14:12:22', '2018-03-31 15:12:22', '371d5b9d0416750ef7a14ca4d6a9bf1da69c07fe50b33e1a9fcd38d2f85bd1ef', 1),
(592, 95, '2018-03-31 15:12:59', '2018-03-31 16:12:59', 'ad66c4095a945a7bd489b93d8a03ece5417ecf9c8e3f9a1d0e1fb9a086627809', 1),
(593, 84, '2018-03-31 17:03:46', '2018-03-31 18:03:46', '2b929fcc52a05c9ad8c87c2fe98daa9b0048cdef328d9b574b634350db518cd3', 1),
(594, 84, '2018-03-31 17:13:11', '2018-03-31 18:13:11', 'b75b3a4170d1d0b4272eb2951788afa25f857b847185dcd86d7bf6f87d472809', 1),
(595, 84, '2018-03-31 18:15:01', '2018-03-31 19:15:01', '3470a20c8c194d23e0f0f947c2d09ea0165b7d1b7438397db75004b525441560', 1),
(596, 84, '2018-03-31 19:14:19', '2018-03-31 20:14:19', 'f3f97309b5974530e83d7893027261f0abc7bfd1b1a881e29c4f53686f088847', 1),
(597, 84, '2018-03-31 19:16:32', '2018-03-31 20:16:32', 'a2e39e64a7d938781d023296496f4760354cb0a83179561271ea0a879b40fbc0', 1),
(598, 95, '2018-03-31 19:22:57', '2018-03-31 20:22:57', 'd23c7c7aea7fa7bc2793d8c3f8b31eb061afdc2269ddaa8066c1e4f10fb5c4f2', 1),
(599, 84, '2018-03-31 20:17:27', '2018-03-31 21:17:27', 'f56d155cf841bdb9512150c8046b27bbcad73b426e9a8245248bbb71405f8dca', 1),
(600, 84, '2018-03-31 21:24:27', '2018-03-31 22:24:27', '65c46ebb4f68dd3e66ebc9f77d5ffb036e4a0520deda5029fd7a11a87db3929a', 1),
(601, 84, '2018-03-31 21:58:38', '2018-03-31 22:58:38', 'd5e6a498c5f7211dd227082cad2189cd94fa9d6e36fd21d56fbf5b269d2a3cff', 1),
(602, 84, '2018-03-31 22:26:17', '2018-03-31 23:26:17', 'a5860f0d2ba62bb97e0995b152f6931743a384bbd713cfa1d603828233173c8a', 1),
(603, 95, '2018-04-01 11:12:39', '2018-04-01 12:12:39', '938de62b0d92b1e65733c9a2ca63c244c5c7a2e3613b5fd1a49ab2698f908438', 1),
(604, 95, '2018-04-01 13:13:36', '2018-04-01 14:13:36', 'a075f411e2121e32f844815dacec5e55c28210c4b6c04a5c3eafcebf5a543c93', 1),
(605, 95, '2018-04-01 17:11:31', '2018-04-01 18:11:31', 'b44efb423b97b808dbacaf166a0224555f9215ba9b13d21f71173a213e1606a2', 1),
(606, 95, '2018-04-01 18:12:22', '2018-04-01 19:12:22', 'b7318bf90fd9d48327b9459a7776bfd044374fb6924c209fff6e567c2100018a', 1),
(607, 95, '2018-04-01 21:46:22', '2018-04-01 22:46:22', 'db577673ebe3578c759b095f42c5425b32263bd579de4ea75a5107c5995623f8', 1),
(608, 95, '2018-04-02 15:51:33', '2018-04-02 16:51:33', '19d267234cae4d0369cf64fc149475c14be0cc732b8fc7f32c3e1b2bb15eba0b', 1),
(609, 95, '2018-04-02 16:53:00', '2018-04-02 17:53:00', '4ad00a2f474418095d933109a56c1a2dae2eae9b083bbed6e9d92b0aab230974', 1),
(610, 95, '2018-04-02 17:53:21', '2018-04-02 18:53:21', '54352205d7dc8150c73565067ff50361621ab29b2216d61c1056bb90dd52556f', 1),
(611, 95, '2018-04-02 18:54:50', '2018-04-02 19:54:50', '1a0a0abf4c17b58edc295d68ab69e170af4e2a4cf31da7924b4c56db941a6d5b', 1),
(612, 84, '2018-04-02 19:35:47', '2018-04-02 20:35:47', '1366493d75927b752c56b49d7ccdc95b7efb0482aa87cdc908204034ec8393d6', 1),
(613, 95, '2018-04-02 19:57:31', '2018-04-02 20:57:31', '17d0218365ab6918dd7b280e2837bd223b99dcf197b71fd90834203414345d94', 1),
(614, 95, '2018-04-02 20:06:51', '2018-04-02 21:06:51', '024c7550bf3b9fa4b651a194ca0077c59e90318d30d6189668e432ddbe21da06', 1),
(615, 95, '2018-04-03 10:02:33', '2018-04-03 11:02:33', 'd46237fe47f11ad4641dc5c9ea086ffa116dfc7cb61a10a39f403c446550c76a', 1),
(616, 95, '2018-04-03 11:28:55', '2018-04-03 12:28:55', '00f50160fa2e0f5bff02d024cac9243ec871ed7f6640515e3cc451044fec2c0f', 1),
(617, 95, '2018-04-03 12:29:53', '2018-04-03 13:29:53', '98a7592ac06c5c13cd43d19febf1b5173f88594e2289d1564fe015e61d31379c', 1),
(618, 95, '2018-04-03 13:44:19', '2018-04-03 14:44:19', '67e60691ae1d7d13ca8ef76d178ad5dc44b560338b32c369ba8193c906626d84', 1),
(619, 95, '2018-04-03 16:15:42', '2018-04-03 17:15:42', 'e8c1abe6489efc0034888be1be90d03dcc2b590f951df74e94f8edd73f2a21f4', 1),
(620, 95, '2018-04-03 17:46:29', '2018-04-03 18:46:29', '1d7e583f7535b637595c3647b38e1cd28078ffd8747f449bb72e35b4fd898791', 1),
(621, 84, '2018-04-03 18:51:21', '2018-04-03 19:51:21', '7e9e958ef417c27d53413be8a666811e54b0059941faf07d3cb05fd2859a3127', 1),
(622, 95, '2018-04-03 19:16:10', '2018-04-03 20:16:10', 'b032ce50f695d8a9edac7368ec0de09cde016e305cff6c966de4802b336599e6', 1),
(623, 95, '2018-04-03 19:24:14', '2018-04-03 20:24:14', '7024fb5e60548398061a2f5a0ae15a0c066d34fe41c969ba964112d679110f5e', 1),
(624, 95, '2018-04-03 20:17:41', '2018-04-03 21:17:41', '1c74412aff8863abf60f416fb6faec5245e8ee7f307185b305be2c0387a6c3f2', 1),
(625, 95, '2018-04-03 20:26:51', '2018-04-03 21:26:51', '99102bfbffc131cc1d535a974c298916ff6793510f4698c0b5f67180bcfacb91', 1),
(626, 84, '2018-04-03 20:33:58', '2018-04-03 21:33:58', '01370825e434771219e71b6d7b72f003ec3e1cfa2655b3dd914737469b22dd34', 1),
(627, 95, '2018-04-03 21:19:03', '2018-04-03 22:19:03', 'c695a21b4ebfe62b7b2f62292e9a3ee7ee948078fd19d0ec9ae9a3d2786e60e9', 1),
(628, 95, '2018-04-03 21:27:30', '2018-04-03 22:27:30', 'ac2d5382f49c4cb9f3a65a9a74eb264e1d948c3d53fbc736ec0c6225a03577fc', 1),
(629, 95, '2018-04-03 21:59:32', '2018-04-03 22:59:32', 'c38144ddcaa3c8e884fc05d946d903051befa8e62293cc5049d1cbb32ee57425', 1),
(630, 84, '2018-04-03 22:20:37', '2018-04-03 23:20:37', 'fbecfd9c8e8347ffdff0400fbb785a11571338b3fd3578120d1461a32ea977ce', 1),
(631, 84, '2018-04-03 22:27:03', '2018-04-03 23:27:03', '4af6e5d76f54843ce97d26cf249daece89e3da9fca0ecfcb602e842e96cb6776', 1),
(632, 95, '2018-04-03 22:29:11', '2018-04-03 23:29:11', 'be26cfbd929c6b05e754f25a3f03276fee39f3fddf7294066c4c5292db5bfc0f', 1),
(633, 95, '2018-04-03 23:29:12', '2018-04-04 00:29:12', 'ad6b131230dd72e541f8d8cf00a463b80faa5fb7c1123fe2d4dc7835a3b1458d', 1),
(634, 84, '2018-04-04 07:35:39', '2018-04-04 08:35:39', '34c524543ca5c19450fc14a42d46be8710e811ea80565acd4c45c4ca1e64b3bd', 1),
(635, 84, '2018-04-04 07:59:08', '2018-04-04 08:59:08', '77a256893e4ed3e2a2709ad3d13583710b7bd31b5ca657f6aaf1ba952461b041', 1),
(636, 95, '2018-04-04 09:32:31', '2018-04-04 10:32:31', '775f3c87d877a7dd374399b0579b43eb9163e5c097da207b502668ee278c48b3', 1),
(637, 95, '2018-04-04 10:29:45', '2018-04-04 11:29:45', '0e30bcb452acdfdad74a0cc2c91060c6f1703dc6858b3449e56325263b604a9f', 1),
(638, 95, '2018-04-05 12:30:51', '2018-04-05 13:30:51', 'f8bfc0636ba71a70dd8d921cec34c3b0127d544700bf36d1070b14856fc77d08', 1),
(639, 84, '2018-04-06 18:31:55', '2018-04-06 19:31:55', '87a6a078b06bca144401745cb878ed064c3adec5f3f19a29a46ea92f083f7aa7', 1),
(640, 84, '2018-04-10 23:20:35', '2018-04-11 00:20:35', 'e559394f95bc1b1af22a24a4e010b27b3f1c5441122a51be53f415357e4acc9e', 1),
(641, 95, '2018-04-10 23:21:13', '2018-04-11 00:21:13', '917d7b5d59434d78ca2ac87d18bbcda780d321b52238537a678209a4a1df564f', 1),
(642, 118, '2018-04-21 06:00:40', '2018-04-21 07:00:40', '25138225ba17310752e2fae2c711df38cb3844562fce407266c5b0ffbf07f1c2', 1),
(643, 118, '2018-04-21 06:33:03', '2018-04-21 07:33:03', 'c8e094a20798a077c5eab39a5f1e7461340a12778495852fb3102a514edc2df6', 1),
(644, 95, '2018-04-21 14:43:21', '2018-04-21 15:43:21', '219e0e00e4841227033e4ec124adaba107d4b6d250364a7a3bf7ce582e3c8813', 1),
(645, 95, '2018-04-21 14:43:24', '2018-04-21 15:43:24', '44b197192cbcf3440d59726b5b693375a5e59a69221656e29c0961f595facab0', 1),
(646, 95, '2018-04-21 14:43:25', '2018-04-21 15:43:25', 'b7979beb43c2d8b5a8b465415a02bf8be7598dacb67a214b1daad2aae0fd1998', 1),
(647, 95, '2018-04-21 14:43:25', '2018-04-21 15:43:25', 'ac3b76a2980aaafe986b89c196ce8fc3705a895a7bed767e8db090aab7b8a03c', 1),
(648, 95, '2018-04-21 14:43:28', '2018-04-21 15:43:28', '8a1dae9f2c123fa1f449b10d41201eee463433f65ef0ce774183366a10c57d1f', 1),
(649, 95, '2018-04-21 14:43:28', '2018-04-21 15:43:28', '77a755f04c72da2a1f4f5855ec481d9b3bd638bbfcfc3076fa3b4f2a116bc2c5', 1),
(650, 95, '2018-04-21 14:43:28', '2018-04-21 15:43:28', '38aa777e4e2dd7d99b48737ee712bf38656cb8cd3200e48177d56d07814a0ff4', 1),
(651, 95, '2018-04-21 14:43:29', '2018-04-21 15:43:29', '2579132eed62b42c7398449248d5977a89693e7884b08c835ee3fa4c62882eeb', 1),
(652, 95, '2018-04-21 16:01:33', '2018-04-21 17:01:33', '3a98bfea01a40396a63959afb1783d8bdff9cb96dd77daaf3b6abc1d0cd45f93', 1),
(653, 95, '2018-04-21 16:01:35', '2018-04-21 17:01:35', '534eb5defcfaf13c360270918c9ec2f503eb417206156cba636c7c4e305fab11', 1),
(654, 95, '2018-04-21 16:03:17', '2018-04-21 17:03:17', '8b8c06156b6afd14af91f1a894cd055402e40bf81c15d5a3eebb3b4c26d62df2', 1),
(655, 95, '2018-04-21 16:04:09', '2018-04-21 17:04:09', '3257d1382de17b0118a9f5d74b0d9b27d968654985007be01f1a001f50191c06', 1),
(656, 95, '2018-04-21 16:04:12', '2018-04-21 17:04:12', 'ee1b259c0b102d29c4aea3bbc66464ba13541caa5b3fd7f46ca9b862a444ed02', 1),
(657, 95, '2018-04-21 16:04:12', '2018-04-21 17:04:12', '56d481fa7feff92eba96b4cb7813370baa5fc2dbc0428f5d44270cdb2d451a1f', 1),
(658, 95, '2018-04-21 16:04:13', '2018-04-21 17:04:13', '45f2b6c6fba0c6b14d94eab6894ead920a6fa1276dd49b7a881b2500d5c2cedd', 1),
(659, 95, '2018-04-21 16:04:13', '2018-04-21 17:04:13', '6d693c2aa3d068848ae364c55351feb6392999d586c2715afa3a9bc4c5e438ce', 1),
(660, 95, '2018-04-21 16:07:00', '2018-04-21 17:07:00', '7b1205d6cf0a6f1f3432dac8d6e8dfb456c1a378bb19effdeeb3a2c20a1b682b', 1),
(661, 95, '2018-04-21 16:07:03', '2018-04-21 17:07:03', 'd4fa132ec3b522753bc359d4bd436d4364066646f538999ec25a4a4d793f84d8', 1),
(662, 95, '2018-04-21 16:07:03', '2018-04-21 17:07:03', '8956c532ffec51d0e05e321eb21f4f431ead3c469d659856ed5acd8be5043e7c', 1),
(663, 95, '2018-04-21 16:07:03', '2018-04-21 17:07:03', '2bf31bcfcd89513d024244fb0ed97ee9481391c389d8f7fa5d82e843fa0a0b53', 1),
(664, 95, '2018-04-21 16:07:03', '2018-04-21 17:07:03', 'a4af107906bb56e1c78d09289a5d795cf5bff72d24c370e11b5775e736bbc6be', 1),
(665, 95, '2018-04-21 16:07:03', '2018-04-21 17:07:03', '21ce90baa396227d2bdebc9c20dde5200e5a6698ab7066e6051a014155abffce', 1),
(666, 95, '2018-04-21 16:07:04', '2018-04-21 17:07:04', '5cbe05a2669198a68c144b418301228f70e132e1d60611ed2aee3a3a25708f46', 1),
(667, 95, '2018-04-21 16:07:04', '2018-04-21 17:07:04', 'f1392c6c99040ecda418afbafc8cb47bde429b62da9d950bb0e94d6d2bee74c7', 1),
(668, 95, '2018-04-21 16:07:04', '2018-04-21 17:07:04', 'df3bbdf0d3be36da6130eaf8c313e916b6220ccb7bb31322e6381c2b435c4ad2', 1),
(669, 95, '2018-04-21 16:07:53', '2018-04-21 17:07:53', '9a163579fbfde11493723f59ba711a246ac21c3963e68217a255cd1905fcf892', 1),
(670, 95, '2018-04-21 16:09:36', '2018-04-21 17:09:36', '9912bbb152f058f42294df9d5e48c0791856d9b5ebb02c3e641bfb62f034379a', 1),
(671, 95, '2018-04-21 16:09:58', '2018-04-21 17:09:58', '783f0ba05b1980a6aa1ed7fffe38c14f0040d27cab51c4be74c22815f7ffacfe', 1),
(672, 95, '2018-04-21 16:10:00', '2018-04-21 17:10:00', '15014c1932b3546e28a14ae0dcba9f75f42b97de6442ac9806c97c92ffb23d16', 1),
(673, 95, '2018-04-21 16:10:01', '2018-04-21 17:10:01', 'cd867e4bb058ba9c792f65b5552b46c320d355cf529a6c8432a78cdcf638a59f', 1),
(674, 95, '2018-04-21 16:10:02', '2018-04-21 17:10:02', '8e1d8515dd241991ed19fa78b433d32a39ab5dbfe79829f12e7f827e68a63bee', 1),
(675, 95, '2018-04-21 16:10:02', '2018-04-21 17:10:02', '93a55e8fb941e4ee1d87279ac68c088eba284d2c9b7386b90165c83d5268468c', 1),
(676, 95, '2018-04-21 16:10:02', '2018-04-21 17:10:02', 'b8afd8c512cee4281104dba1a4de95ddb0c7b4ad359d6711d7592a45b63e1915', 1),
(677, 95, '2018-04-21 16:10:03', '2018-04-21 17:10:03', '6c089c5ba99caaf45ab1a121e0aaa8c443f371df4940e0e87e05c6af6c08fa15', 1),
(678, 95, '2018-04-21 16:10:03', '2018-04-21 17:10:03', '9956e4755c387d84b62996c995c8a17cf33e130ab892bc4224ab1d9258028f57', 1),
(679, 95, '2018-04-21 16:10:03', '2018-04-21 17:10:03', 'd6c14084c202dd5d406410da2e935abdb921e929c81623ed5ddbd7f087318e88', 1),
(680, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', 'e52a501f3533d7f640e55dd1badee2d632bb6ec0117ebc567f8b7e87b3835374', 1),
(681, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', 'e5f3901d8d97c52f498347474ecc3411a3770f88a4b26f44bd6e8a9a3bc78482', 1),
(682, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', '0b975ec06aaea1cfbb8d455956a9302865c031ba47ee28ad027cd16c3bbc78f5', 1),
(683, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', '90f19603c79b212d89916905115524d5a1ea5cae2b86895545ea15d272655a55', 1),
(684, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', 'f5f9a02071fe4e62200b5c8461ae7aca5ac9634e28ac0634c024ab7ea3f030f1', 1),
(685, 95, '2018-04-21 16:10:04', '2018-04-21 17:10:04', 'df1c58bec3f274cd44cb53168553f81ddf3d461f04de4fe14bb643222a2a3be0', 1),
(686, 95, '2018-04-21 16:10:05', '2018-04-21 17:10:05', 'c16d61f601007572faba4f155cb96eda2edcb24d89182624018c392378b6f04c', 1),
(687, 95, '2018-04-21 16:10:05', '2018-04-21 17:10:05', '355e6cbd951c210f3e6afa78029c7248791556168a6c80073da5f2d0e632f595', 1),
(688, 95, '2018-04-21 16:10:06', '2018-04-21 17:10:06', 'c31207cffbff19f615ea192790dd19ecfe7b35dae1ed476335613049db075b03', 1),
(689, 95, '2018-04-21 16:10:07', '2018-04-21 17:10:07', 'a6cbed5d27806a745424a7007712827125208293025647a6e694617213585823', 1),
(690, 95, '2018-04-21 16:10:07', '2018-04-21 17:10:07', 'f7e7cc29b03d713ea123a82e3756653f61735374176ea5ba7c9ae5882aed3677', 1),
(691, 95, '2018-04-21 16:12:33', '2018-04-21 17:12:33', '147f3dcf36111ed271103b3bd9a909a99d3e66705d40d186a986af5a5d3fba9d', 1),
(692, 95, '2018-04-21 16:13:56', '2018-04-21 17:13:56', '7cb0bf2986243d8cf4fc8e5a95adfc4509ff28150807d3d1067c8f7a83c4b215', 1),
(693, 95, '2018-04-21 16:17:36', '2018-04-21 17:17:36', '03cacfb36661e0ddd49ca57a4c9f60716f204d950916ebe5d8f8653e30140fdf', 1),
(694, 95, '2018-04-21 16:23:54', '2018-04-21 17:23:54', 'b11849e6e22c37cd1b3cf426bd97198f730f6a5bd5a40a563e372b85ca521ed0', 1),
(695, 95, '2018-04-21 16:23:55', '2018-04-21 17:23:55', '97ac0239cd7c23f24f2abcd71d7d95ba5ddccb7353676ce7fde2ee3ee84842a7', 1),
(696, 95, '2018-04-21 16:23:55', '2018-04-21 17:23:55', '533a0a39051366703c6b7dbb456ab91d8a8b42f1310379738189c263aeb54e38', 1),
(697, 95, '2018-04-21 16:23:56', '2018-04-21 17:23:56', '3cbd0abe5956186c58ff85ad375763e15ec6a2363d055b4a3747e4532d43078f', 1),
(698, 95, '2018-04-21 17:01:42', '2018-04-21 18:01:42', '654641888906af3fd502b2ff9da69c2518801cef999d20ffcd352633c3aa98dc', 1),
(699, 95, '2018-04-21 17:02:35', '2018-04-21 18:02:35', '0e4a1d49be4313ac31da7044f17a5b80b292c4395d4804c618a3d1f124e1f60e', 1),
(700, 95, '2018-04-21 17:03:45', '2018-04-21 18:03:45', 'c4ae1092dc96f9945cb0234c3574e54cf07b38e640681021641385962ea43bab', 1),
(701, 95, '2018-04-21 17:05:09', '2018-04-21 18:05:09', 'f174a77ca34817d2c03af95ade29ff058424cd18f5a06b560c125e08b29a264b', 1),
(702, 95, '2018-04-21 17:05:33', '2018-04-21 18:05:33', '43d79b7943a63ac52f42e482b2e0d7a06c177348588249d5bc91911bc1490661', 1),
(703, 95, '2018-04-21 17:05:37', '2018-04-21 18:05:37', '5accf5140dcadf9f43f7220303e711c8f5ce1f950f403496bc3420c5ac09c463', 1),
(704, 95, '2018-04-21 17:07:24', '2018-04-21 18:07:24', 'd4aff7bf613f97cb64982cfa36b4c7b0d97f561cb3979a1aa9dcf39030ad6d03', 1),
(705, 95, '2018-04-21 17:08:10', '2018-04-21 18:08:10', '504ac5cff7865c0d1af54c14bf76cd26b8b09cf24ae786112948d5878de1f0de', 1),
(706, 95, '2018-04-21 17:11:12', '2018-04-21 18:11:12', '83bcad61e7b826625206af95de65427470be1868fc5856af189846397a28ee13', 1),
(707, 95, '2018-04-21 17:16:07', '2018-04-21 18:16:07', '21c6dcb3a20e8ee0c1e6f0034d0ed0ec5d9febb302f71c47fb2e00ababcccbcc', 1),
(708, 95, '2018-04-21 17:19:35', '2018-04-21 18:19:35', '3eb0773f98fa807d31f97e7d7c16c90a48354c42663e04e522846e82b1c14bc0', 1),
(709, 95, '2018-04-21 17:19:57', '2018-04-21 18:19:57', '391c125b0ae8a844543930d9e0b5d7c3571a9fe040992a2ab70d5df64c2b6886', 1),
(710, 95, '2018-04-21 17:20:25', '2018-04-21 18:20:25', '1cea91f942e92442093253908e3af28424d80f814b343d0f85cb7f758fa867a1', 1),
(711, 95, '2018-04-21 17:38:34', '2018-04-21 18:38:34', '1581d13effd7bd495021286dfa4d6e74f8ed83d2034ca05a5ffa482c4e3fed97', 1),
(712, 118, '2018-04-21 18:16:05', '2018-04-21 19:16:05', '88938a6bc6d34ee513978d0e2c7be552aeaf8d69a961460721477bbe73d95928', 1),
(713, 95, '2018-04-21 18:46:58', '2018-04-21 19:46:58', '2983de29b88cd5c2fd90bddfcd93440a2cb56e28d2c13fef6b09a97744cfd2c8', 1),
(714, 118, '2018-04-21 19:15:20', '2018-04-21 20:15:20', 'f54905139a5eb3a3fe2f15f78ceaf75ce7dd7da5a21708a1e784c3d12b4f1438', 1),
(715, 95, '2018-04-21 22:49:19', '2018-04-21 23:49:19', '3e21c46d018dc2154878bc5a9dab2273adb0aee41571d4ca68c3b1b6e5d43087', 1),
(716, 95, '2018-04-22 00:15:24', '2018-04-22 01:15:24', '856e4283f5f0b4826100f084b6c4d1cdf6a003a6d4d3348058c679177f611771', 1),
(717, 85, '2018-04-22 06:16:04', '2018-04-22 07:16:04', 'b5f7a93e3978fe5b62c74e7bd3e6a67d276e1f265f88471c6fb19e9b15e0ce83', 1),
(718, 5, '2018-04-22 06:24:13', '2018-04-22 07:24:13', 'e61eb5940c4dab9f3adf76786c835a886f46e1dda79c6d51baa266d91048f6ed', 1),
(719, 95, '2018-04-22 06:57:32', '2018-04-22 07:57:32', '73983ba8dec7f578ca3d5eb6c7b752525d89c3c451ae593c51011ddcc1bb1219', 1),
(720, 95, '2018-04-22 07:31:00', '2018-04-22 08:31:00', '754ecabed18b6e5f4884697642da6ba62273e35281fcaa476fe59352bf3dcf00', 1),
(721, 95, '2018-04-22 07:52:15', '2018-04-22 08:52:15', 'db7dd63bf1cc30ea3e2e2340f205bd9045f4dae2e2465022e92d46f08c5f7957', 1),
(722, 95, '2018-04-22 07:54:09', '2018-04-22 08:54:09', 'e95253888e7c68c296acabc3f365fbf0c15518a4d90eeafc7dd344aa10665561', 1),
(723, 95, '2018-04-22 08:53:51', '2018-04-22 09:53:51', '159cb9c91f556ec5b88667f4f596961794273fd3fa700e6124e7b1d68a52434c', 1),
(724, 95, '2018-04-22 10:03:25', '2018-04-22 11:03:25', '6d1f535b4003616efd5859c15ac5ac2e4e853a2866a32eb78e497fe843424b14', 1),
(725, 95, '2018-04-22 10:08:53', '2018-04-22 11:08:53', 'd3981d1751a156902f6e2c668a48bf8a13da7e26d6d3352180a10ed983d602a1', 1),
(726, 95, '2018-04-22 11:08:22', '2018-04-22 19:08:22', '2ab7f3ec32e7086a1d3fbc9928ee0e336ac71c3180493dc7acf0868cec9892d6', 1),
(727, 95, '2018-04-22 11:22:41', '2018-04-22 19:22:41', '59b96cd832d719fac3eab3e886285f22ee3bdc43b662ac9a62ad5e28ae366a48', 1),
(728, 95, '2018-04-22 11:34:26', '2018-04-22 19:34:26', '78a2680266f66f972ab240743dbb23091f8df04690a80d24d100123b726a980e', 1),
(729, 84, '2018-04-22 12:09:08', '2018-04-23 00:09:08', 'a1744209f25d0b0207f94a3ae3756a1483861d1ea383b574dad53e1c57ced8dc', 1),
(730, 84, '2018-04-22 12:24:57', '2018-04-23 00:24:57', '62424c62c7cb0603155dcf7d8fa94bb53e70cccbeea3966d9a8f32b7ceb9506f', 1),
(731, 84, '2018-04-23 07:44:25', '2018-04-23 19:44:25', '91658b5c3913259e3be46436692214879564652bb49b9d3212f7dbc7574296f2', 1),
(732, 95, '2018-04-23 12:33:22', '2018-04-24 00:33:22', '20685f879b391daa554cfd0213672651cd8d15b7ba41c333dac17afda2420f38', 1),
(733, 95, '2018-04-23 17:07:53', '2018-04-24 05:07:53', '2240f2969d7e81c8b834ec876742efb5b7bda877872107b1c9f070014f6d9e45', 1),
(734, 95, '2018-04-24 11:44:45', '2018-04-24 23:44:45', '682d29689ceeaa17cdda51c2ff6cdda95c2a5fe75e193fc1382322b89f364fb0', 1),
(735, 124, '2018-04-24 13:42:18', '2018-04-25 01:42:18', '27b75915d17e18130597a3e73cb608ac7fde5a1fc6472cf350cb7b8ec3808022', 1),
(736, 95, '2018-04-24 13:48:36', '2018-04-25 01:48:36', '760929db384a4bfcf90bb7283ee321e8446d0a79892d889799ca25d672e7a30c', 1),
(737, 84, '2018-04-24 15:40:39', '2018-04-25 03:40:39', '60ecdf8724c553a4f4cde265b6a958daf9ab39d34d1ca7b3ff801529aeebf2e5', 1),
(738, 84, '2018-04-24 16:47:54', '2018-04-25 04:47:54', 'f56ddc794854b02e45634d58047514470e9de2b9616779953f91dbfbf2b06174', 1),
(739, 84, '2018-04-24 17:11:02', '2018-04-25 05:11:02', '459ebcd01933ad94302b9551aafb7013ce249a332ad97f79a1bb86e1f513e861', 1),
(740, 84, '2018-04-24 17:38:54', '2018-04-25 05:38:54', 'b7e533e1f72d305406fe0e3c92ea874ddfc38c73200772ab3a8697bc11d8b0de', 1),
(741, 95, '2018-04-24 19:12:50', '2018-04-25 07:12:50', 'f82525f41ac50a772d2c3cad74288891ad76d65cf85c909ab70ff72b117899f4', 1),
(742, 95, '2018-04-24 19:27:36', '2018-04-25 07:27:36', '4f4a53fd217094571bc38bcbb48eedbe11d8680f752b72ae29a6f9adbe5b73ee', 1),
(743, 84, '2018-04-24 21:22:56', '2018-04-25 09:22:56', '2913414df0b2fde87c32ffe00b13984feb7474bcaa9a5f9ec21720543cfcb07c', 1),
(744, 95, '2018-04-24 21:26:46', '2018-04-25 09:26:46', '90f0c2f554553318bb4a4ccad3b74a41809f6ebce20a2314c68354546801e02f', 1),
(745, 84, '2018-04-25 08:20:35', '2018-04-25 20:20:35', '0211dd308151af29e8aed227fa294fba02fe74ed908eb3d2a5369accaa88f4e5', 1),
(746, 95, '2018-04-25 10:27:22', '2018-04-25 22:27:22', '410ce952a7a2849ed79081b5f61ea8cd56226aac9d77ff1ad453dcee826e2ae1', 1),
(747, 95, '2018-04-25 10:43:41', '2018-04-25 22:43:41', '819c9d1236dfdbb6003aa8cc41c691a86d0747f379d8e2f093f8885f72f3805a', 1),
(748, 95, '2018-04-25 10:58:38', '2018-04-25 22:58:38', '9067ba6ac3651b7aad9e2943952dbd45dbf2f4befcb79e74e2d387e23ffa244a', 1),
(749, 84, '2018-04-25 11:03:43', '2018-04-25 23:03:43', '42cbcdf0ed6a916b6985dadad1d56d318e360614a8ff26043418dbc9265ee41b', 1),
(750, 95, '2018-04-25 11:06:40', '2018-04-25 23:06:40', 'df9e8c1825b1c0e034fee158f60522d6d460c299eb808e53b1ed51aa1dee3c91', 1),
(751, 95, '2018-04-25 11:26:07', '2018-04-25 23:26:07', '8f0b971ba95f0ccafeece5df16e34553b8dd9e77fb34c959ddd472580fc5d2a3', 1),
(752, 95, '2018-04-25 11:50:31', '2018-04-25 23:50:31', '3e402920243b7e906552ef826217ca39e72b9af7f421e6ccbcca4dfc49dd9f83', 1),
(753, 95, '2018-04-26 08:18:43', '2018-04-26 20:18:43', 'bbf857b538465c7b0fcfc18d7e7d0ad8e569b457a76470f7daacbaccedec5543', 1),
(754, 95, '2018-04-26 08:19:19', '2018-04-26 20:19:19', 'e269a3b717c22f57a39024e906dc4de1833f813e99e774a05fd37791b508fcbc', 1),
(755, 84, '2018-04-28 09:52:04', '2018-04-28 21:52:04', '4de6484152d0fc2e14f90cdc8e2446b38a31367fb3c54ffa6bae3a93eaa3be10', 1),
(756, 84, '2018-04-29 16:58:48', '2018-04-30 04:58:48', 'd0d2065fb6b5844d006835fec5bc0b860a0d34169d1d16feb73d5eddd1bac796', 1),
(757, 95, '2018-05-01 23:13:12', '2018-05-02 11:13:12', '49e317a3d689e148677ee3f104b3d53e2dbb0ea389db2ff0e0360eff80eb9436', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Team`
--

CREATE TABLE `Team` (
  `uid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Team`
--

INSERT INTO `Team` (`uid`, `name`, `desc`, `created`, `created_by`) VALUES
(59, 'Team Rocket', 'hello world', '2018-04-24 21:22:40', 95),
(60, 'Team Falcon', 'kakaw', '2018-04-24 21:37:51', 95),
(62, 'Team Trent', 'best team ever', '2018-04-26 08:20:19', 95);

-- --------------------------------------------------------

--
-- Table structure for table `TeamMember`
--

CREATE TABLE `TeamMember` (
  `uid` int(11) NOT NULL,
  `team_uid` int(11) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `isLead` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `TeamMember`
--

INSERT INTO `TeamMember` (`uid`, `team_uid`, `user_uid`, `isLead`) VALUES
(3, 1, 59, 0),
(4, 1, 79, 1),
(5, 1, 84, 0),
(8, 4, 79, 1),
(9, 8, 72, 0),
(10, 8, 76, 0),
(11, 8, 72, 0),
(12, 8, 75, 0),
(13, 8, 72, 0),
(14, 8, 72, 0),
(15, 8, 72, 0),
(16, 8, 72, 0),
(18, 8, 72, 0),
(19, 8, 76, 0),
(20, 10, 75, 0),
(23, 11, 109, 0),
(24, 11, 59, 0),
(25, 11, 72, 0),
(26, 11, 75, 0),
(27, 11, 77, 0),
(29, 12, 75, 0),
(30, 11, 94, 1),
(31, 35, 84, 0),
(32, 36, 84, 0),
(33, 36, 100, 0),
(34, 12, 85, 0),
(35, 36, 82, 0),
(36, 36, 80, 0),
(37, 36, 79, 1),
(43, 39, 107, 0),
(44, 39, 115, 0),
(45, 39, 111, 0),
(46, 39, 118, 1),
(47, 39, 81, 0),
(48, 39, 108, 0),
(49, 39, 94, 1),
(50, 47, 95, 1),
(51, 47, 84, 0),
(54, 48, 116, 1),
(59, 48, 118, 1),
(60, 52, 84, 0),
(61, 52, 95, 0),
(62, 60, 84, 0),
(63, 60, 116, 1),
(64, 62, 118, 1);

-- --------------------------------------------------------

--
-- Table structure for table `TimeEntry`
--

CREATE TABLE `TimeEntry` (
  `uid` int(11) NOT NULL,
  `req_uid` int(11) NOT NULL,
  `in_time` datetime NOT NULL,
  `out_time` datetime DEFAULT NULL,
  `user_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `TimeEntry`
--

INSERT INTO `TimeEntry` (`uid`, `req_uid`, `in_time`, `out_time`, `user_uid`) VALUES
(8, 2, '2018-03-03 10:07:57', '2018-03-03 10:19:38', 84),
(9, 2, '2018-03-03 10:10:08', '2018-03-03 10:19:38', 84),
(10, 2, '2018-03-03 10:19:32', '2018-03-03 10:19:38', 84),
(11, 13, '2018-03-05 10:11:35', '2018-03-05 10:12:09', 84),
(12, 14, '2018-03-05 10:12:03', '2018-03-05 10:12:05', 84),
(13, 14, '2018-03-05 10:12:04', '2018-03-05 10:12:05', 84),
(14, 13, '2018-03-05 10:12:06', '2018-03-05 10:12:09', 84),
(15, 1, '2018-03-10 12:31:11', '2018-03-10 12:58:10', 84),
(16, 1, '2018-03-10 12:31:15', '2018-03-10 12:58:10', 84),
(17, 5, '2018-03-10 12:31:19', '2018-03-10 12:59:53', 84),
(18, 5, '2018-03-10 12:31:21', '2018-03-10 12:59:53', 84),
(19, 6, '2018-03-10 12:31:31', '2018-03-10 12:58:14', 84),
(20, 1, '2018-03-10 12:35:09', '2018-03-10 12:58:10', 84),
(21, 1, '2018-03-10 12:35:16', '2018-03-10 12:58:10', 84),
(22, 1, '2018-03-10 12:35:43', '2018-03-10 12:58:10', 84),
(23, 1, '2018-03-10 12:35:55', '2018-03-10 12:58:10', 84),
(24, 5, '2018-03-10 12:36:00', '2018-03-10 12:59:53', 84),
(25, 1, '2018-03-10 12:37:40', '2018-03-10 12:58:10', 84),
(26, 5, '2018-03-10 12:37:46', '2018-03-10 12:59:53', 84),
(27, 5, '2018-03-10 12:39:25', '2018-03-10 12:59:53', 84),
(28, 1, '2018-03-10 12:40:05', '2018-03-10 12:58:10', 84),
(29, 5, '2018-03-10 12:40:10', '2018-03-10 12:59:53', 84),
(30, 6, '2018-03-10 12:40:15', '2018-03-10 12:58:14', 84),
(31, 1, '2018-03-10 12:40:49', '2018-03-10 12:58:10', 84),
(32, 1, '2018-03-10 12:56:30', '2018-03-10 12:58:10', 84),
(33, 1, '2018-03-10 12:57:12', '2018-03-10 12:58:10', 84),
(34, 5, '2018-03-10 12:57:15', '2018-03-10 12:59:53', 84),
(35, 1, '2018-03-10 12:58:03', '2018-03-10 12:58:10', 84),
(36, 5, '2018-03-10 12:58:06', '2018-03-10 12:59:53', 84),
(37, 6, '2018-03-10 12:58:07', '2018-03-10 12:58:14', 84),
(38, 5, '2018-03-10 12:59:50', '2018-03-10 12:59:53', 84),
(39, 6, '2018-03-10 13:16:07', NULL, 84),
(40, 1, '2018-03-10 13:16:50', '2018-04-24 17:37:21', 84),
(41, 5, '2018-03-10 13:16:53', NULL, 84),
(42, 17, '2018-03-10 13:32:45', '2018-03-10 13:32:49', 84),
(43, 18, '2018-03-10 15:35:28', '2018-03-10 15:37:13', 84),
(44, 18, '2018-03-10 15:37:09', '2018-03-10 15:37:13', 84),
(45, 20, '2018-03-13 05:07:45', '2018-03-13 22:08:02', 84),
(46, 20, '2018-03-13 05:07:59', '2018-03-13 22:08:02', 84),
(47, 20, '2018-03-13 20:16:26', '2018-03-13 22:08:02', 84),
(48, 20, '2018-03-13 20:57:31', '2018-03-13 22:08:02', 84),
(49, 20, '2018-03-13 21:44:32', '2018-03-13 22:08:02', 84),
(50, 20, '2018-03-13 22:07:53', '2018-03-13 22:08:02', 84),
(51, 21, '2018-03-13 22:07:56', '2018-03-13 22:07:59', 84),
(52, 22, '2018-03-13 23:34:29', '2018-03-14 07:48:49', 84),
(53, 23, '2018-03-14 00:16:08', '2018-03-14 10:06:54', 84),
(54, 22, '2018-03-14 07:43:54', '2018-03-14 07:48:49', 84),
(55, 22, '2018-03-14 07:47:29', '2018-03-14 07:48:49', 84),
(56, 27, '2018-03-14 08:15:02', '2018-03-14 08:30:29', 84),
(57, 23, '2018-03-14 08:16:10', '2018-03-14 10:06:54', 84),
(58, 23, '2018-03-14 08:30:06', '2018-03-14 10:06:54', 84),
(59, 23, '2018-03-14 08:30:16', '2018-03-14 10:06:54', 84),
(60, 27, '2018-03-14 08:30:22', '2018-03-14 08:30:29', 84),
(61, 23, '2018-03-14 09:46:11', '2018-03-14 10:06:54', 84),
(62, 24, '2018-03-14 09:48:29', '2018-03-26 09:51:18', 84),
(63, 23, '2018-03-14 09:48:50', '2018-03-14 10:06:54', 84),
(64, 23, '2018-03-14 09:59:29', '2018-03-14 10:06:54', 84),
(65, 23, '2018-03-14 09:59:57', '2018-03-14 10:06:54', 84),
(66, 24, '2018-03-14 10:08:52', '2018-03-26 09:51:18', 84),
(67, 24, '2018-03-15 15:47:47', '2018-03-26 09:51:18', 84),
(68, 24, '2018-03-15 15:47:49', '2018-03-26 09:51:18', 84),
(69, 24, '2018-03-15 15:47:50', '2018-03-26 09:51:18', 84),
(70, 24, '2018-03-26 09:51:23', NULL, 84),
(71, 33, '2018-03-31 14:12:27', '2018-04-04 10:30:52', 95),
(72, 33, '2018-03-31 14:17:13', '2018-04-04 10:30:52', 95),
(73, 33, '2018-03-31 14:19:47', '2018-04-04 10:30:52', 95),
(74, 33, '2018-03-31 14:21:38', '2018-04-04 10:30:52', 95),
(75, 33, '2018-03-31 14:22:04', '2018-04-04 10:30:52', 95),
(76, 33, '2018-03-31 14:29:06', '2018-04-04 10:30:52', 95),
(77, 33, '2018-03-31 14:33:14', '2018-04-04 10:30:52', 95),
(78, 33, '2018-03-31 14:34:58', '2018-04-04 10:30:52', 95),
(79, 33, '2018-03-31 14:39:00', '2018-04-04 10:30:52', 95),
(80, 33, '2018-03-31 14:49:02', '2018-04-04 10:30:52', 95),
(81, 33, '2018-03-31 14:54:53', '2018-04-04 10:30:52', 95),
(82, 33, '2018-03-31 14:55:06', '2018-04-04 10:30:52', 95),
(83, 33, '2018-03-31 14:58:46', '2018-04-04 10:30:52', 95),
(84, 33, '2018-03-31 15:03:57', '2018-04-04 10:30:52', 95),
(85, 33, '2018-03-31 15:06:23', '2018-04-04 10:30:52', 95),
(86, 33, '2018-03-31 15:08:35', '2018-04-04 10:30:52', 95),
(87, 33, '2018-03-31 15:10:54', '2018-04-04 10:30:52', 95),
(88, 33, '2018-03-31 15:11:21', '2018-04-04 10:30:52', 95),
(89, 33, '2018-03-31 15:13:09', '2018-04-04 10:30:52', 95),
(90, 33, '2018-03-31 15:14:21', '2018-04-04 10:30:52', 95),
(91, 34, '2018-03-31 15:17:08', '2018-04-22 11:53:06', 95),
(92, 34, '2018-03-31 15:23:07', '2018-04-22 11:53:06', 95),
(93, 36, '2018-03-31 15:23:29', '2018-03-31 15:23:30', 95),
(94, 33, '2018-03-31 15:45:29', '2018-04-04 10:30:52', 95),
(95, 33, '2018-04-01 13:18:16', '2018-04-04 10:30:52', 95),
(96, 33, '2018-04-01 13:18:16', '2018-04-04 10:30:52', 95),
(97, 34, '2018-04-01 21:51:11', '2018-04-22 11:53:06', 95),
(98, 33, '2018-04-02 16:32:59', '2018-04-04 10:30:52', 95),
(99, 33, '2018-04-02 16:46:05', '2018-04-04 10:30:52', 95),
(100, 33, '2018-04-02 16:46:47', '2018-04-04 10:30:52', 95),
(101, 33, '2018-04-02 16:46:49', '2018-04-04 10:30:52', 95),
(102, 33, '2018-04-02 16:59:19', '2018-04-04 10:30:52', 95),
(103, 46, '2018-04-02 18:01:30', '2018-04-22 11:35:28', 95),
(104, 33, '2018-04-02 20:05:40', '2018-04-04 10:30:52', 95),
(105, 33, '2018-04-02 20:11:01', '2018-04-04 10:30:52', 95),
(106, 34, '2018-04-02 20:11:13', '2018-04-22 11:53:06', 95),
(107, 33, '2018-04-02 20:11:14', '2018-04-04 10:30:52', 95),
(108, 33, '2018-04-02 20:11:22', '2018-04-04 10:30:52', 95),
(109, 33, '2018-04-02 20:11:34', '2018-04-04 10:30:52', 95),
(110, 33, '2018-04-02 20:11:41', '2018-04-04 10:30:52', 95),
(111, 33, '2018-04-02 20:12:16', '2018-04-04 10:30:52', 95),
(112, 33, '2018-04-02 20:15:07', '2018-04-04 10:30:52', 95),
(113, 34, '2018-04-02 20:29:09', '2018-04-22 11:53:06', 95),
(114, 33, '2018-04-02 20:34:18', '2018-04-04 10:30:52', 95),
(115, 33, '2018-04-02 20:34:19', '2018-04-04 10:30:52', 95),
(116, 33, '2018-04-02 20:34:20', '2018-04-04 10:30:52', 95),
(117, 34, '2018-04-02 20:34:22', '2018-04-22 11:53:06', 95),
(118, 33, '2018-04-02 20:34:24', '2018-04-04 10:30:52', 95),
(119, 33, '2018-04-02 20:34:25', '2018-04-04 10:30:52', 95),
(120, 33, '2018-04-02 20:36:33', '2018-04-04 10:30:52', 95),
(121, 33, '2018-04-02 20:36:40', '2018-04-04 10:30:52', 95),
(122, 33, '2018-04-02 20:41:58', '2018-04-04 10:30:52', 95),
(123, 34, '2018-04-03 13:01:50', '2018-04-22 11:53:06', 95),
(124, 49, '2018-04-03 13:05:00', '2018-04-03 19:26:27', 95),
(125, 33, '2018-04-03 13:12:23', '2018-04-04 10:30:52', 95),
(126, 46, '2018-04-03 13:13:27', '2018-04-22 11:35:28', 95),
(127, 50, '2018-04-03 14:22:13', '2018-04-22 13:55:00', 95),
(128, 51, '2018-04-03 14:23:44', '2018-04-03 14:23:44', 95),
(129, 49, '2018-04-03 19:26:26', '2018-04-03 19:26:27', 95),
(130, 33, '2018-04-04 10:30:49', '2018-04-04 10:30:52', 95),
(131, 55, '2018-04-04 10:40:56', '2018-04-04 10:40:59', 95),
(132, 56, '2018-04-05 12:31:54', '2018-04-21 23:40:14', 95),
(133, 56, '2018-04-21 14:49:39', '2018-04-21 23:40:14', 95),
(134, 57, '2018-04-21 14:49:45', '2018-04-22 07:25:09', 95),
(135, 56, '2018-04-21 14:49:48', '2018-04-21 23:40:14', 95),
(136, 56, '2018-04-21 15:10:15', '2018-04-21 23:40:14', 95),
(137, 56, '2018-04-21 15:25:33', '2018-04-21 23:40:14', 95),
(138, 56, '2018-04-21 15:26:42', '2018-04-21 23:40:14', 95),
(139, 57, '2018-04-21 15:27:05', '2018-04-22 07:25:09', 95),
(140, 56, '2018-04-21 15:29:32', '2018-04-21 23:40:14', 95),
(141, 57, '2018-04-21 15:29:35', '2018-04-22 07:25:09', 95),
(142, 56, '2018-04-21 15:30:00', '2018-04-21 23:40:14', 95),
(143, 57, '2018-04-21 15:30:13', '2018-04-22 07:25:09', 95),
(144, 56, '2018-04-21 15:33:12', '2018-04-21 23:40:14', 95),
(145, 57, '2018-04-21 15:33:52', '2018-04-22 07:25:09', 95),
(146, 56, '2018-04-21 15:34:19', '2018-04-21 23:40:14', 95),
(147, 56, '2018-04-21 15:34:35', '2018-04-21 23:40:14', 95),
(148, 56, '2018-04-21 17:13:38', '2018-04-21 23:40:14', 95),
(149, 56, '2018-04-21 17:14:45', '2018-04-21 23:40:14', 95),
(150, 57, '2018-04-21 17:15:09', '2018-04-22 07:25:09', 95),
(151, 56, '2018-04-21 17:38:43', '2018-04-21 23:40:14', 95),
(152, 57, '2018-04-21 18:52:38', '2018-04-22 07:25:09', 95),
(153, 56, '2018-04-21 18:52:40', '2018-04-21 23:40:14', 95),
(154, 57, '2018-04-21 18:53:51', '2018-04-22 07:25:09', 95),
(155, 56, '2018-04-21 18:54:36', '2018-04-21 23:40:14', 95),
(156, 57, '2018-04-21 18:55:24', '2018-04-22 07:25:09', 95),
(157, 57, '2018-04-21 18:55:45', '2018-04-22 07:25:09', 95),
(158, 57, '2018-04-21 18:55:51', '2018-04-22 07:25:09', 95),
(159, 56, '2018-04-21 18:55:56', '2018-04-21 23:40:14', 95),
(160, 50, '2018-04-21 18:56:16', '2018-04-22 13:55:00', 95),
(161, 57, '2018-04-21 22:49:57', '2018-04-22 07:25:09', 95),
(162, 56, '2018-04-21 22:50:03', '2018-04-21 23:40:14', 95),
(163, 56, '2018-04-21 22:54:36', '2018-04-21 23:40:14', 95),
(164, 57, '2018-04-21 22:54:39', '2018-04-22 07:25:09', 95),
(165, 57, '2018-04-21 22:54:58', '2018-04-22 07:25:09', 95),
(166, 51, '2018-04-21 22:55:15', '2018-04-23 13:45:17', 95),
(167, 56, '2018-04-21 22:55:23', '2018-04-21 23:40:14', 95),
(168, 56, '2018-04-21 22:55:27', '2018-04-21 23:40:14', 95),
(169, 56, '2018-04-21 23:31:56', '2018-04-21 23:40:14', 95),
(170, 57, '2018-04-21 23:39:39', '2018-04-22 07:25:09', 95),
(171, 56, '2018-04-21 23:40:06', '2018-04-21 23:40:14', 95),
(173, 56, '2018-04-22 06:57:42', '2018-04-22 08:57:42', 95),
(174, 57, '2018-04-22 07:25:06', '2018-04-22 07:25:09', 95),
(175, 46, '2018-04-22 11:34:46', '2018-04-22 11:35:28', 95),
(176, 45, '2018-04-22 11:34:48', '2018-04-22 11:35:27', 95),
(177, 47, '2018-04-22 11:34:50', '2018-04-22 11:35:29', 95),
(178, 35, '2018-04-22 11:35:23', '2018-04-22 11:35:25', 95),
(179, 49, '2018-04-22 11:35:50', NULL, 95),
(180, 33, '2018-04-22 11:52:59', NULL, 95),
(181, 34, '2018-04-22 11:53:03', '2018-04-22 11:53:06', 95),
(182, 56, '2018-04-22 12:09:33', '2018-04-23 07:47:39', 84),
(183, 56, '2018-04-22 12:47:14', '2018-04-23 07:47:39', 84),
(184, 50, '2018-04-22 13:54:53', '2018-04-22 13:55:00', 95),
(185, 56, '2018-04-22 14:04:19', '2018-04-23 07:47:39', 84),
(186, 56, '2018-04-22 14:41:46', '2018-04-23 07:47:39', 84),
(187, 56, '2018-04-22 14:55:14', '2018-04-23 07:47:39', 84),
(188, 56, '2018-04-23 07:44:52', '2018-04-23 07:47:39', 84),
(189, 56, '2018-04-23 08:17:07', '2018-04-23 08:25:05', 84),
(190, 56, '2018-04-23 08:25:48', '2018-04-23 08:27:59', 84),
(191, 56, '2018-04-23 08:29:04', '2018-04-23 08:29:45', 84),
(192, 34, '2018-04-23 17:12:13', '2018-04-23 17:12:16', 95),
(193, 34, '2018-04-24 14:54:16', '2018-04-24 14:54:17', 95),
(194, 34, '2018-04-24 14:54:44', '2018-04-24 18:39:02', 95),
(195, 1, '2018-04-24 17:39:55', '2018-04-24 17:40:03', 84),
(196, 1, '2018-04-24 17:42:24', '2018-04-24 17:42:45', 84),
(197, 1, '2018-04-24 17:43:38', '2018-04-24 17:43:47', 84),
(198, 1, '2018-04-24 17:44:12', '2018-04-24 17:44:25', 84),
(199, 1, '2018-04-24 17:48:54', '2018-04-24 17:49:25', 84),
(200, 1, '2018-04-24 17:55:26', '2018-04-24 17:55:36', 84),
(201, 2, '2018-04-24 17:55:46', '2018-04-24 17:55:47', 84),
(202, 2, '2018-04-24 17:55:47', '2018-04-24 17:55:48', 84),
(203, 2, '2018-04-24 17:55:49', '2018-04-24 17:55:51', 84),
(204, 2, '2018-04-24 18:03:33', '2018-04-24 18:03:43', 84),
(205, 62, '2018-04-24 21:24:47', '2018-04-24 21:25:22', 84),
(206, 63, '2018-04-24 22:54:11', '2018-04-25 10:32:45', 95),
(207, 62, '2018-04-24 23:14:43', '2018-04-24 23:14:53', 84),
(208, 64, '2018-04-25 08:25:21', '2018-04-25 08:25:35', 84),
(209, 64, '2018-04-25 08:27:15', '2018-04-25 08:27:30', 84),
(210, 59, '2018-04-25 10:33:50', '2018-04-25 10:33:51', 95),
(211, 65, '2018-04-25 10:44:13', '2018-04-25 10:44:47', 95),
(212, 64, '2018-04-25 11:04:04', '2018-04-25 11:04:36', 84),
(213, 65, '2018-04-25 11:07:26', NULL, 95),
(214, 66, '2018-04-25 11:07:30', '2018-04-25 11:07:33', 95),
(215, 63, '2018-04-26 08:21:23', '2018-04-26 08:21:25', 95);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `uid` bigint(20) NOT NULL,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `phone` varchar(256) NOT NULL,
  `address` varchar(256) NOT NULL,
  `username` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `wage` decimal(10,2) NOT NULL,
  `enabled` int(11) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`uid`, `first_name`, `last_name`, `email`, `phone`, `address`, `username`, `password`, `salt`, `wage`, `enabled`, `created`) VALUES
(84, 'Ryan', 'Castlione', 'rjcastig@svsu.edu', '9894937928', 'updated address', 'rjcastig', '7c0d96f4ce6f12219c2e9647be1c225d87c50f5a5ac87439945886250a6d8393', '1511207434gbnod', '8.00', 1, '2017-11-20 11:50:34'),
(95, 'Trent', 'Killinger', 'trentkillinger@gmail.com', 'None', 'None', 'Crimson-Traxis', 'a8a97a3f96a3522b223e044075964b9f7d1f59dbda23f666ff019478e45e04ad', '1511583547mmcvy', '2.00', 1, '2017-11-24 20:19:07'),
(116, 'Il-Hyung', 'Cho', 'icho@svsu.edu', '1231231234', 'None', 'icho1', 'baa3abaa7dc026e3b2793c60a1c03c4a8dd867b1297eeea8346e2aef1632002a', '1521074703anqmq', '500.00', 1, '2018-03-14 17:45:03'),
(118, 'Brian', 'Cobb', 'xlilcasper@gmail.com', '9891235487', '123 Somewhere', 'brian', '50530724bba35ed77556e189d1ad5f539ec12d3e951e83bfbbe8693391bf815e', '1524315630xxvkm', '1.21', 1, '2018-04-21 06:00:30'),
(119, 'Brad', 'Chippi', 'bjaldsfj@Kladf.com', '9999999999', 'lkajsdf 1', 'adfasdf', 'd3170fe8c7bf7a118ab813c58858d6cac7b4c2b5b63af4070352c21fd1fba7e9', '1524426177wwsyp', '1.23', 0, '2018-04-22 12:42:57'),
(120, 'asdfkjl', 'lkjasdf', 'lkjasdf@lkasdf.com', '9999999999', 'laksjdflkj', 'nomoney', 'c1ebb96be56ddf375c145400e43769336d47a94321e5ded49203c0e5a13e6165', '1524426611wbnls', '0.00', 0, '2018-04-22 12:50:11'),
(121, 'asfd', 'adf', 'asdf@adf.com', '9999999999', 'kjjjlkjlj', 'asdfadsf', '6fefdfd93251976586700dbfc52c8c984f23fdc029ecfcc6ccddeda7819f2b4e', '1524426733wydrb', '0.00', 0, '2018-04-22 12:52:13'),
(122, 'basdfb', 'badflkj', 'badlkfj@lkasdf.com', '9999999999', 'lkjadsfkjl', 'moneymoneymoney', '2bdc279936d680f2d4eb510227b070de5f11958c69bf057b0e50b057034b8f51', '1524426868ppebs', '0.00', 0, '2018-04-22 12:54:28'),
(123, 'brad', 'c', 'fbadfjk@ljkadfs.com', '9999999999', 'klajdsf', 'newuser', 'edbaafd3195211948382109194444929995d13f7c2631691094bf7ef545df6c3', '1524426915njijz', '0.00', 0, '2018-04-22 12:55:15'),
(124, 'Trent', 'Killinger', 'trentkillinger@gmail.com', '9899151606', 'None', 'TrentK', '4593fd750eff5bd4c791ce976e3444c448cb728811ab00b539750a39c4c2614c', '1524602529rpyzc', '33.00', 1, '2018-04-24 13:42:09');

-- --------------------------------------------------------

--
-- Table structure for table `UserPermission`
--

CREATE TABLE `UserPermission` (
  `uid` int(11) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `permission_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `UserPermission`
--

INSERT INTO `UserPermission` (`uid`, `user_uid`, `permission_uid`) VALUES
(2, 84, 11),
(4, 84, 1),
(5, 84, 2),
(6, 84, 3),
(7, 84, 4),
(8, 84, 5),
(9, 84, 6),
(10, 84, 7),
(11, 84, 8),
(12, 84, 9),
(13, 84, 10),
(14, 84, 12),
(17, 84, 13),
(20, 84, 11),
(21, 84, 14),
(22, 84, 15),
(23, 84, 16),
(24, 84, 17),
(25, 84, 18),
(28, 84, 19),
(29, 84, 20),
(30, 84, 21),
(31, 84, 22),
(33, 84, 23),
(47, 116, 1),
(48, 116, 2),
(49, 116, 3),
(50, 116, 4),
(51, 116, 8),
(52, 116, 10),
(53, 116, 11),
(54, 116, 12),
(55, 116, 13),
(56, 116, 14),
(57, 116, 15),
(58, 116, 16),
(59, 116, 17),
(60, 116, 22),
(61, 116, 23),
(75, 95, 1),
(76, 95, 2),
(77, 95, 3),
(78, 95, 4),
(79, 95, 5),
(80, 95, 6),
(81, 95, 7),
(82, 95, 8),
(83, 95, 9),
(84, 95, 10),
(85, 95, 11),
(86, 95, 12),
(87, 95, 13),
(88, 95, 14),
(89, 95, 15),
(90, 95, 16),
(91, 95, 17),
(92, 95, 18),
(93, 95, 19),
(94, 95, 20),
(95, 95, 21),
(96, 95, 22),
(97, 95, 23),
(119, 118, 1),
(120, 118, 2),
(121, 118, 3),
(122, 118, 4),
(123, 118, 5),
(124, 118, 6),
(125, 118, 7),
(126, 118, 8),
(127, 118, 9),
(128, 118, 10),
(129, 118, 11),
(130, 118, 12),
(131, 118, 13),
(132, 118, 14),
(133, 118, 15),
(134, 118, 16),
(135, 118, 17),
(136, 118, 18),
(137, 118, 19),
(138, 118, 20),
(139, 118, 21),
(140, 118, 22),
(141, 118, 23),
(142, 124, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `File`
--
ALTER TABLE `File`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `FileType`
--
ALTER TABLE `FileType`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `notifier`
--
ALTER TABLE `notifier`
  ADD PRIMARY KEY (`user_id`,`req_id`);

--
-- Indexes for table `Permission`
--
ALTER TABLE `Permission`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `ProjectComments`
--
ALTER TABLE `ProjectComments`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `ProjectFiles`
--
ALTER TABLE `ProjectFiles`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `ProjectReq`
--
ALTER TABLE `ProjectReq`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `Req`
--
ALTER TABLE `Req`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `ReqComments`
--
ALTER TABLE `ReqComments`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `ReqStatus`
--
ALTER TABLE `ReqStatus`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `Team`
--
ALTER TABLE `Team`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `TeamMember`
--
ALTER TABLE `TeamMember`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `TimeEntry`
--
ALTER TABLE `TimeEntry`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `UserPermission`
--
ALTER TABLE `UserPermission`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `File`
--
ALTER TABLE `File`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `FileType`
--
ALTER TABLE `FileType`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Permission`
--
ALTER TABLE `Permission`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `Project`
--
ALTER TABLE `Project`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT for table `ProjectComments`
--
ALTER TABLE `ProjectComments`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ProjectFiles`
--
ALTER TABLE `ProjectFiles`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ProjectReq`
--
ALTER TABLE `ProjectReq`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `Req`
--
ALTER TABLE `Req`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `ReqComments`
--
ALTER TABLE `ReqComments`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ReqStatus`
--
ALTER TABLE `ReqStatus`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Session`
--
ALTER TABLE `Session`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=758;

--
-- AUTO_INCREMENT for table `Team`
--
ALTER TABLE `Team`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `TeamMember`
--
ALTER TABLE `TeamMember`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `TimeEntry`
--
ALTER TABLE `TimeEntry`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `UserPermission`
--
ALTER TABLE `UserPermission`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
