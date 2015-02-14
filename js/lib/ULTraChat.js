function ULTraChat(translator) {
	this.appId		= "176fa7bc-ad48-4dda-8b98-9281844d559a";
	this.group		= null;
	this.privateChats   = {};
	this.developmentMode = true;
	this.translator = translator;
	this.myLang		= "en";
	this.userId		= null;
    this.endpoints  = null;
	var me = this;

	this.setLanguage = function(lang) {
		this.myLang = lang;
		console.log("setLanguage..."+this.myLang);
	};
	
	this.getLanguage = function() {
		return this.myLang;
	};
	// create a Respoke client object using the App ID
	this.client = {};

	this.connect = function(userId, callback) {
		this.client = new nrtc(userId, "http://localhost:5000", "test");
        this.client.onConnect(function(users) {
            me.endpoints = users;
            //console.log(me.endpoints.length + " endpoints found");
            me.userId = userId;
            callback(true);
        });
	};

	this.joinGroup = function(groupName, joinHandler, leaveHandler, callback){
		//user successfully connected
        me.group = groupName;
        me.client.onUserJoin(joinHandler);
        me.client.onUserLeave(leaveHandler);
        callback(true);
	};

    this.getGroupMembers = function(callback) {
        // request all current endpoints
        if(!me.group){
            return callback(false);
        }
        //console.log(" group members: "+me.endpoints.length);
        return callback(me.endpoints);
    };
	
	this.sendGroupMessage = function(messageObj, callback){
        this.client.sendGroupMessage(messageObj);
		//callback("Me", messageObj);
	};

	this.onMessage = function (grpMsgCallback, prvtMsgCallback){
		var msgObj, sender;

        this.client.onGroupMessage(function(sndr, message){
            console.log(message);
            msgObj = message;//JSON.parse(message);
            sender = sndr;
            if(msgObj.lang == me.myLang){
                return deliverProcessedMessage(msgObj.message);
            }
            me.translator.translate(msgObj.message, msgObj.lang, me.myLang, deliverProcessedMessage);
        });

		function deliverProcessedMessage(tranlatedMessage){
			//TODO need to enhance for return both version
            //console.log("got translated message: "+tranlatedMessage);
			msgObj.message = tranlatedMessage;
			if(msgObj.genre == "private") {
				me.joinPrivateChat(sender, function(){
					prvtMsgCallback(sender, "Me", msgObj);
				});
			}
			else {
				grpMsgCallback(sender, msgObj);
			}
		}

        this.client.onPrivateMessage(function(sndr, message){
            console.log(message);
            msgObj = message;//JSON.parse(message);
            sender = sndr;
            if(msgObj.lang == me.myLang){
                return deliverProcessedMessage(msgObj.message);
            }
            me.translator.translate(msgObj.message, msgObj.lang, me.myLang, deliverProcessedMessage);
        });

	};

	this.joinPrivateChat = function(userId, callbak){
		this.privateChats[userId] = userId;
		callbak();
	};

	this.leavePrivateChat = function(userId, callback){
		delete this.privateChats[userId];
		callback(userId);
	};

	this.sendPrivateMessage = function(messageObj, userId, callback) {
        this.client.sendPrivateMessage(userId, messageObj);
        callback("Me", userId, messageObj);
	}
}
