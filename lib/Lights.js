

var gpio = null;
try {
	gpio = require("pi-gpio");
} catch (e) {
	console.error(e);
}

module.exports.StudioOn = function () {
	if(gpio === null){return;}
	console.log("Lights StudioOn");
	

	
	gpio.open(18, "output", function(err) {     // Open pin 18 GPIO24for output 
		gpio.write(18, 1, function() {          // Set pin 18 GPIO24 high (1) 
	    	gpio.close(18);          
          });
	});
};	


module.exports.StudioOff = function () {
	 
	if(gpio === null){return;}
	console.log("Lights StudioOff");
	
	gpio.open(18, "output", function(err) {     // Open pin 18 GPIO24for output 
		gpio.write(18, 0, function() {          // Set pin 18 GPIO24 low (0) 
	    	gpio.close(18);          
          });
	});
};




