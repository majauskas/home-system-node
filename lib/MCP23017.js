

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


module.exports.scan = function (callBack) {
	if(i2c1 === null){return;}
	console.log("MCP23017 scan");

	var lastAState = null;
	setInterval(function() {    
	      var dec = i2c1.readByteSync(MCP23017_ADDRESS, GPA); 
	      if(lastAState !== null && lastAState !== dec){           
	    	  var bytes  =  dec2bin(dec,8).split('');         
	          callBack({gpa : bytes});
	      }
	      lastAState = dec;
	},1000);	
	
};



//module.exports.scan(function(data) {
//	  console.log("MCP23017: ", data);
//});