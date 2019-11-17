const {randomClass} = require("./TopFolder/DeeperFolder");
const {status, details } = require('./TopFolder/topFolder');
const method = require('./AnotherTopFolder/inject');
//const methodwwww = require('./wwwwAnotherTopFolder/inject');
//     const methodwwww = require('./wwwwAnotherTopFolder/inject');
/* const methodwwww = require('./wwwwAnotherTopFolder/inject');
*/

/*const methodwwww = require('./wwwwAnotherTopFolder/inject');*/

console.log(status,details);

console.log(new randomClass());

console.log(method());
