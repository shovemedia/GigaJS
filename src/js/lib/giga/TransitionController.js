define(function(require){

		var $ = require('jquery'),
		easing = require('lib/tween/easing/EasePack'),
		signals = require('lib/signals'),

		TweenLite = require('lib/tween/TweenLite');
		TimelineLite = require('lib/tween/TimelineLite');
	
	require('lib/tween/plugins/CSSPlugin');
	

	var TransitionController = function(giga)
	{
		//	TweenLite.selector = $
		this.giga = giga;
		this.$context = giga.$context;
		this.$hidden = giga.$hidden;

		

		this.on = {
			'transitionOut': new signals.Signal(),
			'transitionIn': new signals.Signal()
		}

		this.duration = 3;

		this.defaultin = 'fadeIn';
		this.defaultout = 'fadeOut';
	};

	var p = TransitionController.prototype;

	p.setDefaultContentTarget = function(x)
	{
		console.log('setDefaultContentTarget', x);
		this.$contentTarget = x;
	}


	p.getTransitionSequence = function(inOutAttribute, $content, step)
	{
		console.log ('transition sequence', inOutAttribute, $content, step);

		if ($content != undefined)
		{
			var self = this;

			var transitionList = [];

			var lastRel;

			var $sets = [];

			$content.each(function(){
				var $branch = $(this);

				var rel = $branch.data('rel');

				if (rel != lastRel)
				{
					lastRel = rel;
					$sets.push($branch);
				}
				else
				{
					$sets[$sets.length-1] = $sets[$sets.length-1].add($branch);
				}	
			});

			for (var i=0, len = $sets.length; i<len; i++)
			{
				var $set = $sets[i];
				var transition = self.getTransitionStep(inOutAttribute, i, transitionList, step, $set);
				transitionList.push(transition);
			}	

			console.log('transitionList', transitionList);

			return transitionList;
		}
	};

	p.getTransitionStep = function(inOutAttribute, i, transitionList, step, $branch)
	{
		console.log('getTransitionStep', inOutAttribute, i, transitionList, step, $branch);

		var self = this;

		step.hold();

		var onStart;
		var onComplete;

		if (inOutAttribute == 'in')
		{
			onStart = function() {
				console.log('in onStart', i);
				self.on.transitionIn.dispatch(i);
				for (var j=0, twLen = $branch.length; j<twLen; j++)
				{
					var $item = $($branch[j]);

					var $contentTarget;
					var targetSelector = $item.data('contenttarget');

					if (targetSelector != undefined && targetSelector != "")
					{
						console.log('provided $contentTarget', targetSelector);
						$contentTarget = $(targetSelector);
					}
					else
					{
						console.log('default $contentTarget', self.$contentTarget);
						$contentTarget = self.$contentTarget;
					}
						
					//	console.log($($item.children().first().data('contenttarget')));
					//	console.log('default $contentTarget', self.$contentTarget);
					$contentTarget.append($item);
				}
			};

//			onComplete = self.generateCompleteCallback(i+1, transitionList, step);
			onComplete = function()
			{
				console.log('in onComplete', i);
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
				console.log('out onStart', i);
				self.on.transitionOut.dispatch(i);
			};

			//onComplete = self.generateCompleteCallback(i-1, transitionList, step, function(){self.$hidden.append($item);});
			onComplete = function()
			{
				console.log('out onComplete', i);	
				step.release();

				for (var j=0, twLen = $branch.length; j<twLen; j++)
				{
					var $item = $($branch[j]);
					self.$hidden.prepend($item);
				}

				if (transitionList[i-1] != undefined)
				{
					transitionList[i-1]();
				}	
			}
		}

		return function(){
			console.log('transition step', i,  $branch.length);
			var tl = new TimelineLite({paused: true});

			tl.eventCallback("onStart", onStart);
			tl.eventCallback("onComplete", onComplete);

			var tweens = [];

			// this is a dummy tween to take up space
			tweens.push(new TweenLite.to({}, self.duration, {'dummy': 0}));

			for (var j=0, twLen = $branch.length; j<twLen; j++)
			{
				var $item = $($branch[j]);

				var transitionName = $item.data('transition' + inOutAttribute);
				if (self.transitions[transitionName] == undefined)
				{
					transitionName = self['default' + inOutAttribute];
				}

				var tween = self.transitions[transitionName]($item);
				

				//	if (typeof tween == 'function')
				//	{
				//		//j*self.duration
					tweens.push(tween);
				//	}
				//	else
				//	{
				//		tweens.push(tween);
				//	}	
			}

			tl.add(tweens, null, "start");

			tl.play();
		};
	};

	p.registerTransitions = function(clazz)
	{
		this.transitions = new clazz(this.giga);
		this.transitions.setTransitionManager(this);
		
		console.log(this.transitions);

		//	for (var i in obj)
		//	{

		//	}
	};

	return TransitionController;
});