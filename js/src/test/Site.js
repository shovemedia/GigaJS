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
	var TestTransitions = require('test/Transitions');

/** 
	Represents a demo Giga site.
	@class
	@name Site 
	@param $context a DOM context (jQuery / zepto)
*/
	var Site = function ($context){
		this.init($context);
	}


	var p = Site.prototype;

/**
@name Site.hiddenTemplate
@description HTML fragment used to generate a hidden area in the document
*/   
	Site.hiddenTemplate = '<div style="display:none;"></div>'; // style="border: 1px solid red;"


/**
@function
@name Site.prototype.init
@param {$context} a DOM context  ..... 

@description
The sample site instantiates Giga,
registers the ContentRenderer,
sets the PreloadController,
registers the Transitions
and calls Giga.init
Once upon an example link {@link Site}.


@example
var mySite = new Site();
mySite.init($('#context'));
*/
    p.init = function($context){
		var self = this;

		var $hidden = $(Site.hiddenTemplate); 
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
@function
@name Site.prototype.init2
@param {jQuery/Zepto Node} $context DOM context for content rendering 
@param abc another DOM context  ..... 
@param def also DOM context  ..... 
@description Once upon an example link {@link Site#init}.
*/   
    p.init2 = function($context, abc, def){
	};

	return Site;
});