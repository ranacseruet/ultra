/**
 * Created by Rana on 14-12-06.
 */

var rChat;
var translator;

$(document).ready(function(){
    translator     = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
    rChat     = new ULTraChat(translator);

    $("#doLogin").click(tryLogin);
});

function tryLogin()
{
    var identity = $("#endpoint").val();
    if ((!identity) || (identity.length < 3)) return alert("username must be at least 3 letter");
    rChat.connect(identity, function(status) {
        if (!status) {
            console.err("Couldn't connect");
            return;
        }
        else {
            console.log("Connection successfull!");
            initializeGroupChat();
        }
    });
    rChat.onMessage(loadGroupMessageHistory);

    loadAvailableLanguages();
}

function loadAvailableLanguages() {
    translator.getLanguageList(function(languages){
        var languageOption = "";
        $.each(languages, function(key, value) {
            languageOption += '<option value="' + key + '">' + value + '</option>';
        });

        $("#language").html(languageOption);
        $("#language").change(function(){
            console.log("Changed language to"+$("#language").val());
            rChat.setLanguage($("#language").val());
        });
    });
}

//********Group Chat Functions*************

function initializeGroupChat() {
    showGrpMsgArea();
    $(".container").on('click','.submitBtn',function(){
        sendGroupMessage();
        return false;
    });
}

function showGrpMsgArea() {
    $('#other-part').show();
    $( ".audio" ).prop( "disabled", true );
    $("#endpoints").append("<option value='group-message'>Everyone</option>");
}

function sendGroupMessage() {
    var messageObj  = {};
    var messageText = $("#textToSend").val();
    var language    = $("#language").val();
    if (messageText.trim().length === 0) return;

    messageObj["message"] = messageText;
    messageObj["lang"] = language;
    messageObj["type"] = 'text';
    //console.log(messageObj);
    rChat.sendMessage(messageObj, loadGroupMessageHistory);

    //reset textbox
    $("#textToSend").val("");
}

function loadGroupMessageHistory(sender, messageObj) {
    //console.log(messageObj.message);
    var msgRows = $('.message');
    var newRow = msgRows.last().clone();
    newRow.find(".sender").text(sender);
    newRow.find(".content").text(messageObj.message);
    msgRows.last().after(newRow);
}

//************* End Group Chat Functions ***************