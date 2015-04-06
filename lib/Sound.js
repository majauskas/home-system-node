
var child_process = require('child_process');
var exec = child_process.exec;

var gpio = null;
try {
	gpio = require("pi-gpio");
} catch (e) {
	console.error(e);
}

module.exports.playMp3 = function (file, volume) {
	 
	if(gpio === null){return;}
	
	console.log("Sound playMp3");
	
	gpio.open(12, "output", function(err) {     // Open pin 12 for output 
	    gpio.write(12, 1, function() {          // Set pin 12 high (1) 
	         
	        console.log("amixer set 'PCM' "+volume+"% && mpg321 "+file);
	        var child = exec("amixer set 'PCM' "+volume+"% && mpg321 "+file, function(err, stdout,stderr) {
	        	console.log(err);
	          gpio.write(12, 0, function() {
	            gpio.close(12);
	          });
          
          
          });
	    });
	});	

};

module.exports.kill = function () {
	 
	if(gpio === null){return;}
	
	console.log("kill mp3");
	
	exec("kill -9 $(ps aux | grep 'mpg321' | awk '{print $2}')");	

};



//module.exports.playMp3(function(data) {
//	  console.log("MCP23017: ", data);
//});