
function LanguageController($scope, $rootScope, translator) {
	$scope.languages = [{"key":null, "value":"Select language"}];
	$scope.lang = null;
	//TODO error: initial value isn't being selected
	translator.getLanguageList(function(languages){
		$scope.$apply(function () {
			angular.forEach(languages, function(language, key) {
				$scope.languages.push({"key":key, "value":language});
			});
		});
	});

	$scope.languageChanged = function(){
		console.log("language just changed");
		$rootScope.$broadcast("languageChanged");
		//TODO haven't caught anywhere yet/validation
	}
}

function LoginBoxController($scope, $modal){

	var modalInstance = $modal.open({
		templateUrl: 'loginModal',
		controller: 'LoginAttemptController',
		size: 'md',
		backdrop :'static'
	});
}

function LoginAttemptController($scope, $modalInstance, uchat, $rootScope,getIdentity) {
	$scope.tryLogin = function(){
		if ((!$scope.identity) || ($scope.identity.length < 3)){
			return alert("username must be at least 3 letter");
		}
		uchat.connect($scope.identity, function(status) {
			if (!status) {
				console.err("Couldn't connect");
				return false;
			}
			else {
				console.log("Connection successfull!");
				$modalInstance.close();
				getIdentity.dataIdentity = $scope.identity;
				console.log(getIdentity.dataIdentity);
				$rootScope.$broadcast("loginSuccess");
			}
		});
	}
}

function GroupController($scope, $rootScope, uchat, getIdentity) {

	$scope.$on("loginSuccess", function(){
		$scope.identity = getIdentity.dataIdentity;
		uchat.joinGroup("UpStageCoder",
			function memberJoined(member) {
				//TODO member joined
				$rootScope.$broadcast("newMemberJoin", member);
			}, function memberLeaved(member) {
				//TODO member leaved
				$rootScope.$broadcast("memberLeave", member);
			}, function (status) {
				if (status) {
					console.log("Joined group successfully");
					$rootScope.$broadcast("groupJoinSuccess");
				}
				else {
					console.log("group join attempt failed");
				}
		});
	});

}

function UserListController($scope, $rootScope, uchat){
	$scope.users = [];
	$scope.addUser = function(user){
		$scope.$apply(function () {
			$scope.users.push(user.id);
		});
	};
	$scope.removeUser = function(user){
		$scope.$apply(function () {
			$scope.users.splice($scope.users.indexOf(user.id), 1);
		});
	};
	$scope.openPrivateChat = function(userId) {
		console.log("Trying private chat: "+userId);
		//TODO not yet being listened
		$rootScope.$broadcast("privateChatAttempt");
	};
	$scope.$on("groupJoinSuccess", function(){
		console.log("loading user list");
		uchat.getGroupMembers(function(members){
			angular.forEach(members, function(member, index) {
				$scope.addUser(member.getEndpoint());
			});
		});
	});
	$scope.$on("newMemberJoin", function(event, member){
		//console.log("new member id: "+member.id);
		$scope.addUser(member.getEndpoint());
	});
	$scope.$on("memberLeave", function(event, member){
		//console.log("Leaving member id: "+member.getEndpoint()));
		$scope.removeUser(member.getEndpoint());
	});
}

function GroupMessageController($scope, $rootScope, uchat) {
	$scope.messages = [];

	$scope.textToSend = "";

	//TODO catch language change event
	$scope.lang = "en";

	$scope.sendGroupMessage = function() {
		console.log("sending text: "+$scope.textToSend);
		var messageObj = {};
		messageObj["message"] = $scope.textToSend;
		messageObj["lang"]    = $scope.lang;
		messageObj["type"]    = 'text';
		messageObj["genre"]   = 'group';
		messageObj["timestamp"]   = Date.now();
		//console.log(messageObj);
		$scope.textToSend = "";
		uchat.sendGroupMessage(messageObj, $scope.loadGroupMessage);
	};

	$scope.loadGroupMessage = function(sender, msg){
		console.log("loading to message history");
		msg.sender = sender;
		$scope.$apply(function () {
			//TODO not working - may be because controller is bound to two different element?
			$scope.messages.push(msg);
		});
	};
}

function PrivateChatBoxesController($scope, $rootScope, uchat) {
	$scope.boxes = [{class: "private-chat-rana"}];
	//TODO implement
}

function PrivateMessageController($scope, $rootScope, uchat) {
	$scope.prototype = new GroupMessageController($scope, $rootScope, uchat);
	//TODO implement
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
});


app.factory("getIdentity", function(){
  return {dataIdentity: null }
});



app.controller("UserListController", UserListController);
app.controller("GroupController", GroupController);
app.controller("LoginAttemptController", LoginAttemptController);
app.controller("LoginBoxController", LoginBoxController);
app.controller("LanguageController", LanguageController);
app.controller("GroupMessageController", GroupMessageController);
app.controller("PrivateMessageController", PrivateMessageController);
app.controller("PrivateChatBoxesController", PrivateChatBoxesController);

$(document).ready(function(){
	//$('.carousel').carousel();
});