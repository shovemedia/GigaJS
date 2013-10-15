define(function(require){
	
	var $ = require('jquery');
	require('lib/jquery.withSelf');



	var ContentRenderer = function($context, $hidden)
	{
		this.$context = $context;
		this.$hidden = $hidden;
	};

	var p = ContentRenderer.prototype;

	p.init = function()
	{
		this.$hidden.append($('div[data-rel]', this.$context));
		this.initNav(this.$context);

		//this.content = [];
	};

	p.addContent = function($x)
	{
		this.initNav($x);

		this.$hidden.append($x);

		return $x;
	};

	p.initNav = function(context)
	{
		var self = this;

		context.withSelf('a.nav').each(function(){
			var navLink = $(this);
			// console.log('nav link', navLink)

			navLink.click(function(event){
				event.preventDefault();
				
				var href = navLink.attr('href');

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