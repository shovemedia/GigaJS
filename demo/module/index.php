<?php 
	include('giga/giga.php'); 
	$g = new giga('/module');

	$g->environment = 'production';
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Module Demo</title>

		<link rel="stylesheet" type="text/css" href="/module/css/main.css" />

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

		<script src="/module/js/lib/require.js"></script>
		<script src="/module/js/lib/require.config.js"></script>


		<script>
			var queue = new createjs.LoadQueue(true);

			var preloadView = new PreloadView(queue);
			preloadView.setImgSrc('/module/gradient.jpg');
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
// none
<?php } else if ($g->environment == 'build') { ?>

			loadItems.push({src: '/module/js/build/Giga.js'});

<?php } else if ($g->environment == 'production') { ?>

			loadItems.push({src: '/module/js/build/Giga.min.js'});

<?php } ?>

			loadItems.push({src: '/module/js/lib/jquery-1.7.1.js'});
			queue.loadManifest(loadItems);
		</script>


	</head>

	<body id="contextView">
		<script type="text/javascript">
			// if JS supported, hide everything
			document.getElementById("contextView").style.display = "none";
		</script>

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