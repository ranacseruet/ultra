<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
		<!-- Bootstrap Core CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet">

		<!-- Custom CSS -->
		<link href="css/index.css" rel="stylesheet">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
		<?php include 'header.php';?>
        <div class="container">
			<div id="intro-section">
				<div class="modal fade intro-modal" tabindex="-1" role="dialog" aria-labelledby=""  aria-hidden="true" >
					<div class="modal-dialog">
						<div class="modal-content">
						  <div class="modal-header" style="background: #00396a; border-radius: 2px 2px 0 0;">
								<h3 style="color: #fff; float: left;">Join in chat room</h3>
								<div class="clearfix"></div>
							</div>
							<div class="modal-body text-center">
								<span class="join-error-status text-danger"></span>
								<form id="form-upload-logo" role="form">
									<input type="text" id="identity">
									<br/><br/>
									<button id="joinBtn" class="btn btn-primary" data-id="">Enter</button>
								</form>
								<div class="clearfix"></div>
						  </div>
					  </div>
				  </div>
				</div>
			</div>
			
			<div id="group-section">
				<div class="row">
					<select id="language">
						<option value="">Select language</option>
					</select>
				</div>
				<div id="groupBox" class="row top10">
					
					<div  class="col-md-2 border onlineUserList">
						<div class="row onlineUser">
							<div class="col-md-2 text-left">
								<span class="glyphicon glyphicon-user "></span>
							</div>
							<div class="col-md-8  text-left identityName">Rana</div>
						</div>
					</div>
					
					<div class="col-md-5 border msgList">
						<div class="row msg">
							<div class="col-md-2 text-left">
								<span class="glyphicon glyphicon-user avatar-pic"></span>
								<span class="name text-success">Rana</span>
							</div>
							<div class="col-md-9  text-left">
								hello
							</div>
							<div class="col-md-1  text-left">
								<span class="glyphicon glyphicon-info-sign text-primary msgInfo" data-toggle="tooltip" data-placement="top" title="time and lang"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<textarea name="textToSend" id="textToSend" class="col-md-6"></textarea>
					<button type="button" class="btn btn-default btn-primary col-md-1 groupSendBtn">Send</button>	
				</div>
				
			</div>
			
			<div id="private-section" class="row top10">
				<div class="privateChatBox"></div>
				<div class="col-md-2  privateChatBoxs">
					<div class="row border">
						<div class="row-fluid topArea text-right">
							<span class="startAudio glyphicon glyphicon-earphone"></span>
							<span class="closeBox glyphicon glyphicon-remove"></span>
						</div>
						<div class="row-fluid msg">
							<div class="col-md-2 text-left">
								<span class="glyphicon glyphicon-user avatar-pic"></span>
								<span class="name text-success">Rana</span>
							</div>
							<div class="col-md-8  text-left">
								hello
							</div>
							<div class="col-md-1  text-left">
								<span class="glyphicon glyphicon-info-sign text-primary msgInfo" data-toggle="tooltip" data-placement="top" title="time and lang"></span>
							</div>
						</div>
					</div>
					<div class="row">
						<textarea id="textToSend" class="col-md-8"></textarea>
						<button type="button" class="btn btn-default btn-primary col-md-4 privateSendBtn">Send</button>	
					</div>
				</div>
			</div>

		</div>
		<footer>
			<div class="row">
				<div class="col-md-12 text-center">
					<p>Copyright &copy; UpStageCoder 2014</p>
				</div>
			</div>
		</footer>
		
		
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/vendor/bootstrap.min.js"></script>
		<script src="js/vendor/respoke.min.js"></script>
		<script src="js/lib/speech.js"></script>
		<script src="js/lib/ULTraChat.js"></script>
		<script src="js/lib/ytranslator.js"></script>
		<script src="js/ultra.js"></script>
		<script>
			$(document).ready(function () {
				$(".msgInfo").tooltip({container: 'body'});
				initAudioListener();
			})

			function initAudioListener() {
				var btn = $(".startAudio");
				btn.unbind('click');
				btn.click(function startListen() {
					var listener = new AudioListener($("#language").val(), getAudioToText);
					listener.listen();
					btn.unbind('click');
					btn.click(function stoptListen() {
						listener.stop();
						initAudioListener();
					});
				});
			}

			function getAudioToText(text) {
				console.log("Recognized audio: "+text);
			}
		</script>
    </body>
</html>
