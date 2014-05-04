// load dependencies
var twilio = require("twilio");
var express = require("express.io");
var shared = require("./public/shared");
var util = require('util');

//var authToken = process.env.AUTH_TOKEN || require("fs").readFileSync("authtoken.txt").toString().trim();

// create the express.io app
var app = express();
app.http().io();

var lastInput;

app.use(express.bodyParser());

// send client code from the public/ folder
app.use(express.static(process.cwd() + '/public'));

// handle input
app.post('/hook', function(req, res) {

  // extract the color from the request
  var color = (req.body.Body || req.body.text).split(/\n/)[0].toLowerCase().replace(/\s/g, "");

  // extract the requester mail address
  var requester = req.body.from;
  
  // output request object
  //console.log(util.inspect(req, false, null));
  
  var input = { color: color, requester: requester };
  console.log(color);
  console.log(requester);

  
  // prepare the reply to Twilio
  var resp = new twilio.TwimlResponse();
  
  // broadcast the color to all connected browsers
  app.io.broadcast('input', input);
  lastInput = input;

  // send the reply to Twilio
  // SendGrid will just ignore the reply
  res.send(resp.toString());
});

app.io.route('ready', function(req) {
  if (lastInput) {
    req.io.emit('input', lastInput);
  }
});

app.listen(process.env.PORT || 7076);
