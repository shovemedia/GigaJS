define(function(require){
	var $ = require('jquery');
	require('lib/jquery.withSelf');

	var Giga = require('lib/giga/Giga');
	var PreloadController = require('lib/giga/PreloadController');

	var ContentRenderer = require('ContentRenderer');
	var PortfolioTransitions = require('PortfolioTransitions');


// style="border: 1px solid red;"
		var hiddenTemplate = '<div style="display:none;"></div>';
		

	var Site = function($context){

		this.init($context);
	}

	var p = Site.prototype;

	p.init = function($context){
		var self = this;

		var $hidden = $(hiddenTemplate); 
		$context.append($hidden);

		this.giga = new Giga($context, $hidden);
		this.giga.setContentRenderer( ContentRenderer );
		this.giga.setPreloadController( PreloadController );
		this.giga.registerTransitions( PortfolioTransitions );

		this.giga.setBranchFlow('/project1', this.giga.flowController.CROSS_FLOW);
		this.giga.setBranchFlow('/project2', this.giga.flowController.CROSS_FLOW);		

		this.giga.init();
	};

	return Site;
});