var fs = require('fs');
var env = process.env;

var app = require('http').createServer(httpHandler),
    io = require('socket.io').listen(app),
    redis = require('redis').createClient(Number(env['redis_port'] || 6379),
                                          env['redis_host'] || '127.0.0.1',
                                          Number(env['redis_db'] || 0)),
    numberOfClients = 0,
    recentMessages = {};

app.listen(env['PORT'] || 3000);

redis.on("error", function (err) {
  console.log("Error " + err);
});

redis.on("message", redisHandler);

function httpHandler(request, response) {
  var m;
  if (m = request.url.match(/^\/recent\/(.+)/)) {
    var channel = m[1];
    response.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8",
                             'Access-Control-Allow-Origin': '*',
                             'Access-Control-Allow-Credentials': 'true'});
    output = JSON.stringify(recentMessages[channel] || []);
    response.end(output);

  } else {
    response.writeHead(200, {"Content-Type": "text/plain"});
    output = "" + numberOfClients;
    response.end(output);
  }
}

function redisHandler(pubsubChannel, message) {
  var msgParsed = JSON.parse(message);
  var channel = msgParsed['log_channel'];
  if (!recentMessages[channel]) {
    recentMessages[channel] = [];
  }
  var msgList = recentMessages[channel];
  msgList.push(msgParsed);
  while (msgList.length > 20) {
    msgList.shift();
  }
  io.of('/'+channel).emit('log_message', message);
}


// io.configure(function() {
//   io.set('log level', 1);
//   io.set("transports", ["xhr-polling"]);
//   io.set("polling duration", 10);
// });

io.sockets.on('connection', function(socket) {
  numberOfClients++;
  socket.on('disconnect', function() {
    numberOfClients--;
  });
});


if (env['redis_password']) {
  redis.auth(env['redis_password']);
}
redis.subscribe('tracker-log');

