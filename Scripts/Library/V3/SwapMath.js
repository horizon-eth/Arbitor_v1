const { ethers } = require("../../Common/Global/Global");

const FullMath = require("./FullMath");
const SqrtPriceMath = require("./SqrtPriceMath");

async function computeSwapStep(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, amountRemaining, feePips) {
	let zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
	let exactIn = amountRemaining >= 0;

	let sqrtRatioNextX96;
	let amountIn;
	let amountOut;
	let feeAmount;

	if (exactIn) {
		let amountRemainingLessFee = FullMath.mulDiv(amountRemaining, 1000000n - feePips, 1000000n);

		// console.log("TESTTTTTTTTTTTTTTTTT", amountRemaining, amountRemainingLessFee);

		amountIn = zeroForOne ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true) : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);

		if (amountRemainingLessFee >= amountIn) {
			sqrtRatioNextX96 = sqrtRatioTargetX96;

			// console.log("workeddddd sqrtRatioNextX96 = sqrtRatioTargetX96");
		} else {
			sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne);

			// console.log("workeddddd getNextSqrtPriceFromInput", sqrtRatioNextX96);
		}
	} else {
		amountOut = zeroForOne ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false) : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false);

		// console.log("workeddddd getAmount1Delta");

		if (-amountRemaining >= amountOut) {
			sqrtRatioNextX96 = sqrtRatioTargetX96;
		} else {
			sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(sqrtRatioCurrentX96, liquidity, -amountRemaining, zeroForOne);

			// console.log("workeddddd getNextSqrtPriceFromOutput");
		}
	}

	let max = sqrtRatioTargetX96 == sqrtRatioNextX96;

	if (zeroForOne) {
		amountIn = max && exactIn ? amountIn : SqrtPriceMath.getAmount0Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true);
		amountOut = max && !exactIn ? amountOut : SqrtPriceMath.getAmount1Delta(sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false);

		// console.log("tresss 1111111111", amountIn, amountOut);
	} else {
		amountIn = max && exactIn ? amountIn : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, true);
		amountOut = max && !exactIn ? amountOut : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity, false);

		// console.log("tresss 22222222", amountIn, amountOut, sqrtRatioCurrentX96, sqrtRatioNextX96, liquidity);
	}

	if (!exactIn && amountOut > -amountRemaining) {
		amountOut = -amountRemaining;
	}

	if (exactIn && sqrtRatioNextX96 !== sqrtRatioTargetX96) {
		feeAmount = amountRemaining - amountIn;
	} else {
		feeAmount = FullMath.mulDivRoundingUp(amountIn, feePips, 1000000n - feePips);
	}

	return [sqrtRatioNextX96, amountIn, amountOut, feeAmount];
}

module.exports = {
	computeSwapStep,
};
