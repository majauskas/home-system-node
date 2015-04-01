

var GPA = 0x12;
var GPB = 0x13;
var MCP23017_ADDRESS = 0x20;


var i2c1 = null;
try {
	var i2c = require('i2c-bus');
	i2c1 = i2c.openSync(1);
	//i2c1.writeByteSync(0x20, 0x12, 00000000);
	i2c1.writeByteSync(0x20,0x00,0x00); //Set all of bank A to outputs 
	i2c1.writeByteSync(0x20,0x01,0x00); //Set all of bank B to outputs
    //require('child_process').exec("python /home/pi/home-system-node/utils/mcp23017.py", function(err, stdout,stderr) {});
	
} catch (e) {
	console.error(e);
}

function dec2bin(dec,length){
	  var out = "";
	  while(length--)
	    out += (dec >> length ) & 1;    
	  return out;  
}


//module.exports.scan = function (callBack) {
//	if(i2c1 === null){return;}
//	console.log("MCP23017 scan");
//
//	var last_gpa_state = null;
//	var last_gpb_state = null;
//	setInterval(function() {    
//	      var gpa_state = i2c1.readByteSync(MCP23017_ADDRESS, GPA);
//	      var gpb_state = i2c1.readByteSync(MCP23017_ADDRESS, GPB); 
//	      
//	      if( (last_gpa_state !== null && last_gpa_state !== gpa_state) || (last_gpb_state !== null && last_gpb_state !== gpb_state) ) {           
//	    	  var bytes_gpa  =  dec2bin(gpa_state,8).split('');   
//	    	  var bytes_gpb  =  dec2bin(gpb_state,8).split('');
//	          callBack({gpa : bytes_gpa, gpb : bytes_gpb});
//	      }
//	      last_gpa_state = gpa_state;
//	      last_gpb_state = gpb_state;
//	},1000);	
//	
//};




module.exports.scan = function (callBack) {
	if(i2c1 === null){return;}

	var lastTime = new Date();
	var last_state = null;
	setInterval(function() {    
		
		var duration = Number(new Date() - lastTime);
		var current_state = dec2bin( i2c1.readByteSync(MCP23017_ADDRESS, GPA),8) + dec2bin(i2c1.readByteSync(MCP23017_ADDRESS, GPB),8);
		if( duration > 1400 && duration < 2600 && last_state !== current_state){
			console.log("OK",duration, current_state);	
			var last_array = last_state.split('');
			var current_array = current_state.split('');
			current_array.forEach(function(value, i) {
				
				if(last_array[i] !== value){
					var code = "0x20-GP" + ( (i<8) ? ("A"+i): ("B"+(i-8)));
					callBack({code: code, state : last_array[i] + value, date: new Date()});
				}
		    });	
		}

		last_state = current_state;
		lastTime = new Date();	

	},100);	
};





//var lastTime = new Date();
//var last_state = null;
//function scan(current_state, callBack){
//	
//	var duration = Number(new Date() - lastTime);
//	if( duration > 1400 && duration < 2600 && last_state !== current_state){
//		console.log("OK",duration, current_state);	
//		var last_array = last_state.split('');
//		var current_array = current_state.split('');
//		current_array.forEach(function(value, i) {
//			
//			if(last_array[i] !== value){
//				var code = "0x20-GP" + ( (i<8) ? ("A"+i): ("B"+(i-8)));
//				callBack({code: code, state : last_array[i] + value, date: new Date()});
//			}
//	    });	
//	}
//
//	last_state = current_state;
//	lastTime = new Date();		
//}