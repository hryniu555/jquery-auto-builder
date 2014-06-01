"use strict";

exports = module.exports = {};

var fs = require("fs"),
	path = require('path'),
    appDir = path.dirname(require.main.filename);

function readFiles(files, callback) {

	var jqData = "",
		j = 0;

	for (var i = 0; i < files.length; i++) {

		fs.readFile(files[i], 'utf8', function(err, data){

			if (err) {

				callback(err);

			} else {
				
				jqData += data;

				if (j === (files.length - 1)) {

					callback(0, jqData);

				} else {

					j++;

				}
			}
		});// jshint ignore:line
	}
}


function extractFunctions(jqString){

	var sanitezed = [],
		regex = /\)\.([a-zA-Z]+)\(/g,
		toSanitization = jqString.match(regex, "");
		
	toSanitization.forEach(function(funcName){

		sanitezed.push(funcName.substring(2, (funcName.length - 1)));
	
	});

	return sanitezed;
	
}

function getFunctions(files, callback){

	readFiles(files, function(err, jqData){

		if (err) {
			
			callback(err);

		} else {

			var funcList = extractFunctions(jqData);

			callback(0,funcList); 
		}

	});

}

function buildModules(funcList, callback){

	var onBuild = [],
		offBuild = [];

	fs.readFile(appDir+'/../lib/modules.json', 'utf8', function(err, data){
		
		if (err) {

			callback(err);

		}
 
 		//Is usign eval a bad practice here? 
		var modules = eval('('+data+')'); // jshint ignore:line

		for (var module in modules) {
 
			offBuild.push(module);

			var funcNames =  modules[module];

			for (var i in funcList) {
				
				if (funcNames.indexOf(funcList[i]) > 0) {
					
					if (onBuild.indexOf(module) < 0) {

						onBuild.push(module);

					}
				}
			}
		}

		for (var j in onBuild) {
			
			var tmpMod = offBuild.indexOf(onBuild[j]);
			
			offBuild.splice(tmpMod, 1);

		}

		callback(0, offBuild);

	});

}


exports.getModules = function(files, callback){

	getFunctions(files, function(err, funcs){

		if (err) {
			
			callback(err);

		} else {

			buildModules(funcs, function(err, mods){

				if(err){

					callback(err);

				}else{
					
					callback(0, mods);
					
				}
			});
		}
	});
};

