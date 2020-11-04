import { copyFileSync } from "fs";
import meow from "meow";

const cli = meow(`Heroku CLI mock`, {
	flags: {
		app: {
			type: "string",
			alias: "a",
		},
	},
});
const appName = cli.flags["app"];

const sourcePath = `../fixtures/${appName}.json`;
const destPath = `${appName}-herokuconnect-test.json`;

console.info(`[Heroku CLI Mock] Copy file: ${sourcePath} -> ${destPath}`);

copyFileSync(sourcePath, destPath);
