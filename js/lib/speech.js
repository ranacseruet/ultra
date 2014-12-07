/**
 * Created by Rana on 14-12-06.
 */
function RobotSpeaker()
{
    this.u = new SpeechSynthesisUtterance();

    this.u.rate = 1.2;
    this.u.onend = function(event) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };
    this.speak = function(lang, text){
        this.u.lang = lang;
        this.u.text = text;
        speechSynthesis.speak(this.u);
    };
}

function AudioListener(lang, callback)
{
    this.listener = new webkitSpeechRecognition();
    this.listener.continuous = true;
    this.listener.interimResults = true;
    this.listener.lang = lang;

    this.timestamp = null;

    this.listener.onresult = function(event) {
        if (event.results.length > 0) {
            var result = event.results[event.results.length-1];
            console.log(result+" time taken: "+(Date.now()-this.timestamp));
            callback(result[0].transcript);
        }
    };
    this.listener.onsoundstart = function(event) {
        console.log("sound started");
        this.timestamp = Date.now();
        console.log(event);
    };
    this.listen = function() {
        this.listener.start();
    };
    this.stop = function() {
        this.listener.stop();
        console.log("audio listener stopped");
    }
}