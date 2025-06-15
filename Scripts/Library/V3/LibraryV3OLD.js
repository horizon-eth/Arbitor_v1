const { ethers } = require("../../Common/Global/Global");

const SwapMath = require("./SwapMath");
const FullMath = require("./FullMath");
const SqrtPriceMath = require("./SqrtPriceMath");
const Tick = require("./Tick");
const TickMath = require("./TickMath");
const TickBitMap = require("./TickBitMap");
const LiquidityMath = require("./LiquidityMath");
const LowGasSafeMath = require("./LowGasSafeMath");
const SafeCast = require("./SafeCast");
const FixedPoint128 = require("./FixedPoint128");
const FixedPoint96 = require("./FixedPoint96");

async function swap(zeroForOne, amountSpecified, sqrtPriceLimitX96, pool) {
	if (amountSpecified == 0n) throw new Error("AS");

	const exactInput = amountSpecified > 0;

	const slot0Start = {
		sqrtPriceX96: pool.sqrtPriceX96,
		tick: pool.tick,
		liquidity: pool.liquidity, // Additionally Added
		observationIndex: pool.observationIndex,
		observationCardinality: pool.observationCardinality,
		observationCardinalityNext: pool.observationCardinalityNext,
		feeProtocol: pool.feeProtocol,
	};

	const cache = {
		liquidityStart: pool.liquidity,
		// blockTimestamp: 0n,
		// feeProtocol: zeroForOne ? slot0Start.feeProtocol % 16 : slot0Start.feeProtocol >> 4,
		// secondsPerLiquidityCumulativeX128: 0n,
		// tickCumulative: 0n,
		// computedLatestObservation: false,
	};

	const state = {
		amountSpecifiedRemaining: amountSpecified,
		amountCalculated: 0n,
		sqrtPriceX96: slot0Start.sqrtPriceX96,
		tick: slot0Start.tick,
		// feeGrowthGlobalX128: zeroForOne ? feeGrowthGlobal0X128 : feeGrowthGlobal1X128,
		// protocolFee: 0n,
		liquidity: cache.liquidityStart,
	};

	let i = 0;

	while (state.amountSpecifiedRemaining !== 0 && state.sqrtPriceX96 !== sqrtPriceLimitX96) {
		const step = {
			sqrtPriceStartX96: 0,
			tickNext: 0,
			initialized: false,
			sqrtPriceNextX96: 0,
			amountIn: 0,
			amountOut: 0,
			feeAmount: 0,
		};

		step.sqrtPriceStartX96 = state.sqrtPriceX96;

		[step.tickNext, step.initialized] = await TickBitMap.nextInitializedTickWithinOneWord(state.tick, pool.tickSpacing, zeroForOne);

		// if (step.tickNext < TickMath.MIN_TICK) step.tickNext = TickMath.MIN_TICK;
		// else if (step.tickNext > TickMath.MAX_TICK) step.tickNext = TickMath.MAX_TICK;

		step.sqrtPriceNextX96 = await TickMath.getSqrtRatioAtTick(step.tickNext);

		[state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] = await SwapMath.computeSwapStep(
			state.sqrtPriceX96,
			(zeroForOne ? step.sqrtPriceNextX96 < sqrtPriceLimitX96 : step.sqrtPriceNextX96 > sqrtPriceLimitX96) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96,
			state.liquidity,
			state.amountSpecifiedRemaining,
			pool.feePips
		);

		// console.log("state.sqrtPriceX96", state.sqrtPriceX96);
		// console.log("step.amountIn", step.amountIn);
		// console.log("step.amountOut", step.amountOut);
		// console.log("step.feeAmount", step.feeAmount);

		if (exactInput) {
			state.amountSpecifiedRemaining = LowGasSafeMath.sub(state.amountSpecifiedRemaining, LowGasSafeMath.add(step.amountIn, step.feeAmount));
			state.amountCalculated = LowGasSafeMath.sub(state.amountCalculated, step.amountOut);

			// state.amountSpecifiedRemaining -= step.amountIn + step.feeAmount;
			// state.amountCalculated = state.amountCalculated - step.amountOut;
		} else {
			state.amountSpecifiedRemaining = LowGasSafeMath.add(state.amountSpecifiedRemaining, step.amountOut);
			state.amountCalculated = LowGasSafeMath.add(state.amountCalculated, LowGasSafeMath.add(step.amountIn, step.feeAmount));

			// state.amountSpecifiedRemaining += step.amountOut;
			// state.amountCalculated = state.amountCalculated + (step.amountIn + step.feeAmount);
		}

		// if (cache.feeProtocol > 0) {
		// 	const delta = step.feeAmount / cache.feeProtocol;
		// 	step.feeAmount -= delta;
		// 	state.protocolFee += delta < 0n ? delta * -1n : delta;
		// }

		console.log("test", state.sqrtPriceX96, step.sqrtPriceNextX96);

		// if (i == 2) break;

		if (state.sqrtPriceX96 == step.sqrtPriceNextX96) {
			console.log("state.tick 0  s", state.tick);

			state.tick = zeroForOne ? step.tickNext - 1n : step.tickNext;

			console.log("state.tick 1  ss", state.tick);

			// if (step.initialized) {
			// 	if (!cache.computedLatestObservation) {
			// 		[cache.tickCumulative, cache.secondsPerLiquidityCumulativeX128] = this.observations.observeSingle(cache.blockTimestamp, 0, slot0Start.tick, slot0Start.observationIndex, cache.liquidityStart, slot0Start.observationCardinality);
			// 		cache.computedLatestObservation = true;
			// 	}
			// 	let liquidityNet = Tick.cross(step.tickNext, zeroForOne ? state.feeGrowthGlobalX128 : feeGrowthGlobal0X128, zeroForOne ? feeGrowthGlobal1X128 : state.feeGrowthGlobalX128, cache.secondsPerLiquidityCumulativeX128, cache.tickCumulative, cache.blockTimeStamp);
			// 	if (zeroForOne) liquidityNet = -liquidityNet;
			// 	state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
			// }
			// state.tick = zeroForOne ? step.tickNext - 1n : step.tickNext;
		} else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
			console.log("state.tick 0", state.tick);

			state.tick = await TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);

			console.log("state.tick 1", state.tick);
		}

		i++;
	}

	const [amount0, amount1] = zeroForOne == exactInput ? [LowGasSafeMath.sub(amountSpecified, state.amountSpecifiedRemaining), state.amountCalculated] : [state.amountCalculated, LowGasSafeMath.sub(amountSpecified, state.amountSpecifiedRemaining)];

	// const [amount0, amount1] = zeroForOne == exactInput ? [amountSpecified - state.amountSpecifiedRemaining, state.amountCalculated] : [state.amountCalculated, amountSpecified - state.amountSpecifiedRemaining];

	// console.log("amount0", amount0);

	// console.log("amount1", amount1);

	return [amount0, amount1];
}

module.exports = {
	swap,
};
