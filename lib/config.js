const fs = require("fs")

exports.createConfigIfNonExistent = async function() {
    if (!fs.existsSync(__dirname + "/apimap.json")) {
        // Create JSON Schema
        schema = {
            config: {},
            deployments: []
        }
        await fs.writeFile(__dirname + "/apimap.json", JSON.stringify(schema), (err) => {
            if (err) {
                throw err;
            }
        })
    } 
}

exports.appendDeployment = async function(deployment) {
    exports.createConfigIfNonExistent()
    fs.readFile(__dirname + "/apimap.json", function (err, data) {
        if (err) {
            throw err;
        }
    
        let json = JSON.parse(data)
        json.deployments.push(deployment)
    
        fs.writeFile(__dirname + "/apimap.json", JSON.stringify(json), (err) => {
            if (err) {
                throw err;
            }
        })
    });
}

exports.updateDeployments = async function(deployments) {
    exports.createConfigIfNonExistent()
    fs.readFile(__dirname + "/apimap.json", (err, data) => {
        if (err) {
            throw err;
        }

        d = JSON.parse(data)
        d.deployments = deployments
        fs.writeFile(__dirname + "/apimap.json", JSON.stringify(d), (err) => {
            if (err) {
                throw err;
            }
        })
    });
}

exports.listDeployments = async function() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(__dirname + "/apimap.json")) {
            resolve([]);
        } else {
            fs.readFile(__dirname + "/apimap.json", (err, data) => {
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
        if (!fs.existsSync(__dirname + "/apimap.json")) {
            resolve(null);
        } else {
            fs.readFile(__dirname + "/apimap.json", async (err, data) => {
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
        if (!fs.existsSync(__dirname + "/apimap.json")) {
            resolve(false);
        } else {
            fs.readFile(__dirname + "/apimap.json", async (err, data) => {
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
