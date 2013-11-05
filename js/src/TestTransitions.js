define(function(require){

	var $ = require('jquery'),
	easing = require('lib/tween/easing/EasePack'),

	TweenLite = require('lib/tween/TweenLite');
	//	TimelineLite = require('lib/tween/TimelineLite');
	
	require('lib/tween/plugins/CSSPlugin');
	

	var TestTransitions = function(giga){
		console.log('new TestTransitions');
		this.giga = giga;
	}
	
	var p = TestTransitions.prototype;

	p.setTransitionManager = function (transitionManager)
	{
		this.transitionManager = transitionManager;
	}

	p.fadeIn = function($content)
	{
		console.log('GET fadeIn fn');

		//, border: '1px solid green'
		$content.css({opacity: 0});
		
		return TweenLite.to($content, this.transitionManager.duration, {
			opacity: 1
		});
	};

	p.fadeOut = function($content)
	{
		console.log('GET fadeOut fn');

		//, border: '1px solid red'
		$content.css({opacity: 1});

		return TweenLite.to($content, this.transitionManager.duration, {
			opacity: 0
		});
	};



	p.listIn = function($content)
	{
		console.log('GET listIn fn');

		$content.css({
			position: 'relative'
		});
		
		return TweenLite.fromTo($content, this.transitionManager.duration
		, {
			left: -100
		} , {
			left: 0
		});
	};

	p.listOut = function($content)
	{
		console.log('GET listOut fn');

		$content.css({
			position: 'relative'			
		});

		return TweenLite.fromTo($content, this.transitionManager.duration
		, {
			left: 0
		} , {
			left: -100
		});
	};

	p.projectIn = function($content)
	{
		console.log('GET projectIn fn');
		//	$content.css('border', '1px solid red');

		//	$content.css({
		//		position: 'relative'			
		//	});

		var self = this;

		return function(){
			console.log('projectIn');

			$content.hide();

			$content.slideDown({
				duration: self.transitionManager.duration * 1000
			});
		};
	};


	p.projectOut =  function($content)
	{
		console.log('GET projectOut fn');

		var self = this;

		return function(){
			console.log('projectOut');

			//	$content.hide().show();

			$content.slideUp({
				duration: self.transitionManager.duration * 1000
			});
		};
	};


	return TestTransitions;
});