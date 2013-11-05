define(function(require){
	var FlowController = function()
	{
		this.defaultFlow = this.NORMAL_FLOW;
		this.flowsByBranch = [];
	}

	var p = FlowController.prototype;

	p.NORMAL_FLOW = "NORMAL_FLOW";
	p.PRELOAD_FLOW = "PRELOAD_FLOW";
	p.REVERSE_FLOW = "REVERSE_FLOW";
	p.CROSS_FLOW = "CROSS_FLOW";

	p.setDefaultFlow = function(flow)
	{
		this.defaultFlow = flow;
	}
	p.getDefaultFlow = function()
	{
		return this.defaultFlow;
	}

	p.setBranchFlow = function(branch, flow)
	{
		this.flowsByBranch[branch] = flow;
	}
	p.getBranchFlow = function(branch)
	{
		return this.flowsByBranch[branch];
	}

	return FlowController;	
});