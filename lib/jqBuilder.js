var fs = require("fs");
var async = require("async");

exports = module.exports = {};

function readFiles(files, callback){

	var jqData = "";

	async.map(files, function(file, callback){
		
		fs.readFile(file, 'utf8', function(err, data){						
			if(err){
				callback("Error: Can't read file " + file);
			}else{
				jqData += data;
				callback();
			}
		});
	
	}, function(err){

		if(err){
			callback(err);
			process.exit(1);
		}else{

			jqData = jqData.replace(/[\n\t\r]/g,"").trim();

			callback(0, jqData);
		}
	
	});
}

function extractFunctions(jqString){

	console.log("Sanitizing...:"+jqString);

	var regex = /\)\.([a-zA-Z]+)\(/g;

	var toSanitization = jqString.match(regex, "");

	var sanitezed = [];

	toSanitization.forEach(function(funcName){

		sanitezed.push(funcName.substring(2, (funcName.length - 1)));
	
	});

	return sanitezed;
	
}

exports.getFunctions = function(files, callback){

	readFiles(files, function(err, data){

		if(err){
			
			callback(err);

		}else{

			var functions = extractFunctions(data);

			callback(0, functions);
		}
	});

};