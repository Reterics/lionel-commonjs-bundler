const {randomClass} = require("./TopFolder/DeeperFolder");
const {status, details } = require('./TopFolder/topFolder');
const method = require('./AnotherTopFolder/inject');

console.log(status,details);

console.log(new randomClass());

console.log(method());