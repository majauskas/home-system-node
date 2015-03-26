
var gpio = require("pi-gpio");
var child_process = require('child_process');
var exec = child_process.exec;
console.log("Sound init");

module.exports.playMp3 = function (file) {
	console.log("Sound playMp3");
	
	gpio.open(12, "output", function(err) {     // Open pin 12 for output 
	    gpio.write(12, 1, function() {          // Set pin 12 high (1) 
	         
	        
	        var child = exec('mpg321 -g 35 '+file, function(err, stdout,stderr) {
          
//	          console.log(err);
	          gpio.write(12, 0, function() {
	            gpio.close(12);
	          });
          
          
          });
	    });
	});	

};

//module.exports.playMp3(function(data) {
//	  console.log("MCP23017: ", data);
//});