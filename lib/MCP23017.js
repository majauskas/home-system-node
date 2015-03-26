

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


module.exports.scan = function (callBack) {
	console.log("MCP23017 scan");
	setInterval(function() {
		 callBack({date:new Date()});
	}, 1);	
};