#!/usr/bin/env node
import meow from "meow";
import herokuConnectConfigurationCompare from "./index.js";

// TODO add heroku alias option

const cli = meow([
	"Usage",
	"  $ heroku-connect-configuration-compare [appName1] [appName2]",
	"",
	"Examples",
	"  $ heroku-connect-configuration-compare one-heroku-appname other-heroku-appname",
]);

herokuConnectConfigurationCompare(cli.input[0], cli.input[1]);
