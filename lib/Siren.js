

var gpio = null;
var sirenInrevalId = null;
try {
	gpio = require("pi-gpio");
} catch (e) {
	console.error(e);
}


function onSiren(){
	
	gpio.open(16, "output", function(err) {     
	    gpio.write(16, 1, function() {         
	        setTimeout(function() {
			       gpio.write(16, 0, function() {
			    	   gpio.close(16);
			       });      
		    }, 5000);
	    });
	});
	
}

module.exports.on = function () {
	if(gpio === null){return;}
	console.log("Siren On");
	onSiren();
	
	sirenInrevalId = setInterval(onSiren, 6000);	

};

module.exports.off = function () {
	if(gpio === null || sirenInrevalId === null){return;}
	console.log("Siren Off");
	clearInterval(sirenInrevalId);
};

		