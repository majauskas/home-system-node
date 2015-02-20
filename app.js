
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , url= require('url')
  , fs = require('fs');

app.listen(8080);

// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;
      
    // Managing the root route
    if (path == '/') {
    
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {
                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, function(error,data) {
                res.writeHead(200,{'Content-Type': 'text/javascript'});
                res.end(data);
            });
    }else if( /\.(css)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, function(error,data) {
                res.writeHead(200,{'Content-Type': 'text/css'});
                res.end(data);
            });
    }else if( /\.(gif|png)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, function(error,data) {
                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }

}
           
// Web Socket Connection
io.sockets.on('connection', function (socket) {

  // If we recieved a command from a client to start watering lets do so
  socket.on('ping', function(data) {
      console.log("ping "+ data.duration);


      delay = data["duration"];

      // Set a timer for when we should stop watering
      setTimeout(function(){
          socket.emit("pong");
      }, delay*1000);

  });
  
});