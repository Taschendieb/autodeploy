const fs = require("fs")

const homedir = require('os').homedir();
const configDir = homedir + "/.autodeploy"
const configPath = configDir + "/config.json"

exports.createConfigIfNonExistent = async function() {
    if (!fs.existsSync(configDir)) {
        fs.mkdir(configDir, () => {})
    }
    
    if (!fs.existsSync(configPath)) {
        // Create JSON Schema
        schema = {
            config: {},
            deployments: []
        }
        await fs.writeFile(configPath, JSON.stringify(schema), (err) => {
            if (err) {
                throw err;
            }
        })
    } 
}

exports.appendDeployment = async function(deployment) {
    exports.createConfigIfNonExistent()
    fs.readFile(configPath, function (err, data) {
        if (err) {
            throw err;
        }
    
        let json = JSON.parse(data)
        json.deployments.push(deployment)
    
        fs.writeFile(configPath, JSON.stringify(json), (err) => {
            if (err) {
                throw err;
            }
        })
    });
}

exports.updateDeployments = async function(deployments) {
    exports.createConfigIfNonExistent()
    fs.readFile(configPath, (err, data) => {
        if (err) {
            throw err;
        }

        d = JSON.parse(data)
        d.deployments = deployments
        fs.writeFile(configPath, JSON.stringify(d), (err) => {
            if (err) {
                throw err;
            }
        })
    });
}

exports.listDeployments = async function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(configPath)) {
            resolve([]);
        } else {
            fs.readFile(configPath, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    resolve(JSON.parse(data).deployments);
                }
            });
        }
    });
}

exports.getDeployment = async function(name) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(configPath)) {
            resolve(null);
        } else {
            fs.readFile(configPath, async (err, data) => {
                if (err) {
                    throw err;
                } else {
                    let d = JSON.parse(data).deployments
                    const e = d.find(element => element.name == name);
                    if (e === undefined) {
                        resolve(null)
                    }
                    else {
                        resolve(e)
                    }
                }
            });
        }
    })
}

exports.deleteDeployment = async function(name) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(configPath)) {
            resolve(false);
        } else {
            fs.readFile(configPath, async (err, data) => {
                if (err) {
                    throw err;
                } else {
                    let d = JSON.parse(data).deployments
                    const e = d.find(element => element.name == name);
                    if (e === undefined) {
                        resolve(false)
                    }
                    else {
                        d = d.splice(d.indexOf(e), 0)
                        await exports.updateDeployments(d)
                        resolve(true)
                    }
                }
            });
        }
    })
}