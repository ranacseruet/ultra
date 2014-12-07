/**
 * Created by Rana on 14-12-06.
 */

var rChat;
var translator;

$(document).ready(function(){
    translator     = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
    rChat     = new ULTraChat(translator);

    $('.intro-modal').modal({ backdrop: 'static', keyboard: false });
    $("#joinBtn").click(tryLogin);
});

function tryLogin()
{
    var identity = $("#identity").val();
    if ((!identity) || (identity.length < 3)) return alert("username must be at least 3 letter");
    rChat.connect(identity, function(status) {
        if (!status) {
            console.err("Couldn't connect");
            return;
        }
        else {
            console.log("Connection successfull!");
            initializeGroupChat();
            rChat.onMessage(loadGroupMessageHistory);
            loadAvailableLanguages();
            $(".intro-modal").modal('hide');
        }
    });
    return false;
}

function loadAvailableLanguages() {
    translator.getLanguageList(function(languages){
        var languageOption = "";
        $.each(languages, function(key, value) {
            languageOption += '<option value="' + key + '">' + value + '</option>';
        });

        var language = $("#language");

        language.append(languageOption);
        language.change(function(){
            console.log("Changed language to"+language.val());
            rChat.setLanguage(language.val());
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
    rChat.joinGroup("UpStageCoder",loadGroupMembers, groupMemberLeaved, function(status){
        rChat.getGroupMembers(loadGroupMembers);
    });
}

function showGrpMsgArea() {
    //var element = $(".onlineUserList").find(".row .identityName");
    //console.log("Current name: "+element.html()+" will be changed to: "+rChat.userId);
    //element.html(rChat.userId);
}

function loadGroupMembers(members) {
    var usersList = $(".onlineUserList");
    $.each(members, function(index){
        var endPoint = members[index].getEndpoint();

        var userElement = usersList.find(".row").clone();
        //console.log("adding user: "+userElement.html());
        if(endPoint.id != rChat.userId) {
            userElement.find(".identityName").html(endPoint.id);
            usersList.append(userElement);
        }
    });
}

function groupMemberLeaved(member) {
    var ep = member.getEndpoint();
    $(".onlineUserList .identityName[text='" + ep.id + "']").remove();
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
    rChat.sendGroupMessage(messageObj, loadGroupMessageHistory);

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



//************** private chat functions ***************

function enterPrivateChat(userId) {
    console.log("trying private chat");
    rChat.joinPrivateChat(userId, function(){
        console.log("Entered in a private chat successfully");
        //TODO remove dummy code
        rChat.sendPrivateMessage({message:"Test private Message", lang:$("#language").val(), "type":"text"}, userId, loadGroupMessageHistory);
    });
}



//************** End private chat functions ***************