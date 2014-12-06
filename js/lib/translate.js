function Translation(){
	this.appKey   = "trnsl.1.1.20141130T053443Z.abe0172019286ab4.38cf8c2055843d9fa61079da020e63286c7c5dcf";
	this.text     = "";
	this.toLang   = "";//$("#language").val();
	this.fromLang = "";//fromLang;
	
	this.TranslatedText = function(text,fromLang,toLang,callback){
		this.text     = text;
		this.toLang   = toLang;
		this.fromLang = fromLang;
		console.log("language"+this.fromLang);
		console.log("tolanguage"+this.toLang);
		$.when(
			$.get( "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+this.appKey+"&lang="+this.fromLang+"-"+this.toLang+"&text="+this.text)
		).done(function(data) {
			var text  = data.text[0];
			callback(text);
		});

	}

	this.LanguageList = function(callback){	
		$.when(
			$.get( "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key="+this.appKey+"&ui=en")
		).done(function(data) {
			var languageOption = "";
			$.each(data.langs, function(key, value) {
				languageOption += '<option value="' + key + '">' + value + '</option>';
			});
			callback(languageOption);
		});
	}
}
