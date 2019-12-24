# Autodeploy 

Autodeploy is a small and highly customizable CLI-Tool to automatically deploy your git repo and execute arbitrary commands/scripts after a specific git action (e.g. push, merge, ...)
Currently only GitHub is supported.  
![logo](https://raw.githubusercontent.com/Taschendieb/autodeploy/master/icon.png)

## Installation

### Using NPM
```bash
npm install @taschendieb/autodeploy -g
```

### Using YARN
```bash
yarn global add @taschendieb/autodeploy
```

## Usage

Go to "Settings" in your repository and add a webhook to your website/ip with _port 1337_ (example.com:1337). Subsequently check "Send me everything".
The port can be changed in the configuration.

```bash
autodeploy deploy <giturl> <path> [name]
```

This will clone the repository into the specified path and register the webhook internally.

_by default this will deploy your git repo after a push on master_

For adding custom actions see the 'Customization' section

Finally run the server in listen mode:

```bash
autodeploy listen
```

or register the application to automatcally start on boot

```bash
autodeploy autostart
```

## Configuration

Autodeploy was designed to be as flexible as possible. Therefore you can configure global settings and deployment actions via a JSON configuration.
This file is located by default in "~/.autodeploy/config.json"

The Structure looks as follows:

```JSON
{
    // This section is for application-wide configurations
    "settings": {
        "port": 1337 // port the server listens to
    },
    // Deployments are configured in this section
    "deployments": [
        {
            "name": "", // user-specified name
            "url": "", // url of repository
            "path": "", // path in filesystem
            "trigger": [
                {
                    "event": "push", // one of githubs webhook events
                    "branch": "master", // affected branch
                    // When trigger condition (event and branch matching) is true the following actions will be performed in the order they are listed
                    "actions": [
                        {
                            "name": "pull", // user-specified name for reference
                            "action": "git reset --hard origin/master && git pull" // shell commannd to execute
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

[Hannes Burger](https://github.com/burgha)

[Cornelius Denninger](https://codenn.de)
