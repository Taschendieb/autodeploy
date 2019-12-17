#!/usr/bin/node

let server = require("../lib/server.js")

const yargs = require('yargs');
const config = require("../lib/config.js")
const path = require("path");
const pm2 = require('pm2');


/*
 pm2.connect(function(err) {
  if (err) {
    throw err;
    process.exit(2);
  } else {
      pm2.start("../lib/server.js", (err) => {
          if (err) console.log("server.js is already running");
      }
  } 
  pm2.disconnect();
}
*/

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
        config.appendDeployment({
            name: name,
            url: argv.url,
            path: path.resolve(argv.path)
        })
    })
    .command(['list', 'ls'], 'list all deployments', (yargs) => {}, async (argv) => {
        const deployments = await config.listDeployments()
        console.table(deployments, )
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
        server.start()
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



