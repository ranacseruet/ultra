/**
 * Created by Rana on 14-12-06.
 */

var rChat;
var translator;
var robotSpeaker;

$(document).ready(function(){
    translator     = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
    rChat     = new ULTraChat(translator);

    $('.intro-modal').modal({ backdrop: 'static', keyboard: false });
    $("#joinBtn").click(tryLogin);
    robotSpeaker = new RobotSpeaker();
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
            rChat.onMessage(loadGroupMessageHistory, loadPrivateMessageHistory);
            loadAvailableLanguages();
            $(".intro-modal").modal('hide');
            $("#username").html(identity);
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
        language.val("en").trigger('change');
    });
}

//********Group Chat Functions*************

function initializeGroupChat() {
    $(".container").on('click','.groupSendBtn',function(){
        sendGroupMessage();
        return false;
    });
	
	$("#textToSend").keypress(function (e) {
		if (e.which == 13) {
			sendGroupMessage();
			return false;
		}
	});
	
    rChat.joinGroup("UpStageCoder",loadGroupMembers, groupMemberLeaved, function(status){
        rChat.getGroupMembers(loadGroupMembers);
    });
}

function loadGroupMembers(members) {
    var usersList = $(".onlineUserList");
    $.each(members, function(index){
        var endPoint = members[index].getEndpoint();
        var userElement = usersList.find(".row:first").clone();
        if(endPoint.id != rChat.userId && !$('.onlineUser').hasClass("user-"+endPoint.id)) {
			userElement.addClass("user-"+endPoint.id);
            userElement.find(".identityName").html(endPoint.id);
            usersList.append(userElement);
            userElement.click(function(){
                enterPrivateChat(endPoint.id);
            });
        }
    });
}

function groupMemberLeaved(member) {
    var ep		= member.getEndpoint();
	var user	= $(".user-"+ ep.id);
    user.remove();
    rChat.leavePrivateChat(ep.id, leftPrivateChat);
}

function sendGroupMessage() {
    var messageObj  = {};
    var messageText = $("#textToSend").val();
    var language    = $("#language").val();
    if (messageText.trim().length === 0) return;

    messageObj["message"] = messageText;
    messageObj["lang"]    = language;
    messageObj["type"]    = 'text';
    messageObj["genre"]   = 'group';
    messageObj["timestamp"]   = Date.now();
    //console.log(messageObj);
    rChat.sendGroupMessage(messageObj, loadGroupMessageHistory);

    //reset textbox
    $("#textToSend").val("");
}

function loadGroupMessageHistory(sender, messageObj) {
    var timestamp = new Date(messageObj.timestamp);
    var newDate = new Date();
    newDate.setTime(timestamp);
    dateString = newDate.toLocaleTimeString();

	//timestamp     = timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds();
	var messageType = "";
	if(messageObj.type=="voice")
		messageType = "(Voice) ";
    var msgRows = $('.groupMsg');
    var newRow = msgRows.last().clone();
    newRow.find(".sender").text(sender);
    newRow.find(".content").text(messageType+messageObj.message);
	newRow.find(".msgInfo").attr("title","Original Language: "+messageObj.lang);
	newRow.find(".timestamp").text(dateString);
    msgRows.last().after(newRow);
	$(".msgInfo").tooltip({container: 'body'});
}

//************* End Group Chat Functions ***************



//************** private chat functions ***************

function enterPrivateChat(userId) {
    rChat.joinPrivateChat(userId, function(){
        console.log("Entered in a private chat successfully");
        var privateChatBox = $('.privateChatBox');
        if(!privateChatBox.hasClass("private-chat-"+userId)){
            createPrivateChateBox(userId);
        }
        initAudioListener(userId);
    });
}

function loadPrivateMessageHistory(sender, receiver, messageObj) {
	
    if(messageObj.type == "voice" && sender != "Me") {
        robotSpeaker.speak(messageObj.lang, messageObj.message);
    }
	var privateChatBox  = $('.privateChatBox');
	var privateChatname = 'private-chat-'+sender;
	if(sender=="Me")
		privateChatname = 'private-chat-'+receiver;
	
	if(!privateChatBox.hasClass(privateChatname)){
		createPrivateChateBox(sender);
	}
	var msgRows = $('.'+privateChatname +' .privateMsg');
	var timestamp = new Date(messageObj.timestamp);
    var newDate = new Date();
    newDate.setTime(timestamp);
    timeString = newDate.toLocaleTimeString();
	//timestamp     = timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds();
	var messageType = "";
	if(messageObj.type=="voice")
		messageType = "(Voice) ";
    var newRow = msgRows.first().clone();
    newRow.find(".sender").text(sender);
    newRow.find(".content").text(messageType+messageObj.message);
	newRow.find(".timestamp").text(timeString);
	//newRow.find(".msgInfo").attr("title","Original Language: "+messageObj.lang);
	newRow.show();
    msgRows.last().after(newRow);
	$(".msgInfo").tooltip({container: 'body'});
    
}

function createPrivateChateBox(userId){
	var privateChatBox = $('.privateChatBox');
    var newBox = privateChatBox.first().clone();
	newBox.addClass("private-chat-"+userId);
	newBox.find(".chatWith").text(userId);
    privateChatBox.last().after(newBox);
    newBox.css('position', 'absolute').css('bottom','0px');
	
    newBox.find(".privateSendBtn").click(function(){
		sendPrivateMessage(userId); 
    });
	
	newBox.find(".privateTextToSend").keypress(function (e) {
		if (e.which == 13) {
			sendPrivateMessage(userId);
		}
	});
	newBox.find(".closeBox").click(function(){
		rChat.leavePrivateChat(userId, leftPrivateChat);
    });

}

function leftPrivateChat(userId){
    if(inAudioChat) {
        stopListening($(".private-chat-" + userId + " .audio.stop"), userId)
    }
    $(".private-chat-"+userId).remove();
}

function sendPrivateMessage(userId) {
    var messageObj  = {};
	var privateTextArea = $(".private-chat-"+userId+" .privateTextToSend");
    var messageText = privateTextArea.val();
    var language    = $("#language").val();
    if (messageText.trim().length === 0) return;

    messageObj["message"] = messageText;
    messageObj["lang"]    = language;
    messageObj["type"]    = 'text';
    messageObj["genre"]   = 'private';
    messageObj["timestamp"]   = Date.now();
    //console.log(messageObj);
    rChat.sendPrivateMessage(messageObj, userId, loadPrivateMessageHistory);

    //reset textbox
    privateTextArea.val("");
}

//************** End private chat functions ***************


//*************** Audio Chat *********************
var inAudioChat = false;
var listener;

function initAudioListener(userId) {
    var btn = $(".private-chat-" + userId + " .audio.start");
    console.log("private audio call btn: " + btn.html());
    btn.unbind('click');
    btn.click(function(){
        startListening(btn, userId);
    });
}

function startListening(btn, userId) {
    btn.removeClass("start").addClass("stop");
    console.log("starting to listen audio input");
    if (inAudioChat) {
        alert("You are in a audio chat already. stop that first");
        return;
    }
    listener = new AudioListener($("#language").val(), function(text){
        sendRecognizedVoiceMessage(text, userId);
    });
    listener.listen();
    btn.unbind('click');
    inAudioChat = true;
    btn.click(function () {
        stopListening(btn, userId);
    });
}

function sendRecognizedVoiceMessage(text, userId) {
    console.log("audio: " + text+" sending to:"+userId);
    rChat.sendPrivateMessage({
        message: text, lang: $("#language").val(),
        "type": "voice", "genre": "private", "timestamp": Date.now()
    }, userId, loadPrivateMessageHistory);
}

function stopListening(btn, userId) {
    listener.stop();
    btn.removeClass("stop").addClass("start");
    inAudioChat = false;
    btn.click(function(){
        startListening(btn, userId);
    });
}

//*************** End Audio Chat *****************
