
var respokeChatObj;
//var translationObj;
//var speaker;
var listener;
var identity;
//speaker = new RobotSpeaker();
$(document).ready(function () {

		/*translationObj     = new Translation();
		respokeChatObj     = new RespokeChat();
		
		// all user interface state functions moved to another file/class
		$("#doLogin").click(function () {
			
			var id = $("#endpoint").val();
			identity = id;
			if ((!identity) || (identity.length < 3)) return;
			respokeChatObj.connect(identity);
		});
		
		// Send messages automatically on <enter> in message box
		$("#textToSend").keypress(function (e) {
			if (e.which == 13) {
				sendMessage();
				return false;
			}
		});
		
		$(".container").on('click','.submitBtn',function(){
			sendMessage();
			return false;		
		});
		
		$("#endpoints").change(function () {
			if($("#endpoints").val()!="group-message"){
				$(".privateMsgList").html('<div class="private-message row"></div>');
				$( ".audio" ).prop( "disabled", false );
			}
			else{
				$( ".audio" ).prop( "disabled", true );
			}
			selectEndpoint();
		});
		
		$(".audio").click(function(){
			if ($(this).text() === 'Audio Start') {
			   $(this).removeClass( "start" ).addClass( "stop" );
			   $(this).text("Audio Stop");
			}
			else{
			   $(this).removeClass( "stop" ).addClass( "start" );
			   $(this).text("Audio Start");
			}
		});
		translationObj.LanguageList(loadLangList);*/
}); 

function loadLangList(languageList){
	$("#language").html(languageList);
}

function loadMsgList(fromUser,messageText,group){
	var divName;
	divName = group?"message":"private-message";
	var content = '<div class="'+divName+' row">\
						<div class="col-md-3">'+fromUser+':</div>\
						<div class="col-md-9">'+messageText+'</div>\
				   </div>';
	if(!group){
		if(!$('.privatecontainer').is(":visible"))
			$('.privatecontainer').show();
		
		$('.private-message').last().after(content);
	}
	else{
		$('.message').last().after(content);
	}
	
	if(fromUser=="Me"){
		$("#textToSend").val("");
	}
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
	respokeChatObj.sendMessage(messageObj,loadMsgList);
}

// join handler - invoked when client joins a group
var handleJoin = function(evt) {
	
	var endpoint = evt.connection.getEndpoint();
	
	// don't add the endpoint if it's this client's endpoint (i.e. "myself")
	if (endpoint.id != identity) {

			// check for and prevent duplicates
		if ($("#endpoints option[value='" + endpoint.id + "']").length === 0) {

				// create and add an option for the endpoint
			var opt = "<option value='" + endpoint.id + "'>" + endpoint.id + "</option>\n";
			$("#endpoints").append(opt);

			// if this is the first endpoint in the list, select it
			if ($('#endpoints option').size() == 1) {
					 selectEndpoint();   
			}
		}
	}

};
	
var handleLeave = function(evt) {
	// remove from the drop-down list
	console.log("-- ON-LEAVE --");

	var ep = evt.connection.getEndpoint();

	var selectedEndpontId = $("#endpoints").val();

	// if the endpoint leaving is the currently selected endpoint, switch to group
	if (selectedEndpontId && (ep.id == selectedEndpontId)) {
		$("#endpoints").val("group-message");
		selectEndpoint();
	}

	// remove the endpoint from the list
	console.log(selectedEndpontId+identity);

	$("#endpoints option[value='" + ep.id + "']").remove();
};
		
var selectEndpoint = function () {
	// get the ID value from the text box
	var remoteId = $("#endpoints").val();
	respokeChatObj.changeContactUser(remoteId);
};


listener = new AudioListener(getAudioToText);

function listen(){
	listener.listen();
}

function getAudioToText(text) {
	$("#textToSend").val(text);
	sendMessage();
}
