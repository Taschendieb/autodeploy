#!/usr/bin/node
var http = require('http');
const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Accept': 'application/json'});
  res.write('This is Autodeploy v0.1 © Taschendieb 2019');
  res.end();
}).listen(1337);

server.on("request", (request, response) => {
    if (request.method == 'POST') {
        var body = ''
        request.on('data', function(data) {
          body += data
        })
        request.on('end', function() {
          onWebhookReceived(request.url, body)
          response.writeHead(200, {'Content-Type': 'text/html'})
          response.end('post received')
        })
    }
})

function onWebhookReceived(url, data) {
    console.log(url, data)
}
