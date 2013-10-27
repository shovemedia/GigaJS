/**
 * @fileOverview
 * A module representing a sample Giga site.
 */

define(function(require){

	var $ = require('jquery');
	require('lib/jquery.withSelf');

	var Giga = require('lib/giga/Giga');
	var PreloadController = require('lib/giga/PreloadController');

	var ContentRenderer = require('ContentRenderer');
	var TestTransitions = require('TestTransitions');


// style="border: 1px solid red;"
	var hiddenTemplate = '<div style="display:none;"></div>';
	

/** 
	Represents a sample Giga site.
	@constructor
	@name Site 
	@param $context a DOM context (jQuery / zepto)
*/
	var Site = function ($context){
		this.init($context);
	}


	var p = Site.prototype;

/**
.... description goes here ...
@function
@name Site.init
@param {$context} a DOM context  ..... 
*/   
    p.init = function($context){
		var self = this;

		var $hidden = $(hiddenTemplate); 
		$context.append($hidden);

		this.giga = new Giga($context, $hidden);
		this.giga.setContentRenderer( ContentRenderer );
		this.giga.setPreloadController( PreloadController );
		this.giga.registerTransitions( TestTransitions );

		this.giga.setBranchFlow('/site/project2/', this.giga.flowController.CROSS_FLOW);
		this.giga.setBranchFlow('/site/project3/', this.giga.flowController.CROSS_FLOW);		

		this.giga.init();
	};


/**
.... description goes here ...
@function
@name Site.init2
@param {jQuery/Zepto Node} $context DOM context for content rendering 
@param abc another DOM context  ..... 
@param def also DOM context  ..... 
*/   
    p.init2 = function($context, abc, def){
	};

	return Site;
});