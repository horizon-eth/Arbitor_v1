const { ethers } = require("../../Common/Global/Global");

const LowGasSafeMath = require("./LowGasSafeMath");
const { toInt128 } = require("./SafeCast");
const TickMath = require("./TickMath");
const LiquidityMath = require("./LiquidityMath");

// info stored for each initialized individual tick
class TickInfo {
	constructor() {
		this.liquidityGross = 0;
		this.liquidityNet = 0;
		this.feeGrowthOutside0X128 = 0;
		this.feeGrowthOutside1X128 = 0;
		this.tickCumulativeOutside = 0;
		this.secondsPerLiquidityOutsideX128 = 0;
		this.secondsOutside = 0;
		this.initialized = false;
	}
}

// Derives max liquidity per tick from given tick spacing
function tickSpacingToMaxLiquidityPerTick(tickSpacing) {
	const minTick = Math.floor(TickMath.MIN_TICK / tickSpacing) * tickSpacing;
	const maxTick = Math.floor(TickMath.MAX_TICK / tickSpacing) * tickSpacing;
	const numTicks = Math.floor((maxTick - minTick) / tickSpacing) + 1;
	return Number.MAX_SAFE_INTEGER / numTicks;
}

// Retrieves fee growth data
function getFeeGrowthInside(self, tickLower, tickUpper, tickCurrent, feeGrowthGlobal0X128, feeGrowthGlobal1X128) {
	const lower = self[tickLower];
	const upper = self[tickUpper];

	let feeGrowthBelow0X128, feeGrowthBelow1X128;
	if (tickCurrent >= tickLower) {
		feeGrowthBelow0X128 = lower.feeGrowthOutside0X128;
		feeGrowthBelow1X128 = lower.feeGrowthOutside1X128;
	} else {
		feeGrowthBelow0X128 = feeGrowthGlobal0X128.minus(lower.feeGrowthOutside0X128);
		feeGrowthBelow1X128 = feeGrowthGlobal1X128.minus(lower.feeGrowthOutside1X128);
	}

	let feeGrowthAbove0X128, feeGrowthAbove1X128;
	if (tickCurrent < tickUpper) {
		feeGrowthAbove0X128 = upper.feeGrowthOutside0X128;
		feeGrowthAbove1X128 = upper.feeGrowthOutside1X128;
	} else {
		feeGrowthAbove0X128 = feeGrowthGlobal0X128.minus(upper.feeGrowthOutside0X128);
		feeGrowthAbove1X128 = feeGrowthGlobal1X128.minus(upper.feeGrowthOutside1X128);
	}

	const feeGrowthInside0X128 = feeGrowthGlobal0X128.minus(feeGrowthBelow0X128).minus(feeGrowthAbove0X128);
	const feeGrowthInside1X128 = feeGrowthGlobal1X128.minus(feeGrowthBelow1X128).minus(feeGrowthAbove1X128);

	return [feeGrowthInside0X128, feeGrowthInside1X128];
}

// Updates a tick and returns true if the tick was flipped from initialized to uninitialized, or vice versa
function update(self, tick, tickCurrent, liquidityDelta, feeGrowthGlobal0X128, feeGrowthGlobal1X128, secondsPerLiquidityCumulativeX128, tickCumulative, time, upper, maxLiquidity) {
	const info = self[tick];

	const liquidityGrossBefore = info.liquidityGross;
	const liquidityGrossAfter = LiquidityMath.addDelta(liquidityGrossBefore, liquidityDelta);

	if (liquidityGrossAfter > maxLiquidity) {
		throw new Error("LO"); // LO error handling from Solidity
	}

	const flipped = (liquidityGrossAfter === 0) !== (liquidityGrossBefore === 0);

	if (liquidityGrossBefore === 0) {
		if (tick <= tickCurrent) {
			info.feeGrowthOutside0X128 = feeGrowthGlobal0X128;
			info.feeGrowthOutside1X128 = feeGrowthGlobal1X128;
			info.secondsPerLiquidityOutsideX128 = secondsPerLiquidityCumulativeX128;
			info.tickCumulativeOutside = tickCumulative;
			info.secondsOutside = time;
		}
		info.initialized = true;
	}

	info.liquidityGross = liquidityGrossAfter;

	info.liquidityNet = upper ? LowGasSafeMath.sub(info.liquidityNet, liquidityDelta).toInt128() : LowGasSafeMath.add(info.liquidityNet, liquidityDelta).toInt128();

	return flipped;
}

// Clears tick data
function clear(self, tick) {
	delete self[tick];
}

// Transitions to next tick as needed by price movement
function cross(self, tick, feeGrowthGlobal0X128, feeGrowthGlobal1X128, secondsPerLiquidityCumulativeX128, tickCumulative, time) {
	const info = self[tick];

	info.feeGrowthOutside0X128 = feeGrowthGlobal0X128.minus(info.feeGrowthOutside0X128);
	info.feeGrowthOutside1X128 = feeGrowthGlobal1X128.minus(info.feeGrowthOutside1X128);
	info.secondsPerLiquidityOutsideX128 = secondsPerLiquidityCumulativeX128.minus(info.secondsPerLiquidityOutsideX128);
	info.tickCumulativeOutside = tickCumulative - info.tickCumulativeOutside;
	info.secondsOutside = time - info.secondsOutside;

	return info.liquidityNet;
}

module.exports = {
	TickInfo,
	tickSpacingToMaxLiquidityPerTick,
	getFeeGrowthInside,
	update,
	clear,
	cross,
};
