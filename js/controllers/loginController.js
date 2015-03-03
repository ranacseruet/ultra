/**
 * Created by Rana on 15-03-01.
 */

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
                //console.log("Couldn't connect");
                return false;
            }
            else {
                //console.log("Connection successfull!");
                $modalInstance.close();
                ultraGlobal.dataIdentity = $scope.identity;
                $rootScope.$broadcast("loginSuccess");
            }
        });
    }
}