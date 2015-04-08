

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var os = require('os');
var email = require('./lib/email.js');
var MCP23017 = require('./lib/MCP23017.js');
var Sound = require('./lib/Sound.js');
var moment = require('moment');
var CronJob = require('cron').CronJob;






//var gpio = require("pi-gpio");


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
app.enable('view cache');
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

  MCP23017.scan(function(data) {
	  console.log("MCP23017: ", data);
	  PIR_SENSOR.findOneAndUpdate({code : data.code}, data, {upsert : true }, function (err, doc) {
		
		var code = doc.code;
//		var name = (doc.name) ? doc.name : doc.code;
//		Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:name, description:"ON"}}, function (err, data) {});
		PIR_SENSOR.find({}).exec(function(err, doc) {
			if(!doc) {return;}
			
			io.sockets.emit("PIRSENSOR", doc);
			
			Area.findOne({isActivated:true, activeSensors : code }).exec(function(err, area) {
				if(area){
					alarmDetection(doc, area._id);
//					doc.forEach(function(pir) {
//						if(pir.code ===  code){
//							alarmDetection(pir, area._id);
//						}					
//					});	
						
				}
			});				
			
			
			
		});		
	  });	 
  });
  
  

  
//  new CronJob('00 25 06 * * 1-5', function(){
//      console.log('job init at ', new Date());
//      Sound.playMp3("/home/pi/Bailando.mp3","75");
//  },null, true);
//  
//  new CronJob('00 00 09 * * 6-7', function(){
//      console.log('job init at ', new Date());
//      Sound.playMp3("/home/pi/Bailando.mp3","75");
//  },null, true);  
    
  
  email("Home System Attivato", "App listening at http://"+host+":"+port);
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
	
	socket.on('disarm', function (areaId) {
		
		Area.findByIdAndUpdate(areaId, {isActivated: false}, function (err, data) {
			io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
		});	
		
		disarm(areaId);
		
	});
	
});


var isAlarmActivated = false;
var alarmTimer = null;
function alarmDetection(sensor, areaId) {
	if(isAlarmActivated){return;}
	
	isAlarmActivated = true;
	console.log("alarmDetection ", sensor, areaId);
	
	sensor.name = (sensor.name) ? sensor.name : sensor.code;
	
	//sending to client the notification
	io.sockets.emit("ALARM_DETECTION", sensor, areaId);
	
	
	Sound.playMp3("/home/pi/home-system-node/mp3/AvvisoAllarme.mp3","95");
//	Sound.playMp3("/home/pi/home-system-node/mp3/AvvisoAllarme.mp3","10");
	alarmTimer = setTimeout(function() {
		    if(!isAlarmActivated){return;}
		    
		    console.log("EMAIL init Sound", new Date()); 
			email("Sound", sensor.name + "\n Sirena allarme attivata");
			 console.log("EMAIL end Sound", new Date()); 
			Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Sirena allarme attivata", description: "Sirena"}}, function (err, data) {});
			console.log("SOUND INIT", new Date());
			Sound.playMp3("/home/pi/home-system-node/mp3/Siren.mp3","100","-Z");//repeat mp3
			console.log("SOUND END", new Date());
			
//			Sound.playMp3("/home/pi/home-system-node/mp3/Siren.mp3","10","-Z");//repeat mp3
	}, 10000);
	
	//TODO: activate the siren and email/sms notifications
//	gpio.open(16, "output", function(err) {     // Open pin 16 for output 
//	    gpio.write(16, 1, function() {          // Set pin 16 high (1) 
//	        gpio.close(16);                     // Close pin 16 
//	    });
//	});
	
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Allarme attivato", description: sensor.name}}, function (err, data) {});
	
}


function disarm(areaId) {
	isAlarmActivated = false;
	console.log("DISARM", areaId, new Date());
	clearTimeout(alarmTimer);
	Sound.kill();
	
		
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"system", name:"Allarme disattivato", description:""}}, function (err, data) {});
		
		
		
	//	gpio.open(16, "output", function(lerr) { // Open pin 16 for output
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
 

mongoose.connection.on("connected", function(ref) {
  console.log("Connected to DB!");
});
mongoose.connection.on("error", function(err) {
  console.error('Failed to connect to DB on startup ', err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB disconnected');
});

//If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

var Schema = mongoose.Schema;


//-----------PIR_SENSOR---------------------------------------------
var PirSensorSchema = new Schema({
    code: String,
    name: String,
    state: String,
    date: Date
},{toJSON:{virtuals: true}});

PirSensorSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};
var PIR_SENSOR = mongoose.model('PIR_SENSOR', PirSensorSchema);


app.get('/PirSensor', function(req, res) {
	PIR_SENSOR.find({}).exec(function(err, data) { res.send(data); });
});


app.put('/PirSensor', function(req, res) {
	PIR_SENSOR.findByIdAndUpdate(req.body._id, {name: req.body.name}, function (err, data) {
		PIR_SENSOR.find({}).exec(function(err, data) {
			res.send(data);
		});
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
	WifiSensor.findOne(req.body, function(err, data){
		data.remove();
		Area.update({}, {'$pull':  { wifisensors : {_id: data._id} }}, {multi: true}, function (err, data) {
			if(err){console.log(err);}
		});			
		res.send({});
	});	
});



//-----------Area---------------------------------------------
var AreaSchema = new Schema({
	name : {type : String, required : true, unique: true, trim: true},
	description : String,
	activeSensors: [],
	isActivated: {type : Boolean, 'default': false},
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

app.put('/Area/isActivated/:id', function(req, res) {
	Area.update({}, {isActivated: false},{multi: true}, function (err, data) {
		Area.findByIdAndUpdate(req.params.id, {isActivated: req.body.isActivated}, function (err, data) {
			if(err){console.log(err); res.status(500).send(err); }
			else { 
				io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", data);
				res.send({});
				
			}
		});	
	});
});


app.put('/Area/activeSensors/:id', function(req, res) {
	var activeSensors = req.body.activeSensors || [];
	Area.findByIdAndUpdate(req.params.id, {'$set':  {'activeSensors': activeSensors}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
	
});



app.get('/Area', function(req, res) {
	Area.find({}).sort('date').populate('wifisensors').populate('pirsensors').exec(function(err, data) {
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
},{toJSON:{virtuals: true}});


EventSchema.methods.toJSON = function() {
	  var obj = this.toObject();
	  var date = moment(obj.date), formatted = date.format('DD/MM/YYYY HH:mm:ss');
	  obj.date = formatted;
	  return obj;
};


mongoose.model('Event', EventSchema); 
var Event = mongoose.model('Event');


app.get('/Event', function(req, res) {
	Event.find({},'-__v -code -binCode -device.provider').sort('-date').limit(15).exec(function(err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else {res.send(data); }
	});		
});

app.del('/Event/:id', function(req, res) {
	Event.remove({ _id: req.params.id }, function (err, data) {
		 res.send({});
	});
});





//-----------RemoteControlSchema---------------------------------------------
var RemoteControlSchema = new Schema({
	code: Number,
	binCode: String,	
	name: String,
	activeArea: String,
	isLock: {type : Boolean, 'default': null},
	isBatteryLow: {type : Boolean, 'default': null},
	date: Date
});
mongoose.model('RemoteControl', RemoteControlSchema); 
var RemoteControl = mongoose.model('RemoteControl');

app.get('/RemoteControl', function(req, res) { RemoteControl.find({}).sort('-date').exec(function(err, data) { res.send(data); }); });

app.get('/RemoteControl/:code/:binCode', function(req, res) {

	RemoteControl.findOne({code : req.params.code}, function (err, data) {
		if(data){
			res.send({data:data, existing:true });
		}else{
			RemoteControl.create(req.params, function (err, data) {
				if(err){console.log(err); res.status(500).send(err); }
				res.send({data:data, existing:false });
			});				
		}
	});
});




app.put('/RemoteControl/:id', function(req, res) {
	RemoteControl.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

app.del('/RemoteControl/:id', function(req, res) {
	RemoteControl.findByIdAndRemove(req.params.id, function (err, data) {
		 res.send({});
	});
});




app.put('/RemoteControl/activeArea/:id', function(req, res) {
	RemoteControl.findByIdAndUpdate(req.params.id, {'$set':  {'activeArea':  req.body.activeArea}}, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
});

//--------------------------------------------------------


var lastTime = new Date();
var lastBinCode;
app.post('/433mhz/:binCode', function(req, res) {
	
	var binCode = req.params.binCode;
	
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
		
		Area.findOne({isActivated:true, activeSensors : code.toString() }).exec(function(err, area) {
			if(area){
				WifiSensor.findOne({code:code}, function(err, sensor){
					alarmDetection(sensor, area._id);
				});	
			}
		});		
		
		
		
		WifiSensor.findOneAndUpdate({code : code}, {isOpen:isOpen, isBatteryLow:isBatteryLow}, function (err, data) {
			if(data !== null){
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"wifi-sensor", name:data.name, description:data.description, isOpen:data.isOpen, isBatteryLow:data.isBatteryLow}}, function (err, data) {});
//				if(data.code === 4022 && data.isOpen === true){
//					Sound.playMp3("/home/pi/home-system-node/mp3/portaCucinaAperta.mp3", "95");
//				}
//				if(data.code === 4029 && data.isOpen === true){
//					Sound.playMp3("/home/pi/home-system-node/mp3/portaBagnoAperta.mp3", "95");
//				}
//				if(data.code === 32533){
//					Sound.playMp3("/home/pi/home-system-node/mp3/portaIngressoAperta.mp3", "95");
//				}
//				
//				email("WifiSensor Attivato", data.name + " " + data.description+"\ncode: "+code+"\nbinCode: "+binCode+"\nduration: "+duration);
			}
		});		
		
		RemoteControl.findOne({code : code}).exec(function(err, data) {
			if(data !== null){
				
				var isActivated = null;
				if(binCode.length === 24){ 
					var state = binCode.substr(16,8);
					if(state === "00000011"){ //OFF
						isActivated = false;
					}else if(state === "11000000"){ //ON
						isActivated = true;
					}
				}
				console.log("isActivated",isActivated);
				
				
				if(data.activeArea){
					Area.findByIdAndUpdate(data.activeArea, {isActivated: isActivated}, function (err, data) {
						if(data){
							
							io.sockets.emit("SOCKET-CHANGE-ALARM-STATE", {_id:data._id, isActivated: data.isActivated});
							
							if(data.isActivated){
								Sound.playMp3("/home/pi/home-system-node/mp3/allarmeAttivato.mp3", "95");
							}else{
								disarm(data._id);
								Sound.playMp3("/home/pi/home-system-node/mp3/allarmeDisattivato.mp3", "95");
							}
						}
					});	
				}
				
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"remote-control", name:data.name, description:data.description, isLock:isActivated}}, function (err, data) {});
				//email("RemoteControl Attivato", data.name + " " + data.description+"\ncode: "+code+"\nbinCode: "+binCode+"\nduration: "+duration);
			}
		});	
		
	}

	res.send();
	
});



//************* TESTS ******************
//TEST
//setInterval(function() {
//	
//	Area.findOne({isActivated:true, activeSensors : "GPA-1" }).exec(function(err, area) {
//		if(area){
//			alarmDetection({name:"PIR prescrizione", code:"GPA-1"}, area._id);
//		}
//	});	
//}, 5000);

app.post('/testPir', function(req, res) {
	Area.findOne({isActivated:true, activeSensors : "GPA-1" }).exec(function(err, area) {
		if(area){
			alarmDetection({name:"PIR prescrizione", code:"GPA-1"}, area._id);
		}
	});	
});
