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

function AudioListener(callback)
{
    this.listener = new webkitSpeechRecognition();
    this.listener.onresult = function(event) {
        if (event.results.length > 0) {
            callback(event.results[0][0].transcript);
        }
    };
    this.listen = function() {
        this.listener.start();
    };
}