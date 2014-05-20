"use strict";

var argv = require('minimist')(process.argv.slice(2));
var jqb = require("../lib/jqBuilder");
var sys = require("util");
var async = require("async");

var jqFunc = [];

//start the fun!

//First get functions, then the modules.
async.series({
	funcs: function(callback){
		jqb.getFunctions(argv._, function(err, data){
			if(err){	
				callback(err);
			}else{
				jqFunc = data;
				callback(0, jqFunc);
			}
		});
	},
	mods: function(callback){
		jqb.getModules(jqFunc, function(err, mods){
			if(err){
				callback(err);
			}else{
				callback(0, mods);
			}
		});	
	}
}, function(err, results){

	if(err){
		sys.error(err);
		process.exit(1);
	}else{
		console.log("Módulos: "+results.mods);
	}
});

