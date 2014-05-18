"use strict";

var sys = require("util");
var fs = require("fs");
var path = require("path");
var argv = require('minimist')(process.argv.slice(2));

argv._.forEach(function(file){
	fs.readFile(file,"utf8",function(err, data) {
		if (err) throw err;
		console.log(data);
	});
});
