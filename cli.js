#!/usr/bin/env node
'use strict';
var meow = require('meow');
var herokuConnectConfigurationCompare = require('./');

// TODO add heroku alias option

var cli = meow([
	'Usage',
	'  $ heroku-connect-configuration-compare [appName1] [appName2]',
	'',
	'Examples',
	'  $ heroku-connect-configuration-compare one-heroku-appname other-heroku-appname'
]);

herokuConnectConfigurationCompare(cli.input[0], cli.input[1]);
