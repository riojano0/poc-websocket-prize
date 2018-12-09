import {SOCKET_PATH} from './socket-client.js'

let stompClient = null;
let showPriceFormFlag = true;
let prizeListAvailable = [];
const TAGS_ID = {
    connectButton: '#connect',
    disconnectButton: '#disconnect',
    prizeForm: '#prize-form',
    selectPrize: "#select-prize",
    sendPrizeButton: '#send-prize',
    sendWinnerButton: '#send',
    showPrizeFormButton: '#show-prize-form',
    winnerListContainer: '#winner-list',
    winners: '#winners'
}

function initPage() {
    $(TAGS_ID.connectButton).prop("disabled", false);
    $(TAGS_ID.disconnectButton).prop("disabled", true);
    $(TAGS_ID.sendWinnerButton).prop("disabled", true);
    $(TAGS_ID.showPrizeFormButton).hide();
    $(TAGS_ID.prizeForm).hide();
    $(TAGS_ID.winnerListContainer).hide();
}

function setConnected(connected) {
    $(TAGS_ID.connectButton).prop("disabled", connected);
    $(TAGS_ID.disconnectButton).prop("disabled", !connected);
    $(TAGS_ID.sendWinnerButton).prop("disabled", !connected);

    if (connected) {
        $(TAGS_ID.winnerListContainer).show()
        $(TAGS_ID.showPrizeFormButton).show();
    } else {
        $(TAGS_ID.winnerListContainer).hide()
        $(TAGS_ID.showPrizeFormButton).hide();
        $(TAGS_ID.prizeForm).hide()
    };

    $(TAGS_ID.winners).html("");
    $(TAGS_ID.selectPrize).html("");
}

function connect() {
    const socket = new SockJS(SOCKET_PATH);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/winner-list', (winners) => showWinners(JSON.parse(winners.body)));
        stompClient.subscribe('/prize-list', (prizes) => showPrizes(JSON.parse(prizes.body)));
        initializeWinners()
        initializePrizes()
    });
}

function disconnect() {
    if (stompClient !== null)
        stompClient.disconnect();
    setConnected(false);
    console.log("Disconnected");
}

function initializeWinners() {
    stompClient.send("/app/init-winner", {});
}

function initializePrizes() {
    stompClient.send("/app/init-prize", {});
}

function sendWinner() {
    const prizeClaimed = {
        name: prizeListAvailable[$(TAGS_ID.selectPrize).val()].name,
        description: prizeListAvailable[$(TAGS_ID.selectPrize).val()].description
    }

    stompClient.send("/app/remove-prize", {}, JSON.stringify(prizeClaimed));
    stompClient.send("/app/claim", {}, JSON.stringify({
        'name': $("#name").val(),
        "prize": prizeClaimed
    }));
}

function sendNewPrize() {
    stompClient.send("/app/new-prize", {}, JSON.stringify({
        name: $("#prize-name").val(),
        description: $("#prize-description").val()
    }));
}

function showWinners(winnerList) {
    $(TAGS_ID.winners).html("");
    winnerList.forEach(winner => {
        $(TAGS_ID.winners).append("<tr><td>" + winner.name + "</td><td>" + winner.prize.name + "</td><td>" + winner.prize.description + "</td></tr>");
    })
}

function showPrizes(prizeList) {
    prizeListAvailable = prizeList;
    $(TAGS_ID.selectPrize).html("")
    prizeList.forEach((prize, index) => {
        $(TAGS_ID.selectPrize).append("<option value=" + index + ">" + prize.name + "</option>")
    })
    if (prizeListAvailable.length === 0) {
        $(TAGS_ID.sendWinnerButton).prop("disabled", true);
    } else {
        $(TAGS_ID.sendWinnerButton).prop("disabled", false);
    }
}

function showPrizeForm() {
    if (showPriceFormFlag) {
        showPriceFormFlag = false;
        $(TAGS_ID.prizeForm).show()
    } else {
        showPriceFormFlag = true;
        $(TAGS_ID.prizeForm).hide()
    }
}

$(function () {
    $("form")
        .on('submit', function (e) {
            e.preventDefault();
        });
    $(TAGS_ID.connectButton).click(_ => connect());
    $(TAGS_ID.disconnectButton).click(_ => disconnect());
    $(TAGS_ID.sendWinnerButton).click(_ => sendWinner());
    $(TAGS_ID.sendPrizeButton).click(_ => sendNewPrize());
    $(TAGS_ID.showPrizeFormButton).click(_ => showPrizeForm());
    initPage();
});