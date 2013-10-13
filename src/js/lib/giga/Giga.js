define(function(require){

	var Q = require('lib/q');
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

		this.transitionController = new TransitionController(this.$context, this.$hidden);

		this.currentBranch = '/';
		this.targetBranch = null;

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
			var content = self.contentRenderer.getOutgoingContent(self.transitioningBranch);
			self.transitionController.xout(content, self.transitioningBranch, step);
		});
		this.siteController.on.transitionIn.add(function(step){
			var content = self.contentRenderer.getIngoingContent(self.transitioningBranch);
			self.transitionController.xin(content, self.transitioningBranch, step);
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

			var rootChangeBranch = '';

			for (var i=0, len = transitioningBranchArray.length; i<len; i++)
			{
				rootChangeBranch += transitioningBranchArray[i] + '/';
				if (currentBranchArray[i] != transitioningBranchArray[i])
				{
					break;
				}	
			}

			console.log('rootChangeBranch', rootChangeBranch);

			var pageFlow = this.flowController.getBranchFlow(rootChangeBranch);
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