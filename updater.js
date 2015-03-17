

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var os = require('os');

var child_process = require('child_process');

//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('view cache');
var server = app.listen(process.env.PORT || 8082, function () {
	var interfaces = os.networkInterfaces();
	var host = "";
	for (var k in interfaces) {
		if(interfaces.hasOwnProperty(k)) {
		    for (var k2 in interfaces[k]) {
		    	if(interfaces[k].hasOwnProperty(k2)) {
			        var address = interfaces[k][k2];
			        if (address.family === 'IPv4' && !address.internal) {
			        	host = address.address;
			        }
		    	}
		    }
		}
	}

  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});




app.post('/github', function(req, res) {

//      myExec();

    
	 
	var exec = child_process.exec;

	exec('forever stop app.js', function(error, output) {
		console.log(output);
		exec('git pull origin', function(error, output) {
			console.log(output);
			exec('npm install', function(error, output) {
				console.log(output);
				exec('forever start app.js', function(error, output) {
					console.log(output);
					exec('forever list', function(error, output) {
						console.log(output);
					});
				});
			});				
		});			
	});	
	
	
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



var myExec = function() {

	
//	var spawn = require('child_process').spawn('C:\\cygwin64\\bin\\mintty.exe', ['"E:\\LombardiaInformatica\\workspace\\home-system-node\\node-cd.sh"'], { 
//		  windowsVerbatimArguments: true
//	});
//	
//	spawn.stdout.on('data', function (data) { console.log(data.toString()); });
//	spawn.stderr.on('data', function (data) { console.log(data.toString()); });
//	spawn.on('error', function() { console.log(arguments); });
//	
//	
	
//	var spawn = require('child_process').spawn,
//	cp=spawn('i2cget', ['-y', '1', iicAddr, 0x12, 'w']);	
	
	
	var executionFile = "node-cd.bat";
	if(os.hostname().toLowerCase() === "raspberrypi"){
		executionFile = "node-cd.sh";
	}
	
    var exec = require('child_process').exec;
    var execCallback = function (error, stdout, stderr) {
    console.log(error, stdout.split("\r\n"), stderr.split("\r\n"));
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    };
    
    
    var child = exec("node-cd.bat", execCallback);
}
