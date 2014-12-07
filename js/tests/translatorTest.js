/**
 * Created by Rana on 14-12-06.
 */

$(document).ready(function(){

    var translator = new YTranslator("trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf");

    translator.getLanguageList(function(list){
        if(list.length <= 0){
            console.error("language list error");
        }
    });

    translator.translate("Hello World", "en", "fr", function(translatedText){
        if(translatedText != "Bonjour Tout Le Monde"){
            console.error("Translation error");
        }
    });

});