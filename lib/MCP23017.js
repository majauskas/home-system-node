


 
//exports.scan = function (callBack) {
//    console.log("MCP23017 scan");
//    
//    setInterval(function() {
//    	 callBack({date:new Date()});
//    }, 1);
//    
//   
//
//};    


//exports.MCP23017 = function (callBack) {
//    console.log("MCP23017 scan");
//    
//    setInterval(function() {
//    	 callBack({date:new Date()});
//    }, 1);
//    
//   
//
//};
//
//
//global.MCP23017 = MCP23017;

console.log("MCP23017 init");
var MCP23017 = {};

MCP23017.scan = function (callBack) {
	console.log("MCP23017 scan");
	setInterval(function() {
		 callBack({date:new Date()});
	}, 1);	
};

module.exports = MCP23017;