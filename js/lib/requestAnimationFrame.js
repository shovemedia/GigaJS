	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function( callback ){
				//log('using anim timeout');
				return window.setTimeout(callback, 1000 / 60);
			};
	})();

	window.cancelRequestAnimFrame = ( function() {
		return window.cancelAnimationFrame				||
			window.webkitCancelRequestAnimationFrame	||
			window.mozCancelRequestAnimationFrame		||
			window.oCancelRequestAnimationFrame			||
			window.msCancelRequestAnimationFrame		||
			clearTimeout;
	} )();