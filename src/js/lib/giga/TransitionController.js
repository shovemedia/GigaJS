define(function(require){

		var $ = require('jquery'),
		easing = require('lib/tween/easing/EasePack'),
		signals = require('lib/signals'),

		TweenLite = require('lib/tween/TweenLite');
		//	TimelineLite = require('lib/tween/TimelineLite');
	
	require('lib/tween/plugins/CSSPlugin');
	

	var TransitionController = function(giga)
	{
		//	TweenLite.selector = $
		this.$context = giga.$context;
		this.$hidden = giga.$hidden;

		this.$detail = $('#projectDetail', this.$context);

		this.on = {
			'transitionOut': new signals.Signal(),
			'transitionIn': new signals.Signal()
		}

		this.duration = 1;

		this.defaultin = 'fadeIn';
		this.defaultout = 'fadeOut';
	};

	var p = TransitionController.prototype;


	p.getTransitionSequence = function(inOutAttribute, $content, step)
	{
		console.log ('transition sequence', inOutAttribute, $content, step);

		if ($content != undefined)
		{
			var self = this;

			var transitionList = [];

			$content.each(function(i){
				console.log('each', i)
				var $item = $(this);
				var transition = self.getTransitionStep(inOutAttribute, i, transitionList, step, $item);

				transitionList.push(transition);				
			});

			console.log('transitionList', transitionList);

			return transitionList;
		}
	};

	p.getTransitionStep = function(inOutAttribute, i, transitionList, step, $item)
	{
		console.log('getTransitionStep', inOutAttribute, i, transitionList, step, $item);

		var self = this;

		step.hold();

		var onStart;
		var onComplete;

		if (inOutAttribute == 'in')
		{
			onStart = function() {
				self.on.transitionIn.dispatch(i);				
				self.$detail.append($item);
			};

//			onComplete = self.generateCompleteCallback(i+1, transitionList, step);
			onComplete = function()
			{
				step.release();

				if (transitionList[i+1] != undefined)
				{
					transitionList[i+1]();
				}	
			}

		}
		else if (inOutAttribute == 'out')
		{
			onStart = function() {
				self.on.transitionOut.dispatch(i);
			};

			//onComplete = self.generateCompleteCallback(i-1, transitionList, step, function(){self.$hidden.append($item);});
			onComplete = function()
			{
				step.release();

				self.$hidden.prepend($item);

				if (transitionList[i-1] != undefined)
				{
					transitionList[i-1]();
				}	
			}
		}

		var transitionName = $item.children().first().data('transition' + inOutAttribute);

		if (this.transitions[transitionName] == undefined)
		{
			transitionName = this['default' + inOutAttribute];
		}

		console.log('transitionName', transitionName);

		return function(){
			self.transitions[transitionName]($item, onStart, onComplete);
		};
	};

	p.registerTransitions = function(clazz)
	{
		this.transitions = new clazz(this);
		console.log(this.transitions);

		//	for (var i in obj)
		//	{

		//	}
	};

	return TransitionController;
});