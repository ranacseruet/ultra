
var app = angular.module("home",[]);

app.directive("header", function(){
	return {
		templateUrl: "header.html"
	};
});

app.directive("footer", function(){
	return {
		templateUrl: "footer.html"
	};
});

app.directive("share", function(){
	return {
		templateUrl: "share.html"
	};
});