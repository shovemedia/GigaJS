/**
 * @fileOverview
 * A module representing a sample Giga Content Renderer.
 */

define(function(require){
	
	var $ = require('jquery');
	require('lib/jquery.withSelf');


/** 
	Represents a demo Giga Content Renderer.
	@class
	@name ContentRenderer 
	@param $context a DOM context (jQuery / zepto)
	@param $hidden a DOM context (jQuery / zepto)
*/
	var ContentRenderer = function($context, $hidden)
	{
		this.$context = $context;
		this.$hidden = $hidden;
	};

	var p = ContentRenderer.prototype;

/**
.... description goes here ...
@function
@name ContentRenderer.prototype.init

@description Once upon an example link {@link Site#init}.
*/   
	p.init = function()
	{
		this.$hidden.append($('.gigaContent[data-rel]', this.$context));
		this.initNav(this.$context);

		//this.content = [];
	};

	p.addContent = function($x)
	{
		console.log('addContent', $x);

		this.initNav($x);

		this.$hidden.append($x);

		return $x;
	};

	//cribbed from URI.js
	p.resolveRelative = function(_path)
	{
		while (true) {
			_parent = _path.indexOf('/../');
			if (_parent === -1) {
				// no more ../ to resolve
				break;
			} else if (_parent === 0) {
				// top level cannot be relative...
				_path = _path.substring(3);
				break;
			}

			_pos = _path.substring(0, _parent).lastIndexOf('/');
			if (_pos === -1) {
				_pos = _parent;
			}
			_path = _path.substring(0, _pos) + _path.substring(_parent + 3);
		}
		return _path;
	}

	p.initNav = function(context)
	{
		var self = this;

		context.withSelf('a.nav').each(function(){
			var navLink = $(this);
			// console.log('nav link', navLink)

			var href = self.resolveRelative(navLink.attr('href'));

			navLink.click(function(event){
				event.preventDefault();

				console.log('= = =');
				console.log('push: ', href);
				console.log('= = =');

				History.pushState(null, null, href);

				return false;
			});
		});
	};

	return ContentRenderer;

});