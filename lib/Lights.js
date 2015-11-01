
var child_process = require('child_process');
var exec = child_process.exec;

var gpio = null;
try {
	gpio = require("pi-gpio");
} catch (e) {
	console.error(e);
}

module.exports.StudioOn = function () {
	 
	if(gpio === null){return;}
	console.log("Lights StudioOn");
	
	gpio.open(18, "output", function(err) {     // Open pin 12 for output 
	    gpio.write(18, 1, function() {          // Set pin 12 high (1) 
	         
//	        console.log("amixer set 'PCM' "+volume+"% && mpg321 "+file);
//	        var child = exec("amixer set 'PCM' "+volume+"% && mpg321 "+arg+" "+file, function(err, stdout,stderr) {
//	        	console.log(err);
//	          gpio.write(18, 0, function() {
//	            gpio.close(18);
//	          });
          
          
          });
	    });
	});	

};



