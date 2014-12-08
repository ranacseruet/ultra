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

        <!-- home -->
        <div id="home">
			<div class="row">
				<div class="col-md-6">
					<h1>Universal Language Translated Chat System</h1>
					<h4>
						Break the language barrier!<br><br>
						Voice/Text chat with anyone around the world, <br><br>
						speaking any(well almost) language! <br><br>
						No need for costly and time consuming bilingual assistance!<br><br>
						Communicate via instant text/voice messaging!
					</h4>
					<br>
					<p class="text-center">
						<a class="btn btn-success btn-lg" href="demo.php" target="_blank">Try It Now!</a>
					</p>
				</div>
				<div class="col-md-6">
					<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
						  <!-- Indicators -->
						  <ol class="carousel-indicators">
							<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
							<li data-target="#carousel-example-generic" data-slide-to="1"></li>
							<li data-target="#carousel-example-generic" data-slide-to="2"></li>
						  </ol>

						  <!-- Wrapper for slides -->
						  <div class="carousel-inner" role="listbox">
							<div class="item active">
							  <img src="img/screenshot-2.png" alt="screenshot-2">
							  <div class="carousel-caption">
								First
							  </div>
							</div>
							<div class="item">
							  <img src="img/screenshot-3.png" alt="screenshot-3">
							  <div class="carousel-caption">
								SeconD
							  </div>
							</div>
							<div class="item">
							  <img src="img/screenshot-1.png" alt="screenshot-1">
							  <div class="carousel-caption">
								Third
							  </div>
							</div>
						  </div>

						  <!-- Controls -->
						  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
							<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
							<span class="sr-only">Previous</span>
						  </a>
						  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
							<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
							<span class="sr-only">Next</span>
						  </a>
</div>
				</div>
			</div>
         </div>

			<hr>
				<h3 class="text-center">Proudly Built With:</h3>
				<div class="text-center">
					<img class="api-img" src="img/respoke.jpg" width="300">
					<img class="api-img" src="img/yandex.png" width="300">
					<img class="api-img" src="img/spech.png" width="300">
				</div>
			<hr>

        <!-- about -->
        <div id="about" class="margin-top">
			<div class="row">
				<div class="col-md-12">
					<h1>
						About ULTraChat
					</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="name">Web Based Communication:</div>
					<div class="description">
						ULTraChat is a web based real time web based communication system, which allows you to communicate with people, who don't speak/understand your
						language.
					</div>
				</div>
				
			</div>
			
			<div class="row top10">
				<div class="col-md-12">
					<div class="name">Group/Private Chat:(Translated)</div>
					<div class="description">
						You can text chat with anyone in the group chat room, all theirs message will be shown in your own preferred language and yours to them as
						their preferred language. If multiple persons message you in different languages, you will see all of them in your native(which you can select from
						top left select box) language!
						<br>
						The translation service are served by <a href="http://api.yandex.com/translate/">Yandex  API</a>, which supports
						a wide area of languages.
					</div>
				</div>
				
			</div>

			<div class="row top10">
				<div class="col-md-12">
					<div class="name">Voice Communication:(Translated)</div>
					<div class="description">
						<div class="col-md-6">
						You can also communicate to other people(speaking different language) via voice as well. This is available in private
						chat system only. You can speak your own language, that will be recognized and played to your chat partner as robotic
						voice in his preferred language.

						To use this feature, first click on the username of a online user, and then click on the 'phone' icon that will appear
						on the top bar of private message box.
						</div>
						<div class="col-md-6">
							<img src="img/audio.png" class="pull-right">
						</div>
					</div>
				</div>
			</div>

			<div class="row top10">
				<div class="col-md-12">
					<div class="name">Requirement:</div>
					<div class="description">
						<ul>
							<li>Google Chrome Browser(Latest Version)</li>
							<li>Audio Input(For Voice Recognition Based Communication)</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="row top10">
				<div class="col-md-12">
					<div class="name">Limitations:</div>
					<div class="description">
						<ul>
							<li>Currently voice recognition technology only available on Google Chrome. However, we can expect this feature to come
							to other browsers very soon, as well.
							</li>
							<li>If you are using Windows OS environment, then continuous audio input is not supported even in chrome, thus
							you will have to use the 'phone' icon again and again to allow you each time you speak something. On other hand,
							in Mac OSx environment, you should be able to go smoothly for longer conversation in a single allow.</li>
							<li>As currently this software isn't hosted under 'https' protocol, the voice input allow button will pop up
							each time you want to talk. We are expecting to move this to 'https' very soon when you won't have to do it
							again and again.</li>
							<li>Currently the chat system is powered by <a href="https://www.respoke.io">Respoke API</a> FREE tier, which
							limits to 5 concurrent users only! We will upgrade soon and you will be able to try it with more of your friends!</li>
							<li>Currently we are relying on third party services for all backend process, which causes some additional message communication
							cycle(sender->voice recognition service->recognized message back to sender-> to chat server->to receiver), which is delaying the communication significantly.
							We are planning to reduce it by establishing a backend infrastructure that will reduce these cycles and give you several times faster(sender->
							ULTra server on cloud->recognized message to receiver) speed
							even for voice recognized messages!</li>
						</ul>
					</div>
				</div>
			</div>

			<p class="text-center">
				<a class="btn btn-success btn-lg" href="demo.php" target="_blank">Try It Now!</a>
			</p>

         </div>

       

        <!-- Contact -->
        <div  id="contact">
			<hr>
			<div class="row">
				<div class="col-md-12 text-center">
					<h1>Contact Us</h1>
					<p>Feel free to email us to give us suggestions  or to just say hello!</p>
					<p><a href="mailto:rana@codesamplez.com">rana@codesamplez.com</a>
					</p>
					<ul class="list-inline banner-social-buttons">
						<li>
							<a href="https://twitter.com/ranacseruet" class="btn btn-default btn-lg"><i class="fa fa-twitter fa-fw"></i> <span class="network-name">Twitter</span></a>
						</li>
						<li>
							<a href="https://github.com/ranacseruet/ultra" class="btn btn-default btn-lg"><i class="fa fa-github fa-fw"></i> <span class="network-name">Github</span></a>
						</li>
						<li>
							<a href="https://www.linkedin.com/in/ranacseruet" class="btn btn-default btn-lg"><i class="fa fa-google-plus fa-fw"></i> <span class="network-name">LinkedIn</span></a>
						</li>
					</ul>
				</div>
			</div>
        </div>

        <hr>

        <!-- Footer -->
        <footer>
            <div class="row">
                <div class="col-md-12 text-center">
                    <p>Copyright &copy; UpStageCoder 2014</p>
                </div>
            </div>
        </footer>

    </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
		<script src="js/vendor/bootstrap.min.js"></script>
		
        <script src="js/main.js"></script>
    </body>
</html>
