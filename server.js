// load dependencies
var twilio = require("twilio");
var express = require("express.io");
var shared = require("./public/shared");
var util = require('util');

// var authToken = process.env.AUTH_TOKEN ||
// require("fs").readFileSync("authtoken.txt").toString().trim();

var fs = require('fs'), path = require('path');

var fileCopy = function(srcFile, dstFile, callback) {

    if (fs.existsSync(srcFile) && fs.statSync(srcFile).isFile()) {
        var oldFile = fs.createReadStream(srcFile);
        var newFile = fs.createWriteStream(dstFile);

        oldFile.addListener("data", function(chunk) {
            newFile.write(chunk);
        });
        oldFile.addListener("close", function() {
            newFile.end();
            if (callback) {
                callback();
            }
        });
    } else {
        throw 'file not found: ' + srcFile;
    }
};

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
    var color = (req.body.Body || req.body.text).split(/\n/)[0].toLowerCase()
            .replace(/\s/g, "");

    // extract the requester mail address
    var requester = req.body.from;

    // output request object
//    console.log(util.inspect(req, false, null));

    // copy file to the public
    var file = null;
    if (req.body.attachments > 0) {
        var srcFile = req.files.attachment1.path;
        // handle only jpg
        if (path.extname(srcFile) == '.jpg') {
            fileCopy(srcFile, './public/img/image.jpg');
            file = './public/img/image.jpg';
        }
    }

    var input = {
        color : color,
        requester : requester,
        file : file
    };
    console.log(input);

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
