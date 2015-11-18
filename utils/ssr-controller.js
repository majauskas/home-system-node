

var MCP23017_ADDRESS_0x21 = 0x21;
var MCP23017_ADDRESS_0x22 = 0x22;

var IODIRA = 0x00; // IO direction for port A
var IODIRB = 0x01; // IO direction for port B
var GPIOA = 0x12; // used for reading port A
var GPIOB = 0x13; // used for reading port B
var OLATA = 0x14; // used for writing port A
var OLATB = 0x15; // used for writing port B


var i2c = require('/home/pi/node_modules/i2c-bus');
var i2c1 = i2c.openSync(1);


//switchPin(MCP23017_ADDRESS_0x22, "A", 7); //studio
//switchPin(MCP23017_ADDRESS_0x22, "A", 6); //camera da letto muro
//switchPin(MCP23017_ADDRESS_0x22, "A", 5); //coridoio
//switchPin(MCP23017_ADDRESS_0x22, "A", 4); //cameretta
//switchPin(MCP23017_ADDRESS_0x22, "A", 3); //camera da letto soffito
//console.log(getPinStatus(MCP23017_ADDRESS_0x22, "A", 7));
//allOff(MCP23017_ADDRESS_0x22, "A");
//allOn(MCP23017_ADDRESS_0x22, "A");

  



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




function getPinStatus(address, gpio, pin){
	  var GPIO = GPIOA;
	  if(gpio === "B"){ GPIO = GPIOB;}
	  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse(); 
	  
	  var currentState = "off";
	  if(bytes[pin] === "1"){
		  currentState = "on";
	  }
	  return currentState;
}

function allOn(address, gpio){
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}
	  i2c1.writeByteSync(address, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec("11111111"));
}

function allOff(address, gpio){
	  var GPIO = GPIOA;
	  var IODIR = IODIRA; 
	  var OLAT = OLATA;
	  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB; OLAT = OLATB;}
	  i2c1.writeByteSync(address, IODIR, 0x00);
	  i2c1.writeByteSync(address, OLAT, bin2dec("00000000"));
}

function writePin(address, gpio, pin, newPinValue){

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
}

function switchPin(address, gpio, pin){

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

}




 

//s.2
//	
// switchPin(MCP23017_ADDRESS_0x22, "A", 1);
// 
//},2000);


  
    // i2c1.closeSync();

  





                                            
//i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, bin2dec("11111111"));
//i2c1.closeSync();
         
//var data = new Buffer([0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01]);

//i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, Array.prototype.slice.call(data, 0));
 
// i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, 0xFF); //11111111        

//var digit = bin2dec("11111110");                                                                      
//i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, digit);   
  //i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, 0x7F); //01111111 
  // i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, 0xFF); //11111111 
 // i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, 0xBF); //10111111 
 
 //   i2c1.writeQuickSync(MCP23017_ADDRESS_0x22, bin2dec("0000000011111111")) ;
  // Start temperature conversion
  //i2c1.sendByteSync(MCP23017_ADDRESS_0x22, 0xFF);
  // bin2dec("0000000011111111")
  

//  console.log("0x22-GPA", dec2bin( i2c1.readByteSync(MCP23017_ADDRESS_0x22, GPIOA), 8).split("").reverse().join(""));
//  console.log("0x22-GPB", dec2bin( i2c1.readByteSync(MCP23017_ADDRESS_0x22, GPIOB), 8).split("").reverse().join("")); 
   //i2c1.writeByteSync(MCP23017_ADDRESS_0x22, IODIRA, digit); 
  
  
  
 // i2c1.closeSync();           


//i2c1 = i2c.openSync(1);

