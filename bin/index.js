#!/usr/bin/node

const logic = require('../lib/logic.js');

const yargs = require('yargs');
const config = require("../lib/config.js");
const path = require("path");
const pm2 = require('pm2');
const child_process = require('child_process');

yargs
    .command('deploy <url> <path> [name]', 'map a deployment', (yargs) => {
        yargs
            .positional('url', {
                describe: 'Url of the repo',
            })
            .positional('path', {
                describe: 'path to clone into',
            })
            .positional('name', {
                describe: 'name of the project',
            })
    }, (argv) => {
        if (argv.name === undefined) {
            name = argv.url.split("/").pop()
        } else {
            name = argv.name
        }
        logic.initRepository(path.resolve(argv.path), argv.url, argv.force)
        config.appendDeployment({
            name: name,
            url: argv.url,
            path: path.resolve(argv.path),
            trigger: [{
                event: "push",
                branch: "master",
                actions: [{
                    name: "pull",
                    action: "git reset --hard origin/master"
                }]
            }]
        })
    })
    .command(['list', 'ls'], 'list all deployments', (yargs) => {}, async (argv) => {
        const deployments = await config.listDeployments()
        console.table(deployments,["name","url","path"])
    })
    .command(['autostart', 'as'], 'autostart', (yargs) => {}, async (argv) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }
            console.warn("Run pm2 startup to start AutoDeploy on reboot!")
            pm2.start('./lib/server.js',{
                "name": "AutoDeploy Server"
            }, function (err) {
                pm2.disconnect();
                if (err) console.log("PM2 daemon is already running!");
            });
        });
    })
    .command(['remove <name>', 'rm <name>'], 'remove a deployment', (yargs) => {
        yargs
            .positional('name', {
                describe: 'name of the deployment',
            })
    }, async (argv) => {
        const res = await config.deleteDeployment(argv.name)
        if (res) {
            console.log(argv.name + " successfully removed")
        } else {
            console.log("error removing " + argv.name)
        }

    })
    .command('listen', 'listen for changes to the repo', (argv) => {
        child_process.spawn(__dirname + "/../lib/server.js", [], {stdio: 'inherit'});
    })
    .option('force', {
        alias: 'f',
        type: 'boolean',
        description: 'force command'
    })
    .demandCommand()
    .argv

/*
// autodeploy giturl Mantis /home/penis/mantis

{
    config: {},
    deployments: [
        {
            name: ""
            url: ""
            path: ""
            "trigger": [
                {
                    "event": "push",
                    "branch": "master",
                    "actions": [
                        {
                            "name": "pull",
                            "action": "git pull"
                        },
                        {
                            "name": "restart",
                            "action": "./deploy.sh"
                        }
                    ]
                }
            ]
        }
    ]
}

// autodeploy https://github.com/colodenn/Mantis Mantis .
// adding mantis and path to apimap.json
// git clone repo to path 
// adding deploy.sh for additional deploy configuration e.g. flask serve, service start usw..



// curl -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" -X POST localhost:1337
// https://nodejs.org/api/http.html#http_class_http_incomingmessage

*/