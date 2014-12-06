function RespokeChat(apiKey) {
	this.appId		= apiKey;
	this.group		= null;
	this.endpoint   = null;
	this.developmentMode = true;

	var me = this;

	// create a Respoke client object using the App ID
	this.client = new respoke.Client({
		"appId": this.appId,
		"developmentMode": this.developmentMode
	});

	this.connect = function(endpoint, callback) {
		this.client.connect({
			endpointId: endpoint,
			developmentMode: this.developmentMode,
			appId: this.appId
		});

		this.client.listen('connect', function () {
			//user successfully connected
			me.client.join({
				"id": "UpStageCoder", //TODO change hard coded value
				//"onJoin": handleJoin,
				//"onLeave": handleLeave,
				"onSuccess": function (grp) {

					// request all current endpoints
					grp.getMembers().done(function getMembers(members) {
						/*for (var i = 0; i < members.length; i++) {
						 var evt = {};
						 evt.connection = members[i];
						 //handleJoin(evt);
						 }*/
						console.log(members.length+" members found\n");
					});
					//showMsgArea();
					me.group = grp;
					callback(true);
				}
			});
		});

		this.client.listen('error', function (err) {
			console.error('Connection to Respoke failed.', err);
			callback(false);
		});
	};
	
	this.sendMessage = function(messageObj, callback){
		/*console.log("msgObsj"+messageObj.message);
		if (this.endpoint) {
			this.endpoint.sendMessage({
				"message": messageObj,
				"onSuccess": function(evt){
					callback("Me",messageObj.message,"");
				}
			});
		}else{
			this.group.sendMessage({
				"message": messageObj,
				"onSuccess": function(evt){
					callback("Me",messageObj.message,"group");
				}
			});
		}*/
		//console.log(this.group);

		this.group.sendMessage({
			"message": JSON.stringify(messageObj),
			"onSuccess": function(evt){
				console.log("group message sent successfully: "+evt);
				callback("Me", messageObj);
			},
			"onError": function(err){
				console.error("error occured while sending group message: "+JSON.stringify(err));
				//callback(e);
			}
		});
		
	};
	
	this.changeContactUser = function(userId){
		// if the value is "group-message" then we're in group chat mode

		console.log("changing chat connection");

		/*if (userId == "group-message") {
			// null out the endpoint
			this.endpoint = null;		

		} else {
			this.endpoint = this.client.getEndpoint({
					"id": userId
			});
		}*/
	};

	this.onMessage = function (callback){
		// listen for incoming messages
		this.client.listen('message', function (evt) {
			console.log("recieved a message: "+evt.message.message);
			//TODO get out of this scope
			/*translationObj.translate(evt.message.message.message, evt.message.message.lang,$("#language").val(),function(convertedMessage){
			 loadMsgList(evt.message.endpointId,convertedMessage,evt.group);
			 });*/
			callback(evt.message.endpointId, JSON.parse(evt.message.message));
		});
	}
}
