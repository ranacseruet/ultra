/**
 * Created by Rana on 14-12-06.
 */

$(document).ready(function(){
    var rchat = new ULTraChat("176fa7bc-ad48-4dda-8b98-9281844d559a");
    rchat.connect("testuser", function(status){
        if(!status){
            consol.err("Couldn't connect");
            return;
        }
        console.log("Connection success");
        /* doesn't work always*/
        /*rchat.sendMessage("test message", function(evt){
            console.log("result: "+evt);
        });*/
    });
});