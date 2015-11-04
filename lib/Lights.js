
var gpio = null;

try {
	gpio = require("pi-gpio");

} catch (e) {
	console.error(e);
}



function gpioOn(pin){
	if(gpio === null){return;}
	gpio.open(pin, "output", function(err) {     
		gpio.write(pin, 1, function() {       
	    	gpio.close(pin);          
        });
	});	
}

function gpioOff(pin){
	if(gpio === null){return;}
	gpio.open(pin, "output", function(err) {    
		gpio.write(pin, 0, function() {           
	    	gpio.close(pin);          
        });
	});	
}




module.exports.StudioOn = function () {
	console.log("Light Studio On"); 
	gpioOn(18); //GPIO24
};	
module.exports.StudioOff = function () {
	console.log("Light Studio Off"); 
	gpioOff(18); //GPIO24
};


module.exports.CameraDaLetto2On = function () {
	console.log("Light CameraDaLetto2 On"); 
	gpioOn(22); //GPIO25
};	
module.exports.CameraDaLetto2Off = function () {
	console.log("Light CameraDaLetto2 Off"); 
	gpioOff(22); //GPIO25
};