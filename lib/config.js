const fs = require("fs")

exports.createConfigIfNonExistent = async function() {
    if (!fs.existsSync("lib/apimap.json")) {
        // Create JSON Schema
        schema = {
            config: {},
            deployments: []
        }
        await fs.writeFile("lib/apimap.json", JSON.stringify(schema), (err) => {
            if (err) {
                throw err;
            }
        })
    } 
}

exports.appendDeployment = function(deployment) {
    exports.createConfigIfNonExistent()
    fs.readFile("lib/apimap.json", function (err, data) {
        if (err) {
            throw err;
        }
    
        let json = JSON.parse(data)
        json.deployments.push(deployment)
    
        fs.writeFile("lib/apimap.json", JSON.stringify(json), function (err) {
            if (err) {
                throw err;
            }
        })
    });
}


exports.listDeployments = function() {
    if (!fs.existsSync("lib/apimap.json")) {
        return [];
    } else {
        fs.readFile("lib/apimap.json", function (err, data) {
            if (err) {
                throw err;
            } else {
                return data.deployments;
            }
        });
    }
}

exports.deleteDeployment = function(name) {
    if (!fs.existsSync("lib/apimap.json")) {
        return false;
    } else {
        fs.readFile("lib/apimap.json", function (err, data) {
            if (err) {
                throw err;
            } else {
                return data.deployments.find(element => element.name == name);
            }
        });
    }
}
