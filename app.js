

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var os = require('os');
var email = require('./lib/email.js');
var database = require('./lib/database.js');
var MCP23017 = require('./lib/MCP23017.js');
var Sound = require('./lib/Sound.js');
var Siren = require('./lib/Siren.js');
//var LightsTrigger = require('./lib/LightsTrigger.js');
var LightsController = require('./lib/LightsController.js');
var CronJob = require('cron').CronJob;
var request = require('request');
var child_process = require('child_process');
var exec = child_process.exec;
var arp = null; try { arp = require('arp-a'); } catch (e) {}


var host = null;
//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('view cache');
var server = app.listen(process.env.PORT || 8081, function () {
	var interfaces = os.networkInterfaces();
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

	
//	new CronJob({
//		  cronTime: '00 13 07 * * 1-5',
//		  onTick: function() {
//			  LightsController.CameraDaLetto2On();
//				setTimeout(function() {	
//					LightsController.CameraDaLetto2Off();
//				}, 600000);
//
//		  },
//		  onComplete: function() {},
//		  startNow: true,
//		  timeZone: null,
//		  context: null
//		});
	
		
	
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);

  LightsController.scan(function(data) {

		database.LIGHT_CONTROLLERS.findOneAndUpdate({code : data.code}, data, {upsert : true}, function (err, res) {
			
			database.LIGHTS.find({code: { $in : res.lights }}).exec(function(err, entries) {
				entries.forEach(function(target) {
					
					var address = parseInt(target.code.substring(0, 4), 16);
					var port = target.code.substring(7, 8);
					var pin = target.code.substring(8);
					
					console.log(address, port, pin);
					target.isOn = LightsController.switchPin(address, port, pin);
					target.save(function (err) {});
					
				});
			});	
			
			
			database.LIGHT_CONTROLLERS.find({}).exec(function(err, data){
				io.sockets.emit("socket-add-light-controller", data);
			});
			
			database.LIGHTS.find({}).sort('name').exec(function(err, data){
				io.sockets.emit("socket-lights", data);
			});
			
			
		});
	  
//		if(data.code === "0x21-GPA4"){
//			LightsController.switchPin(0x22, "A", 4); //cameretta				0x21-GPA4
//		}	 	 
//		if(data.code === "0x21-GPA5"){
//			LightsController.switchPin(0x22, "A", 5); //coridoio				0x21-GPA5
//		}	
//		if(data.code === "0x21-GPA6"){
//			LightsController.switchPin(0x22, "A", 3); //camera da letto soffito	0x21-GPA6
//			LightsController.switchPin(0x22, "A", 6); //camera da letto muro	0x21-GPA6
//		}	
//		if(data.code === "0x21-GPA7"){
//			LightsController.switchPin(0x22, "A", 7); //studio     				0x21-GPA7 
//		}  
		
  });
  
//  LightsController.scan(function(data) {  
//	  
//	  console.log(data.code);
//	  if(data.code === "0x21-GPA7"){
//		 
//		  LightsController.studioOnOff();
//		  
////		  LIGHTS.findOneAndUpdate({code : data.code}, data, {upsert : true}, function (err, doc) {
////			  
////				var code = doc.code;
////				var isOn = doc.isOn;
////				
////				LIGHTS.update({code : doc.code}, {isOn : !isOn}, function (err, data) {
////					
////					if(isOn === false){ 
////						LightsController.StudioOff();
////					}else { 
////						LightsController.StudioOn();
////					}						
////					
////				});						
////				
////
////			
////	   });		  
//	  }
//	  
//
//	  
//	  if(data.code === "0x21-GPA6"){
//		  
//		  LightsController.cameraDaLettoMuroOnOff();
//		  LightsController.cameraDaLettoSoffitoOnOff();
//		  
//		  
////		  LIGHTS.findOneAndUpdate({code : data.code}, data, {upsert : true}, function (err, doc) {
////			  
////				var code = doc.code;
////				var isOn = doc.isOn;
////				
////				LIGHTS.update({code : doc.code}, {isOn : !isOn}, function (err, data) {
////					
////					if(isOn === false){ 
////						LightsController.CameraDaLettoOff();
////						LightsController.CameraDaLetto2Off();
////					}else { 
////						LightsController.CameraDaLettoOn();
////						LightsController.CameraDaLetto2On();
////					}						
////					
////				});						
////			
////	   });		  
//	  }
//	  
//	  
//	  
//  });
//  

  
  
  
//  MCP23017.scanPirSensors(function(data) {
//	  
//	  database.PIR_SENSOR.findOneAndUpdate({code : data.code}, data, {upsert : true }, function (err, doc) {
//		
//		var code = doc.code;
//		database.PIR_SENSOR.find({}).sort('-date').exec(function(err, doc) {
//			if(!doc) {return;}
//			
//			io.sockets.emit("PIRSENSOR", doc);
//			
//			database.AREA.findOne({isActivated:true, activeSensors : code }).exec(function(err, area) {
//				if(area){
//					alarmDetection(doc, area._id);
//						
//				}
//			});				
//			
//		});	
//	  });	 
//  });
  
  email("Home System Attivato", "App listening at http://"+host+":"+port);
});

app.get('/home-system', function(req, res) {
	fs.readFile(__dirname+'/public/index.html', function(error,data) {
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.end(data);
    });
});






var _volumeSirena = "100";
var _volumeVoce = "100";

// Web Socket Connection
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
	
	socket.on('disarm', function (areaId) {
		
		database.AREA.findByIdAndUpdate(areaId, {isActivated: false}, function (err, data) {
			io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
		});	
		
		disarm(areaId);
		
	});
	
	
	socket.on('SOCKET-GET-CONFIGURATION', function (callback) {
		database.CONFIGURATION.findOne({}).exec(function(err, data) {
			if(!data){
				_volumeSirena = data.audio.volumeSirena;
				_volumeVoce = data.audio.volumeVoce;
			}
			callback(data);
		});		
	});	
	
	socket.on('SOCKET-CHANGE-SIREN-VOLUME', function (value) {
		_volumeSirena = value;
		database.CONFIGURATION.findOneAndUpdate({}, { 'audio.volumeSirena' : value}, function (err, doc) {});
	});	

	socket.on('SOCKET-CHANGE-VOICE-VOLUME', function (value) {
		_volumeVoce = value;
		database.CONFIGURATION.findOneAndUpdate({}, { 'audio.volumeVoce' : value}, function (err, doc) {});
	});
	
	
	socket.on('SOCKET-SWITHC-LIGHT', function (data) {
		console.log("SOCKET-SWITHC-LIGHT", data);
		var code = data.code;
		var address = parseInt(code.substring(0, 4), 16);
		var gpio = code.substring(7, 8);
		var pin = code.substring(8);
		
		var value = 1;
		if(data.isOn === false){
			value = 0;
		}
		console.log(address, gpio, pin, value);

		LightsController.writePin(address, gpio, pin, value);
		
		database.LIGHTS.update({code : code}, {isOn: data.isOn, date: new Date()}, function (err, data) {

		});	
		
	});
	

	
	
//	socket.on('socket-enable-add-light-controller', function () {
//		isEnableAddLightController = false;
//	});	
	
	
});

//var isEnableAddLightController = false;


var isAlarmActivated = false;
var alarmTimer = null;
var avvisoAllarmeTimer = null;
function alarmDetection(sensor, areaId) {
	if(isAlarmActivated){return;}
	
	isAlarmActivated = true;
	console.log("alarmDetection ", sensor, areaId);
	
	sensor.name = (sensor.name) ? sensor.name : sensor.code;
	
	//sending to client the notification
	io.sockets.emit("ALARM_DETECTION", sensor, areaId);
	
	
	
	avvisoAllarmeTimer = setTimeout(function() {
	    if(!isAlarmActivated){return;}
	    
	    Sound.playMp3("/home/pi/home-system-node/mp3/AvvisoAllarme.mp3", _volumeVoce);
	}, 5000);
	
	alarmTimer = setTimeout(function() {
		    if(!isAlarmActivated){return;}
		    
			email("Sound", sensor.name + "\n Sirena allarme attivata");
			database.EVENT.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Sirena Allarme Attivata"}}, function (err, data) {});
			Sound.playMp3("/home/pi/home-system-node/mp3/Siren.mp3", _volumeSirena ,"-q -v -l10");//repeat mp3
			Siren.on();
	}, 15000);
	

	database.AREA.findByIdAndUpdate(areaId, {'$set':  {'alarmActivate.state': true, 'alarmActivate.sensor.name': sensor.name }}, function (err, data) {});	
	
	database.EVENT.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Avviso Allarme: "+sensor.name}}, function (err, data) {});

}


function disarm(areaId) {
	isAlarmActivated = false;
	console.log("DISARM", areaId, new Date());
	clearTimeout(alarmTimer);
	clearTimeout(avvisoAllarmeTimer);
	Sound.kill();
	Siren.off();
	
	database.AREA.findByIdAndUpdate(areaId, {'$set':  {'alarmActivate.state': false, 'alarmActivate.sensor.name': null }}, function (err, data) {});	
	database.EVENT.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Allarme disattivato"}}, function (err, data) {});
	
}

app.get('/lights', function(req, res) {
	database.LIGHTS.find({}).sort('name').exec(function(err, data) { res.send(data); });
});

app.put('/lights/:id', function(req, res) {
	database.LIGHTS.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.put('/light-controllers/lights/:id', function(req, res) {
	var lights = req.body.lights || [];
	database.LIGHT_CONTROLLERS.findByIdAndUpdate(req.params.id, {'$set':  {'lights': lights}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});


app.get('/light-controllers', function(req, res) {
	database.LIGHT_CONTROLLERS.find({}).sort('-date').exec(function(err, data) { res.send(data); });
});

app.put('/light-controllers/:id', function(req, res) {
	database.LIGHT_CONTROLLERS.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});


app.del('/light-controllers/:id', function(req, res) {
	database.LIGHT_CONTROLLERS.findByIdAndRemove(req.params.id, function (err, data) {
		 res.send({});
	});
});


//-----------PIR_SENSOR---------------------------------------------
app.get('/PirSensor', function(req, res) {
	database.PIR_SENSOR.find({}).sort('-date').exec(function(err, data) { res.send(data); });
});


app.put('/PirSensor', function(req, res) {
	database.PIR_SENSOR.findByIdAndUpdate(req.body._id, {name: req.body.name}, function (err, data) {
		database.PIR_SENSOR.find({}).exec(function(err, data) {
			res.send(data);
		});
	});	
});

app.del('/PirSensor/:id', function(req, res) {
	database.PIR_SENSOR.remove({_id : req.params.id}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	 });
});


//-----------WifiSensor---------------------------------------------
app.get('/WifiSensor', function(req, res) {
	database.WIFISENSOR.find({}).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});


app.get('/WifiSensor/:code/:binCode', function(req, res) {

	database.WIFISENSOR.findOne({code : req.params.code}, function (err, data) {
		if(data){
			res.send({data:data, existing:true });
		}else{
			database.WIFISENSOR.create(req.params, function (err, data) {
				if(err){console.log(err); res.status(500).send(err); }
				res.send({data:data, existing:false });
			});				
		}
	});
});



app.put('/WifiSensor', function(req, res) {
	database.WIFISENSOR.update({code : req.body.code}, req.body, {upsert : true}, function (err, data) {
        res.send({});
	});	
});
app.del('/WifiSensor', function(req, res) {
	database.WIFISENSOR.findOne(req.body, function(err, data){
		data.remove();
		database.AREA.update({}, {'$pull':  { wifisensors : {_id: data._id} }}, {multi: true}, function (err, data) {
			if(err){console.log(err);}
		});			
		res.send({});
	});	
});



//----------- CONFIGURATION ---------------------------------------------
database.CONFIGURATION.findOne({}).exec(function(err, data) {
	if(!data){
		database.CONFIGURATION.create({audio:{volumeSirena: _volumeSirena, volumeVoce: _volumeVoce}}, function (err, data) {
			console.log("CONFIGURATION create", err, data);
		});	
	}else{
		_volumeSirena = data.audio.volumeSirena;
		_volumeVoce = data.audio.volumeVoce;
	}
});	


//----------- LAN_DEVICE ---------------------------------------------
app.get('/LAN_DEVICE', function(req, res) {
	database.LAN_DEVICE.find({}).sort('-lastLogin').exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send(data); }
	});		
});
app.put('/LAN_DEVICE', function(req, res) {
	database.LAN_DEVICE.update({mac : req.body.mac}, req.body, function (err, data) {
        res.send({});
	});	
});
app.del('/LAN_DEVICE', function(req, res) {
	database.LAN_DEVICE.remove({mac : req.body.mac}, function (err, data) {
		res.send({});
	 });		
});



//-----------AREA---------------------------------------------
app.post('/Area', function(req, res) {
	database.AREA.create(req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});		
	
});
app.put('/Area/:id', function(req, res) {
	database.AREA.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.put('/Area/isActivated/:id', function(req, res) {
	database.AREA.update({}, {isActivated: false},{multi: true}, function (err, data) {
		database.AREA.findByIdAndUpdate(req.params.id, {isActivated: req.body.isActivated}, function (err, data) {
			if(err){console.log(err); res.status(500).send(err); }
			else { 
				res.send({});
				
				io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", data);	
				
				if(data.isActivated === true){
					
					var activeSensors = data.activeSensors;
					for ( var i = 0; i < activeSensors.length; i++) {
						activeSensors[i] = parseInt(activeSensors[i]);
						if(!activeSensors[i]){activeSensors[i]=0;}
					}
					database.WIFISENSOR.findOne({isOpen : true, code: { $in : activeSensors }}, function (err, sensor) {
						if(sensor){
							io.sockets.emit("SOCKET-WARNING-MSG", sensor.name+" &#232; aperta!");
						}
					});	
					
				}else if(data.isActivated === false){
					disarm(data._id);
				}
					
			}
		});	
	});
});

app.put('/Area/schedulers/:id', function(req, res) {
	var schedulers = req.body.schedulers || [];
	database.AREA.findByIdAndUpdate(req.params.id, {'$set':  {'schedulers': schedulers}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
		
//		checkJobs();
	});	
});

	
app.put('/Area/activeSensors/:id', function(req, res) {
	var activeSensors = req.body.activeSensors || [];
	database.AREA.findByIdAndUpdate(req.params.id, {'$set':  {'activeSensors': activeSensors}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});


app.put('/Area/autoOnOff/:id', function(req, res) {
	var auto_on_off = req.body.auto_on_off || {};
	database.AREA.findByIdAndUpdate(req.params.id, {'$set':  {'auto_on_off': auto_on_off}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
		
		checkJobs();
	});	
});


app.get('/Area', function(req, res) {
	database.AREA.find({}).sort('date').populate('wifisensors').populate('pirsensors').exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send(data); }
	});		
});

app.del('/Area/:id', function(req, res) {
	database.AREA.remove({_id : req.params.id}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	 });
});



//----------- EVENTS ---------------------------------------------
app.get('/Event', function(req, res) {
	database.EVENT.find({},'-__v -code -binCode -device.provider').sort('-date').limit(15).exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else {res.send(data); }
	});		
});

app.del('/Event/:id', function(req, res) {
	database.EVENT.remove({ _id: req.params.id }, function (err, data) {
		 res.send({});
	});
});





//-----------REMOTECONTROL---------------------------------------------

app.get('/RemoteControl', function(req, res) { database.REMOTE_CONTROL.find({}).sort('-date').exec(function(err, data) { res.send(data); }); });

app.get('/RemoteControl/:code/:binCode', function(req, res) {

	database.REMOTE_CONTROL.findOne({code : req.params.code}, function (err, data) {
		if(data){
			res.send({data:data, existing:true });
		}else{
			database.REMOTE_CONTROL.create(req.params, function (err, data) {
				if(err){console.log(err); res.status(500).send(err); }
				res.send({data:data, existing:false });
			});				
		}
	});
});



app.put('/RemoteControl/:id', function(req, res) {
	database.REMOTE_CONTROL.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.del('/RemoteControl/:id', function(req, res) {
	database.REMOTE_CONTROL.findByIdAndRemove(req.params.id, function (err, data) {
		 res.send({});
	});
});




app.put('/RemoteControl/activeArea/:id', function(req, res) {
	database.REMOTE_CONTROL.findByIdAndUpdate(req.params.id, {'$set':  {'activeArea':  req.body.activeArea}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

//--------------------------------------------------------


var lastTime = new Date();
var lastBinCode;
app.post('/433mhz/:binCode', function(req, res) {
	
	var binCode = req.params.binCode;
	console.log("-------------------------------- ",binCode);
	var duration = Number(new Date() - lastTime);
	
	if(duration < 2200 || (duration < 1200 && lastBinCode === binCode)){
		res.send();
		return;		
	}
	lastTime = new Date();
	lastBinCode = binCode;
	
	
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
			var battery = binCode.substr(31,1); 	//31bit 1 - KO  0 - OK	
			if(battery === "1"){
				isBatteryLow = false;
			}else if(battery === "0"){
				isBatteryLow = true;
			}
			
		}
//		000011110011110100000000|0000|101|0|10101010        batt KO inserita
//		000011111010010100000000|0000|101|1|01000001        batt OK inserita
		
		
//		else if(binCode.length === 24){ 
////			state = binCode.substr(19,4);
////			battery = "1";
//		}
		
		console.log(code, isOpen, isBatteryLow, binCode, new Date());
		
		io.sockets.emit("433MHZ", {code:code,binCode:binCode});	
		
		database.AREA.findOne({isActivated:true, activeSensors : code.toString() }).exec(function(err, area) {
			if(area){
				database.WIFISENSOR.findOne({code:code}, function(err, sensor){
					if(sensor.isOpen !== false){
						alarmDetection(sensor, area._id);
					}
				});	
			}
		});		
		
		
		
		database.WIFISENSOR.findOneAndUpdate({code : code}, {isOpen:isOpen, isBatteryLow:isBatteryLow, date:new Date()}, function (err, data) {
			if(data !== null){
				database.WIFISENSOR.find({}).sort('-date').exec(function(err, data) {
					io.sockets.emit("WIFISENSOR", data);
				});
				
				database.EVENT.create({code:code,binCode:binCode, date: new Date(), device:{provider:"wifi-sensor", name:data.name, isOpen:data.isOpen, isBatteryLow:data.isBatteryLow}}, function (err, data) {});
				if(isBatteryLow){ //send email notification of battery low
					email("Battery of sensor '"+ data.name + "' is low", "");
				}
			}
		});		
		//010001001100110111000000  ON
		//010001001100110100001100 OFF
		//010001001100110100000011 HOME
		//010001001100110100110000 SOS
		database.REMOTE_CONTROL.findOne({code : code}).exec(function(err, data) {
			if(data !== null){
				
				var isActivated = null;
				if(binCode.length === 24){ 
					var state = binCode.substr(16,8);
					if(state === "00000011" || state === "00001100"){ //OFF
						isActivated = false;
					}else if(state === "11000000"){ //ON
						isActivated = true;
					}
				}
				console.log("isActivated",isActivated);
				
				
				if(data.activeArea){
					database.AREA.findByIdAndUpdate(data.activeArea, {isActivated: isActivated}, function (err, data) {
						console.log(data);
						if(data){
							
							io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
							console.log("data.isActivated",data.isActivated);
							if(data.isActivated === true){
								console.log("allarmeAttivato1", new Date());
								Sound.playMp3("/home/pi/home-system-node/mp3/car_lock.mp3", _volumeVoce);
								console.log("allarmeAttivato2", new Date());
								var activeSensors = data.activeSensors;
								for ( var i = 0; i < activeSensors.length; i++) {
									activeSensors[i] = parseInt(activeSensors[i]);
									if(!activeSensors[i]){activeSensors[i]=0;}
								}
								database.WIFISENSOR.findOne({isOpen : true, code: { $in : activeSensors }}, function (err, data) {
									if(data){
										setTimeout(function(data) {
											console.log(data.name, "/home/pi/home-system-node/mp3/"+data.name.replace(" ", "")+".mp3");
											Sound.playMp3("/home/pi/home-system-node/mp3/"+data.name.replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "")+".mp3", _volumeVoce);
										}, 1500, data);
									}
								});
							}else if(data.isActivated === false){
								disarm(data._id);
								Sound.playMp3("/home/pi/home-system-node/mp3/dtmf_8.mp3", _volumeVoce, "-l2");//allarmeDisattivato.mp3
								
							}
						}
					});	
				}
				
				database.EVENT.create({code:code,binCode:binCode, date: new Date(), device:{provider:"remote-control", name:data.name, isLock:isActivated}}, function (err, data) {});
			}
		});	
		
	}

	res.send();
	
});


//sudo arp-scan --interface=wlan0 --localnet
//https://ajauskas.dyndns.org:8080/setup.cgi?todo=nbtscan_refresh&this_file=DEV_devices.htm&next_file=DEV_devices.htm&SID=
//sudo nmap -sP -PE -PA 192.168.0.* | grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}|([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}"

//sudo arp -n | grep -E "([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}"  
//sudo arp -n -D -i wlan0 | grep 'ether'


//ip -s -s neigh flush all
//
var semaforoNmap = true;
setInterval(function() {

	if(!semaforoNmap){return;}
	semaforoNmap = false;
	try {
//	    exec("sudo ip neighbor show dev wlan0 | grep REACHABLE | awk '{print $1,$3}'", function(err, stdout,stderr) {
		exec("sudo nmap -sP -n -PE -PA -T5 -e wlan0 192.168.0.2-24 --exclude "+host+" | grep -E -o '([0-9]{1,3}[\.]){3}[0-9]{1,3}|([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}' | tr '\n' '#'", function(err, stdout,stderr) {
	    	
	    	if(stdout){
	    		
	    		var entries = stdout.split('#');
	    		var macs = "";
	    		for (var int = 0; int < entries.length; int++) {
					var ip = entries[int++];
					var mac = entries[int];
					if(ip && mac){
						macs += mac; 
						database.LAN_DEVICE.findOneAndUpdate({mac : mac}, {mac:mac, ip:ip, exists:true, lastLogin:new Date()}, {upsert : true }, function (err, data) {});
					}
				} 

	    		
//	    		setTimeout(function(entries) {
	
					database.LAN_DEVICE.find({}).sort('-lastLogin').exec(function(err, data) {
						io.sockets.emit("SOCKET-LAN-DEVICES", data);
						if(data && data.length > 0){
							
							data.forEach(function(device) {
								var obj = {exists : false};
								if(macs.indexOf(device.mac) >= 0){
									obj.exists = true;
									obj.lastLogin = new Date();
								}	
								database.LAN_DEVICE.findOneAndUpdate({mac : device.mac}, obj, function (err, doc) {});	
								
								
								if(!device.manufacturer){
									var macaddress = device.mac;
									request({'url':'http://www.admin-toolkit.com/php/mac-lookup-vendor.php?maclist='+macaddress}, function (error, response, body) {
									    if (!error && response.statusCode === 200) {
									        var arr = body.split('|');
									        if(arr.length === 2){
	    								        var manufacturer = arr[1].trim();
	    								        database.LAN_DEVICE.findOneAndUpdate({mac : macaddress}, {manufacturer:manufacturer}, function (err, doc) {});
									        }
									    }
								    });    								
								}
								
							});	
						}
				});	         			
//	    		}, 500,entries);
	    	}
	    	
	    	semaforoNmap = true;
	   });
		
	} catch (e) {
		console.log("ERROR LAN_DEVICE NMAP", e);
	}
}, 1000);


//setInterval(function() {
//	
//	try {
//        exec("sudo nmap -sP -PE -PA 192.168.0.3-24 | grep 'MAC' | awk '{print $3,$4}'", function(err, stdout,stderr) {
//        	if(stdout){
//        		var entries = stdout.split('\n');
//        		entries.forEach(function(target) {
//        			if(target){
//        				var entry = target.split(' ');
//        				var mac = entry[0];
//        				var name = entry[1].replace("(", "").replace(")", "");
//        				database.LAN_DEVICE.findOneAndUpdate({mac : mac}, {mac:entry[0], nmapname:name, exists:true, lastLogin:new Date()}, {upsert : true }, function (err, data) {});
//        			}
//        		});
//        		
//        		setTimeout(function() {
//
//    				database.LAN_DEVICE.find({}).sort('-lastLogin name').exec(function(err, data) {
//    					io.sockets.emit("SOCKET-LAN-DEVICES", data);
//    					var macs = "";
//    					entries.forEach(function(target) {
//    						if(target){
//    							macs += target.split(' ')[0]; 
//    						}
//    						
//    					});
//    					if(data && data.length > 0){
//    						
//    						data.forEach(function(device) {
//    							var obj = {exists : false};
//    							if(macs.indexOf(device.mac) >= 0){
//    								obj.exists = true;
//    								obj.lastLogin = new Date();
//    							}	
//    							database.LAN_DEVICE.findOneAndUpdate({mac : device.mac}, obj, function (err, doc) {});	
//    							
//    							
//    							if(!device.manufacturer){
//    								var macaddress = device.mac;
//    								request({'url':'http://www.admin-toolkit.com/php/mac-lookup-vendor.php?maclist='+macaddress}, function (error, response, body) {
//    								    if (!error && response.statusCode == 200) {
//    								        var arr = body.split('|');
//    								        if(arr.length === 2){
//        								        var manufacturer = arr[1].trim();
//        								        database.LAN_DEVICE.findOneAndUpdate({mac : macaddress}, {manufacturer:manufacturer}, function (err, doc) {});
//    								        }
//    								    }
//    							    });    								
//    							}
//    							
//    						});	
//    					}
//				});	         			
//        		}, 1000);
//        	}
//       });
//		
//	} catch (e) {
//		console.log("ERROR LAN_DEVICE NMAP", e);
//	}
//}, 5000);



var intervalAutoOnOff;

function startAutoOnOff() {
	console.log("startAutoOnOff");	
	intervalAutoOnOff = setInterval(function() {
	
		//------------ Auto On/Off ----------
		
		
		
		database.AREA.find({'auto_on_off.lan_devices': {'$ne': null }}).exec(function(err, data) {
			data.forEach(function(area) {
				if(area.auto_on_off.lan_devices.length > 0){
					var lan_devices = [];
					area.auto_on_off.lan_devices.forEach(function(obj) {
						lan_devices.push(obj.mac);
					});
					
	//				var d = new Date();
	//				console.log(new Date(d.getTime() + 10*1000)); //unit second
	//				console.log(new Date(d.getTime() - 10*1000));
					
					if(!area.isActivated){
						
						database.LAN_DEVICE.find({exists:false, mac: { $in : lan_devices }}).sort('-lastLogin').exec(function(err, devices) {
							
							if(devices.length === lan_devices.length){
								var lastLogin = devices[0].lastLogin
								var d = new Date(lastLogin.getTime() + 120*1000);
								if(new Date() > d){
									database.AREA.findByIdAndUpdate(area._id, {isActivated: true}, function (err, data) {
										console.log("Allarme attivato", "Auto ON allarme zona: "+area.name+" by "+devices[0].name);
										io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
										email("Allarme attivato", "Auto ON allarme zona: "+area.name+" by "+devices[0].name);
										database.EVENT.create({code:"",binCode:"", date: new Date(), device:{provider:devices[0].name, name:"Auto ON allarme zona: "+area.name}}, function (err, data) {});
									});	
								}
							}					
							
						});	
					}else{
						
						database.LAN_DEVICE.find({exists:true, mac: { $in : lan_devices }}).exec(function(err, devices) {
							if(devices.length > 0){
								database.AREA.findByIdAndUpdate(area._id, {isActivated: false}, function (err, data) {
									console.log("Allarme disattivato", "Auto OFF allarme zona: "+area.name+" by "+devices[0].name);
									io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
									email("Allarme disattivato", "Auto OFF allarme zona: "+area.name+" by "+devices[0].name);
									database.EVENT.create({code:"",binCode:"", date: new Date(), device:{provider:devices[0].name, name:"Auto OFF allarme zona: "+area.name}}, function (err, data) {});
								});
							}
						});	
					}
					
				}
				
			});
			
			
		}); 
	
	}, 2000);

}

var cronAllJobs = [];
checkJobs();

function checkJobs() {

	
	cronAllJobs.forEach(function(jobs) {
		jobs.jobFrom.stop();
		jobs.jobTo.stop();
	});	
	cronAllJobs = [];	
	
	
	database.AREA.find({}).exec(function(err, areas) {
		if(err){console.log(err); return;}
		
		areas.forEach(function(area) {
			
			area.schedulers.forEach(function(scheduler) {
				

				var id = scheduler.id;
				var from = scheduler.from.split(":");
				var to = scheduler.to.split(":");
				var daysOfWeek = scheduler.daysOfWeek;
				if(daysOfWeek === "Off"){
					return;
				}
				
				var cronOnAllarm = "00 "+from[1]+" "+from[0]+" * * " + daysOfWeek;
				var cronOffAllarm = "00 "+to[1]+" "+to[0]+" * * " + daysOfWeek;
				console.log(this.areaId, "Cron Job Allarm ON at " + cronOnAllarm + " and OFF at " + cronOffAllarm);
				
				var cronJobFrom = new CronJob(cronOnAllarm, function(){
						console.log('job cronOnAllarm init at ', new Date(), this.areaId);
						database.AREA.findByIdAndUpdate(this.areaId, {isActivated: true}, function (err, data) {
							io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
						});
				},null, true, null, {'areaId':area._id});
				
				var cronJobTo = new CronJob(cronOffAllarm, function(){
					console.log('job cronOffAllarm init at ', new Date(), this.areaId);
					database.AREA.findByIdAndUpdate(this.areaId, {isActivated: false}, function (err, data) {
						io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
					});
				},null, true, null, {'areaId':area._id});			
						
				cronAllJobs.push({id:area._id+"_"+id, jobFrom: cronJobFrom, jobTo: cronJobTo});
				
			});	
			
			
			if(area.auto_on_off && area.auto_on_off.scheduler){
				
				
				var scheduler = area.auto_on_off.scheduler;
				console.log("scheduler",scheduler);
				var from = scheduler.from.split(":");
				var to = scheduler.to.split(":");
				var daysOfWeek = scheduler.daysOfWeek;
				if(daysOfWeek === "Off"){ 
					
					if(intervalAutoOnOff) {
						console.log("OFF intervalAutoOnOff");
						clearInterval(intervalAutoOnOff);
					}
					return; 
				}
				
				var cronOn = "00 "+from[1]+" "+from[0]+" * * " + daysOfWeek;
				var cronOff = "00 "+to[1]+" "+to[0]+" * * " + daysOfWeek;
				console.log(area.name, "Cron auto on/off Job ON at: " + cronOn + " and OFF at: " + cronOff);		
				
				var sysdate = new Date();
				
				var startDate = new Date();
				startDate.setHours(from[0],from[1],0);
				
				var endDate = new Date();
				endDate.setHours(to[0],to[1],0);
//console.log(startDate);
//console.log(endDate);	
//console.log(sysdate);	
				
				
				
				
				var cronJobFrom = new CronJob(cronOn, function(){
					console.log('job auto on/off init at: ', new Date(), this.name);
					startAutoOnOff();
				},null, true, null, {'name':area.name});

				var isInDay = cronJobFrom.cronTime.dayOfWeek[sysdate.getDay()];
				if(startDate < sysdate && sysdate < endDate && isInDay === true){
					startAutoOnOff();
				}else{
					if(intervalAutoOnOff) {
						console.log("OFF intervalAutoOnOff");
						clearInterval(intervalAutoOnOff);
					}
				}
				
				
				
				var cronJobTo = new CronJob(cronOff, function(){
					console.log('job auto on/off end at: ', new Date(), this.name);
					if(intervalAutoOnOff) {clearInterval(intervalAutoOnOff);}
				},null, true, null, {'name':area.name});				
				
				
				cronAllJobs.push({jobFrom: cronJobFrom, jobTo: cronJobTo});
				
				
			}
			
//			area.auto_on_off = area.auto_on_off || {};
//			area.auto_on_off.scheduler = area.auto_on_off.scheduler || {};
//			
		
			
			
			
		});		
		
		
	});		
}




//************* TESTS ******************
//TEST
//setInterval(function() {
//	
//	database.AREA.findOne({isActivated:true, activeSensors : "GPA-1" }).exec(function(err, area) {
//		if(area){
//			alarmDetection({name:"PIR prescrizione", code:"GPA-1"}, area._id);
//		}
//	});	
//}, 5000);

app.post('/testPir', function(req, res) {
	database.AREA.findOne({isActivated:true, activeSensors : "0x20-GPA1" }).exec(function(err, area) {
		if(area){
			alarmDetection({name:"PIR Bagno", code:"0x20-GPA1"}, area._id);
		}
	});	
	res.send();
});


 

setInterval(function() {

	database.LIGHTS.find({}).sort('name').exec(function(err, data){
		io.sockets.emit("socket-lights", data);
	});

}, 5000);





//var data = {code : "0x21-GPA7", date: new Date()};
//database.LIGHT_CONTROLLERS.findOneAndUpdate({code : data.code}, data, {upsert : true}, function (err, res) {
//	
//	database.LIGHTS.find({code: { $in : res.lights }}).exec(function(err, entries) {
//		
//		console.log("target", entries);
//		
//		entries.forEach(function(target) {
//			
//			console.log("forEach",target);
//			var address = parseInt(target.code.substring(0, 4), 16);
//			var port = target.code.substring(7, 8);
//			var pin = target.code.substring(8);
//			
//			console.log(address, port, pin);
//			target.isOn = true;
////			target.isOn = LightsController.switchPin(address, port, pin);
//			target.save(function (err) {});
//			
//			
//		});
//		
//	});	
//	
//	
//});



