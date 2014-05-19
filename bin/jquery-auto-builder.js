"use strict";

var argv = require('minimist')(process.argv.slice(2));
var jqb = require("../lib/jqBuilder");
var sys = require("util");
//get files
var jqFiles = "";

jqb.getFunctions(argv._, function(err, data){

	if(err){
		sys.error(err);
	}else{
		jqFiles = data;
	}

});