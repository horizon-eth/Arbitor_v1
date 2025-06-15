const { ethers } = require("../../Common/Global/Global");

const { BigNumber } = require("bignumber.js");

// Cast a uint256 to a uint160, revert on overflow
function toUint160(y) {
	let z = new BigNumber(y);
	if (!z.isInteger() || z.isNegative() || z.isGreaterThan("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) {
		throw new Error("SafeCast: Integer overflow");
	}
	return z.toNumber();
}

// Cast a int256 to a int128, revert on overflow or underflow
function toInt128(y) {
	let z = new BigNumber(y);
	if (!z.isInteger() || z.isGreaterThan("0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF") || z.isLessThan("-0x80000000000000000000000000000000")) {
		throw new Error("SafeCast: Integer overflow");
	}
	return z.toNumber();
}

// Cast a uint256 to a int256, revert on overflow
function toInt256(y) {
	let z = new BigNumber(y);
	if (!z.isInteger() || z.isGreaterThan("0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) {
		throw new Error("SafeCast: Integer overflow");
	}
	return z.toNumber();
}

module.exports = {
	toUint160,
	toInt128,
	toInt256,
};
