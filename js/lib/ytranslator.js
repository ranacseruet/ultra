function YTranslator(apiKey) {
	if(!$) {
		alert("jQuery not found!");
	}

	this.appKey   = apiKey;
	this.text     = "";
	this.toLang   = "";
	this.fromLang = "";
	
	this.translate = function(text, fromLang, toLang, callback){
		this.text     = text;
		this.toLang   = toLang;
		this.fromLang = fromLang;

		var apiURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+this.appKey+"&lang="+this.fromLang+"-"+this.toLang+"&text="+this.text;
		console.log("Translate API request: "+apiURL);
		$.when(
			$.get(apiURL)
		).done(function(data) {
			var text  = data.text[0];
			callback(text);
		});
	};

	this.getLanguageList = function(callback){
		$.when(
			$.get( "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key="+this.appKey+"&ui=en")
		).done(function(data) {
			if(!data.langs) {
				console.error("couldn't retrieve language list");
				callback([]);
			}
			callback(data.langs);
		});
	}
}
