
var express = require('express');
var app = express();
var child_process = require('child_process');

var server = app.listen(process.env.PORT || 8082, function () {
  console.log('app listening at ... 8082');
});

app.post('/github', function(req, res) {
//	forever start /home/pi/home-system-node/updater.js 
	var exec = child_process.exec;
	console.log("\n\n\n------------- UPDATING ------ ");
	
	exec('cd /home/pi/home-system-node/ && sudo forever stop /home/pi/home-system-node/app.js && sudo git pull origin && sudo npm install && sudo forever start /home/pi/home-system-node/app.js', function(error, output) {
		console.log("\n\n"+error, output);
	});	
//	exec('cd /home/pi/home-system-node/', function(error, output) {
//		console.log("\n\n /home/pi/home-system-node/"+output);	
//		exec('forever stop app.js', function(error, output) {
//			console.log("\n\n"+output);
//			exec('git pull origin', function(error, output) {
//				console.log("\n\n"+output);
//				exec('npm install', function(error, output) {
//					console.log("\n\n"+output);
//					exec('forever start app.js', function(error, output) {
//						console.log("\n\n"+output);
//						setTimeout(function() {
//							exec('forever list', function(error, output) {
//								console.log("\n\n"+output);
//							});						
//						}, 1000);
//						
//	
//					});
//				});				
//			});			
//		});	
//	});	
	
	
//	var child = exec("forever stop app.js", {silent:true}, {async:true});
//	child.stdout.on('data', function(data) {console.log('data:', data);});
//	child.on('error', function() { console.log(arguments); });
//	
//	child = exec("git pull origin", {silent:true}, {async:true});	
//	child.stdout.on('data', function(data) {console.log('data:', data);});
//	child.on('error', function() { console.log(arguments); });
//	
//	child = exec("npm install", {silent:true}, {async:true});	
//	child.stdout.on('data', function(data) {console.log('data:', data);});
//	child.on('error', function() { console.log(arguments); });
//	
//	
//	child = exec("forever start app.js", {silent:true}, {async:true});	
//	child.stdout.on('data', function(data) {console.log('data:', data);});
//	child.on('error', function() { console.log(arguments); });
//	
	
	
	 res.writeHead(200);
	 res.end();
  	
	
});



//var myExec = function() {
//
//	
//	
//	var executionFile = "node-cd.bat";
//	if(os.hostname().toLowerCase() === "raspberrypi"){
//		executionFile = "node-cd.sh";
//	}
//	
//    var exec = require('child_process').exec;
//    var execCallback = function (error, stdout, stderr) {
//    console.log(error, stdout.split("\r\n"), stderr.split("\r\n"));
//      if (error !== null) {
//        console.log('exec error: ' + error);
//      }
//    };
//    
//    
//    var child = exec("node-cd.bat", execCallback);
//}
