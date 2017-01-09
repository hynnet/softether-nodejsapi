/*global require module*/
const CONNECTION = "/usr/local/vpnclient/./vpncmd /server <SERVERIP>:443 /password:<ADMINPASSWORD> /adminhub:";
var exec =  require("child_process").execSync; 

//********************************************************************************
module.exports = {

  sessionList: function(hub) {
    var info = [];
    var sessions = [];
    var temp = [];
    info = exec(CONNECTION + hub + " /cmd SessionList").toString().split("\n");
    info = info.splice(14);
    for (var i = 0 ; i < info.length-8;) {
      for (var j = 0 ; j < 9; j++) {
        temp.push(info[i+j].substring(17));       
      }
      
      temp[0] = temp[4];
      if (temp[3] !== "SecureNAT Session" && temp[0] !== "L3SW_ro") { // Don't include stystem connections
        temp.splice(4,1); //Remove duplicated username in [4]
        sessions.push(temp);
      }
      temp = [];
      i=i+j;
    }
    return JSON.stringify(sessions);
  },

  IpTable: function(hub) {
    var info = [];
    var sessions = [];
    var temp = [];
    info = exec(CONNECTION + hub + " /cmd IpTable").toString().split("\n");   
    info = info.splice(14);
    for (i = 0 ; i < info.length-9;) {
      for (j = 0 ; j < 7; j++) {
        temp.push(info[i+j].substring(13));       
      }
      temp[3] = temp[3].replace(" (DHCP)",""); // Remove DHCP
      temp[0] = temp[2].split("-")[1].toLowerCase(); // Build user name
      temp[6] = temp[6].replace("On ","");
      sessions.push(temp); 
      temp = [];
      i=i+j;      
    }
    return JSON.stringify(sessions);
  },

  getConnections: function(hub) {
    var sessions = [];
    var temp = [];
    var info = [];

    if(hub == "servers") {
      sessions = module.exports.sessionList(hub);
    }
    else {
      sessions = module.exports.IpTable(hub);
    }
    return sessions; 
  },


  getAllUsers(hub) {
    
    var users = [];
    var temp = [];
    var info = exec(CONNECTION + hub + " /cmd UserList").toString().split("\n");

    info = info.splice(14); //Remove header

    for (var i = 0 ; i < info.length-9;) {
      for (var j = 0 ; j < 11; j++) {
        temp.push(info[i+j].substring(17));  // Remove field description     
      }
      temp.shift(); 
      users.push(temp);
      temp = [];
      i=i+j;  
    }
    return JSON.stringify(users);
  },

  createUser: function(hub,accountName,password,completeName) {
    exec(CONNECTION + hub + " /cmd UserCreate " + accountName + " /GROUP:none /REALNAME:" + completeName + " /NOTE:none");
    exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + " /Password:" + password);
 
  },

  setPassword: function(hub,accountName,password) {
    exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + "/Password:" + password);
    return;
  },


  deleteUser: function(hub,userName) {
    exec(CONNECTION + hub + " /cmd UserDelete " + userName);
  },

  userDetails: function(hub,userName) {
    var info = exec(CONNECTION + hub + " /cmd UserGet " + userName).toString().split("\n");
    info = info.splice(14); //Remove header
    for (var i = 0 ; i < info.length; i++) {
      info[i] = info[i].substring(30);   //Remove field description
    }
    info.shift();
    info.pop();
    info.pop();
    info.pop();
    info.splice(5,1);  //Remove delimiter ---------------
    return JSON.stringify(info);
  },

  generatePass: function() { 
    var password = Math.random().toString(36).slice(-8);
    return password;
  }
};
