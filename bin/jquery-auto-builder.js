#! /usr/bin/env node
// -*- js -*-

"use strict";

var argv = require('minimist')(process.argv.slice(2),{ boolean: "d" , string: "v" });
var jqParser = require("../lib/jqParser");
var jqBuilder = require("../lib/jqBuilder");
var sys = require("util");
//start the fun!


if(!argv._.length > 0){
	sys.log("No files given.");
	process.exit(1);
}
if(argv.v === "1"){
	sys.log("Building latest 1.* jQuery stable version (1.11.1)");
	argv.v = "1.11.1";//jQuery v1.* latest stable
}else if(argv.v === "2"){
	sys.log("Building latest 2.* jQuery stable version (2.1.1)");
	argv.v = "2.1.1"; //jQuery v2.* latest stable
}else if(argv.v === undefined){
	sys.log("Building latest jQuery stable version (2.1.1)");
}else if(argv.v !== "1.11.1" && argv.v !== "2.1.1"){
	sys.log("Invalid version given. Falling back to latest (2.1.1)");
	argv.v = "2.1.1";
}


function build(ver, mods){

	jqBuilder({
		ver: ver,
		exclude: mods,
		dev: argv.d || false,
		output: argv.o
	}, function(err){
		if(err){
			sys.error(err);
			process.exit(1);
		}else{
			sys.log("JQuery custom version built successfully!");
		}
	});
}

jqParser.getModules(argv._, function(err, excludeMods){
	if(err){
		sys.error(err);
		process.exit(1);
	}else{
		build(argv.v, excludeMods);
	}
});

