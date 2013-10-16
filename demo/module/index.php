<?php 
	include('giga/giga.php'); 
	$g = new giga('module');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Module Demo</title>

		<script src="/module/js/lib/require.js"></script>
		<script src="/module/js/lib/require.config.js"></script>
		
		<script src="/module/js/lib/jquery-1.7.1.js"></script>	

		<script src="/module/js/lib/giga/Giga.js"></script>
		
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