var switcher = false;

// connect to the websocket
var socket = io.connect();

var validColor = function(color) {
    var elem = document.createElement("div");
    elem.style.color = color;
    return !!elem.style.color;
};

var showExample = function() {
    document.getElementById("example").innerHTML = randomColor();
//    if (switcher) {
//        document.getElementById("image").src = "http://image.itmedia.co.jp/news/articles/1405/06/yu_express1.jpg";
//        switcher = false;
//    } else {
//        document.getElementById("image").src = "https://pbs.twimg.com/profile_images/2444266750/j3jlc3ktl6sl9ol2wvyi.jpeg";
//        switcher = true;
//    }
};

setInterval(showExample, 5000);
showExample();

// listen for new colors from the server
socket.on('input', function(input) {
    var color = input.color;
    var requester = input.requester;
    document.body.style.backgroundColor = validColor(color) ? color
            : randomColor();
    document.getElementById("requester").innerHTML = requester;
    document.getElementById("image").src = "img/image.jpg";
});

socket.emit('ready');
