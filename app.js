

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require("request");

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config.json');




//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(process.env.PORT || 8080, function () {
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

//	socket.on('change-alarm-state', function(data) {
//	    socket.broadcast.emit("change-alarm-state", data);
//	});	
//	

});


//setInterval(function () {
//	
//	//io.sockets.emit('test', {r:"OK"});
//
//	}, 2000);



mongoose.connect('mongodb://10.221.160.78/home-system');
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
	 });
});





//-----------WifiSensor---------------------------------------------
var WifiSensorSchema = new Schema({
	id: String,
	bits: String,
	binCode: String,
	decCode: String,
	name: String,
	description: String,
	sensorState: String,
	batteryState: String,
	date: Date	
});
mongoose.model('WifiSensor', WifiSensorSchema); 
var WifiSensor = mongoose.model('WifiSensor');



app.get('/WifiSensor', function(req, res) {
	WifiSensor.find({}).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.get('/WifiSensor/:binCode', function(req, res) {
	console.log("get WifiSensor body: ", req.body);
	console.log("get WifiSensor params: ", req.params);	
	WifiSensor.find(req.params).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.put('/WifiSensor', function(req, res) {
//	console.log("put WifiSensor: ", req.body);
	WifiSensor.update({binCode : req.body.binCode}, req.body, {upsert : true}, function (err, data) {
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
	code : {type : Number, required : true},
	name : {type : String, required : true},
	sensors: [{type: Schema.ObjectId, ref: 'WifiSensor' }],
//	sensors: [WifiSensorSchema],
	date: Date	
});
mongoose.model('Area', AreaSchema); 
var Area = mongoose.model('Area');





//--------------------------------------------------------

app.post('/433mhz/:bits/:binCode/:decCode', function(req, res) {
	
	

	
	
	//controlling if alarm is activated
	AlarmState.findOne({}).sort('-date').exec(function(err, alarmState) {

		if(alarmState.state !== "OFF"){
//			console.log(err, alarmState);
			Area.findOne({name : alarmState.state}).populate('sensors').exec(function(err, area) {

//				console.log(err, area);
				for ( var i = 0; i < area.sensors.length; i++) {
					var sensor = area.sensors[i];
					
					if(sensor.binCode ===  req.params.binCode){
						io.sockets.emit("ALARM_DETECTION", sensor);
						break;
					}
				}
				
				

				
				
				
			});		
		}else{
			io.sockets.emit("433mhz", req.params);
		}
		
	});

	

//	AlarmState.findOne({}).sort('-date').populate("Area").exec(function(err, data) {
//		console.log(err, data);
//		if(data.state !== "OFF"){
//			io.sockets.emit("ALARM_DETECTION", {name:"camera 1"});
//		}
//		
//	});	
	
		
		

//	WifiSensor.find({}).sort('-date').exec(function(err, data) {
//	
//		
//		Area.update({code:1}, {code:1,name:"HOME", sensors: data, date: Date.now()}, {upsert : true}, function (err, data) {
//		});		
//	
//	});
	
//	Area.findOne({}).populate('sensors').exec(function(err, data) {
//		console.log(err, data);
//	});	
	

	res.send();
	
});



function switchOnAlarm() {
	
}


function switchOffAlarm() {
	
}






app.post('/message', function(req, res) {

     Message.create(req.body, function (err, data) {
		console.log(data); 
	    res.send(req.body);
	 });

});
app.get('/message', function(req, res) {
	
//	Message.find({}).sort('-date').exec(function(err, data) {
//		console.log(data); 
//		res.send(data);
//	});
	
//	Message.find({'_id': '54eb0a6efdaf05040bc5ce15'}).exec(function(err, data) {
//		console.log(data); 
//		res.send(data);
//	});

//	Message.findOne({}).sort('-date').exec(function(err, data) {
//		console.log(data); 
//		res.send(data);
//	});
	
//	Message.update({message:"name2"}, 
//		    {$set : {date: Date.now()}}, 
//		    {upsert : true, multi:true}, function (err, data) {
//		    	console.log(err, data); 
//		        res.send(data);
//	});	

	request({
		  uri: "http://10.221.6.69:8080/WifiSensor",
		  method: "GET",
		}, function(error, response, body) {
		  console.log(body);
		});
	
//	  request({
//		  url: '/WifiSensor'
//		}, function (err, res, data) {
//		  console.log(data);
//		});	
	 
});

app.get('/message/:id', function (req, res, next) {
	Message.findById(req.params.id).exec(function(err, data) {
		console.log(data); 
		res.send(data);
	});	  
});



app.del('/message', function(req, res) {
	 console.log(req.body);
	 Message.remove({_id:'54eb0a6efdaf05040bc5ce15'}, function (err, data) {
		 console.log(data); 
		 res.send(data);
	 });
	 
});

app.put('/message', function(req, res) {
	 console.log(req.body);

	 Message.update({_id:'54eb0a6efdaf05040bc5ce15'}, req.body, function (err, data) {
		 console.log(data); 
		 res.send(data);
	 });

//	 Message.update({message : "123123sldfjdsdl hlfdss"}, req.body, {multi:true}, function (err, data) {
//		 console.log(data); 
//		 res.send(data);
//	 });
	 
//		WifiSensor.update({binCode:req.body.binCode}, req.body {$set : {date: Date.now()}}, {upsert : true, multi:true}, function (err, data) {
// 	console.log(err, data); 
//     res.send(data);
//	});		 
	 
});
app.put('/message/:id', function (req, res, next) {
	
	 Message.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
		 console.log(data); 
		 res.send(data);
	 });	
	
});



//app.route('/message')
//.all(function(req, res, next) {next();})
//.delete(function(req, res, next) {})
//.get(function(req, res, next) {})
//.post(function(req, res, next) {});




