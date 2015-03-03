/**
 * Created by Rana on 15-03-01.
 */

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
        $rootScope.$broadcast("privateChatAttempt",userId);
    };
    $scope.$on("groupJoinSuccess", function(){
        //console.log("loading user list");
        $scope.identity = ultraGlobal.dataIdentity;
        uchat.getGroupMembers(function(members){
            //console.log(members.length+" members trying on");
            angular.forEach(members, function(member, index) {
                //console.log("member "+index+" : "+member.username);
                if(member.username != $scope.identity){
                    $scope.addUser(member.username);
                }
            });
        });
    });
    $scope.$on("newMemberJoin", function(event, member){
        //console.log("new member id: "+member.username);
        $scope.addUser(member.username);
    });
    $scope.$on("memberLeave", function(event, member){
        //console.log("Leaving member id: "+member.username);
        $scope.removeUser(member.username);
    });
}