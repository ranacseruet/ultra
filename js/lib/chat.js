function RespokeChat(){
	this.appId		= "93a17c4f-4854-4ae2-92de-9f90b59a30e6";
	this.identity   = null;
	this.group		= null;
	this.endpoint   = null;

	// create a Respoke client object using the App ID
	this.client = new respoke.Client({
		"appId": this.appId,
		"developmentMode": true
	});

	var me = this;
	this.client.listen('connect', function () {
		me.joinMainGroup();
	});

	// listen for incoming messages
	this.client.listen('message', function (evt) {
		
		translationObj.TranslatedText(evt.message.message.message,evt.message.message.lang,$("#language").val(),function(convertedMessage){
			loadMsgList(evt.message.endpointId,convertedMessage,evt.group);
			speaker.speak('fr-FR', convertedMessage);
		});	
	});
	
	
	this.connect = function(endpoint) {
		this.client.connect({
			endpointId: endpoint,
			developmentMode: true,
			appId: this.appId
		});
	};

	this.joinMainGroup = function(){	
		this.client.join({
			"id": "UpStageCoder",
			"onJoin": handleJoin,
			"onLeave": handleLeave,
			"onSuccess": function (grp) {
				
							// request all current endpoints
				grp.getMembers().done(function getMembers(members) {
					for (var i = 0; i < members.length; i++) {
						var evt = {};
						evt.connection = members[i];
						handleJoin(evt);
                  }
                });
				showMsgArea();
				me.group = grp;
				
			}        
		});
	}
	
	this.sendMessage = function(messageObj,callback){
		console.log("msgObsj"+messageObj.message);
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
		}
		
	}
	
	this.changeContactUser = function(userId){
		// if the value is "group-message" then we're in group chat mode
		
		if (userId == "group-message") {
			// null out the endpoint
			this.endpoint = null;		

		} else {
			this.endpoint = this.client.getEndpoint({
					"id": userId
			});
		}
		
	}
	
	
}
