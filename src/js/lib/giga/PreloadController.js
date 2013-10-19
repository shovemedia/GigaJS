define(function(require){
	var $ = require('jquery');
	require('lib/jquery.withSelf');

	var Q = require('q');

	var PreloadController = function($context)
	{
		this.$context = $context;

		this.cache = {};

		this.dataUrl = 'data.php';

		this.rootChangeBranch = null;

		this.init();
	}

	var p = PreloadController.prototype;

	p.init = function()
	{
		this.cacheContent($('div[data-rel]', this.$context));
	}

	p.cacheContent = function($content)
	{
		var self = this;

		$content.each(function(){
			var $item = $(this);
			var url = $item.data('rel');
			var $content = $item;//.withSelf('div');

			console.log('cache:', url, $content.html())

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

		var depth;

		var rootChangeBranchArr = this.rootChangeBranch.split('/');
		var targetBranchArr = url.split('/');


		depth = targetBranchArr.length - rootChangeBranchArr.length;

		//alert (depth + ' :: ' + this.rootChangeBranch + ': ' +  rootChangeBranchArr.length + ' vs ' + url + ': ' + targetBranchArr.length);


		$.ajax({
			url: url + this.dataUrl,
			type: 'POST',
			data: {
				depth: depth
			},
			success: function(x)
			{
				self.onFetched(url, x, deferred);
			}
		});
	};	

	p.onFetched = function(url, x, deferred)
	{
		//this.cache[url] = deferred.promise;

		console.log('ok', x);

		var data = x;
		var title = 'Title: ' + url;

		var State = History.getState(); 

		//	var href = History.getShortUrl(State.url);

		var full = History.getFullUrl(State.url);
		var root = History.getRootUrl();
		var href = '/' + full.replace(root, '');

		//strip anchor if present
		href = href.replace('#', '');

				console.log('= = =');
				console.log('replace: ', href);
				console.log('= = =');

//		History.replaceState(null, null, full); //href
		document.title = title;

		var $content = $(x);

		this.cacheContent($content.filter('div[data-rel]'));

		deferred.resolve($content);
	};

	return PreloadController;
});