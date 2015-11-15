

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
	 i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, 0x00);
	 i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRB, 0x00);	 
} catch (e) {
	console.error(e);
}

function sleep(milliseconds) {

      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
              break;
          }
      }
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

function binArray2dec(num){
    return num.reduce(function(x, y, i){
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
}




function readPin(address, gpio, pin) {
	if(i2c1 === null){return;}
	
	var GPIO = GPIOA;
	
	if (gpio === "B") {
		GPIO = GPIOB;
	}
	var bytes = dec2bin(i2c1.readByteSync(address, GPIO), 8).split("").reverse();
	return bytes[pin];
}


  
function writePin(address, gpio, pin, newPinValue){
	if(i2c1 === null){return;}
	
  var GPIO = GPIOA;
  var IODIR = IODIRA; 
  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB;}

  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse();
  
  var oldPinValue =  bytes[pin];
  if(oldPinValue === newPinValue+""){
     console.log("pin "+pin+" oldValue === newValue: nothing to do", newPinValue);
     return newPinValue;
  }
  bytes[pin] = newPinValue;
     console.log(bytes);
 i2c1.writeByteSync(address, IODIR, bin2dec(bytes.join("")));

  return newPinValue;
  
}

function switchPin(address, gpio, pin){
	if(i2c1 === null){return;}

	console.log("MCP23017 ", "0x22-GP"+gpio+pin, new Date());
	
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB;}
	
	  

	   
	  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse();
	  console.log("read",bytes[pin]);
	
	  
	  var oldPinValue =  bytes[pin];
	  var newPinValue = "0";
	  if(oldPinValue === "0"){
	        newPinValue = "1"; 
	  }
	  bytes[pin] = newPinValue;
	  var  write =  bytes[pin];
	  console.log("write", write);
  
	  i2c1.writeByteSync(address, IODIR, bin2dec(bytes.join("")));
  
 return newPinValue;

} 

//readPin(MCP23017_ADDRESS_0x22, GPIOA, 7);   
// writePin(MCP23017_ADDRESS_0x22, "A", 7, 0);
 //switchPin(MCP23017_ADDRESS_0x22, "A", 6); 


module.exports.studioOnOff = function () {
	var state = switchPin(MCP23017_ADDRESS_0x22, "A", 7);
	console.log("Light Studio on/off: ", state);
	return state;
};	


module.exports.cameraDaLettoSoffitoOnOff = function () {
	var state = switchPin(MCP23017_ADDRESS_0x22, "A", 0);
	console.log("Light camera da letto soffito on/off: ", state);
	return state;
};	


module.exports.cameraDaLettoMuroOnOff = function () {
	var state = switchPin(MCP23017_ADDRESS_0x22, "A", 6);
	console.log("Light camera da letto muro on/off: ", state);
	return state;
};	




//
//
//function gpioOn(pin){
//	if(gpio === null){return;}
//	gpio.open(pin, "output", function(err) {     
//		gpio.write(pin, 1, function() {       
//	    	gpio.close(pin);          
//        });
//	});	
//}
//
//function gpioOff(pin){
//	if(gpio === null){return;}
//	gpio.open(pin, "output", function(err) {    
//		gpio.write(pin, 0, function() {           
//	    	gpio.close(pin);          
//        });
//	});	
//}
//
//
//
//
//module.exports.StudioOn = function () {
//	console.log("Light Studio On"); 
//	gpioOn(18); //GPIO24
//};	
//module.exports.StudioOff = function () {
//	console.log("Light Studio Off"); 
//	gpioOff(18); //GPIO24
//};
//
//
//module.exports.CameraDaLettoOn = function () {
//	console.log("Light CameraDaLetto2 On"); 
//	gpioOn(32); //GPIO12
//};	
//module.exports.CameraDaLettoOff = function () {
//	console.log("Light CameraDaLetto2 Off"); 
//	gpioOff(32); //GPIO12
//};
//
//
//module.exports.CameraDaLetto2On = function () {
//	console.log("Light CameraDaLetto2 On"); 
//	gpioOn(22); //GPIO25
//};	
//module.exports.CameraDaLetto2Off = function () {
//	console.log("Light CameraDaLetto2 Off"); 
//	gpioOff(22); //GPIO25
//};