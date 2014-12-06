/**
 * Created by Rana on 14-12-06.
 */

var rChat;
var translator;

$(document).ready(function(){
    translator     = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
    rChat     = new RespokeChat("176fa7bc-ad48-4dda-8b98-9281844d559a");

    $("#doLogin").click(tryLogin);



});

function tryLogin()
{
    var id = $("#endpoint").val();
    identity = id;
    if ((!identity) || (identity.length < 3)) return alert("username must be at least 3 letter");
    rChat.connect(identity,function(status) {
        if (!status) {
            console.err("Couldn't connect");
            return;
        }
        else {
            console.log("Connection successfull!");
            showMsgArea();
        }
    });
    rChat.onMessage(loadMsgList);


    $(".container").on('click','.submitBtn',function(){
        sendMessage();
        return false;
    });
}

function showMsgArea(){
    $('#other-part').show();
    $( ".audio" ).prop( "disabled", true );
    $("#endpoints").append("<option value='group-message'>Everyone</option>");
}

function sendMessage(){
    var messageObj  = {};
    var messageText = $("#textToSend").val();
    var selLanguage = $("#language").val();
    if (messageText.trim().length === 0) return;

    messageObj["message"] = messageText;
    messageObj["lang"] = selLanguage;
    messageObj["type"] = 'text';
    //console.log(messageObj);
    rChat.sendMessage(messageObj, loadMsgList);
    $("#textToSend").val("");
}

function loadMsgList(sender, messageObj){
    //console.log(messageObj.message);
    var msgRows = $('.message');
    var newRow = msgRows.last().clone();
    newRow.find(".sender").text(sender);
    newRow.find(".content").text(messageObj.message);
    msgRows.last().after(newRow);
}
