

var gpio = require("/home/pi/node_modules/pi-gpio");

	gpio.open(18, "output", function(err) {     
	    gpio.write(18, 1, function() {         
	      gpio.close(18);   
	    });
	});
	
	
setTimeout(function() {	
console.log("off light");	
 
 
	gpio.open(18, "output", function(err) {     
	    gpio.write(18, 0, function() {         
	      gpio.close(18);   
	    });
	});
             
}, 5000);	



