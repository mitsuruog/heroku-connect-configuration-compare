import { readdirSync, readFile } from "fs";
import { join } from "path";
import { structuredPatch } from "diff";
import shelljs from "shelljs";
import chalk from "chalk";
import mkdirp from "mkdirp";
import herokuConnectConfigurationComb from "heroku-connect-configuration-comb";

const WORK_DIR = ".herokuConnectConfigurationCompare_tmp";

function exportConfiguration(appName) {
	return new Promise((resolve, reject) => {
		shelljs.exec(
			`heroku connect:export --app ${appName}`,
			(code, stdout, stderr) => {
				if (code !== 0) {
					reject(stderr);
				}
				// [MEMO] herokuコマンドが出力するファイル名WORK_DIRから取得する
				// ファイル名の先頭はappNameから始まる heroku-app-name-herokuconnect-rectangular-5141.json
				const dirents = readdirSync("./", { withFileTypes: true });
				const fileName = dirents
					.filter((dirent) => dirent.isFile())
					.filter(({ name }) =>
						new RegExp(`${appName}-herokuconnect-.+\\.json`).exec(name)
					)
					.map(({ name }) => name)[0];
				resolve(fileName);
			}
		);
	});
}

function combConfiguration(input) {
	return new Promise((resolve) => {
		herokuConnectConfigurationComb(input).then(() => {
			resolve(input);
		});
	});
}

function readConfiguration(input) {
	return new Promise((resolve, reject) => {
		const inputFile = join(process.cwd(), input);
		readFile(
			inputFile,
			{
				encoding: "utf-8",
			},
			(err, data) => {
				if (err) {
					reject(err);
				}
				resolve({
					inputFile: inputFile,
					data: data,
				});
			}
		);
	});
}

function fetchConfiguration(appName) {
	return new Promise((resolve) => {
		exportConfiguration(appName)
			.then(combConfiguration)
			.then(readConfiguration)
			.then((data) => {
				resolve(data);
			});
	});
}

function fetchConfigurations(appName1, appName2) {
	return new Promise((resolve) => {
		Promise.all([
			fetchConfiguration(appName1),
			fetchConfiguration(appName2),
		]).then((data) => resolve(data));
	});
}

function evaluateDiff(data) {
	return structuredPatch(
		"oldFileName",
		"newFileName",
		data[0].data,
		data[1].data
	);
}

function report(data) {
	console.log(`Index:`);
	console.log(
		`===================================================================`
	);
	console.log(chalk.blue(`---`));
	console.log(chalk.red(`+++`));

	data.hunks.forEach((hunk) => lineReporter(hunk));
	return Promise.resolve();
}

function lineReporter(data) {
	console.log(
		chalk.blue(`@@`, `-${data.oldStart},${data.oldLines}`),
		chalk.red(`+${data.newStart},${data.newLines}`, `@@`)
	);

	data.lines.forEach((line) => {
		const color = line.startsWith("+")
			? "blue"
			: line.startsWith("-")
			? "red"
			: "white";
		console.log(chalk[color](line));
	});
}

function before() {
	mkdirp(WORK_DIR);
	shelljs.cd(WORK_DIR);
	return Promise.resolve();
}

function after() {
	shelljs.cd("../");
	// TODO add options
	// shell.rm('-rf', WORK_DIR);
	return Promise.resolve;
}

function HerokuConnectConfigurationCompare(appName1, appName2) {
	return new Promise(() => {
		before()
			.then(() => fetchConfigurations(appName1, appName2))
			.then(evaluateDiff)
			.then(report)
			.then(after);
	});
}

export default HerokuConnectConfigurationCompare;
