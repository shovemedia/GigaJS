	require.config({
		baseUrl: "/site/js/src",
		paths : {
			//create alias to plugins (not needed if plugins are on the baseUrl)
			//jquery: "../lib/jquery-1.7.1",
			jquery: "empty:",
			
			//	jquery: "lib/zepto",

			//	q: "lib/q",
			q: "lib/when",
		},

		waitSeconds: 30
	});