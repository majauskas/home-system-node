

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require("request");

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config.json');
var os = require('os');
//var gpio = require("pi-gpio");


//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(process.env.PORT || 8081, function () {
  var host = server.address().address;
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
//	socket.on('message', function (data) {console.log("message: "+ data); });
//	socket.on('disconnect', function () {console.log("socket disconnect");  });
	
	socket.on('getWifiSensors', function (arg1,arg2, back) {

		back();
		
		
//		setTimeout(function () {}, 2000);
		
		
	});	
	

	socket.on('switchOffAlarm', function(arg1) {
		console.log("switchOffAlarm");
		switchOffAlarm();
	});	
	
	

// socket.on('change-alarm-state', function(data) {
//	    socket.broadcast.emit("change-alarm-state", data);
//	});	
//	

});


//setInterval(function () {
//	
//	//io.sockets.emit('test', {r:"OK"});
//
//	}, 2000);





function switchOnAlarm(sensor) {
	//sending to client the notification
	io.sockets.emit("ALARM_DETECTION", sensor);
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"web-app", name:"Mobile", description:"Allarme Attivato"}}, function (err, data) {});
	
	//TODO: activate the siren and email/sms notifications
//	gpio.open(16, "output", function(err) {     // Open pin 16 for output 
//	    gpio.write(16, 1, function() {          // Set pin 16 high (1) 
//	        gpio.close(16);                     // Close pin 16 
//	    });
//	});
	
}


function switchOffAlarm() {
	
	AlarmState.create({state: "OFF", provider:"web-app", date: new Date()}, function (err, data) {});
	io.sockets.emit("change-alarm-state", {state:"OFF"});	
	
	Event.create({code:"",binCode:"", date: new Date(), device:{provider:"web-app", name:"Mobile", description:"Allarme Disattivato"}}, function (err, data) {});
	
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







var MessageSchema = new Schema({
	message: String,
	date: Date	
});


mongoose.model('Message', MessageSchema); 



var Message = mongoose.model('Message');



//-----------AlarmState---------------------------------------------
var AlarmStateSchema = new Schema({
	state: String,
	user: String,
	provider: String,
	date: Date
//	area: {type: Schema.ObjectId, ref: 'Area' }
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
	    
	    Event.create({code:"",binCode:"", date: new Date(), device:{provider:"web-app", name:"Mobile", description:"cambio stato allarme: "+data.state}}, function (err, data) {});
	    
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
//	console.log("put WifiSensor: ", req.body);
	WifiSensor.update({code : req.body.code}, req.body, {upsert : true}, function (err, data) {
        res.send({});
	});	
});
app.del('/WifiSensor', function(req, res) {
	WifiSensor.remove(req.body, function (err, data) {
		 res.send({});
	 });
});


//wire

//-----------Area---------------------------------------------
var AreaSchema = new Schema({
//	code : {type : Number, required : true, 'default': 1},
	name : {type : String, required : true, unique: true, trim: true},
	description : String,
//	wifisensors: [{type: Schema.ObjectId, ref: 'WifiSensor' }],
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
//		isOpen: {type : Boolean, 'default': null},
//		isBatteryLow: {type : Boolean, 'default': null}		
	}
//	wifisensor : { type: Schema.Types.ObjectId, 'default': null, ref: 'WifiSensor', index: true }
//	date: Date	
	
});
mongoose.model('Event', EventSchema); 
var Event = mongoose.model('Event');

app.get('/Event', function(req, res) {
	Event.find({}).sort('-date').populate('wifisensor','name -_id description isOpen isBatteryLow').limit(30).exec(function(err, data) {
		console.log(err, data);
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
	console.log(req.body);
	RemoteControl.update({_id : req.params.id}, req.body, function (err, data) {
		if(err){console.log(err); res.status(500).send(err); }
		else { res.send({}); }
	});	
	
	
//	console.log(new Area(req.body.area));
	
//	RemoteControl.findByIdAndUpdate(req.params.id, {'$set':  {'area': new Area(req.body.area)}}, function (err, data) {
//		if(err){console.log(err); res.status(500).send(err); }
//		else { res.send({}); }
//	});	
	
	
});

app.del('/RemoteControl', function(req, res) {
	RemoteControl.remove(req.body, function (err, data) {
		 res.send({});
	 });
});











//--------------------------------------------------------

var STATE_OPENED = "0010";

app.post('/433mhz/:binCode', function(req, res) {
	
	
	var binCode = req.params.binCode;
	var code=null;
	
	if(binCode.length === 24 || binCode.length === 40 ){
		
//		if(binCode.length === 24){ code = binCode.substr(0,16);	}
		
//		code = parseInt(code, 2);

				
		
		code = parseInt(binCode.substr(0,16), 2);
		
		console.log("433mhx: ",code, binCode); 
		
		var isOpen = null, isBatteryLow = null; 
		if(binCode.length === 40){ 
			var state = binCode.substr(24,4); 	//1000 - close  0010 - open	0000111110110110000000001000011110110100 (close) 0000111110110110000000000010011110110100 (open)
			console.log(state);
			if(state === "0010"){
				isOpen = true;
			}else if(state === "1000"){
				isOpen = false;
			}
			//			var insertedBatteryState = binCode.substr(28,4); 	//1010 - batt KO inserted  1011 - batt OK inserted
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
					console.log(err, alarmState); 
					console.log(err, area);
        	 
					if(area && area.wifisensors !== undefined){
						for ( var i = 0; i < area.wifisensors.length; i++) {
							var sensor = area.wifisensors[i];
							
							if(sensor.code ===  code){
								switchOnAlarm(sensor);
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
			console.log(err, data);
			if(data !== null){
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"wifi-sensor", name:data.name, description:data.description, isOpen:data.isOpen, isBatteryLow:data.isBatteryLow}}, function (err, data) {});
			}
		});		
		
//		.populate('wifisensor','name -_id description isOpen isBatteryLow')
		RemoteControl.findOne({code : code}).exec(function(err, data) {
//		RemoteControl.findOne({code : code}, function (err, data) {
			if(data !== null){
				
				var isLock = null;
				if(binCode.length === 24){ 
					var state = binCode.substr(16,8);
					console.log(state);
					if(state === "00000011"){ //OFF
						isLock = false;
					}else if(state === "11000000"){ //ON
						isLock = true;
					}
				}
				console.log("------\n",data);
				if(data.area !== null){
					var alarmState = null;
					if(isLock === false){
						alarmState = "OFF";
					}else if(isLock === true){
						alarmState = data.area.name;
					}
					if(alarmState !== null){
						AlarmState.create({state: alarmState, provider:"remote-control", date: new Date()}, function (err, data) {console.log("------\n",data);});
						io.sockets.emit("change-alarm-state", {state:alarmState});						
					}

				}
				
				Event.create({code:code,binCode:binCode, date: new Date(), device:{provider:"remote-control", name:data.name, description:data.description, isLock:isLock}}, function (err, data) {});
			}
		});	
		
	}

	res.send();
	
});







