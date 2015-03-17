

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var os = require('os');

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

	console.log("exports.github");
	
//  var authorizedIps = config.security.authorizedIps;
//  var githubIps = config.security.githubIps;
//  var payload = req.body.payload;
//
//  console.log('From IP Address:', req.ip);
//  console.log('payload', payload);
//
//  if (payload && (inAuthorizedSubnet(req.ip) || authorizedIps.indexOf(req.ip) >= 0 || githubIps.indexOf(req.ip) >= 0)){
//    payload = JSON.parse(payload);
//
//    if (payload.ref === config.repository.branch || payload.ref === 'refs/heads/master' || payload.ref === 'refs/heads/develop'){
//      myExec();
//    }

    res.writeHead(200);
//  } else {
//    res.writeHead(403);
//  }
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
