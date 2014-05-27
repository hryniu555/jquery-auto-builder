//Custom r.js to build simple version of jQuery. 
module.exports = function( args , callback) {

	"use strict";

	var fs = require("fs"),
		requirejs = require("requirejs"),
		path = require('path'),
		homeDir = path.dirname(require.main.filename);

	var config = {

		//appDir: homeDir + "/../node_modules/jquery/src/",
		name: "jquery",
		baseUrl: "./node_modules/jquery/src/",
		paths: {
			sizzle: homeDir + "/../node_modules/jquery/src/sizzle/dist/sizzle"
		},
		include: ["core", "selector"],
		out: homeDir+"/dist/jquery-custom.js",
		optimize: "none",
		findNestedDependencies: true,
		skipSemiColonInsertion: true,
		wrap: {
			startFile: homeDir+"/../node_modules/jquery/src/intro.js",
			endFile: homeDir+"/../node_modules/jquery/src/outro.js"
		}
	}

	requirejs.optimize(config, function(response){

		callback(0, response);

	}, function(err){

		callback(err);
	});

}