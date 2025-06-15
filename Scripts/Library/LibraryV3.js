const { ethers, fs, path } = require("../Common/Global/Global");

const SwapMath = require("./V3/SwapMath");
const FullMath = require("./V3/FullMath");
const SqrtPriceMath = require("./V3/SqrtPriceMath");
const Tick = require("./V3/Tick");
const TickMath = require("./V3/TickMath");
const TickBitMap = require("./V3/TickBitMap");
const LiquidityMath = require("./V3/LiquidityMath");
const LowGasSafeMath = require("./V3/LowGasSafeMath");
const SafeCast = require("./V3/SafeCast");
const FixedPoint128 = require("./V3/FixedPoint128");
const FixedPoint96 = require("./V3/FixedPoint96");

async function swap(zeroForOne, amountSpecified, sqrtPriceLimitX96, pool) {
	if (amountSpecified == 0n) throw new Error("AS");

	// const feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
	// const feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;

	// --- slot0Start ---
	const slot0Start = {
		sqrtPriceX96: pool.sqrtPriceX96,
		tick: pool.tick,
		// --- May Not Be Used
		// observationIndex: pool.observationIndex,
		// observationCardinality: pool.observationCardinality,
		// observationCardinalityNext: pool.observationCardinalityNext,
		// feeProtocol: pool.feeProtocol,
		// unlocked: pool.unlocked
		// --- May Not Be Used
		// liquidity: pool.liquidity, // Additionally Added
	};
	// --- slot0Start ---

	// --- cache ---
	const cache = {
		liquidityStart: pool.liquidity,
		// --- May Not Be Used
		// blockTimeStamp: pool.blockTimeStamp,
		// feeProtocol: zeroForOne ? slot0Start.feeProtocol % 16 : slot0Start.feeProtocol >> 4,
		// secondsPerLiquidityCumulativeX128: 0n,
		// tickCumulative: 0n,
		// computedLatestObservation: false,
		// --- May Not Be Used
	};
	// --- cache ---

	// --- state ---
	const state = {
		amountSpecifiedRemaining: amountSpecified,
		amountCalculated: 0n,
		sqrtPriceX96: slot0Start.sqrtPriceX96,
		tick: slot0Start.tick,
		// --- May Not Be Used
		// feeGrowthGlobalX128: zeroForOne ? feeGrowthGlobal0X128 : feeGrowthGlobal1X128,
		// protocolFee: 0n,
		liquidity: cache.liquidityStart,
		// --- May Not Be Used
	};
	// --- state ---

	const exactInput = amountSpecified > 0n; // True or False

	// ---------
	// ------------------
	// --- While Part / Input, Output ---
	while (state.amountSpecifiedRemaining !== 0n && state.sqrtPriceX96 !== sqrtPriceLimitX96) {
		//
		//
		//

		// --- step ---
		const step = {
			sqrtPriceStartX96: 0n,
			tickNext: 0n,
			initialized: false,
			sqrtPriceNextX96: 0n,
			amountIn: 0n,
			amountOut: 0n,
			feeAmount: 0n,
		};
		// --- step ---

		// --- step.sqrtPriceStartX96 is initialized from state.sqrtPriceX96 ---
		step.sqrtPriceStartX96 = state.sqrtPriceX96;
		// --- step.sqrtPriceStartX96 is initialized from state.sqrtPriceX96 ---

		// --- TickBitMap.nextInitializedTickWithinOneWord() ---
		[step.tickNext, step.initialized] = await TickBitMap.nextInitializedTickWithinOneWord(state.tick, pool.tickSpacing, zeroForOne);
		// --- TickBitMap.nextInitializedTickWithinOneWord() ---

		// --- ENSURE TICK BETWEEN IN MIN_TICK < TICK < MAX_TICK ---
		if (step.tickNext > TickMath.MAX_TICK) step.tickNext = TickMath.MAX_TICK;
		if (step.tickNext < TickMath.MIN_TICK) step.tickNext = TickMath.MIN_TICK;
		// --- ENSURE TICK BETWEEN IN MIN_TICK < TICK < MAX_TICK ---

		// --- Getting The Price For The Next Tick ---
		step.sqrtPriceNextX96 = await TickMath.getSqrtRatioAtTick(step.tickNext);
		// --- Getting The Price For The Next Tick ---

		// --- SwapMath.computeSwapStep() // compute values to swap to the target tick, price limit, or point where input/output amount is exhausted ---
		[state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] = await SwapMath.computeSwapStep(
			state.sqrtPriceX96,
			(zeroForOne ? step.sqrtPriceNextX96 < sqrtPriceLimitX96 : step.sqrtPriceNextX96 > sqrtPriceLimitX96) ? sqrtPriceLimitX96 : step.sqrtPriceNextX96,
			state.liquidity,
			state.amountSpecifiedRemaining,
			pool.feePips
		);
		// --- SwapMath.computeSwapStep() // compute values to swap to the target tick, price limit, or point where input/output amount is exhausted ---

		// --- Input, Output ---
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
		// --- Input, Output ---

		// --- feeProtocol ---
		if (cache.feeProtocol > 0n) {
			const delta = step.feeAmount / cache.feeProtocol;
			step.feeAmount -= delta;
			state.protocolFee += delta < 0n ? delta * -1n : delta;
		}
		// --- feeProtocol ---

		// --- state.feeGrowthGlobalX128 ---
		// if (state.liquidity > 0n) state.feeGrowthGlobalX128 += FullMath.mulDiv(step.feeAmount, FixedPoint128.Q128, state.liquidity);
		// --- state.feeGrowthGlobalX128 ---

		// --- observations ---

		// console.log(state.sqrtPriceX96 == step.sqrtPriceNextX96, "AAAAAAAA");

		if (state.sqrtPriceX96 == step.sqrtPriceNextX96) {
			// console.log("final iffffffffffffffffffffffffffffffff");
			if (step.initialized) {
				// console.log("final if step.initialized");
				if (!cache.computedLatestObservation) {
					// console.log("final if step.initialized !cache.computedLatestObservation");
					[cache.tickCumulative, cache.secondsPerLiquidityCumulativeX128] = await observations.observeSingle(
						cache.blockTimestamp,
						0n,
						slot0Start.tick,
						slot0Start.observationIndex,
						cache.liquidityStart,
						slot0Start.observationCardinality
					);

					cache.computedLatestObservation = true;
				}

				let liquidityNet = await Tick.cross(
					step.tickNext,
					zeroForOne ? state.feeGrowthGlobalX128 : feeGrowthGlobal0X128,
					zeroForOne ? feeGrowthGlobal1X128 : state.feeGrowthGlobalX128,
					cache.secondsPerLiquidityCumulativeX128,
					cache.tickCumulative,
					cache.blockTimeStamp
				);

				if (zeroForOne) liquidityNet = -liquidityNet;

				state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
			}

			// console.log("state.tick 1", state.tick, step.tickNext - 1n, step.tickNext, step.initialized);

			state.tick = zeroForOne ? step.tickNext - 1n : step.tickNext;

			// console.log("state.tick 2", state.tick, step.tickNext - 1n, step.tickNext, step.initialized);
		} else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
			// console.log("final else if");

			// console.log("state.tick 1", state.tick);

			state.tick = await TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);

			// console.log("state.tick 2", state.tick);

			// console.log("just a test", state.sqrtPriceX96, step.sqrtPriceNextX96, step.sqrtPriceStartX96);
		}
		// --- observations ---

		// console.log("just a test", state.amountSpecifiedRemaining, state.sqrtPriceX96, sqrtPriceLimitX96);
	}
	// --- While Part / Input, Output ---
	// ------------------
	// ---------

	// console.log("doneeeeeeeeeeeee");

	// --- Final Part / amount0, amount1 ---
	const [amount0, amount1] = zeroForOne == exactInput ? [amountSpecified - state.amountSpecifiedRemaining, state.amountCalculated] : [state.amountCalculated, amountSpecified - state.amountSpecifiedRemaining];

	// console.log("doneeeeeeeeeeeee", amount0, amount1);

	return [amount0, amount1];
	// --- Final Part / amount0, amount1 ---
}

async function calculatePoolPriceOfTokenWithSqrtPriceX96(sqrtPriceX96, ZeroToOne, tokenIn_decimal, tokenOut_decimal) {
	const P = (Number(sqrtPriceX96) / Number(FixedPoint96.Q96)) ** 2;

	const decimals = 10 ** (ZeroToOne == true ? tokenIn_decimal - tokenOut_decimal : tokenOut_decimal - tokenIn_decimal);

	const base = ZeroToOne == true ? P : 1 / P;

	const main = base * decimals;

	// const price = main * marketPrice;

	const price = main;

	return price;
}

module.exports = {
	swap,
	calculatePoolPriceOfTokenWithSqrtPriceX96,
};
