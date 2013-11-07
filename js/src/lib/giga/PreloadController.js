define(function(require){
	var $ = require('jquery');
	require('lib/jquery.withSelf');

	var Q = require('q'),
		signals = require('lib/signals');

	var PreloadController = function($context)
	{
		this.$context = $context;

		this.on = {
			'start': new signals.Signal(),
			'progress': new signals.Signal(),
			'end': new signals.Signal()
		};

		var self = this;
		this.queue = new createjs.LoadQueue(true);
		this.queue.addEventListener("fileprogress", function(event){
			self.on.progress.dispatch(event);
		});
		this.queue.addEventListener("fileload", function(event){
			var url = event.item.src;
			self.onFetched(url, event.result);
		});


		this.cache = {};
		this.deferredByUrl = [];

		this.dataUrl = 'data.php';

		this.rootChangeBranch = null;

		
	}

	var p = PreloadController.prototype;

	p.init = function(url)
	{
		console.log('init', url);

		var $original = this.$context;
		
		var $content = this.unwrapEnvelope($original);

		this.cacheContent($content);

		var deferred = Q.defer();
		this.deferredByUrl[url + this.dataUrl] = deferred;		

		var allImagesReady = this.preloadImages($content);

		//	var self = this;
		allImagesReady.then(function(){
			console.log('home ready! @ ');
			//var deferred = self.deferredByUrl[url];
			deferred.resolve($content);
		});
	};

	p.unwrapEnvelope = function($content)
	{
		var $envelopes = $content.withSelf('.gigaContent[data-rel]'); //$('div[data-rel]', $content);

		var $p;

		var $allContents = $();

		$envelopes.each(function(){
			var $envelope = $(this);

			var $contents = $envelope.children();

			var rel = $envelope.data('rel');
			$contents.data('rel', rel);
			$contents.attr('data-rel', rel);
			$contents.addClass('gigaContent');

			$p = $envelope.parent();//.parent();
			
			if ($p.length > 0)
			{	
				console.log($contents);
				//alert('A' + $contents.html());
				$envelope.detach();
				$p.append($contents);
			}
			else
			{
				//alert('B');
				$contents.detach();
			}	
		
			$allContents = $allContents.add($contents);
		});


		return $($allContents);
	};

	p.cacheContent = function($content)
	{
		var self = this;

		$content.each(function(){
			var $item = $(this);
			var url = $item.data('rel');
			var $content = $item;//.withSelf('div');

			//	console.log('cache:', url, $content.html())

			var deferred = Q.defer();
			deferred.resolve($content);

			self.cache[url] = deferred.promise;
		});
	}

	p.get = function(url)
	{
		//	console.log('PreloadController get', url, this.deferredByUrl[url + this.dataUrl])

		var deferred;

		var cached = this.cache[url];
		if (cached)
		{
			deferred = this.deferredByUrl[url + this.dataUrl];
		}
		else
		{
			deferred = Q.defer();
			this.deferredByUrl[url + this.dataUrl] = deferred;
			this.fetchContent(url);
		}

		return deferred.promise;
	}

	p.fetchContent = function(url)
	{
		console.log('fetchContent', url);

		var self = this;

		this.on.start.dispatch(url);

		var depth;

		var rootChangeBranchArr = this.rootChangeBranch.split('/');
		var targetBranchArr = url.split('/');


		depth = targetBranchArr.length - rootChangeBranchArr.length;

		//alert (depth + ' :: ' + this.rootChangeBranch + ': ' +  rootChangeBranchArr.length + ' vs ' + url + ': ' + targetBranchArr.length);

		//jquery
/*
		$.ajax({
			url: url + this.dataUrl,
			type: 'POST',
			data: {
				depth: depth
			},
			success: function(x)
			{
				self.onFetched(url + this.dataUrl, x);
			}
		});
*/



		this.queue.loadFile({
			src: url + this.dataUrl,
			method: 'POST',
			values: {
				depth: depth
			}
		});

	};	

	p.onFetched = function(url, x)
	{
		//this.cache[url] = deferred.promise;

		this.on.end.dispatch(url);

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

		var $content = this.unwrapEnvelope($content);

		console.log('POST FETCH:', $content);

		//this.$context.append($content);

		this.cacheContent($content); // $content.filter('div[data-rel]')

		var allImagesReady = this.preloadImages($content);

		var self = this;
		allImagesReady.then(function(){
			//	alert('fetched & ready! @ ' + url);
			var deferred = self.deferredByUrl[url];
			deferred.resolve($content);
		});
	};

	p.preloadImages = function($content)
	{
		//Guarantee all images are loaded!
		var imgLoadPromises = [];

		var $img = $('img', $content);
		$img.each(function(){
			var $item = $(this);
			if (!$item[0].complete && $item[0].ready != "complete")
			{
				var deferred = Q.defer();
				imgLoadPromises.push(deferred.promise);

				$item.load(function(){
					deferred.resolve();
				});
			}	
		});
		
		//var self = this;
		return Q.all(imgLoadPromises);
	};

	return PreloadController;
});