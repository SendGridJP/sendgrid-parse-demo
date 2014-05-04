// connect to the websocket
var socket = io.connect();

var validColor = function (color) {
  var elem = document.createElement("div");
  elem.style.color = color;
  return !!elem.style.color;
};

var showExample = function() {
  document.getElementById("example").innerHTML = randomColor();
};

setInterval(showExample, 5000);
showExample();

// listen for new colors from the server
socket.on('input', function(input) {
	var color = input.color;
	var requester = input.requester;
	document.body.style.backgroundColor = validColor(color) ? color : randomColor();
    document.getElementById("requester").innerHTML = requester;
});

socket.emit('ready');
