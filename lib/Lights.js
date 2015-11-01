

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
	    	gpio.close(18);          
          });
	});
};	




