const { ethers } = require("../../Common/Global/Global");

const { BigNumber } = require("bignumber.js");

// Struct definition for Observation
class Observation {
	constructor(blockTimestamp, tickCumulative, secondsPerLiquidityCumulativeX128, initialized) {
		this.blockTimestamp = blockTimestamp;
		this.tickCumulative = tickCumulative;
		this.secondsPerLiquidityCumulativeX128 = secondsPerLiquidityCumulativeX128;
		this.initialized = initialized;
	}
}

// Function to transform a previous observation into a new observation
function transform(last, blockTimestamp, tick, liquidity) {
	const delta = blockTimestamp - last.blockTimestamp;
	const tickCumulative = last.tickCumulative.plus(new BigNumber(tick).times(delta));
	const secondsPerLiquidityCumulativeX128 = last.secondsPerLiquidityCumulativeX128.plus(new BigNumber(delta).times(new BigNumber(2).pow(128)).div(new BigNumber(liquidity > 0 ? liquidity : 1)));
	return new Observation(blockTimestamp, tickCumulative, secondsPerLiquidityCumulativeX128, true);
}

// Function to initialize the oracle array
function initialize(self, time) {
	self[0] = new Observation(time, new BigNumber(0), new BigNumber(0), true);
	return [1, 1];
}

// Function to write an oracle observation to the array
function write(self, index, blockTimestamp, tick, liquidity, cardinality, cardinalityNext) {
	let last = self[index];

	// Early return if we've already written an observation this block
	if (last.blockTimestamp.eq(blockTimestamp)) return [index, cardinality];

	// If conditions are right, bump the cardinality
	let cardinalityUpdated = cardinality;
	if (cardinalityNext > cardinality && index.eq(cardinality - 1)) {
		cardinalityUpdated = cardinalityNext;
	}

	const indexUpdated = index.plus(1).mod(cardinalityUpdated);
	self[indexUpdated] = transform(last, blockTimestamp, tick, liquidity);
	return [indexUpdated, cardinalityUpdated];
}

// Function to prepare the oracle array to store up to 'next' observations
function grow(self, current, next) {
	if (current <= 0) {
		throw new Error("I");
	}
	if (next <= current) return current;
	for (let i = current; i < next; i++) {
		self[i].blockTimestamp = 1;
	}
	return next;
}

// Function to compare 32-bit timestamps
function lte(time, a, b) {
	if (a.lte(time) && b.lte(time)) return a.lte(b);

	let aAdjusted = a.gt(time) ? a : a.plus(new BigNumber(2).pow(32));
	let bAdjusted = b.gt(time) ? b : b.plus(new BigNumber(2).pow(32));

	return aAdjusted.lte(bAdjusted);
}

// Function for binary search to fetch observations
function binarySearch(self, time, target, index, cardinality) {
	let l = index.plus(1).mod(cardinality); // oldest observation
	let r = l.plus(cardinality).minus(1); // newest observation
	let i;

	while (true) {
		i = l.plus(r).dividedBy(2).integerValue(BigNumber.ROUND_DOWN);

		let beforeOrAt = self[i.mod(cardinality)];

		if (!beforeOrAt.initialized) {
			l = i.plus(1);
			continue;
		}

		let atOrAfter = self[i.plus(1).mod(cardinality)];

		let targetAtOrAfter = lte(time, beforeOrAt.blockTimestamp, target);

		if (targetAtOrAfter && lte(time, target, atOrAfter.blockTimestamp)) {
			break;
		}

		if (!targetAtOrAfter) {
			r = i.minus(1);
		} else {
			l = i.plus(1);
		}
	}

	return [beforeOrAt, atOrAfter];
}

// Function to fetch observations before or at and at or after a target
function getSurroundingObservations(self, time, target, tick, index, liquidity, cardinality) {
	let beforeOrAt = self[index];

	if (lte(time, beforeOrAt.blockTimestamp, target)) {
		if (beforeOrAt.blockTimestamp.eq(target)) {
			return [beforeOrAt, beforeOrAt];
		} else {
			return [beforeOrAt, transform(beforeOrAt, target, tick, liquidity)];
		}
	}

	beforeOrAt = self[index.plus(1).mod(cardinality)];
	if (!beforeOrAt.initialized) beforeOrAt = self[0];

	if (!lte(time, beforeOrAt.blockTimestamp, target)) {
		throw new Error("OLD");
	}

	return binarySearch(self, time, target, index, cardinality);
}

// Function to observe a single point in time
function observeSingle(self, time, secondsAgo, tick, index, liquidity, cardinality) {
	if (secondsAgo === 0) {
		let last = self[index];
		if (!last.blockTimestamp.eq(time)) {
			last = transform(last, time, tick, liquidity);
		}
		return [last.tickCumulative, last.secondsPerLiquidityCumulativeX128];
	}

	const target = time - secondsAgo;

	let [beforeOrAt, atOrAfter] = getSurroundingObservations(self, time, target, tick, index, liquidity, cardinality);

	if (beforeOrAt.blockTimestamp.eq(target)) {
		return [beforeOrAt.tickCumulative, beforeOrAt.secondsPerLiquidityCumulativeX128];
	} else if (atOrAfter.blockTimestamp.eq(target)) {
		return [atOrAfter.tickCumulative, atOrAfter.secondsPerLiquidityCumulativeX128];
	} else {
		const observationTimeDelta = atOrAfter.blockTimestamp.minus(beforeOrAt.blockTimestamp);
		const targetDelta = target.minus(beforeOrAt.blockTimestamp);
		const tickCumulative = beforeOrAt.tickCumulative.plus(atOrAfter.tickCumulative.minus(beforeOrAt.tickCumulative).dividedBy(observationTimeDelta).times(targetDelta));
		const secondsPerLiquidityCumulativeX128 = beforeOrAt.secondsPerLiquidityCumulativeX128.plus(atOrAfter.secondsPerLiquidityCumulativeX128.minus(beforeOrAt.secondsPerLiquidityCumulativeX128).times(targetDelta).dividedBy(observationTimeDelta));
		return [tickCumulative, secondsPerLiquidityCumulativeX128];
	}
}

// Function to observe multiple points in time
function observe(self, time, secondsAgos, tick, index, liquidity, cardinality) {
	if (cardinality <= 0) {
		throw new Error("I");
	}

	const tickCumulatives = [];
	const secondsPerLiquidityCumulativeX128s = [];

	for (let i = 0; i < secondsAgos.length; i++) {
		const [tickCumulative, secondsPerLiquidityCumulativeX128] = observeSingle(self, time, secondsAgos[i], tick, index, liquidity, cardinality);
		tickCumulatives.push(tickCumulative);
		secondsPerLiquidityCumulativeX128s.push(secondsPerLiquidityCumulativeX128);
	}

	return [tickCumulatives, secondsPerLiquidityCumulativeX128s];
}

module.exports = {
	Observation,
	transform,
	initialize,
	write,
	grow,
	lte,
	binarySearch,
	getSurroundingObservations,
	observeSingle,
	observe,
};
