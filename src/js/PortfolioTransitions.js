define(function(require){

		var $ = require('jquery'),
		easing = require('lib/tween/easing/EasePack'),

		TweenLite = require('lib/tween/TweenLite'),
		TimelineLite = require('lib/tween/TimelineLite')
		;
	
	require('lib/tween/plugins/CSSPlugin');
	

	var PortfolioTransitions = function(transitionManager){
		console.log('new PortfolioTransitions');
		this.transitionManager = transitionManager;
	}

	var p = PortfolioTransitions.prototype;

	p.fadeIn = function($content, branch, onStart, onComplete)
	{
		console.log('fadeIn')

		//, border: '1px solid green'
		$content.css({opacity: 0});
		
		TweenLite.to($content, this.transitionManager.duration, {
			opacity: 1,
			onStart: onStart,
			onComplete: onComplete
		});
	};

	p.fadeOut = function($content, branch, onStart, onComplete)
	{
		console.log('fadeOut');

		//, border: '1px solid red'
		$content.css({opacity: 1});

		TweenLite.to($content, this.transitionManager.duration, {
			opacity: 0,
			onStart: onStart,
			onComplete: onComplete
		});
	};



	p.listIn = function($content, branch, onStart, onComplete)
	{
		console.log('listIn')

		$content.css({
			position: 'relative',
			left: '-100px'
		});
		
		TweenLite.to($content, this.transitionManager.duration, {
			left: 0,
			onStart: onStart,			
			onComplete: onComplete
		});
	};

	p.listOut = function($content, branch, onStart, onComplete)
	{
		console.log('listOut');

		$content.css({
			position: 'relative',
			left: '0px'
		});

		TweenLite.to($content, this.transitionManager.duration, {
			left: -100,
			onStart: onStart,		
			onComplete: onComplete
		});
	};

	p.projectIn = function($content, branch, onStart, onComplete)
	{
		console.log('projectIn')

		if (onStart != undefined)
		{
			onStart();
		};

		$content.hide().slideDown({
			duration: this.transitionManager.duration * 1000,
			complete: onComplete
		});

	};


	p.projectOut =  function($content, branch, onStart, onComplete)
	{
		console.log('projectOut');

		if (onStart != undefined)
		{
			onStart();
		};

		$content.slideUp({
			duration: this.transitionManager.duration * 1000,
			complete: onComplete
		});

	};


	return PortfolioTransitions;
});