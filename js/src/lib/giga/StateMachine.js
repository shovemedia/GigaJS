define(function(require){

	var signals = require('lib/signals');

	var StateMachine = function(initialState) {
		this.state = initialState;
		this.transitionsFor = {};
		this.on = {};
	};

	var p = StateMachine.prototype;

  p.setTransitionsFor = function(state, transitionMap)
  {
	this.transitionsFor[state] = transitionMap;

	for (var i in transitionMap)
	{
		var state = transitionMap[i];
		if (this.on[state] == undefined)
		{
			this.on[state] = new signals.Signal();
		}	
	}	

  }
	
	p.getTransitionFor = function(event) {
		try{
			return this.transitionsFor[this.state][event];
		} catch(exception) {
			console.log('event', event);
				console.log('transitions', this.transitionsFor, this.state);
			throw new Error("Invalid Event");
		}
	};

	p.trigger = function(event) {
		var nextState = this.getTransitionFor(event);

		if(nextState != undefined) {
			this.state = nextState
			this.on[this.state].dispatch();

			return true;
		} else {
			return false;
		}
	};
	
	p.reset = function()
	{
		for (var state in this.on)
		{
			var state = this.on[state];
			if (this.on[state] != undefined)
			{
				this.on[state].removeAll();
			}	
		}	
	};

	return StateMachine;
});