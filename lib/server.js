#!/usr/bin/node

const config = require('./config.js')
const { exec } = require('child_process');

var http = require('http');

const server = http.createServer(function (req, res) {}).listen(1337);

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
            onWebhookReceived(request.url, request.headers["x-github-event"], body)
            response.writeHead(200, {
                'Content-Type': 'text/html'
            })
            response.end('post received')
        })
    }

    response.end()
})

exports.start = async function () {
}

exports.stop = function () {
    server.close()
}

async function onWebhookReceived(url, event, data) {
    switch (event) {
        default: {
            payload = JSON.parse(data)
            deployment = await config.getDeployment(payload.repository.name)
            if (deployment === null) {
                return;
            }

            branch = payload.ref.split("/").slice(-1)[0]
            trigger = deployment.trigger.find(e => e.event == event && e.branch == branch)
            if (trigger === undefined) {
                return;
            }

            runActions(deployment.path, trigger.actions)
            break;
        }
    }
}

function runActions(path, actions) {
    actions.forEach(action => {
        const cmd = `cd ${path} && ${action.action}`
        exec(cmd, (err, stdout, stderr) => {
            console.log(err, stdout, stderr)
        })
    });
}