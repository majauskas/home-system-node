

var GPA = 0x12;
var GPB = 0x13;
var MCP23017_ADDRESS = 0x20;

var IODIRA = 0x00; // IO direction for port A
var IODIRB = 0x01; // IO direction for port B
var GPIOA = 0x12; // used for reading port A
var GPIOB = 0x13; // used for reading port B
var OLATA = 0x14; // used for writing port A
var OLATB = 0x15; // used for writing port B


var i2c1 = null;
try {
	var i2c = require('i2c-bus');
	i2c1 = i2c.openSync(1);
//	i2c1.writeByteSync(MCP23017_ADDRESS, IODIRA, 0x00); //Set all of bank A to outputs 
//	i2c1.writeByteSync(MCP23017_ADDRESS, IODIRB, 0x00); //Set all of bank B to outputs
	
	i2c1.writeByteSync(MCP23017_ADDRESS, OLATA, 0x00); //Set all of bank A to outputs 
	i2c1.writeByteSync(MCP23017_ADDRESS, IODIRB, 0x00); //Set all of bank B to outputs	
	
} catch (e) {
	console.error(e);
}

function dec2bin(dec,length){
	  var out = "";
	  while(length--)
	    out += (dec >> length ) & 1;    
	  return out;  
}

	
	var last_state = null;
	setInterval(function() {
		
//		var current_state = dec2bin( i2c1.readByteSync(MCP23017_ADDRESS, GPIOA),8) + dec2bin(i2c1.readByteSync(MCP23017_ADDRESS, GPIOB),8);
		
		var current_state = dec2bin( i2c1.readByteSync(MCP23017_ADDRESS, GPIOA), 8);
		current_state = current_state.split("").reverse().join("");
		
		i2c1.writeByteSync(MCP23017_ADDRESS, IODIRA, 0x00);
		
		if(last_state === null){
			last_state = current_state;
			return;
		}
		
		if(last_state !== current_state){
  			var last_array = last_state.split('');
  			var current_array = current_state.split('');
  			last_state = current_state;
  			current_array.forEach(function(value, i) {
  				
  				if(last_array[i] !== value){
  					var code = "0x20-GP" + ( (i<8) ? ("A"+i): ("B"+(i-8)));
  					console.log(last_state, current_state, code);
  					if("0x20-GPA2".indexOf(code) >= 0){
  						console.log("OKKKKKKKKKKKKKKKKKK ", code);
//	  					callBack({code: code, date: new Date()});
  					}
  				}
  		    });	
//  			last_state = current_state;
		}		
	},500);	//100
	
//};


