
function LanguageController($scope, $rootScope, translator,uchat,ultraGlobal) {
	$scope.languages = [{"key":null, "value":"Select language"}];
	$scope.lang		 = null;
	
	//TODO error: initial value isn't being selected
	translator.getLanguageList(function(languages){
		$scope.$apply(function () {
			angular.forEach(languages, function(language, key) {
				$scope.languages.push({"key":key, "value":language});
				
				if(key==ultraGlobal.dataLang){
					$scope.lang = $scope.languages[$scope.languages.length-1];
				}
			});
		});
	});

	$scope.languageChanged = function(){
		console.log("language just changed");
		//$rootScope.$broadcast("languageChanged");
		//TODO haven't caught anywhere yet/validation
		ultraGlobal.dataLang = $scope.lang.key;
		uchat.setLanguage(ultraGlobal.dataLang);
		
	};
}

function LoginBoxController($scope, $modal){

	var modalInstance = $modal.open({
		templateUrl: 'loginModal',
		controller: 'LoginAttemptController',
		size: 'md',
		backdrop :'static'
	});
}

function LoginAttemptController($scope, $modalInstance, uchat, $rootScope,ultraGlobal) {
	$scope.tryLogin = function(){
		if ((!$scope.identity) || ($scope.identity.length < 3)){
			return alert("username must be at least 3 letter");
		}
		uchat.connect($scope.identity, function(status) {
			if (!status) {
				console.log("Couldn't connect");
				return false;
			}
			else {
				console.log("Connection successfull!");
				$modalInstance.close();
				ultraGlobal.dataIdentity = $scope.identity;
				$rootScope.$broadcast("loginSuccess");
			}
		});
	}
}

function GroupController($scope, $rootScope, uchat, ultraGlobal) {

	$scope.$on("loginSuccess", function(){
		$scope.identity = ultraGlobal.dataIdentity;
		uchat.joinGroup("UpStageCoder",
			function memberJoined(member) {
				//TODO member joined
				$rootScope.$broadcast("newMemberJoin", member);
			}, function memberLeaved(member) {
				//TODO member leaved
				$rootScope.$broadcast("memberLeave", member);
			}, function (status) {
				if (status) {
					//console.log("Joined group successfully");
					$rootScope.$broadcast("groupJoinSuccess");
				}
				else {
					console.log("group join attempt failed");
				}
		});
		
	});

}

function UserListController($scope, $rootScope, uchat, ultraGlobal){
	$scope.users = [];
	
	$scope.addUser = function(user){
		$scope.$apply(function () {
			$scope.users.push(user);
		});
	};
	$scope.removeUser = function(user){
		$scope.$apply(function () {
			$rootScope.$broadcast("closePrivateChatBox",user);
			$scope.users.splice($scope.users.indexOf(user), 1);
		});
	};
	$scope.openPrivateChat = function(userId) {
		console.log("Trying private chat: "+userId);
		//TODO not yet being listened
		$rootScope.$broadcast("privateChatAttempt",userId);
	};
	$scope.$on("groupJoinSuccess", function(){
		console.log("loading user list");
		$scope.identity = ultraGlobal.dataIdentity;
		uchat.getGroupMembers(function(members){
			//console.log(members.length+" members trying on");
            angular.forEach(members, function(member, index) {
				console.log("member "+index+" : "+member.username);
				if(member.username != $scope.identity){
                    $scope.addUser(member.username);
                }
			});
		});
	});
	$scope.$on("newMemberJoin", function(event, member){
		console.log("new member id: "+member.username);
		$scope.addUser(member.username);
	});
	$scope.$on("memberLeave", function(event, member){
		console.log("Leaving member id: "+member.username);
		$scope.removeUser(member.username);
	});
}

function GroupMessageController($scope, $rootScope, uchat, ultraGlobal) {
	$scope.messages = [];

	$scope.textToSend = "";

	//TODO catch language change event
    $scope.$on("groupJoinSuccess", function() {


        $scope.sendGroupMessage = function () {
            console.log("sending text: " + $scope.textToSend);
            var messageObj = {};
            messageObj["message"] = $scope.textToSend;
            messageObj["lang"] = uchat.getLanguage();
            messageObj["type"] = 'text';
            messageObj["genre"] = 'group';
            messageObj["timestamp"] = Date.now();
            //console.log(messageObj);
            $scope.textToSend = "";
            uchat.sendGroupMessage(messageObj, $scope.loadGroupMessageHistory);
        };

        $scope.enterKeypress = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.sendGroupMessage();
            }
        };

        $scope.loadGroupMessageHistory = function (sender, msg) {
            console.log("loading to message history");
            msg.sender = sender;

            $scope.$apply(function () {
                var timestamp = new Date(msg.timestamp);
                var newDate = new Date();
                newDate.setTime(timestamp);
                var dateString = newDate.toLocaleTimeString();
                msg.timestamp = dateString;
                $scope.messages.push(msg);
                console.log(msg);
            });
        };

        $scope.loadPrivateMessageHistory = function (sender, receiver, msg) {
            $rootScope.$broadcast("onLoadPrivateMessageHistory", sender, receiver, msg);
        };
        uchat.onMessage($scope.loadGroupMessageHistory, $scope.loadPrivateMessageHistory);
    });

};


function PrivateChatBoxesController($scope, $rootScope, uchat) {
	$scope.boxes = [];
}

function PrivateMessageController($scope, $rootScope, uchat, listener, speaker , ultraGlobal) {
	//$scope.prototype = new GroupMessageController($scope, $rootScope, uchat);
	$scope.boxes = {}; 
	$scope.textToSend ={};
	
	$scope.inAudioChat = false;



	$scope.joinPrivateChat = function(userId){
		uchat.joinPrivateChat(userId, function(){
			
			if(!$scope.boxes[userId]){
				
				$scope.boxes[userId]= {"messages":[]};
				$scope.textToSend[userId] = "";
			}
		});
	};
	
	$scope.$on("privateChatAttempt",function(event,userId){
		$scope.joinPrivateChat(userId);
	});
	
	$scope.sendPrivateMessage = function(userId) {
		
		var messageObj = {};
		messageObj["message"] = $scope.textToSend[userId];
		messageObj["lang"]    = uchat.getLanguage();
		messageObj["type"]    = 'text';
		messageObj["genre"]   = 'private';
		messageObj["timestamp"]   = Date.now();
		$scope.textToSend[userId] = "";
		uchat.sendPrivateMessage(messageObj, userId, $scope.loadPrivateMessageHistory);
	};
	
	$scope.enterKeypress = function(keyEvent,userId) {
		if (keyEvent.which === 13){
			$scope.sendPrivateMessage(userId);
		}
	};
	
	$scope.loadPrivateMessageHistory = function(sender, receiver, msg){
		
		var boxName = "";
		if(msg.type == "voice" && sender != "Me") {
			speaker.speak(msg.lang, msg.message);
		}

		if(sender == "Me") {
			boxName = receiver;
		}
		else {
			boxName = sender;
		}

		if(!$scope.boxes[boxName]){
			$scope.joinPrivateChat(boxName);
			msg.sender = boxName;
		}
		else {
			msg.sender = sender;
		}

        var update = function () {

            var timestamp = new Date(msg.timestamp);
            var newDate   = new Date();
            newDate.setTime(timestamp);
            var dateString = newDate.toLocaleTimeString();
            msg.timestamp  = dateString;
            $scope.boxes[boxName].messages.push(msg);
        }

        if(sender != "Me"){
            $scope.$apply(update);
        }
        else{
            update();
        }
	};
	
	$scope.closeBox = function(chatIdentity){
		if($scope.boxes[chatIdentity]) {
			delete $scope.boxes[chatIdentity];
		}
	};

	$scope.toggleAudioChat = function(userId){

		$scope.inAudioChat = !$scope.inAudioChat;

		if($scope.inAudioChat){
			$scope.startAudioChat(userId);
			angular.element(".private-chat-" + userId.trim() + " .audio.start").removeClass("start").addClass("stop");
		}
		else{
			$scope.stopAudioChat(userId);
			angular.element(".private-chat-" + userId.trim() + " .audio.stop").removeClass("stop").addClass("start");
		}
	};

	$scope.toggleHeight = function(userId){
		var height = $(".private-chat-"+userId+" .privateMsgList").css("height");
		console.log("current height: "+height);
		angular.element(".private-chat-"+userId+" .privateMsgList").css("height", (height == "12px")?"300px":"12px");
	};

	$scope.startAudioChat = function(userId){
		listener.listen(uchat.getLanguage(), function(text){
			var messageObj = {};
			messageObj["message"] = text;
			messageObj["lang"]    = uchat.getLanguage();
			messageObj["type"]    = 'voice';
			messageObj["genre"]   = 'private';
			messageObj["timestamp"]   = Date.now();
			uchat.sendPrivateMessage(messageObj, userId, $scope.loadPrivateMessageHistory);
		});
	};

	$scope.stopAudioChat = function(userId){
		listener.stop();
	};
	
	$scope.$on("closePrivateChatBox", function(event, chatIdentity){
		$scope.closeBox(chatIdentity);
	});
	
	$scope.$on("onLoadPrivateMessageHistory", function(event, sender, receiver, msg){
		$scope.loadPrivateMessageHistory(sender, receiver, msg);
	});

}


var app = angular.module("chat",['ui.bootstrap'])
.config(function($provide) {
	var translator = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");
	$provide.factory('translator', function(){
		return translator;
	});
	$provide.factory('uchat', function(){
		return new ULTraChat(translator);
	});
	$provide.factory('speaker', function(){
		return new RobotSpeaker();
	});
	$provide.factory('listener', function(){
		return new AudioListener();
	});
});


app.factory("ultraGlobal", function(){
  return {
	  dataIdentity: null, 
	  dataLang    : 'en'
  };
});



app.controller("UserListController", UserListController);
app.controller("GroupController", GroupController);
app.controller("LoginAttemptController", LoginAttemptController);
app.controller("LoginBoxController", LoginBoxController);
app.controller("LanguageController", LanguageController);
app.controller("GroupMessageController", GroupMessageController);
app.controller("PrivateMessageController", PrivateMessageController);
app.controller("PrivateChatBoxesController", PrivateChatBoxesController);

app.directive("header", function(){
	return {
		templateUrl: "header.html"
	};
});

app.directive("footer", function(){
	return {
		templateUrl: "footer.html"
	};
});

app.directive("share", function(){
	return {
		templateUrl: "share.html"
	};
});