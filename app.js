

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var os = require('os');
var email = require('./email.js');
//var gpio = require("pi-gpio");


//var play = require('play').Play();
//play.sound('mail666.wav');
//
////var player = require('play-sound')(opts = {})
////player.play('e://the-man-aloe-blacc.mp3') // $ mplayer foo.mp3  
//
//return;


//var request = require('request');
//request({'url':'http://www.google.com',
//        'proxy':'http://miajausk:li8d1toy@10.211.1.100:8080'}, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        console.log(body);
//    }
//});
//return;



//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(process.env.PORT || 8081, function () {
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

app.get('/home-system', function(req, res) {
	fs.readFile(__dirname+'/public/index.html', function(error,data) {
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.end(data);
    });
});








// Web Socket Connection
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
	
//	socket.on('getWifiSensors', function (arg1,arg2, back) {
//		back();
//	});	
	
	socket.on('switchOffSiren', function(arg1) {
		switchOffSiren();
	});	
		

});






function switchOnSiren(sensor) {
	//sending to client the notification
	io.sockets.emit("ALARM_DETECTION", sensor);
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Sirena allarme attivata", description: sensor.name + " " + sensor.description}}, function (err, data) {});
	
	email("Sicurezza di casa violata", sensor.name + " " + sensor.description + "\n Sirena allarme attivata");
	
	//TODO: activate the siren and email/sms notifications
//	gpio.open(16, "output", function(err) {     // Open pin 16 for output 
//	    gpio.write(16, 1, function() {          // Set pin 16 high (1) 
//	        gpio.close(16);                     // Close pin 16 
//	    });
//	});
	
}


function switchOffSiren() {
	
	AlarmState.create({state: "OFF", provider:"system", date: new Date()}, function (err, data) {});
	io.sockets.emit("change-alarm-state", {state:"OFF"});	
	
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Sirena allarme disattivata", description:""}}, function (err, data) {});
	
//	gpio.open(16, "output", function(err) { // Open pin 16 for output
//		gpio.write(16, 0, function() { // Set pin 16 high (1)
//			gpio.close(16); // Close pin 16
//		});
//	});
}







if(os.hostname().toLowerCase() === "minde-pc" || os.hostname().toLowerCase() === "raspberrypi"){
	mongoose.connect('mongodb://192.168.0.21/home-system');
}else{
	mongoose.connect('mongodb://10.221.160.78/home-system');
} 
 
var Schema = mongoose.Schema;




//-----------AlarmState---------------------------------------------
var AlarmStateSchema = new Schema({
	state: String,
	user: String,
	provider: String,
	date: Date
});
mongoose.model('AlarmState', AlarmStateSchema); 
var AlarmState = mongoose.model('AlarmState');


app.get('/AlarmState', function(req, res) {
	AlarmState.findOne({}).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.post('/AlarmState', function(req, res) {
	AlarmState.create(req.body, function (err, data) {
		io.sockets.emit("change-alarm-state", data);
	    res.send(data);
	 });
});





//-----------WifiSensor---------------------------------------------
var WifiSensorSchema = new Schema({
	code: Number,
	binCode: String,	
	name: String,
	description: String,
	isOpen: {type : Boolean, 'default': null},
	isBatteryLow: {type : Boolean, 'default': null},
	date: Date	
});
mongoose.model('WifiSensor', WifiSensorSchema); 
var WifiSensor = mongoose.model('WifiSensor');



app.get('/WifiSensor', function(req, res) {
	WifiSensor.find({}).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.get('/WifiSensor/:code', function(req, res) {
	WifiSensor.find(req.params).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.put('/WifiSensor', function(req, res) {
	WifiSensor.update({code : req.body.code}, req.body, {upsert : true}, function (err, data) {
        res.send({});
	});	
});
app.del('/WifiSensor', function(req, res) {
	WifiSensor.remove(req.body, function (err, data) {
		 res.send({});
	 });
});



//-----------Area---------------------------------------------
var AreaSchema = new Schema({
	name : {type : String, required : true, unique: true, trim: true},
	description : String,
	wifisensors: [WifiSensorSchema],
	date: {type : Date, 'default': Date.now()}	
	
});
mongoose.model('Area', AreaSchema); 
var Area = mongoose.model('Area');

app.post('/Area', function(req, res) {
	Area.create(req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});		
	
});
app.put('/Area/:id', function(req, res) {
	Area.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});


app.put('/Area/wifisensors/:id', function(req, res) {
	Area.findByIdAndUpdate(req.params.id, {'$set':  {'wifisensors': new Area(req.body).wifisensors}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});


app.get('/Area', function(req, res) {
	Area.find({}).sort('date').populate('wifisensors').exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send(data); }
	});		
});

app.del('/Area/:id', function(req, res) {
	Area.remove({_id : req.params.id}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	 });
});


//----------- Events ---------------------------------------------
var EventSchema = new Schema({
	code : {type : Number},
	binCode : {type : String},
	description : String,
	date: {type : Date},
	device : { 
		provider : String,
		name : String,
		description : String,
		isLock : Boolean,
		isOpen : Boolean,
		isBatteryLow : Boolean
	}
});

mongoose.model('Event', EventSchema); 
var Event = mongoose.model('Event');

app.get('/Event', function(req, res) {
	Event.find({}).sort('-date').populate('wifisensor','name -_id description isOpen isBatteryLow').limit(30).exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send(data); }
	});	
});










//-----------WifiSensor---------------------------------------------
var RemoteControlSchema = new Schema({
	code: Number,
	binCode: String,	
	name: String,
	description: String,
	isLock: {type : Boolean, 'default': null},
	isBatteryLow: {type : Boolean, 'default': null},
	date: Date,
	area : {
		_id: Schema.Types.ObjectId,
		name: String
	}
});
mongoose.model('RemoteControl', RemoteControlSchema); 
var RemoteControl = mongoose.model('RemoteControl');



app.get('/RemoteControl', function(req, res) { RemoteControl.find({}).sort('-date').exec(function(err, data) { res.send(data); }); });

app.get('/RemoteControl/:code', function(req, res) {
	RemoteControl.find(req.params).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.post('/RemoteControl', function(req, res) {
	RemoteControl.create(req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.put('/RemoteControl/:id', function(req, res) {
	RemoteControl.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.del('/RemoteControl', function(req, res) {
	RemoteControl.remove(req.body, function (err, data) {
		 res.send({});
	 });
});











//--------------------------------------------------------


var lastTime = new Date();
var lastBinCode;
app.post('/433mhz/:binCode', function(req, res) {
	
	var binCode = req.params.binCode;
	
	var duration = Number(new Date() - lastTime);
	
	if(duration < 2200 || lastBinCode === binCode){
		res.send();
		return;		
	}
	lastTime = new Date();
	lastBinCode = binCode;
	
	console.log("duration: ",duration);
	var code=null;
	if(binCode.length === 24 || binCode.length === 40 ){
		
		code = parseInt(binCode.substr(0,16), 2);
		
		
		var isOpen = null, isBatteryLow = null; 
		if(binCode.length === 40){ 
			var state = binCode.substr(24,4); 	//1000 - close  0010 - open	0000111110110110000000001000011110110100 (close) 0000111110110110000000000010011110110100 (open)
			if(state === "0010"){
				isOpen = true;
			}else if(state === "1000"){
				isOpen = false;
			}
			var battery = binCode.substr(30,1); 	//31bit 1 - KO  0 - OK	
			if(battery === "1"){
				isBatteryLow = true;
			}else if(battery === "0"){
				isBatteryLow = false;
			}
			
		}
//		else if(binCode.length === 24){ 
////			state = binCode.substr(19,4);
////			battery = "1";
//		}
		
		console.log(code, isOpen, isBatteryLow, binCode);
	
		
		//controlling if alarm is activated
		AlarmState.findOne({}).sort('-date').exec(function(err, alarmState) {
					      
			if(alarmState !== null && alarmState.state !== "OFF" && isOpen === true){
				Area.findOne({name : alarmState.state}).populate('wifisensors').exec(function(err, area) {
        	 
					if(area && area.wifisensors !== undefined){
						for ( var i = 0; i < area.wifisensors.length; i++) {
							var sensor = area.wifisensors[i];
							
							if(sensor.code ===  code){
								switchOnSiren(sensor);
								break;
							}
						}
					}
				});		
			}else{
				//send codes for sensors registrations
				io.sockets.emit("433mhz", {code:code,binCode:binCode});
			}
			
		});
		

		
		
		WifiSensor.findOneAndUpdate({code : code}, {isOpen:isOpen, isBatteryLow:isBatteryLow}, function (err, data) {
			if(data !== null){
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"wifi-sensor", name:data.name, description:data.description, isOpen:data.isOpen, isBatteryLow:data.isBatteryLow}}, function (err, data) {});
				email("WifiSensor Attivato", data.name + " " + data.description);
			}
		});		
		
		RemoteControl.findOne({code : code}).exec(function(err, data) {
			if(data !== null){
				
				var isLock = null;
				if(binCode.length === 24){ 
					var state = binCode.substr(16,8);
					if(state === "00000011"){ //OFF
						isLock = false;
					}else if(state === "11000000"){ //ON
						isLock = true;
					}
				}
				if(data.area !== null){
					var alarmState = null;
					if(isLock === false){
						alarmState = "OFF";
					}else if(isLock === true){
						alarmState = data.area.name;
					}
					if(alarmState !== null){
						AlarmState.create({state: alarmState, provider:"remote-control", date: new Date()}, function (err, data) {});
						io.sockets.emit("change-alarm-state", {state:alarmState});						
					}

				}
				
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"remote-control", name:data.name, description:data.description, isLock:isLock}}, function (err, data) {});
			}
		});	
		
	}

	res.send();
	
});







