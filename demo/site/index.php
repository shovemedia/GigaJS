<?php 
	include('giga/giga.php'); 
	$g = new giga('/site');

	$g->environment = 'production';
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Site Demo</title>

		<link rel="stylesheet" type="text/css" href="/site/css/main.css" />

<!--[if lt IE 10]>	
<script src="/site/js/lib/ie/function.bind.js"></script>
<script src="/site/js/lib/ie/stacktrace.js"></script>
<![endif]-->

<!-- canvas shim for IE8 here -->


<!--
		<script src="/site/js/lib/preloadjs-0.4.0.min.js"></script>
		<script src="/site/js/lib/requestAnimationFrame.js"></script>
		<script src="/site/js/lib/PreloadView.js"></script>
-->

		<script src="/site/js/build/PreloadView.min.js"></script>

		<script>
			var queue = new createjs.LoadQueue(true);

			var preloadView = new PreloadView(queue);
			preloadView.setImgSrc('/site/gradient.jpg');
			preloadView.init();

			queue.addEventListener("complete", function(event)
			{
				$(function ()
				{		
					require(['test/Site'], function (Main) {
						var main = new Main($('#contextView'));

						$('.canvas.preloader').addClass('bounceOut');
						$('.antiFOUC').removeClass('antiFOUC');
					});
				});
			});

			var loadItems = [];

<?php if ($g->environment == 'dev') { ?>

			loadItems.push({src: '/site/js/lib/require.js'});
			loadItems.push({src: '/site/js/lib/require.config.js'});

<?php } else if ($g->environment == 'build') { ?>

			loadItems.push({src: '/site/js/build/Site.js'});

<?php } else if ($g->environment == 'production') { ?>

			loadItems.push({src: '/site/js/build/Site.min.js'});

<?php } ?>

			loadItems.push({src: '/site/js/lib/jquery-1.7.1.js'});
			queue.loadManifest(loadItems);
		</script>

	</head>

	<body id="contextView">
		<script type="text/javascript">
			document.getElementById("contextView").style.display = "none";
		</script>

		<div id="title_area"></div>

		<div id="projectDetail">
		<?php $g->content(); ?>
		</div>

		<script type="text/javascript">
			document.getElementById("contextView").style.display = "block";
			var items = document.querySelectorAll("body > *");
			for (var i=0, len=items.length; i<len; i++)
			{	
				var item = items[i];
				item.className += "antiFOUC";
			}
		</script>
	</body>
</html>	