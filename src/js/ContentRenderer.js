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