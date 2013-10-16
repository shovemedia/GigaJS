GigaJS
======

<h2>HTML5 site engine based on the GAIA Flash Framework</h2>

Giga leverages the following fine libraries:
<ul>
<li>require.js — All JS in Giga is wrapped as an AMD module.</li>
<li>almond.js — optimized builds are built with the require.js optimizer to include almond</li>
<li>History.js — as GAIA used SWFAddress, Giga uses History.js</li>
<li>when.js / Q.js — Promises implementation</li>
<li>signals.js — "Event" dispatching</li>
<li>Greensock tweening — GAIA used Greensock (ActionScript) , Giga uses Greensock (JavaScript)</li>
<li>Zepto / JQuery — Selector engine</li>
</ul>

<h2>Installation</h2>
The files in the PHP folder must be added to your server.

Don't forget the .htaccess file — it routes all requests to index.php, the site template. 
<ul>
	<li>Deep link requests will render a full site with the requested content whereever you place $giga-&gt;content()</li>
	<li>Normal navigation requests will be intercepted by giga; Giga JS will request your html content via AJAX.</li>
</ul>

<h2>Demos!</h2>
<h3>Module</h3>
The demo in /demo/module uses Giga built as a module.
Your Site class is responsible for bootstrapping the correct supporting classes:
PreloadController
ContentRenderer
CustomTransitions

See /demo/module/js/Site.js 

<h3>Site</h3>
The demo in /demo/site uses Giga built as a full site.

All the necessary JS is built into one minified file:
/site/js/test/Site.min.js (jquery is excluded as you might wish to lean on a cached CDN)


<h2>Optimized Build</h2>
<h3>Setup</h3>
You'll need to install these fine tools:
<ul>
<li>ant -- build.xml is an ant build script</li>
<li>node.js is a dependency for most of the build tools.</li>
<li>java -- The google closure compiler runs on java</li>
</ul>
You'll need to set the following paths in build.properties:

<ul>
<li>yui (yuicompressor), The Yahoo Tools -- used to combine and compress CSS
	http://http://yui.github.io/yuicompressor/</li>

<li>r.js (v2.1.5) -- the require.js optimizer script
	http://requirejs.org/docs/1.0/docs/download.html#rjs</li>

<li>closure_compiler.jar -- Google's closure compiler
	Pre-built Closure binaries can be found at
	http://code.google.com/p/closure-compiler/downloads/list</li>

<li>jslint.jar — optional js linter (highly recommended), you'll need to remove the linting sub-tasks if you forego installing jslint.
	http://code.google.com/p/jslint4java/</li>

<li>jsdoc-toolkit.dir — optional jsdoc tool. Used to generate documentation.
	https://github.com/jsdoc3/jsdoc</li>
<ul>

<h3>Build</h3>
from the command-line:
ant build

for documentation:
ant generateDocs

