const fs = require("fs")
const child_process = require('child_process');
const config = require("./config.js")

exports.onWebhookReceived = async function (url, event, data) {
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
        child_process.exec(cmd, (err, stdout, stderr) => {
            console.log("executed '" + cmd + "'")
        })
    });
}

exports.initRepository = function (path, url, force = false) {
    return new Promise((resolve, reject) => {
        // ensure directory exists
        if (!fs.existsSync(path)) {
            fs.mkdir(path, () => {});
        }

        fs.readdir(path, function (err, files) {
            if (err) {
                throw err
            } else {
                if (files.length > 0 && !force) {
                    console.log("WARNING: Directory not empty: Run command with '--force' to overwrite existing files!")
                } else {
                    const rm_process = child_process.exec("rm -R " + path)
                    rm_process.on('exit', function() {
                        const cmd = `cd ${path} && git clone ${url} .`;
                        child_process.spawn("git", ["clone", url, path], {stdio: 'inherit'});
                        resolve(true);
                    })
                }
            }
        });
    })
}