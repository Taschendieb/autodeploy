#!/usr/bin/node

const logic = require('../lib/logic.js');
const config = require("../lib/config.js");

const yargs = require('yargs');
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
    }, async (argv) => {
        if (argv.name === undefined) {
            name = argv.url.split("/").pop()
        } else {
            name = argv.name
        }
        deployment = await config.getDeployment(name);
        if (deployment !== null) {
            console.log(`Deployment with name '${name}' already exists! please specify a different name`);
            return;
        }
        logic.initRepository(path.resolve(argv.path), argv.url, argv.force).then(() => {
            console.log(`Creating Deployment. Please point the WebHook to port ${config.settings.port}`);
            config.appendDeployment({
                name: name,
                url: argv.url,
                path: path.resolve(argv.path),
                trigger: [{
                    event: "push",
                    branch: "master",
                    actions: [{
                        name: "pull",
                        action: "git reset --hard origin/master && git pull"
                    }]
                }]
            });
        })
    })
    .command(['list', 'ls'], 'list all deployments', (yargs) => {}, async (argv) => {
        const deployments = await config.listDeployments()
        console.table(deployments,["name","url","path"])
    })
    .command(['autostart', 'as'], 'register server to automatically start', (yargs) => {}, async (argv) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.warn("Run pm2 startup to start AutoDeploy on reboot!")
            pm2.start(__dirname + '/../lib/server.js',{
                "name": "AutoDeploy Server"
            }, function (err) {
                pm2.disconnect();
                if (err) console.log("PM2 daemon is already running!" + err);
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
        child_process.spawn('node', [__dirname + "/../lib/server.js"], {stdio: 'inherit'});
    })
    .option('force', {
        alias: 'f',
        type: 'boolean',
        description: 'force command'
    })
    .demandCommand()
    .argv