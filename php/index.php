<?php 
	include('giga/giga.php'); 
	$g = new giga();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Giga Site</title>

	<script src="/js/lib/require.js"></script>
	<script src="/js/lib/require.config.js"></script>
	
	
	<script>
	
	require(
		[
			"jquery"
		]
		,	  			
		function ($) {	
			$(function ()
			{		
				require(['test/Site'], function (Main) {
					var main = new Main($('#contextView'));
					$('body').css('display', 'block');
				});
			});
  	});	
	</script>
</head>
<body>








	</head>



	<body id="contextView">

<script type="text/javascript">
	document.getElementById("contextView").style.display = "none";// hide everything
</script>		

		<div id="projectDetail">
		<?php $g->content(); ?>
		</div>

	</body>
</html>	