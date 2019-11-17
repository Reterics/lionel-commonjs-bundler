const {someFunction} = require("../AnotherTopFolder/AnotherDeepFolder");


module.exports = {
	status: "This code is in the topFolder\\topFolder.js",
	details: someFunction()
};
