define(function(require){

		var $ = require('jquery'),
		easing = require('lib/tween/easing/EasePack'),

		TweenLite = require('lib/tween/TweenLite'),
		TimelineLite = require('lib/tween/TimelineLite')
		;
	
	require('lib/tween/plugins/CSSPlugin');
	

	var TransitionController = function($context, $hidden)
	{
		//	TweenLite.selector = $
		this.$context = $context;
		this.$hidden = $hidden;

		this.$detail = $('#projectDetail', this.$context);

		this.duration = 1;

		this.defaultin = 'fadeIn';
		this.defaultout = 'fadeOut';		

		this.firstDisplay = true;

	};

	var p = TransitionController.prototype;

	p.in = function($content, branch, step)
	{
		console.log ('transition in', $content);

		if ($content != undefined)
		{
			var self = this;

			var transitionList = [];

			$content.each(function(i){
				var $item = $(this);
				var transition = self.getTransition('in', $item, branch);

				console.log('x in', i, $item.html());



				step.hold();

				var onStart = function() {
					self.$detail.append($item);
				};

				var onComplete = self.generateCompleteCallbackIn(i+1, step, transitionList);

				transitionList.push(function(){
					transition($item, branch, onStart, onComplete)
				});				
			});

			console.log('transitionList', transitionList);

			if(transitionList.length > 0)
			{
				transitionList[0]();
			}


		}
	};

	p.out = function($content, branch, step)
	{
		console.log ('transition out', $content);

		if ($content != undefined)
		{
			if (!this.firstDisplay)
			{	
				var self = this;

				var transitionList = [];

				$content.each(function(i){
					var $item = $(this);
					var transition = self.getTransition('out', $item, branch);

					console.log('x out', i, $item.html());

					step.hold();

					var onComplete = self.generateCompleteCallbackOut(i, step, transitionList, $item);

					transitionList.push(function(){
						transition($item, branch, null, onComplete)
					});		
				});

				console.log('transitionList', transitionList);

				if(transitionList.length > 0)
				{
					transitionList[transitionList.length-1]();
				}

			}
			else
			{
				this.firstDisplay = false;
			}	
		}
	};


	p.generateCompleteCallbackIn = function(i, step, transitionList)
	{
		return function(){
			console.log('complete in', i, new Date());

			step.release();
			if (transitionList[i] != undefined)
			{
				transitionList[i]();
			}	
		};
	};

	p.generateCompleteCallbackOut = function(i, step, transitionList, $content)
	{
		var self = this;

		return function(){
			console.log('complete out', i, new Date());

			step.release();
			self.$hidden.append($content);
			if (transitionList[i-1] != undefined)
			{
				transitionList[i-1]();
			}	
		};
	};

	p.registerTransitions = function(clazz)
	{
		this.transitions = new clazz(this);
		console.log(this.transitions)

		//	for (var i in obj)
		//	{

		//	}
	};

	p.getTransition = function(inOutAttribute, $content, branch)
	{
		var transitionName = $content.children().first().data('transition' + inOutAttribute);

		console.log(inOutAttribute, 'transitionName', transitionName);
		console.log($content)

		var fn = this.transitions[transitionName];
		if (fn == undefined)
		{
			fn = this.transitions[this['default' + inOutAttribute]];
		}

		return fn.bind(this.transitions);
	};

	return TransitionController;
});