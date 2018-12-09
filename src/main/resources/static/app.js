var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#winner-list").show();
    }
    else {
        $("#winner-list").hide();
    }
    $("#winners").html("");
}

function connect() {
    var socket = new SockJS('/poc-websocket-prizes');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/winner-list', function (winners) {
            showWinners(JSON.parse(winners.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/claim", {}, JSON.stringify({'name': $("#name").val(), "prize": null}));
}

function showWinners(winnerList) {
    $("#winners").html("");
    winnerList.forEach(function(winner) {
        $("#winners").append("<tr><td>" + winner.name + "</td></tr>");
    })
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});