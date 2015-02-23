

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config.json');


mongoose.connect('mongodb://10.221.160.78/home-system');
var Schema = mongoose.Schema;

var AlarmStateSchema = new Schema({
	state: String,
	user: String,
	provider: String,
	date: Date	
});



var MessageSchema = new Schema({
	message: String,
	date: Date	
});


mongoose.model('Message', MessageSchema); 
mongoose.model('AlarmState', AlarmStateSchema); 


var Message = mongoose.model('Message');
var AlarmState = mongoose.model('AlarmState');

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
	
	
	socket.on('ferret', function (arg1,arg2, back) {
		back('ok');
	});	

	socket.on('change-alarm-state', function(data) {
	    socket.broadcast.emit("change-alarm-state", data);
	});	
	

});









//---------------------------------------------------------------------

app.get('/AlarmState', function(req, res) {
	AlarmState.findOne({}).sort('-date').exec(function(err, data) {
		res.send(data);
	});
});
app.post('/AlarmState', function(req, res) {
	AlarmState.create(req.body, function (err, data) {
	    res.send(data);
	 });
});












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

	Message.findOne({}).sort('-date').exec(function(err, data) {
		console.log(data); 
		res.send(data);
	});
	 
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




