var env = process.env;
var http = require('http');

function simpleResponse(response, status, body) {
  response.writeHead(status, {
    'Content-Length': body.length,
    'Content-Type': 'text/plain'
  });
  response.write(body);
  response.end();
}

function handleRequest(request, response) {
  console.log(request.url);

  if (request.method != 'PUT') {
    simpleResponse(response, 405, '');
    return;
  }

  if (!request.url.match(/^\/[a-z0-9]+\/upload\//)) {
    simpleResponse(response, 405, '');
    return;
  }

  var req = http.get('http://tracker.archiveteam.org'+request.url, function(res) {
    var str = '';
    res.on('data', function(chunk) {
      str += chunk;
    });
    res.on('end', function(chunk) {
      if (res.statusCode==200) {
        if (str!='') {
          console.log(request.url+' -> '+str);
	  var body = '';
          response.writeHead(302, {
            'Content-Length': body.length,
            'Content-Type': 'text/plain',
	    'Location': str
          });
          response.write(body);
          response.end();
	} else {
          simpleResponse(response, 429, '');
	}
      } else {
        simpleResponse(response, 405, '');
      }
    });
  }).on('error', function(e) {
    simpleResponse(response, 502, '');
  });
}

var server = http.createServer(handleRequest);
server.addListener('checkContinue', handleRequest);
server.listen(env['PORT'] || 3000);

