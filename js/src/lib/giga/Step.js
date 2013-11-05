define(function(require){

	var signals = require('lib/signals');

	var Step = function(name)
	{
    this.name = name;

		this.holds = 0;

		this.on = {
			hold : new signals.Signal(),
			release : new signals.Signal()
		};

		this.init();
	};

	var p = Step.prototype;

	p.init = function()
	{
		var self = this;
		this.on.hold.add(function(){
			self.holdAction();
		});
		this.on.release.add(function(){
			self.releaseAction();
		});
	}
	p.deinit = function()
	{
		this.on.hold.removeAll();
		this.on.release.removeAll();
	}

	p.hold = function()
	{ 
		this.on.hold.dispatch();
	}

	p.holdAction = function()
	{
		console.log('holdAction');
		this.holds++;
	}

	p.release = function()
	{
		this.on.release.dispatch();
	}
	p.releaseAction = function()
	{
		console.log('releaseAction');
		this.holds--;
		this.check();
	};

	p.waiting = function()
	{
		if (this.holds == 0)
		{
			return false;
		}
		else
		 {
			return true;
		 } 
	};

	p.check = function()
	{
		console.log('step check', this.name);
		if (!this.waiting())
		{
			console.log('step next!', this.name);
			this.next();
		}
    else
    {
      console.log('holds', this.holds, this.name)
    }
	};

	p.reset = function()
	{
		this.deinit();
		this.holds = 0;
		this.init();
	}

	return Step;
});	