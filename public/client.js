var xhr;

var callbackSearch = function(ev) {
    //alert(xhr.responseText);
    var data = JSON.parse(xhr.responseText);
    //alert(data.items.length);
    //alert(data.items[0].id.videoId);
    if (data.items.length > 0 && data.items[0].id.videoId) {
        var videoId = data.items[0].id.videoId;
        //alert(videoId);
        player.loadVideoById(videoId);
    }
};

var searchYoutube = function(color, apiKey, callback) {
    //alert(color);
    xhr = new XMLHttpRequest();
    xhr
            .open(
                    "GET",
                    "https://www.googleapis.com/youtube/v3/search?part=snippet&q="
                            + color + "&maxResults=1&type=video&regionCode=jp&key=" + apiKey);
    xhr.addEventListener("load", callback);
    xhr.send();
};

// connect to the websocket
var socket = io.connect();

var validColor = function(color) {
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
    //alert('input');
    var color = input.color;
    var requester = input.requester;
    var apiKey = input.apiKey;

    document.body.style.backgroundColor = validColor(color) ? color
            : randomColor();
    document.getElementById("requester").innerHTML = requester;
    // if (file != null)
    document.getElementById("image").src = "img/image.jpg";
    searchYoutube(color, apiKey, callbackSearch);
    // player.loadVideoById('tG0HpmLX0VA');
});

socket.emit('ready');
