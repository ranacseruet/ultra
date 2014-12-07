function ULTraChat(translator) {
	this.appId		= "176fa7bc-ad48-4dda-8b98-9281844d559a";
	this.group		= null;
	this.privateChats   = {};
	this.developmentMode = true;
	this.translator = translator;
	this.myLang		= "en";
	this.userId		= null;

	var me = this;

	this.setLanguage = function(lang) {
		this.myLang = lang;
	};

	// create a Respoke client object using the App ID
	this.client = new respoke.Client({
		"appId": this.appId,
		"developmentMode": this.developmentMode
	});

	this.connect = function(userId, callback) {
		var endPoints = this.client.getEndpoints();
		console.log(endPoints.length+" endpoints found");
		for(var i=0; i<endPoints.length; i++) {
			console.log("user "+i+" :"+endPoints[i].id);
			if(endPoints[i].id == userId) {
				return callback(false);
			}
		}
		this.client.connect({
			endpointId: userId,
			developmentMode: this.developmentMode,
			appId: this.appId
		});

		this.client.listen('connect', function () {
			me.userId = userId;
			callback(true);
		});

		this.client.listen('error', function (err) {
			console.error('Connection to Respoke failed.', err);
			callback(false);
		});
	};

	this.joinGroup = function(groupName, joinHandler, leaveHandler, callback){
		//user successfully connected
		me.client.join({
			"id": groupName,
			"onJoin": function(evt){
				console.log("new user joined: "+evt.connection);
				joinHandler([evt.connection]);
			},
			"onLeave": function(evt){
				console.log("user is leaving: "+evt.connection);
				leaveHandler(evt.connection);
			},
			"onSuccess": function (grp) {
				me.group = grp;
				callback(true);
			},
			"onError": function(err){
				console.error(err);
				callback(false);
			}

		});
	};

	this.getGroupMembers = function(callback) {
		// request all current endpoints
		this.group.getMembers().done(function getMembers(members) {
			console.log(members.length+" members found\n");
			callback(members);
		});
	};
	
	this.sendGroupMessage = function(messageObj, callback){
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

	this.onMessage = function (grpMsgCallback, prvtMsgCallback){
		// listen for incoming messages
		this.client.listen('message', function (evt) {
			//TODO check group/private message
			console.log("received a message: "+evt.message.message);
			var msgObj = JSON.parse(evt.message.message);
			me.translator.translate(msgObj.message, msgObj.lang, me.myLang, function(tranlatedMessage){
				//TODO need to enhance for return both version
				msgObj.message = tranlatedMessage;
				if(msgObj.genre == "private") {
					prvtMsgCallback(evt.message.endpointId, msgObj);
				}
				else {
					grpMsgCallback(evt.message.endpointId, msgObj);
				}
			});
		});
	};

	this.joinPrivateChat = function(userId, callbak){
		var endpoint = this.client.getEndpoint({
			"id": userId
		});
		this.privateChats[userId] = endpoint;
		callbak();
	};

	this.leavePrivateChat = function(userId, callback){
		//this.client.rem
		delete this.privateChats[userId];
		callback(userId);
	};

	this.sendPrivateMessage = function(messageObj, userId, callback) {
		var endPoint = this.privateChats[userId];

		endPoint.sendMessage({
			"message": JSON.stringify(messageObj),
			"onSuccess": function(evt){
				callback("Me",messageObj);
			}
		});
	}
}
