define(function(require){

	var signals = require('lib/signals');
	var History = require('lib/History');

	var SiteController = require('lib/giga/SiteController');
	var FlowController = require('lib/giga/FlowController');
	var TransitionController = require('lib/giga/TransitionController');

	var Giga = function($context, $hidden)
	{
		var self = this;

		this.$context = $context;
		this.$hidden = $hidden;

		this.flowController = new FlowController();
		this.siteController = new SiteController(this.flowController);

		this.transitionController = new TransitionController(this);

		this.currentBranch = '/';
		this.targetBranch = null;
		this.transitioningBranch = null;
		this.rootChangeBranch = null;

		History.Adapter.bind(window, 'statechange', function() {
			var State = History.getState(); 
			History.log(State.data, State.title, State.url);

			self.gotoBranch(History.getShortUrl(State.url));	
		});
	};


	var p = Giga.prototype;

	p.init = function()
	{
		var self = this;

		this.siteController.init(this.flowController.defaultFlow);

		this.siteController.on.transitionOut.add(function(step){
			var $content = self.getOutgoingContent(self.transitioningBranch);
			var sequence = self.transitionController.getTransitionSequence('out', $content, step);
			if(sequence.length > 0)
			{
				sequence[sequence.length-1]();
			}

		});
		this.siteController.on.transitionIn.add(function(step){
			var $content = self.getIngoingContent(self.transitioningBranch);
			var sequence = self.transitionController.getTransitionSequence('in', $content, step);
			if(sequence.length > 0)
			{
				sequence[0]();
			}
		});


		this.siteController.on.transitionCross.add(function(step){

			console.log('transitionCross');

			var $contentOut = self.getOutgoingContent(self.transitioningBranch);
			var $contentIn = self.getIngoingContent(self.transitioningBranch);

			var sequenceOut = self.transitionController.getTransitionSequence('out', $contentOut, step);
			var sequenceIn = self.transitionController.getTransitionSequence('in', $contentIn, step);

			//	self.transitionController.on.transitionIn.add(function(){
			//	});

			if(sequenceOut.length > 0)
			{
				sequenceOut[sequenceOut.length-1]();

				var inCounterDelay = sequenceOut.length;

				if(sequenceIn.length > 0)
				{
					self.transitionController.on.transitionOut.removeAll();
					self.transitionController.on.transitionOut.add(function(){
						if(--inCounterDelay == 0)
						{
							sequenceIn[0]();							
						}
					});		
				}
			}
			else
			{
				if(sequenceIn.length > 0)
				{
					sequenceIn[0]();
				}
			}
		});
	

		this.siteController.on.preload.add(function(step){
			//console.log('preload step hold!');
			step.hold();

			var promise = self.preloadController.get(self.transitioningBranch, step);

			promise.then(function(x){
				//console.log('preload step release!');

				if (x.parent().length == 0)
				{
					self.contentRenderer.addContent(x);
				}	

				step.release();
			})
		});

		this.siteController.on.complete.add(function(){
			self.currentBranch = self.transitioningBranch;
			self.navigateTo(self.targetBranch); //
		});

		this.gotoBranch(History.getShortUrl(History.getLocationHref()));
	};


	p.getSelectorForBranch = function(branch)
	{
		var selector = '';

		var the_arr = branch.split('/');
	    the_arr.pop();
	    //	the_arr.pop();

	    do
	    {	
			//	console.log('****')
			//	console.log(branch, the_arr);		    
		    //	the_arr.pop();
			var relContext = the_arr.join('/') + '/';

			if (selector != '')
			{
				selector += ', ';
			}

			selector += 'div[data-rel="' + relContext + '"]';
		}
		while(the_arr.pop())

		return selector;
	}

	p.getOutgoingContent = function(branch)
	{
		//	var relContext = $x.data('rel');
//		console.log('relContext pre', relContext);

		var selector = this.getSelectorForBranch(branch);
    
		//var $outgoing = $('div[data-rel^="' + relContext + '"][data-rel!="' + relContext + '"], div[data-rel]:not([data-rel^="' + relContext + '"])');

		var $outgoing = $('div[data-rel]').not(selector).not(this.$hidden.children());

		//console.log('getOutgoingContent', 'for', branch, 'is !', selector, $outgoing);

		return $outgoing
	};

	p.getIngoingContent = function(branch)
	{
		var selector = this.getSelectorForBranch(branch);

		console.log('selector', selector)

		var $ingoing = $(selector, this.$hidden);
		//console.log('getIngoingContent', 'is', selector, $ingoing);

		//console.log('HIDDEN: ', this.$hidden.html());

		//	$ingoing.each(function(i){
		//		console.log(i, $(this).html())
		//	});

		//	alert('holdup')

		return $ingoing;
	};


	p.setPreloadController = function(clazz)
	{
		//	console.log ('preload controller', x);
		this.preloadController = new clazz(this.$context)
	};

	p.setContentRenderer = function(clazz)
	{
		//	console.log ('content renderer', x);
		this.contentRenderer = new clazz(this.$context, this.$hidden);
		this.contentRenderer.init();
	};

	p.registerTransitions = function(x)
	{
		//	console.log ('xition controller', x);
		this.transitionController.registerTransitions(x);
	};

	// This method is the beginning of the event chain
	p.gotoBranch = function(branch)
	{
		if (!branch) {
			branch = "/";
		}

		branch = this.normalizeBranch(branch);
		
		if (this.targetBranch != branch)
		{
			console.log('Giga goto', 'branch', branch, 'targetBranch', this.targetBranch);
			//console.trace();

			this.targetBranch = branch;

			if (!this.siteController.isBusy())
			{
				this.navigateTo(branch);
			}
		}	
	};

	p.navigateTo = function(branch)
	{
		if (this.transitioningBranch != branch)
		{
			this.transitioningBranch = branch;


			console.log('navigate', 'from', this.currentBranch, 'to', this.transitioningBranch);

			var currentBranchArray = this.currentBranch.split('/');
			var transitioningBranchArray = this.transitioningBranch.split('/');

			this.rootChangeBranch = '';

			for (var i=0, len = transitioningBranchArray.length; i<len; i++)
			{
				this.rootChangeBranch += transitioningBranchArray[i] + '/';
				if (currentBranchArray[i] != transitioningBranchArray[i])
				{
					break;
				}	
			}

			console.log('rootChangeBranch', this.rootChangeBranch);

			var pageFlow = this.flowController.getBranchFlow(this.rootChangeBranch);
			if (pageFlow != undefined)
			{
				this.siteController.init(pageFlow);
			}
			else
			{
				this.siteController.init(this.flowController.defaultFlow);
			}

			this.siteController.processPageChange();
		}
	};


	p.normalizeBranch = function(branch)
	{
		//force end with '/'
		if (branch.indexOf('/', branch.length - 1) == -1)
		{
			branch += '/';
		}	

		return branch;
	}

	p.setDefaultFlow = function(flow)
	{
		this.flowController.setDefaultFlow(flow);
	};

	p.setBranchFlow = function(branch, flow)
	{
		this.flowController.setBranchFlow(this.normalizeBranch(branch), flow);		
	};

	//	p.setBranchChildFlow = function(branch, flow)
	//	{
		
	//	}




	return Giga;
});