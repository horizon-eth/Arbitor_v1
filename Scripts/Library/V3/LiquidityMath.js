const { ethers } = require("../../Common/Global/Global");

const { BigNumber } = require("bignumber.js");

// Add a signed liquidity delta to liquidity and revert if it overflows or underflows
function addDelta(x, y) {
	const BigNumberX = new BigNumber(x);
	const BigNumberY = new BigNumber(y);

	let z;
	if (BigNumberY.isNegative()) {
		z = BigNumberX.minus(BigNumberY.abs());
		if (z.isLessThan(BigNumberX)) {
			throw new Error("LS"); // LS error handling from Solidity
		}
	} else {
		z = BigNumberX.plus(BigNumberY);
		if (z.isGreaterThanOrEqualTo(BigNumberX)) {
			throw new Error("LA"); // LA error handling from Solidity
		}
	}

	return z.toNumber();
}

module.exports = {
	addDelta,
};
