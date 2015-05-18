
var express = require('express');
var app = express();
var child_process = require('child_process');


var server = app.listen(process.env.PORT || 8082, function () {
  console.log('app listening at ... 8082');
});

app.post('/github', function(req, res) {
	
	var exec = child_process.exec;
	console.log("\n\n\n------------- UPDATING ------ ");
	
	exec('cd /home/pi/home-system-node/ && sudo forever stop /home/pi/home-system-node/app.js && sudo git pull origin && sudo npm install && sudo forever start -l /home/pi/logs-home-system-node.log -e /home/pi/logs-home-system-node.err /home/pi/home-system-node/app.js', function(error, output) {
		console.log("\n\n"+error, output);
	});	
	
	 res.writeHead(200);
	 res.end();
  	
	
});
