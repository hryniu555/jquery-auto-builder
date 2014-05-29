//Custom r.js to build simple version of jQuery. 
module.exports = function( args , callback) {

	"use strict";

	var fs = require("fs"),
		requirejs = require("requirejs"),
		path = require('path'),
		homeDir = path.dirname(require.main.filename),
		rdefineEnd = /\}\);[^}\w]*$/,
		version = args.distVersion || "2.1.1",
		excludeList = args.exclude || [],
		minify = args.minify || "none"
		;

	var output = "";

	if(minify === "none"){
		output = homeDir+"/../dist/jquery.custom.js";
	}else{
		output = homeDir+"/../dist/jquery.custom.min.js";
	}

	var config = {

		//appDir: homeDir + "/../node_modules/jquery/src/",
		name: "jquery",
		baseUrl: homeDir+"/../lib/jquery/"+version+"/src/",
		paths: {
			sizzle: homeDir+"/../lib/jquery/"+version+"/src/sizzle/dist/sizzle"
		},
		include: ["core", "selector"],
		exclude: excludeList,
		out: output,
		optimize: minify,
		findNestedDependencies: true,
		skipSemiColonInsertion: true,
		wrap: {
			startFile: homeDir+"/../lib/jquery/"+version+"/src/intro.js",
			endFile: homeDir+"/../lib/jquery/"+version+"/src/outro.js"
		},
		onBuildWrite: convert

	};

	function convert( name, path, contents ) {
		var amdName;
		// Convert var modules
		if ( /.\/var\//.test( path ) ) {
			contents = contents
				.replace( /define\([\w\W]*?return/, "var " + (/var\/([\w-]+)/.exec(name)[1]) + " =" )
				.replace( rdefineEnd, "" );

		// Sizzle treatment
		} else if ( /^sizzle$/.test( name ) ) {
			contents = "var Sizzle =\n" + contents
				// Remove EXPOSE lines from Sizzle
				.replace( /\/\/\s*EXPOSE[\w\W]*\/\/\s*EXPOSE/, "return Sizzle;" );

		} else {

			// Ignore jQuery's exports (the only necessary one)
			if ( name !== "jquery" ) {
				contents = contents
					.replace( /\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1" )
					// Multiple exports
					.replace( /\s*exports\.\w+\s*=\s*\w+;/g, "" );
			}

			// Remove define wrappers, closure ends, and empty declarations
			contents = contents
				.replace( /define\([^{]*?{/, "" )
				.replace( rdefineEnd, "" );

			// Remove anything wrapped with
			// /* ExcludeStart */ /* ExcludeEnd */
			// or a single line directly after a // BuildExclude comment
			contents = contents
				.replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "" )
				.replace( /\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "" );

			// Remove empty definitions
			contents = contents
				.replace( /define\(\[[^\]]+\]\)[\W\n]+$/, "" );
		}
		
		return contents;
	}

	requirejs.optimize(config, function(response){

		callback(0, response);

	}, function(err){

		callback(err);
	});




}