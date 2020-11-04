import test from "ava";
import fn from "./index.js";

const appName1 = "input1";
const appName2 = "input2";

test("Should displayed diff ", async (t) => {
	const actual = await fn(appName1, appName2, {
		cli: "node ../test.heroku.cli.mock.js",
	});
	t.is(actual, Promise.resolve);
});
