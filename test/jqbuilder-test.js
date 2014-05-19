var expect = require('chai').expect;
var jqb = require('../lib/jqBuilder');

describe('jqBuilder', function(){
	/*describe('#readFiles()', function(){
		it('should return a string containing the files concatenated.', function(done){

			var files = [
				"examples/jquery-sample-1.js",
				"examples/jquery-sample-2.js"
				];

			var filesData = "$('#ele').fadeIn();$('#ele').fadeOut();$('#ele-2').css('top','35px');";
			
			jqb.readFiles(files, function(err, data){
				
				if(err){ 
					return done(err); 
				}

				var jqData = data;
				
				expect(jqData).to.be.a('string');
				
				expect(jqData).to.equal(filesData);

				done();
			});

		});
	});*/
	describe('#getFunctions()', function(){
		it('should return a list of jQuery functions been used.', function(done){

			var files = [
				"examples/jquery-sample-1.js",
				"examples/jquery-sample-2.js"
			];

			var functionsList = ['fadeIn', 'fadeOut', 'css'];

			jqb.getFunctions(files, function(err, data){

				if(err){
					return done(err);
				}

				var jqFunc = data;
				

				expect(jqFunc).to.be.an('array');
				expect(jqFunc).to.have.length(3);
				
			});

		});
	});
});