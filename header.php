<?php
$base_url = "http://localhost/ultra/";
?>

<!-- Navigation -->
<nav class="navbar navbar-inverse navbar-fixed-top header" role="navigation">
	<div class="container">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="<?php echo $base_url;?>">ULTraChat</a>
		</div>
		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<li>
					<a href="<?php echo $base_url;?>#about">About</a>
				</li>
				<li>
					<a href="<?php echo $base_url;?>demo.php">Try It!</a>
				</li>
				<li>
					<a href="<?php echo $base_url;?>#contact">Contact</a>
				</li>
				
			</ul>
		</div>
		<!-- /.navbar-collapse -->
	</div>
	<!-- /.container -->
</nav>