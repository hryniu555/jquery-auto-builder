/* 
=================================================================
This module is deeply based in jQuery's custom build.js module
=================================================================

Copyright 2014 jQuery Foundation and other contributors
http://jquery.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


"use strict";
var path = require('path'),
    appDir = path.dirname(require.main.filename);
    
var fs = require( "fs" ),
	requirejs = require( "requirejs" ),
	srcFolder = __dirname + "/../../src/",
	rdefineEnd = /\}\);[^}\w]*$/,
	config = {
		baseUrl: "src",
		name: "jquery",
		out: "dist/jquery.js",
		// We have multiple minify steps
		optimize: "none",
		// Include dependencies loaded with require
		findNestedDependencies: true,
		// Avoid breaking semicolons inserted by r.js
		skipSemiColonInsertion: true,
		wrap: {
			startFile: "src/intro.js",
			endFile: "src/outro.js"
		},
		paths: {
			sizzle: "sizzle/dist/sizzle"
		},
		rawText: {},
		onBuildWrite: convert
	};