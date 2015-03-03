/**
 * Created by Rana on 15-03-01.
 */
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
                    //console.log("group join attempt failed");
                }
            });

    });
}