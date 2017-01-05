/*global require __dirname*/

//********  Dependencies  **************
var bodyParser = require("body-parser");
const token = <token>;
const hubList = [];
//*******  Include Functions  *****
var tools = require(__dirname + "/functions.js");

//********  Create Server ***********

var express = require("express")
 , app = express();
var router = express.Router();

var hub;


//*****   Start Server:  **********

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000); 

//*********************************

router.use(function (req,res,next) {
  next();
});



// *********** Page Handling  ****************

app.get("/check",function(req,res) {
  if (!req.body) return res.sendStatus (400);
  res.send("The server i UP");
  res.end();
});



app.post("/main", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
  if(hubList.indexOf(hub) > -1) {
    var sessions = tools.getConnections(hub);
    res.send(sessions);
  }
  else {
    res.send("Hub not found");
  }    
  res.end(); 
});


app.post("/users", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
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
  var userName;
  var passwd;
  var completeName;
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
  if (hubList.indexOf(hub) > -1) {
    userName = req.body.userName;
    passwd = req.body.passwd;
    completeName = req.body.completeName;
    tools.createUser(hub,userName,passwd,completeName);  
  }
  else {
    res.send("Hub not found");
  }
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

app.post("/userDetails", function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
  var userName = req.body.userName;
  if(hubList.indexOf(hub) > -1) {
    var user = tools.userDetails(hub,userName);
    res.send(user);
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