var fs = require("fs");
var path = require('path'),
    appDir = path.dirname(require.main.filename);

exports = module.exports = {};

exports.getModules = function(files, callback){

	getFunctions(files, function(err, funcs){
		if(err){
			callback(err);
		}else{	
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

function getFunctions(files, callback){

	readFiles(files, function(err, jqData){

		if(err){
			callback(err);
		}else{

			var funcList = extractFunctions(jqData);

			callback(0,funcList); 
		}

	});

};

function buildModules(funcList, callback){

	var onBuild = [],
		offBuild = [];

	fs.readFile(appDir+'/../lib/modules.json', 'utf8', function(err, data){
		
		if(err){
			callback(err);
		}
 
		modules = eval('('+data+')'); //Any risks using Eval here?

		for (var module in modules){

			offBuild.push(module);

			var funcNames =  modules[module];

			for (var i in funcList){
				
				if(funcNames.indexOf(funcList[i]) > 0){
					
					if(onBuild.indexOf(module) < 0 ){

						onBuild.push(module);

					}
				}
			}
		}

		for(var j in onBuild){
			
			var tmpMod = offBuild.indexOf(onBuild[j]);
			
			offBuild.splice(tmpMod, 1);

		}

		callback(0, offBuild);

	});

}
