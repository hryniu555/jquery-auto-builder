module.exports = function( args , callback) {

	"use strict";

	var dev = args.dev,
		excluded = [],
		excludeList = args.exclude || [],
		filename = args.output,
		fs = require("fs"),
		method = "",
		output = "",
		path = require('path'),
		homeDir = path.dirname(require.main.filename),
		rdefineEnd = /\}\);[^}\w]*$/,
		requirejs = require("requirejs"),
		version = args.distVersion || "2.1.1",
		srcFolder = homeDir+"/../lib/jquery/"+version+"/src/";
		

	if (dev === true) {
		if (filename === undefined) {
			output = "jquery.custom.js";
		} else {
			output = filename;
		}
		method = "none";
	} else {
		if (filename === undefined) {
			output = "jquery.custom.min.js";	
		} else {
			output = filename;
		}
		method = "uglify2";
	}

	function convert(name, path, contents){
		// Convert var modules
		if (/.\/var\//.test(path)) {
			contents = contents
				.replace( /define\([\w\W]*?return/, "var " + (/var\/([\w-]+)/.exec(name)[1]) + " =" )
				.replace( rdefineEnd, "" );

		// Sizzle treatment
		} else if (/^sizzle$/.test(name)) {
			contents = "var Sizzle =\n" + contents
				// Remove EXPOSE lines from Sizzle
				.replace( /\/\/\s*EXPOSE[\w\W]*\/\/\s*EXPOSE/, "return Sizzle;" );

		} else {
			// Ignore jQuery's exports (the only necessary one)
			if (name!== "jquery") {
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

	function toExclusion(list, prepend){

		if (list) {

			prepend = prepend ? prepend + "/" : "";

			list.forEach(function(module) {
				// Exclude var modules as well
				if (module === "var") {
					toExclusion( fs.readdirSync( srcFolder + prepend + module ), prepend + module );
					return;
				}
				if (prepend) {
					if (!(module = /([\w-\/]+)\.js$/.exec(module))) {
						return;
					}
					module = prepend + module[1];
				}
				if (excluded.indexOf(module) === -1 ) {
					excluder( module );
				}
			});
		}
	}

	function excluder(module){

		if (excluded.indexOf(module) === -1) {
			console.log("- "+module);
			excluded.push(module);

			try {
				toExclusion(fs.readdirSync(srcFolder + module), module);
			} catch (e) {
				//console.log(e);
			}
		}

	}

	excludeList.forEach(function(module){

		excluder(module);
	});

	var config = {
		baseUrl: srcFolder,
		excludeShallow: excluded,
		findNestedDependencies: true,
		include: ["core", "selector"],
		name: "jquery",
		onBuildWrite: convert,
		optimize: method,
		paths: {
			sizzle: homeDir+"/../lib/jquery/"+version+"/src/sizzle/dist/sizzle"
		},
		rawText: {},
		skipSemiColonInsertion: true,
		wrap: {
			startFile: homeDir+"/../lib/jquery/"+version+"/src/intro.js",
			endFile: homeDir+"/../lib/jquery/"+version+"/src/outro.js"
		},
		out: function(compiled){
			console.log("excluding modules: "+excluded);
			compiled = compiled
				// Embed Version
				.replace( /@VERSION/g, version )
				// Embed Date
				// yyyy-mm-ddThh:mmZ
				.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );

				//Writing file here. 
				try{

					fs.writeFileSync(output, compiled);	

				}catch(e){
					
					console.log("Unable to write to file: "+output+". Make sure to check if directory exists.\nError: "+e.message);
					
					process.exit(1);
				}

		}

	};

	requirejs.optimize(config, function(response){

		callback(0, response);

	}, function(err){
		
		callback(err);

	});
};