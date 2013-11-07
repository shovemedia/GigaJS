	require.config({
		baseUrl: "/js",
		paths : {
			//create alias to plugins (not needed if plugins are on the baseUrl)
			//	jquery: "../lib/jquery-1.7.1",
			//	jquery: "lib/zepto",
			jquery: "empty:",

			//	q: "lib/q",
			q: "lib/when"
		}
	});