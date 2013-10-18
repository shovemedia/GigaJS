<?php 
	include('giga/giga.php'); 
	$g = new giga('/site');

	$g->environment = 'build';
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Site Demo</title>

<!--[if lt IE 10]>	
<script src="/site/js/lib/ie/function.bind.js"></script>
<script src="/site/js/lib/ie/stacktrace.js"></script>
<![endif]-->

	<?php if ($g->environment == 'dev') { ?>


	<?php } else if ($g->environment == 'build') { ?>
		<script src="/site/js/test/Site.js"></script>
	<?php } else if ($g->environment == 'production') { ?>
		<script src="/site/js/test/Site.min.js"></script>
	<?php } ?>

		<script src="/site/js/lib/jquery-1.7.1.js"></script>	
		
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