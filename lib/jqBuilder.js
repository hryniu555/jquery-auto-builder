module.exports = function( args , callback) {

	"use strict";

	var fs = require("fs"),
		path = require('path'),
		requirejs = require("requirejs"),
		homeDir = path.dirname(require.main.filename),
		version = args.distVersion || "2.1.1",
		list = args.exclude,
		rdefineEnd = /\}\);[^}\w]*$/,
		filename = args.output,
		dev = args.dev,
		output = "",
		method = "";
		

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

	var config = {
		baseUrl: homeDir+"/../lib/jquery/"+version+"/src/",
		excludeShallow: excludeList,
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
		excludeList = function(list, prepend) {
			if ( list ) {
				prepend = prepend ? prepend + "/" : "";
				list.forEach(function( module ) {
					// Exclude var modules as well
					if ( module === "var" ) {
						excludeList( fs.readdirSync( srcFolder + prepend + module ), prepend + module );
						return;
					}
					if ( prepend ) {
						// Skip if this is not a js file and we're walking files in a dir
						if ( !(module = /([\w-\/]+)\.js$/.exec( module )) ) {
							return;
						}
						// Prepend folder name if passed
						// Remove .js extension
						module = prepend + module[1];
					}

					// Avoid infinite recursion
					if ( excluded.indexOf( module ) === -1 ) {
						excluder( "-" + module );
					}
				});
			}
		},
		excluder = function( flag ) {
			var m = /^(\+|\-|)([\w\/-]+)$/.exec( flag ),
				exclude = m[ 1 ] === "-",
				module = m[ 2 ];

			if ( exclude ) {
				// Can't exclude certain modules
				if ( minimum.indexOf( module ) === -1 ) {
					// Add to excluded
					if ( excluded.indexOf( module ) === -1 ) {
						console.writeln( flag );
						excluded.push( module );
						// Exclude all files in the folder of the same name
						// These are the removable dependencies
						// It's fine if the directory is not there
						try {
							excludeList( fs.readdirSync( srcFolder + module ), module );
						} catch( e ) {
							console.log( e );
						}
					}
					// Check removeWith list
					excludeList( removeWith[ module ] );
				} else {
					console.log( "Module \"" + module + "\" is a mimimum requirement.");
					if ( module === "selector" ) {
						console.log( "If you meant to replace Sizzle, use -sizzle instead." );
					}
				}
			} else {
				console.log( flag );
				included.push( module );
			}
		},
		out: function(compiled){

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