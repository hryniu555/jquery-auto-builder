var fs = require("fs");
var path = require('path'),
    appDir = path.dirname(require.main.filename);

exports = module.exports = {};

function readFiles(files, callback){

	var jqData = "";
	var j = 0; 

	for ( var i = 0 ; i < files.length ; i++ ){

		fs.readFile(files[i], 'utf8', function(err, data){

			if(err){

				callback(err);
			
			}else{

				jqData += data;
			
				if(j === (files.length - 1)){
					
					callback(0, jqData);
			
				}else{
			
					j++;
			
				}
			}
		});
	}

}


function extractFunctions(jqString){



	var regex = /\)\.([a-zA-Z]+)\(/g;

	var toSanitization = jqString.match(regex, "");

	var sanitezed = [];

	toSanitization.forEach(function(funcName){

		sanitezed.push(funcName.substring(2, (funcName.length - 1)));
	
	});

	return sanitezed;
	
}

exports.getFunctions = function(files, callback){

	readFiles(files, function(err, jqData){

		if(err){
			callback(err);
		}else{

			if(jqData instanceof Error){

				callback(jqData);

			}

			var funcList = extractFunctions(jqData);

			callback(0,funcList); 
		}

	});

};

exports.getModules = function(funcList, callback){

	var modules = {};

	var onBuild = [];

	fs.readFile(appDir+'/../lib/modules.json', 'utf8', function(err, data){
		
		if(err){
			callback(err);
		}
 
		modules = eval('('+data+')'); //Any risks using Eval here?

		for (var module in modules){

			var funcNames =  modules[module];

			for (var index in funcList){

				if(funcNames.indexOf(funcList[index]) !== -1){

					onBuild.push(module);

				}

			}
		}

		callback(0, onBuild);

	});
};