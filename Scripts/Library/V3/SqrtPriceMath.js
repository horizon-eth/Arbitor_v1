const { ethers } = require("../../Common/Global/Global");

const max_uint160 = 1461501637330902918203684832716283019655932542975n;

const FixedPoint96 = require("./FixedPoint96");
const FullMath = require("./FullMath");
const UnsafeMath = require("./UnsafeMath");

function getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amount, add) {
	if (amount === 0n) return sqrtPX96;

	let numerator1 = BigInt(liquidity) << BigInt(FixedPoint96.RESOLUTION);

	if (add) {
		let product = amount * sqrtPX96;
		if (product / amount === sqrtPX96) {
			let denominator = numerator1 + product;
			if (denominator >= numerator1) {
				return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
			}
		}

		return UnsafeMath.divRoundingUp(numerator1, numerator1 / sqrtPX96 + amount);
	} else {
		let product = amount * sqrtPX96;
		if (product / amount === sqrtPX96 && numerator1 > product) {
			let denominator = numerator1 - product;
			return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator);
		}
		throw new Error("Invalid operation");
	}
}

function getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amount, add) {
	if (add) {
		// let quotient = amount <= max_uint160 ? (amount << BigInt(FixedPoint96.RESOLUTION)) / liquidity : FullMath.mulDiv(amount, BigInt(FixedPoint96.Q96), liquidity);

		let quotient = amount <= max_uint160 ? (amount << BigInt(FixedPoint96.RESOLUTION)) / liquidity : FullMath.mulDiv(amount, BigInt(FixedPoint96.Q96), liquidity);

		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", amount);
		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", BigInt(FixedPoint96.RESOLUTION));
		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", liquidity);

		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", quotient);

		return sqrtPX96 + quotient;
	} else {
		let quotient = amount <= max_uint160 ? UnsafeMath.divRoundingUp(amount << BigInt(FixedPoint96.RESOLUTION), liquidity) : FullMath.mulDivRoundingUp(amount, BigInt(FixedPoint96.Q96), liquidity);
		if (sqrtPX96 > quotient) {
			return sqrtPX96 - quotient;
		}
		throw new Error("Invalid operation");
	}
}

function getNextSqrtPriceFromInput(sqrtPX96, liquidity, amountIn, zeroForOne) {
	if (zeroForOne) {
		return getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true);
	} else {
		return getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true);
	}
}

function getNextSqrtPriceFromOutput(sqrtPX96, liquidity, amountOut, zeroForOne) {
	if (zeroForOne) {
		return getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false);
	} else {
		return getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false);
	}
}

function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
	if (sqrtRatioAX96 > sqrtRatioBX96) {
		[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
	}

	let numerator1 = BigInt(liquidity) << BigInt(FixedPoint96.RESOLUTION);
	let numerator2 = sqrtRatioBX96 - sqrtRatioAX96;

	if (roundUp) {
		return UnsafeMath.divRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), sqrtRatioAX96);
	} else {
		return FullMath.mulDiv(numerator1, numerator2, sqrtRatioBX96) / sqrtRatioAX96;
	}
}

function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
	if (sqrtRatioAX96 > sqrtRatioBX96) {
		[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
	}

	if (roundUp) {
		return FullMath.mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, BigInt(FixedPoint96.Q96));
	} else {
		return FullMath.mulDiv(liquidity, sqrtRatioBX96 - sqrtRatioAX96, BigInt(FixedPoint96.Q96));
	}
}

module.exports = {
	getNextSqrtPriceFromAmount0RoundingUp,
	getNextSqrtPriceFromAmount1RoundingDown,
	getNextSqrtPriceFromInput,
	getNextSqrtPriceFromOutput,
	getAmount0Delta,
	getAmount1Delta,
};
