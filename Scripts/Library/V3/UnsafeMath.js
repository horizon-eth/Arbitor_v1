const { ethers } = require("../../Common/Global/Global");

function divRoundingUp(x, y) {
	return x / y + (x % y > 0n ? 1n : 0n);
}

module.exports = {
	divRoundingUp,
};
