#!/usr/bin/node
const logic = require('./logic.js')
const config = require('./config.js')

var http = require('http');

const port = 1337
let server

async function start() {
    server = http.createServer(function (req, res) {}).listen(port);
    console.log(`Server listening on port ${port}`)

    server.on("request", (request, response) => {
        console.log("request")
    
        response.writeHead(200, {
            'Accept': 'application/json'
        });
        response.write('This is Autodeploy v0.1 © Taschendieb 2019');
    
        if (request.method == 'POST') {
            var body = ''
            request.on('data', function (data) {
                body += data
            })
            request.on('end', function () {
                logic.onWebhookReceived(request.url, request.headers["x-github-event"], body)
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                response.end('post received')
            })
        }
    
        response.end()
    })
}

function stop() {
    server.close()
}

start()