

var MCP23017_ADDRESS_0x21 = 0x21;
var MCP23017_ADDRESS_0x22 = 0x22;


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
	 
	 i2c1.writeByteSync(MCP23017_ADDRESS_0x21, IODIRA, 0x00); //Set all of bank A to outputs 
	 i2c1.writeByteSync(MCP23017_ADDRESS_0x21, IODIRB, 0x00); //Set all of bank B to outputs		
	 
	 
} catch (e) {
	console.error(e);
}


function dec2bin(dec,length){
	  var out = "";
	  while(length--)
	    out += (dec >> length ) & 1;    
	  return out;  
}

function bin2dec(num){
    return num.split('').reduce(function(x, y, i){
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
}



module.exports.scan = function (callBack) {
	if(i2c1 === null){return;}
	
	var last_state = null;
	setInterval(function() {
		
		var current_state = dec2bin( i2c1.readByteSync(MCP23017_ADDRESS_0x21, GPIOA), 8).split("").reverse().join("") +  dec2bin( i2c1.readByteSync(MCP23017_ADDRESS_0x21, GPIOB), 8).split("").reverse().join("");
		
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
  					var code = "0x21-GP" + ( (i<8) ? ("A"+i): ("B"+(i-8)));
  					console.log(code, new Date());
	  				callBack({code: code, date: new Date()});
  				}
  		    });	

		}		
	},100);	
	
};





module.exports.getPinStatus = function (address, gpio, pin) {
	  if(i2c1 === null){return;}
	  var GPIO = GPIOA;
	  if(gpio === "B"){ GPIO = GPIOB;}
	  
	  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse(); 
	  
	  var currentState = "off";
	  if(bytes[pin] === "1"){
		  currentState = "on";
	  }
	  return currentState;
}

module.exports.allOn = function (address, gpio) {
	  if(i2c1 === null){return;}
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}
	  i2c1.writeByteSync(address, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec("11111111"));
};

module.exports.allOff = function (address, gpio) {
	  if(i2c1 === null){return;}
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}
	  i2c1.writeByteSync(address, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec("00000000"));
};

module.exports.writePin = function (address, gpio, pin, newPinValue) {
	  if(i2c1 === null){return;}
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}

	  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse();
	  var oldPinValue =  bytes[pin];
	  if(oldPinValue === newPinValue+""){
	     console.log("pin "+pin+" oldValue === newValue: nothing to do", newPinValue);
	     return newPinValue;
	  }
	  bytes[pin] = newPinValue;
	
	  i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec(bytes.join("")));
	
	  return newPinValue;
};

module.exports.switchPin = function (address, gpio, pin) {
	  if(i2c1 === null){return;}
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}
	 
	  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse();
	  
	  var oldPinValue =  bytes[pin];
	  var newPinValue = "0";
	  if(oldPinValue === "0"){
	        newPinValue = "1"; 
	  }
	  bytes[pin] = newPinValue;
	  
	  i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec(bytes.join("")));
	  
	  var currentState = "off";
	  if(newPinValue === "1"){
		  currentState = "on";
	  }
	  console.log("0x22-GP"+gpio+pin, currentState, new Date());
	  
	  return currentState;

}; 


