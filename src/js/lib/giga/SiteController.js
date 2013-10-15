define(function(require){
	
	var StateMachine = require('lib/giga/StateMachine');
	var Step = require('lib/giga/Step');

	var signals = require('lib/signals');

	var SiteController = function(flowController){
		this.flowController = flowController;

		this.transitionOutStep = new Step(); //'x out'
		this.preloadStep = new Step(); //'preload'
		this.transitionInStep = new Step(); //'x in'

		var self = this;

		this.transitionOutStep.next = 
		this.preloadStep.next =  
		this.transitionInStep.next = this.nextStep.bind(this);

		this.on = {
			transitionOut: new signals.Signal(),
			transitionIn: new signals.Signal(),
			transitionCross: new signals.Signal(),
			preload: new signals.Signal(),
			complete: new signals.Signal()		
		};

		this.currentStep = null;
	};

	var p = SiteController.prototype;

	p.init = function(flow)
	{
		if (flow == undefined || this.currentFlow != flow)
		{
			switch (flow)
			{
				case this.flowController.PRELOAD_FLOW:
					this.currentFlow = this.flowController.PRELOAD_FLOW;
					this.initPreloadFlow();
					this.initStateListeners();
					break;

				case this.flowController.REVERSE_FLOW:
					this.currentFlow = this.flowController.REVERSE_FLOW;
					this.initReverseFlow();
					this.initCrossListeners();
					break;

				case this.flowController.CROSS_FLOW:
					this.currentFlow = this.flowController.CROSS_FLOW;
					this.initCrossFlow();
					this.initStateCrossListeners();
					break;

				case this.flowController.NORMAL_FLOW:
				default:
					this.currentFlow = this.flowController.NORMAL_FLOW;
					this.initNormalFlow();
					this.initStateListeners();
			}
		}
	};

	p.initNormalFlow = function()
	{
		this.stateMachine = new StateMachine('start');
		this.stateMachine.setTransitionsFor(
			'start', {
				'continue': 'transitionOut'
			});

		this.stateMachine.setTransitionsFor(
			'transitionOut', {
				'continue': 'preload'
			});

		this.stateMachine.setTransitionsFor(
			'preload', {
				'continue': 'transitionIn'
			});

		this.stateMachine.setTransitionsFor(
			'transitionIn', {
				'continue': 'complete'
			});			

		this.stateMachine.setTransitionsFor(
			'complete', {
				'reset': 'start'
			});
	};

	p.initPreloadFlow = function()
	{
		this.stateMachine = new StateMachine('start');
		this.stateMachine.setTransitionsFor(
			'start', {
				'continue': 'preload'
			});

		this.stateMachine.setTransitionsFor(
			'preload', {
				'continue': 'transitionOut'
			});

		this.stateMachine.setTransitionsFor(
			'transitionOut', {
				'continue': 'transitionIn'
			});

		this.stateMachine.setTransitionsFor(
			'transitionIn', {
				'continue': 'complete'
			});			

		this.stateMachine.setTransitionsFor(
			'complete', {
				'reset': 'start'
			});
	};

	p.initReverseFlow = function()
	{
		this.stateMachine = new StateMachine('start');
		this.stateMachine.setTransitionsFor(
			'start', {
				'continue': 'preload'
			});

		this.stateMachine.setTransitionsFor(
			'preload', {
				'continue': 'transitionIn'
			});

		this.stateMachine.setTransitionsFor(
			'transitionIn', {
				'continue': 'transitionOut'
			});

		this.stateMachine.setTransitionsFor(
			'transitionOut', {
				'continue': 'complete'
			});			

		this.stateMachine.setTransitionsFor(
			'complete', {
				'reset': 'start'
			});
	};

	p.initCrossFlow = function()
	{
		this.stateMachine = new StateMachine('start');
		this.stateMachine.setTransitionsFor(
			'start', {
				'continue': 'preload'
			});

		this.stateMachine.setTransitionsFor(
			'preload', {
				'continue': 'transition'
			});

		this.stateMachine.setTransitionsFor(
			'transition', {
				'continue': 'complete'
			});

		this.stateMachine.setTransitionsFor(
			'complete', {
				'reset': 'start'
			});
	};

	p.initStateListeners = function()
	{
		var self = this;

		this.stateMachine.on.transitionOut.add(function(){
			console.log('SiteController transition out', self);
			self.currentStep = self.transitionOutStep;
			self.on.transitionOut.dispatch(self.currentStep);
			self.currentStep.check();
		});

		this.stateMachine.on.preload.add(function(){
			console.log('SiteController preload');
			self.currentStep = self.preloadStep;
			self.on.preload.dispatch(self.currentStep);
			self.currentStep.check();
		});

		this.stateMachine.on.transitionIn.add(function(){
			console.log('SiteController transition in');
			self.currentStep = self.transitionInStep;
			self.on.transitionIn.dispatch(self.currentStep);
			self.currentStep.check();
		});

		this.stateMachine.on.complete.add(function(){
			console.log('SiteController complete');
			self.currentStep = null;
			self.stateMachine.trigger('reset');
			self.on.complete.dispatch();
		});
	};

	p.initStateCrossListeners = function()
	{
		var self = this;

		this.stateMachine.on.preload.add(function(){
			console.log('SiteController preload');
			self.currentStep = self.preloadStep;
			self.on.preload.dispatch(self.currentStep);
			self.currentStep.check();
		});

		this.stateMachine.on.transition.add(function(){
			console.log('SiteController transition');
			self.currentStep = self.transitionInStep;
			self.on.transitionCross.dispatch(self.currentStep);
			self.currentStep.check();
		});

		this.stateMachine.on.complete.add(function(){
			console.log('SiteController complete');
			self.currentStep = null;
			self.stateMachine.trigger('reset');
			self.on.complete.dispatch();
		});
	};



	p.isBusy = function()
	{
		if (this.currentStep != null)
		{
			return true;
		}	
		else
		{
			return false;
		}	
	};

	p.nextStep = function()
	{
		console.log ('SiteController state', this.stateMachine.state);
		this.stateMachine.trigger('continue');
	};

	p.processPageChange = function()
	{
		this.nextStep();
	};

	//	p.reset = function()
	//	{
	//		this.transitionOutStep.reset();
	//		this.preloadStep.reset();
	//		this.transitionInStep.reset();
	//	}

	return SiteController;

});
