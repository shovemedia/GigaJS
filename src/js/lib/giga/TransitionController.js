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
				var transition = self.getTransitionStep(inOutAttribute, step, $set); //i, transitionList, step, $set
				transitionList.push(transition);
			}

			if (inOutAttribute == 'out')
			{
				transitionList.reverse();
			}	

			console.log('transitionList', transitionList);

			var tl = new TimelineLite({paused: true});

			// this is a dummy tween to take up space
			tl.add(new TweenLite.to({}, .0001, {'dummy': 0}));

			//	tl.eventCallback("onStart", function(){
			//		console.log("x start " + inOutAttribute);
			//	});
			//	tl.eventCallback("onComplete", function(){
			//		console.log("x end " + inOutAttribute);
			//	});

			tl.add(transitionList, null, "sequence");

			return tl;
		}
	};

	p.getTransitionStep = function(inOutAttribute, step, $branch)
	{
		console.log('getTransitionStep', inOutAttribute, step, $branch);

		var self = this;

		step.hold();

		var onStart;
		var onComplete;

		if (inOutAttribute == 'in')
		{
			onStart = function() {
				console.log('in onStart');
				self.on.transitionIn.dispatch();
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
						
					$contentTarget.append($item);
				}
			};

			onComplete = function()
			{
				console.log('in onComplete');
				step.release();
			}
		} 
		else if (inOutAttribute == 'out')
		{
			onStart = function() {
				console.log('out onStart');
				self.on.transitionOut.dispatch();
			};

			onComplete = function()
			{
				console.log('out onComplete');	
				step.release();

				for (var j=0, twLen = $branch.length; j<twLen; j++)
				{
					var $item = $($branch[j]);
					self.$hidden.prepend($item);
				}
			}
		}

		console.log('transition step',  $branch.length);
		var tl = new TimelineLite(); //{paused: true}

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
			
			tweens.push(tween);
		}

		tl.add(tweens, null, "start");

		return tl;

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