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


<h3>Optimized Build</h3>
Set the paths to tools listed in build.properties

... 


from the command-line:
ant build

