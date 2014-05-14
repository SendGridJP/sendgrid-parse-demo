// Load player api asynchronously.
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var done = false;
var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(evt) {
    //evt.target.playVideo();
}

function onPlayerStateChange(evt) {
    if (evt.data == YT.PlayerState.PLAYING && !done) {
//    if (evt.data == !done) {
        setTimeout(stopVideo, 5000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}
