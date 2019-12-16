#!/usr/bin/node

var fs = require("fs")

const yargs = require('yargs');
const config = require("../lib/config.js")
const path = require("path");

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
    .alias("ls", "list")
    .command('list', 'list all deployments', (yargs) => {}, (argv) => {
        console.table(config.listDeployments())
    })
    .command('remove <name>', 'remove a deployment', (yargs) => {
        yargs
            .positional('name', {
                describe: 'name of the deployment',
            })
    }, (argv) => {
        if (config.deleteDeployment(argv.name)) {
            console.log(argv.name + " successfully removed")
        } else {
            console.log("error removing " + argv.name)
        }

    }).argv

/*
// autodeploy giturl Mantis /home/penis/mantis
/*

.command('list', 'list all deployments', (yargs) => {}, (argv) => {
        console.table(config.listDeployments())
    }).command('remove <name>', 'remove a deployment', (yargs) => {}, (argv) => {
        yargs
            .positional('name', {
                describe: 'name of the deployment',
            })
    }, (argv) => {
        if (config.deleteDeployment(argv.name)) {
            console.log(argv.name + " successfully removed")
        } else {
            console.log("error removing " + argv.name)
        }

    }).argv

{
    deployments: [
        {
            name:
            url:
            path:
        }
    ]
}

*/


// autodeploy https://github.com/colodenn/Mantis Mantis .
// adding mantis and path to apimap.json
// git clone repo to path 
// adding deploy.sh for additional deploy configuration e.g. flask serve, service start usw..



// curl -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" -X POST localhost:1337
// https://nodejs.org/api/http.html#http_class_http_incomingmessage