const { gg } = require("../constantsForIndex");
const { o } = require("../constantsForIndex");
module.exports = {
	someFunction : function () {
		console.log('Working');
		console.log(o);
		return 'Remote import is okay'
	}
};
