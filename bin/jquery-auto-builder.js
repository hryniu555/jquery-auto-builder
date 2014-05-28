"use strict";

var argv = require('minimist')(process.argv.slice(2));
var jqParser = require("../lib/jqParser");
var jqBuilder = require("../lib/jqBuilder");
var sys = require("util");
var async = require("async");
//start the fun!


jqParser.getModules(argv._, function(err, excludeMods){
	if(err){
		sys.error(err);
		process.exit(1);
	}else{
		build(argv.v, excludeMods);
	}
});

function build(ver, mods){

	jqBuilder({
		ver: ver,
		exclude: mods
	}, function(err, data){
		if(err){
			sys.error(err);
			process.exit(1);
		}else{
			console.log(data);
			console.log("JQuery custom build built successfully!");
		}
	});
}