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

	p.getOutgoingContent = function(branch)
	{
		//	var relContext = $x.data('rel');
//		console.log('relContext pre', relContext);

		var selector = '';

		var the_arr = branch.split('/');
	    the_arr.pop();
	    //	the_arr.pop();

	    do
	    {	
			//	console.log('****')
			//	console.log(branch, the_arr);		    
		    //	the_arr.pop();
			var relContext = the_arr.join('/') + '/';
			selector += 'div[data-rel="' + relContext + '"], ';
		}
		while(the_arr.pop())
    
		//var $outgoing = $('div[data-rel^="' + relContext + '"][data-rel!="' + relContext + '"], div[data-rel]:not([data-rel^="' + relContext + '"])');

		var $outgoing = $('div[data-rel]').not(selector).not(this.$hidden.children());

		console.log('getOutgoingContent', 'for', branch, 'is !', selector, $outgoing);

		return $outgoing
	};

	p.getIngoingContent = function(branch)
	{
		var selector = '';

		var the_arr = branch.split('/');
		the_arr.pop();

		console.log('****')
		console.log(branch, the_arr);

		do
		{	
			//	console.log('****')
			//	console.log(branch, the_arr);			
			//	the_arr.pop();
			var relContext = the_arr.join('/') + '/';

			if (selector != '')
			{
				selector += ', ';
			}	

			selector += 'div[data-rel="' + relContext + '"]';
		}
		while(the_arr.pop())

		console.log('selector', selector)

		var $ingoing = $(selector, this.$hidden);
		console.log('getIngoingContent', 'is', selector, $ingoing);

		//console.log('HIDDEN: ', this.$hidden.html());

		$ingoing.each(function(i){
			console.log(i, $(this).html())
		});

		//	alert('holdup')

		return $ingoing;
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