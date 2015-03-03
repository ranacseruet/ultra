/**
 * Created by Rana on 15-03-01.
 */

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
        //console.log("language just changed");
        //$rootScope.$broadcast("languageChanged");
        //TODO haven't caught anywhere yet/validation
        ultraGlobal.dataLang = $scope.lang.key;
        uchat.setLanguage(ultraGlobal.dataLang);

    };
}