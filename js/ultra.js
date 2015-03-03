
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