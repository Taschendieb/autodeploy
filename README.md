# Autodeploy 

Autodeploy is a npm package to automatically deploy your git repo after a specific git action (push, merge, ...)  
![alt text](https://raw.githubusercontent.com/Taschendieb/autodeploy/master/Element%201.png)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Autodeploy.

```bash
npm i @taschendieb/autodeploy -g
```

## Usage

Go to "Settings" in your repository and add a webhook to your website/ip with _port 1337_ (example.com:1337). Subsequently check "Send me everything"

```bash
autodeploy deploy <giturl> <path> [name]
```

```bash
autodeploy autostart
```

_by default this will deploy your git repo after a push on master_

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

Hannes Burger

[Cornelius Denninger](https://codenn.de)
