
var i2c = require('i2c-bus');
var i2c1 = i2c.openSync(1);
i2c1.writeByteSync(0x20, 0x12, 00000000);
  
  
console.log("MCP23017 init");
//var MCP23017 = {};
//MCP23017.scan = function (callBack) {
//	console.log("MCP23017 scan");
//	setInterval(function() {
//		 callBack({date:new Date()});
//	}, 1);	
//};
//
//module.exports = MCP23017;


//function scan(callBack) {
//	console.log("MCP23017 scan");
//	setInterval(function() {
//		 callBack({date:new Date()});
//	}, 1);	
//}
//
//module.exports.scan = scan;


function dec2bin(dec,length){
	  var out = "";
	  while(length--)
	    out += (dec >> length ) & 1;    
	  return out;  
}


module.exports.scan = function (callBack) {
	console.log("MCP23017 scan");
//	setInterval(function() {
//		 callBack({date:new Date()});
//	}, 1);	

	var lastAState = null;
	setInterval(function() {    
	      var dec = i2c1.readByteSync(0x20, 0x12); 
	      if(lastAState !== null && lastAState !== dec){           
	    	  var b =  dec2bin(dec,8).split('');         
//	          console.log(dec, b);
	          callBack({bin:b});
	      }
	      lastAState = dec;
	          
	    
	},1000);	
	
};



//module.exports.scan(function(data) {
//	  console.log("MCP23017: ", data);
//});