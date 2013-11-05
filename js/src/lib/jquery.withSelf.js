define(function(){
	var $ = require('jquery');

	$.fn.withSelf = function (selector)
	{
				//self 					//descendents
		return this.filter(selector).add(selector, this) 
	}
});