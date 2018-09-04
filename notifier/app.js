var mysql      = require('mysql');
var async = require("async");
const ManageMeSettings = require("./managemeSettings.js");

function wait(ms) {
  var start = Date.now(),
      now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

console.log("waiting for 120 seconds to launch the notifier ....")
wait(120000);


var connection = mysql.createConnection({
  host     : ManageMeSettings.dbHost,
  user     : ManageMeSettings.dbUser,
  password : ManageMeSettings.dbPasswd,
  database : ManageMeSettings.dbDBName
});

connection.connect();

let usersStates = {};

/*

{
  user_id: {
    req_id: {
      clocked_in: true or false
      soft_cap: num
      hard_cap: num
      time_spent: num
    }
  }
}

*/


function changeNotiedRow(user_id, req_id, column_name, column_value){
  let query = `
  INSERT INTO notifier (user_id,req_id,${column_name})
  VALUES (?,?,?)
  ON DUPLICATE KEY UPDATE 
  ${column_name}=VALUES(${column_name})
  `;
  connection.query(query, [user_id, req_id, column_value], function (error, results, fields) {});
}


function initializeUserStates(){
  return new Promise((resolve, reject)=>{
    connection.query('select * from notifier', function (error, results, fields) {
      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        if(!(row.user_id in usersStates)){
          usersStates[row.user_id] = {};
        }
        if(!(row.req_id in usersStates[row.user_id])){
          usersStates[row.user_id][row.req_id] = {};
        }
        if(row.soft_cap) usersStates[row.user_id][row.req_id]["soft_cap"] = row.soft_cap;
        if(row.hard_cap) usersStates[row.user_id][row.req_id]["hard_cap"] = row.hard_cap;
        if(row.time_spent) usersStates[row.user_id][row.req_id]["time_spent"] = row.time_spent;
        if(row.soft_cap_notified) {
          usersStates[row.user_id][row.req_id]["soft_cap_notified"] = row.soft_cap_notified;
        }
        if(row.hard_cap_notified) {
          usersStates[row.user_id][row.req_id]["hard_cap_notified"] = row.hard_cap_notified;
        }
        if(row.clocked_in) {
          usersStates[row.user_id][row.req_id]["clocked_in"] = row.clocked_in;
        }
      }
      resolve(true);
    });
  });
}

async function runTask(){
  let waitInit = await initializeUserStates();
  console.log("init: ", usersStates);

  async.forever(
    function(next) {
      connection.query('select * from User', function (error, results, fields) { // select all users
        if (error) throw error;
        //console.log('Users Are: ', results);
        for (let i = 0; i < results.length; i++) { // 1- get users
          const userData = results[i];
          // create in in state if not there.
          if(!(userData.uid in usersStates)){
            usersStates[userData.uid] = {};
          }
          //console.log(userData.uid);
          connection.query(`
            select * from Req 
            where uid in (select req_uid from ProjectReq 
            where project_uid in (select uid from Project 
            where assigned_team in (select team_uid from TeamMember where user_uid = ?)))`,
            [userData.uid], 
            function (error1, resultsReqs, fields1) { 
              if(error1) console.log("ERR:", error1);
              //if(resultsReqs) console.log("resultsReqs:", resultsReqs);
              //if(fields1) console.log("ERR:", fields1);
              for (let j = 0; j < resultsReqs.length; j++) { // 2- for each user get requirements
                const req = resultsReqs[j];
                // create in in state if not there.
                if(!(req.uid in usersStates[userData.uid])){
                  usersStates[userData.uid][req.uid] = {};
                  usersStates[userData.uid][req.uid]["soft_cap"] = req.soft_cap;
                  usersStates[userData.uid][req.uid]["hard_cap"] = req.hard_cap;
                  changeNotiedRow(userData.uid, req.uid, "soft_cap", req.soft_cap);
                  changeNotiedRow(userData.uid, req.uid, "hard_cap", req.hard_cap);
                }
                else {
                  usersStates[userData.uid][req.uid]["soft_cap"] = req.soft_cap;
                  usersStates[userData.uid][req.uid]["hard_cap"] = req.hard_cap;
                  changeNotiedRow(userData.uid, req.uid, "soft_cap", req.soft_cap);
                  changeNotiedRow(userData.uid, req.uid, "hard_cap", req.hard_cap);
                }
                connection.query(`
                SELECT uid FROM TimeEntry 
                WHERE req_uid = ? AND out_time IS NULL AND 
                user_uid = ? LIMIT 1
                `, [req.uid, userData.uid], function (error2, resultsTimeEntries, fields2) { // 2a- check clock ins
                  if(error2) console.log("ERR:", error2);
                  //if(fields3) console.log("ERR:", fields1);
                  //console.log("Time Entries - clock ins: ", resultsTimeEntries);
      
                  // create in in state if not there.
                  if(!("clocked_in" in usersStates[userData.uid][req.uid])){
                    usersStates[userData.uid][req.uid]["clocked_in"] = false;
                    changeNotiedRow(userData.uid, req.uid, "clocked_in", 0);
                  }
      
                  let current_clocked_in_state = usersStates[userData.uid][req.uid]["clocked_in"];
      
                  if(resultsTimeEntries.length > 0 && !current_clocked_in_state){ // clocked in event
                    usersStates[userData.uid][req.uid]["clocked_in"] = true;
                    changeNotiedRow(userData.uid, req.uid, "clocked_in", 1);
                    console.log(`clock in event: user ${userData.uid} , requirement: ${req.uid}`);
                    // PUT your code here for any notification system
                  }
                  else if(resultsTimeEntries.length == 0 && current_clocked_in_state) { // clocked out event
                    usersStates[userData.uid][req.uid]["clocked_in"] = false;
                    changeNotiedRow(userData.uid, req.uid, "clocked_in", 1);
                    console.log(`clock out event: user ${userData.uid} , requirement: ${req.uid}`);
                    // PUT your code here for any notification system
                  }
                });
      
                // select * from TimeEntry where req_uid = 56 and user_uid = 84 order by in_time
      
                connection.query('select * from TimeEntry where req_uid = ? and user_uid = ? order by in_time', // 2b- get total hours
                [req.uid, userData.uid], function (error3, timeRangeResults, fields3) {
                  if(error3) console.log("ERR:", error3);
                  let totalHours = 0;
                  for (let k = 0; k < timeRangeResults.length; k++) {
                    const rangeRow = timeRangeResults[k];
                    let in_time = rangeRow.in_time;
                    let out_time = new Date();
                    if(rangeRow.out_time != null){
                      out_time = rangeRow.out_time;
                    }
                    //console.log("range row: ", rangeRow);
                    //console.log("clock_in ", in_time, "clock out: ", out_time, "diff: ", out_time-in_time);
                    totalHours += (out_time-in_time)/1000/60/60;
                  }
                  //console.log("total hours for a req:", totalHours);

                  usersStates[userData.uid][req.uid]["time_spent"] = totalHours;
                  changeNotiedRow(userData.uid, req.uid, "time_spent", totalHours);
      
                  if((usersStates[userData.uid][req.uid]["soft_cap"]-totalHours) < 0 && !(usersStates[userData.uid][req.uid]["soft_cap_notified"])){
                    console.log(`Soft cap notification: user ${userData.uid} , requirement: ${req.uid} We are now notifing them of this soft cap...`);
                    usersStates[userData.uid][req.uid]["soft_cap_notified"] = true;
                    changeNotiedRow(userData.uid, req.uid, "soft_cap_notified", 1);
                    // PUT your code here for any notification system
                  }
      
                  if((usersStates[userData.uid][req.uid]["hard_cap"]-totalHours) < 0 && !(usersStates[userData.uid][req.uid]["hard_cap_notified"])){
                    console.log(`Hard cap notification: user ${userData.uid} , requirement: ${req.uid} We are now clocking them out!`);
                    usersStates[userData.uid][req.uid]["hard_cap_notified"] = true;
                    changeNotiedRow(userData.uid, req.uid, "hard_cap_notified", 1);
                    connection.query(`UPDATE TimeEntry SET out_time=Now() WHERE req_uid = ? and user_uid = ? and out_time is null;`, [req.uid, userData.uid], function (error, results, fields) {});
                    // PUT your code here for any notification system
                  }

                });
      
              }
          });
        }
      });

      //console.log("state Obj : ", usersStates);

      //Repeat after the delay
      setTimeout(function() {
        next();
      }, 5000)
    },
    function(err) {
        console.error(err);
    }
  );

}

runTask();

//connection.end();