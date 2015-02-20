

var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var movies = require('./routes/movies');

mongoose.connect('mongodb://10.221.160.78/home-system');


//app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', movies);
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;

var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);

});

//Web Socket Connection
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
	
	socket.on('message', function (data) {console.log("message: "+ data); });
	socket.on('disconnect', function () {console.log("socket disconnect");  });
	
	
	socket.on('ferret', function (arg1,arg2, back) {
		back('ok');
	});	
	
	socket.on('ping', function(data) {
	    console.log(data);
	    var delay = data.duration;
	
	    setTimeout(function(){
	        socket.emit("pong");
//	    	socket.broadcast.emit("pong");
	    }, delay*1000);
	
	});

});




//List products
//app.get('/api/products', function(req, res) {
//	return ProductModel.find(function(err, products) {
//		if (!err) {
//			return res.send(products);
//		} else {
//			return console.log(err);
//		}
//	});
//}); 


