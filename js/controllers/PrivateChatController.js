/**
 * Created by Rana on 15-03-01.
 */

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
        console.log("event caught for private chat");
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
        //console.log('click');
        //var height = $(".private-chat-"+userId+" .privateMsgList").css("height");
        var msgListWithSendbox = $(".private-chat-"+userId+" .msgListWithSendbox");
        if (msgListWithSendbox.is(':visible')){
            msgListWithSendbox.hide();
        }
        else{
            msgListWithSendbox.show();
        }
        //console.log("current height: "+height);
        //angular.element(".private-chat-"+userId+" .privateMsgList").css("height", (height == "12px")?"300px":"12px",'important');
        //height = $(".private-chat-"+userId+" .msgListWithSendbox").css("height");
        //console.log("next height: "+height);
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