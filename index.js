'use strict';

const fs = require('fs');
const path = require('path');
const jsdiff = require('diff');
const shell = require('shelljs');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const herokuConnectConfigurationComb = require('heroku-connect-configuration-comb');

const WORK_DIR = '.herokuConnectConfigurationCompare_tmp';

function exportConfiguration(appName) {
	return new Promise((resolve, reject) => {
		shell.exec(`heroku connect:export --app ${appName}`, (code, stdout, stderr) => {
			if (code !== 0) {
				reject(stderr);
			}
			// [MEMO] herokuコマンドが出力するファイル名WORK_DIRから取得する
			// ファイル名の先頭はappNameから始まる heroku-app-name-herokuconnect-rectangular-5141.json
			const dirents = fs.readdirSync(WORK_DIR, { withFileTypes: true });
			const fileName = dirents
				.filter(dirent => dirent.isFile())
				.filter(({ name }) => new RegExp(`${appName}-herokuconnect-.+\\.json`).exec(name))
				.map(({ name }) => name)[0];
			const filePath = `${WORK_DIR}/${fileName}`
			resolve(filePath);
		});
	});
}

function combConfiguration(input) {
	return new Promise((resolve, reject) => {
		herokuConnectConfigurationComb(input)
			.then(() => {
				resolve(input);
			});
	});
}

function readConfiguration(input) {
	return new Promise((resolve, reject) => {
		const inputFile = path.join(process.cwd(), input);
		fs.readFile(inputFile, {
			encoding: 'utf-8'
		}, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve({
				inputFile: inputFile,
				data: data
			});
		});
	});
}

function fetchConfiguration(appName) {
	return new Promise((resolve, reject) => {
		exportConfiguration(appName)
			.then(combConfiguration)
			.then(readConfiguration)
			.then((data) => {
				resolve(data);
			});
	});
}

function fetchConfigurations(appName1, appName2) {
	return new Promise((resolve, reject) => {
		Promise.all([
			fetchConfiguration(appName1),
			fetchConfiguration(appName2)
		]).then((data) => resolve(data));
	});
}

function evaluateDiff(data) {
	return jsdiff.structuredPatch('oldFileName', 'newFileName', data[0].data, data[1].data);
}

function report(data) {
	console.log(`Index:`);
	console.log(`===================================================================`);
	console.log(chalk.blue(`---`));
	console.log(chalk.red(`+++`));

	data.hunks.forEach((hunk) => lineReporter(hunk));
	return Promise.resolve();
}

function lineReporter(data) {
	console.log(chalk.blue(`@@`, `-${data.oldStart},${data.oldLines}`), chalk.red(`+${data.newStart},${data.newLines}`, `@@`));

	data.lines.forEach((line) => {
		const color = line.startsWith('+') ? 'blue' : line.startsWith('-') ? 'red' : 'white';
		console.log(chalk[color](line));
	});
}

function before() {
	mkdirp(WORK_DIR);
	return Promise.resolve();
}

function after() {
	shell.cd('../');
	// TODO add options
	// shell.rm('-rf', WORK_DIR);
	return Promise.resolve;
}

function HerokuConnectConfigurationCompare(appName1, appName2, opts) {
	opts = opts || {};

	return new Promise((resolve, reject) => {
		before()
			.then(() => fetchConfigurations(appName1, appName2))
			.then(evaluateDiff)
			.then(report)
			.then(after);
	});
}

module.exports = HerokuConnectConfigurationCompare;
