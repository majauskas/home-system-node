

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
var i2c1_21 = i2c.openSync(1);

i2c1_21.writeByteSync(MCP23017_ADDRESS_0x21, IODIRA, 0x00); //Set all of bank A to outputs 
i2c1_21.writeByteSync(MCP23017_ADDRESS_0x21, IODIRB, 0x00); //Set all of bank B to outputs		
 
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






function scan (callBack) {
	
	if(i2c1_21 === null){return;}
	
	
	var lastTime = new Date();
	
	var last_state = null;
	
	var last_code = null;
	
	setInterval(function() {
		
		var current_state_a = dec2bin(i2c1_21.readByteSync(MCP23017_ADDRESS_0x21, GPIOA), 8).split("").reverse().join("");
//		var current_state = current_state_a +  dec2bin( i2c1_21.readByteSync(MCP23017_ADDRESS_0x21, GPIOB), 8).split("").reverse().join("");
		var current_state = current_state_a +  "00000000";
		
		i2c1_21.writeByteSync(MCP23017_ADDRESS_0x21, IODIRA, 0x00);
		i2c1_21.writeByteSync(MCP23017_ADDRESS_0x21, IODIRB, 0x00);	
		
		if(last_state === null){
			last_state = current_state;
			return;
		}
		
		if(last_state !== current_state){
			var duration = Number(new Date() - lastTime);

  			if( duration > 400){
  				
  	  			var last_array = last_state.split('');
  	  			var current_array = current_state.split('');
//  	  			last_state = current_state;
  	  			
		  			current_array.forEach(function(value, i) { 
		  				
		  				if(last_array[i] !== value){
		  					var code = "0x21-GP" + ( (i<8) ? ("A"+i): ("B"+(i-8)));
		  					setTimeout(function() {
		  						last_code = null;
		  					}, 50);
		  					if(last_code !== null) return;
		  					last_code = code;
		  					console.log(code, current_state, current_state_a, new Date()); 
//		  					setTimeout(function() {
		  						callBack({code: code, date: new Date()});
//		  						i2c1_21.writeByteSync(MCP23017_ADDRESS_0x21, IODIRA, 0x00);
//		  						var current_state_a = dec2bin(i2c1_21.readByteSync(MCP23017_ADDRESS_0x22, GPIOA), 8).split("").reverse().join("");
//		  						console.log(current_state_a);
//		  					}, 100);
//		  					return;
			  				
		  				}
		  		    });	
  			}
  	  		last_state = current_state;
  	  		lastTime = new Date();
  			
		}		
	},100);	
	
};

















function readPin(address, gpio, pin){
  var bytes = dec2bin( i2c1.readByteSync(address, gpio), 8).split("").reverse(); 
  return  bytes[pin];
}


  
function writePin(address, gpio, pin, newPinValue){

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

  var GPIO = GPIOA;
  var IODIR = IODIRA; 
  if(gpio === "B"){ GPIO = GPIOB; IODIR = IODIRB;}

   
 
  var bytes = dec2bin( i2c1.readByteSync(address, GPIO), 8).split("").reverse();
  
//  console.log("read",bytes[pin]);
  console.log("0x22-GP"+gpio+pin, bytes.join(""), bytes[pin], new Date());
  
  var oldPinValue =  bytes[pin];
  var newPinValue = "0";
  if(oldPinValue === "0"){
        newPinValue = "1"; 
  }
  bytes[pin] = newPinValue;
  var  write =  bytes[pin];
//  console.log("write", write);
  

  
 i2c1.writeByteSync(address, IODIR, bin2dec(bytes.join("")));

 
 return newPinValue;

}   





//scan(function(data) {  
//
//	
//	if(data.code === "0x21-GPA4"){
//		
//		switchPin(MCP23017_ADDRESS_0x22, "A", 1); //cameretta 
//		  
//	}	 	
//	
//	if(data.code === "0x21-GPA7"){
//		 
//		switchPin(MCP23017_ADDRESS_0x22, "A", 7);//studio
//		  
//	}
//	if(data.code === "0x21-GPA6"){
//		  
//		switchPin(MCP23017_ADDRESS_0x22, "A", 6);
//		switchPin(MCP23017_ADDRESS_0x22, "A", 0);
//		  
//	}
//
//	if(data.code === "0x21-GPA5"){
//		
//		switchPin(MCP23017_ADDRESS_0x22, "A", 5); //coridorio
//		  
//	}
//
//});


 

setInterval(function() {
	
 switchPin(MCP23017_ADDRESS_0x22, "A", 0);
 
},2000);









   //readPin(MCP23017_ADDRESS_0x22, GPIOA, 7);   
  // writePin(MCP23017_ADDRESS_0x22, "A", 7, 0);
   //switchPin(MCP23017_ADDRESS_0x22, "A", 6); 
  
  
    // i2c1.closeSync();

  
 // var bytes = dec2bin( i2c1.readByteSync(MCP23017_ADDRESS_0x22, IODIRA), 8).split("").reverse();
 // console.log(bytes);




                                            
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

