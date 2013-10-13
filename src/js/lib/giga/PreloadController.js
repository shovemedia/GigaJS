define(function(require){
	var $ = require('jquery');
	require('lib/jquery.withSelf');

	var Q = require('lib/q');

	var PreloadController = function($context)
	{
		this.$context = $context;

		this.cache = {};

		this.init();
	}

	var p = PreloadController.prototype;

	p.init = function()
	{
		this.primeCache();
	}

	p.primeCache = function()
	{
		var self = this;

		$('div[data-rel]', this.$context).each(function(){
			var $item = $(this);
			var url = $item.data('rel');
			var $content = $item;//.withSelf('div');

			console.log('prime cache:', url, $content.html())

			var deferred = Q.defer();
			deferred.resolve($content);

			self.cache[url] = deferred.promise;
		});
	}

	p.get = function(url)
	{
		var cached = this.cache[url];
		if (cached)
		{
			return cached;
		}

		var deferred = Q.defer();
		this.fetchContent(url, deferred);

		return deferred.promise;
	}

	p.fetchContent = function(url, deferred)
	{
		console.log('fetchContent', url);

		var self = this;

		$.ajax({
			url: url + '/index_data.php',
			success: function(x)
			{
				self.onFetched(url, x, deferred);
			}
		});
	};	

	p.onFetched = function(url, x, deferred)
	{
		this.cache[url] = deferred.promise;

		console.log('ok', x);

		var data = x;
		var title = 'Title: ' + url;

		var State = History.getState(); 

		var href = History.getShortUrl(State.url);
				console.log('= = =');
				console.log('replace: ', href);
				console.log('= = =');

		History.replaceState(null, title, href);
		document.title = title;

		deferred.resolve($(x));
	};

	return PreloadController;
});