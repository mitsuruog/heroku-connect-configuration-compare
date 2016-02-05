# heroku-connect-configuration-compare [![Build Status](https://travis-ci.org/mitsuruog/heroku-connect-configuration-compare.svg?branch=master)](https://travis-ci.org/mitsuruog/heroku-connect-configuration-compare)

> Fetch two Heroku Connect Configuration and Compare together

![thumbnail](thumbnail.png)

## Install

```
$ npm install --save heroku-connect-configuration-compare
```


## Usage

```js
const herokuConnectConfigurationCompare = require('heroku-connect-configuration-compare');

herokuConnectConfigurationCompare('one-heroku-appname', 'other-heroku-appname');

```

## API

### herokuConnectConfigurationCompare(appName1, appName2)

#### appName1

Type: `string`

the first heroku app name to be compared.

#### appName2

Type: `string`

the second heroku app name to be compared.

## CLI

```
$ npm install --global heroku-connect-configuration-compare
```

```
$ heroku-connect-configuration-compare --help

  Usage
    heroku-connect-configuration-compare [appName1] [appName2]

  Examples
    $ heroku-connect-configuration-compare one-heroku-appname other-heroku-appname

```


## License

MIT © [mitsuruog](https://github.com/mitsuruog)
