
var i2c1 = null;
try {
	var i2c = require('i2c-bus');
	i2c1 = i2c.openSync(1);
	i2c1.writeByteSync(0x20, 0x12, 00000000);
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
	      var dec = i2c1.readByteSync(0x20, 0x12); 
	      if(lastAState !== null && lastAState !== dec){           
	    	  var b =  dec2bin(dec,8).split('');         
	          callBack({bin:b});
	      }
	      lastAState = dec;
	},1000);	
	
};



//module.exports.scan(function(data) {
//	  console.log("MCP23017: ", data);
//});