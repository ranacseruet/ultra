/**
 * Created by Rana on 15-03-01.
 */

function GroupMessageController($scope, $rootScope, uchat, ultraGlobal) {
    $scope.messages = [];

    $scope.textToSend = "";

    //TODO catch language change event
    $scope.$on("groupJoinSuccess", function() {


        $scope.sendGroupMessage = function () {
            //console.log("sending text: " + $scope.textToSend);
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
            //console.log("loading to message history");
            msg.sender = sender;

            $scope.$apply(function () {
                var timestamp = new Date(msg.timestamp);
                var newDate = new Date();
                newDate.setTime(timestamp);
                var dateString = newDate.toLocaleTimeString();
                msg.timestamp = dateString;
                $scope.messages.push(msg);
                //console.log(msg);
            });
        };

        $scope.loadPrivateMessageHistory = function (sender, receiver, msg) {
            $rootScope.$broadcast("onLoadPrivateMessageHistory", sender, receiver, msg);
        };
        uchat.onMessage($scope.loadGroupMessageHistory, $scope.loadPrivateMessageHistory);
    });

};