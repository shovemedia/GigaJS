<?php 
	include('giga/giga.php'); 
	$g = new giga('/module');

	$g->environment = 'production';
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Module Demo</title>

		<script src="/module/js/lib/require.js"></script>
		<script src="/module/js/lib/require.config.js"></script>

		<script src="/module/js/lib/preloadjs-0.4.0.min.js"></script>		
		<script src="/module/js/lib/jquery-1.7.1.js"></script>	

		
	<?php if ($g->environment == 'dev') { ?>



	<?php } else if ($g->environment == 'build') { ?>
		<script src="/module/js/build/Giga.js"></script>
	<?php } else if ($g->environment == 'production') { ?>
		<script src="/module/js/build/Giga.min.js"></script>
	<?php } ?>


		<script>
			$(function ()
			{		
				require(['test/Site'], function (Main) {
					var main = new Main($('#contextView'));
					$('body').css('display', 'block');
				});
			});
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

	</body>
</html>	