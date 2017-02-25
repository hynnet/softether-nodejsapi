/*global require __dirname*/

//********  Dependencies  **************
var bodyParser = require("body-parser");

const hubList = ["operaciones","servers","agencias", "ruviag"];
//*******  Include Functions  *****
var tools = require(__dirname + "/functions.js");

//********  Create Server ***********

var express = require("express")
 , app = express();
var router = express.Router();

var hub;


//*****   Start Server:  **********
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000); 

//*********************************

router.use(function (req,res,next) {
  next();
});



// *********** Page Handling  ****************

app.get("/check",function(req,res) {
  if (!req.body) return res.sendStatus (400);
  res.send("The server is UP");
  res.end();
});

app.get("/sessions.json", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  console.log("Checking Sessions...");
 // if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  if(hubList.indexOf(hub) > -1) {
    var sessions = tools.getConnections(hub);
    res.send(sessions);
  }
  else {
    res.send("Hub not found");
  }    
  res.end(); 
});


app.get("/allUsers.json", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  onsole.log("Getting all users...");
  hub = req.query.hubname;
  if(hubList.indexOf(hub) > -1) {
    var users = tools.getAllUsers(hub);
    res.send(users);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
});

app.post("/newUser", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  if (hubList.indexOf(hub) > -1) {
    var userName = req.body.user_name;
    var passwd = req.body.password;
    var description = req.body.description;
    tools.createUser(hub,userName,passwd,description);  
  }
  else {
    res.send("Hub not found");
  }
  onsole.log("New User Saved");
  res.end(); 
}); 

app.post("/deleteUser", function (req,res) { //lista
  var userName;
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
  userName = req.body.userName;
  tools.deleteUser(hub,userName);
  res.end();   
});  

app.get("/userDetails.json", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  var userName = req.query.username;
  if(hubList.indexOf(hub) > -1) {
    var user = tools.userDetails(hub,userName);
    res.send(user);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
});

app.post("/sessionList", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = "agencias";
  var sessionName = req.body.sessionName;
  if(hubList.indexOf(hub) > -1) {
    var session = tools.sessionList("agencias",sessionName);
    res.send(session);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
});


app.post("/generatePass", function (req,res) { //lista
  var password = tools.generatePass();
  res.send(password);
});

app.post("/test", function (req,res) { //lista
  tools.test();
});

app.get("/vnc", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
 // if (req.headers.token !== token) return res.sendStatus(401);
  ip = req.query.ip;
  var url = tools.vncConnect(ip);
  res.end(); 
});