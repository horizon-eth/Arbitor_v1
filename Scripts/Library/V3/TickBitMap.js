const BitMath = require("./BitMath");

const map = new Map();

async function position(tick) {
	const wordPos = tick >> 8n;
	const bitPos = tick % 256n;
	return [wordPos, bitPos];
}

async function flipTick(tick, tickSpacing) {
	if (tick % tickSpacing !== 0n) {
		throw new Error("Tick must be spaced correctly.");
	}

	const [wordPos, bitPos] = await position(tick / tickSpacing);
	const mask = 1n << bitPos;
	const currentWord = map.get(wordPos) || 0n;
	map.set(wordPos, currentWord ^ mask);
}

async function nextInitializedTickWithinOneWord(tick, tickSpacing, lte) {
	let compressed = tick / tickSpacing;

	if (tick < 0n && tick % tickSpacing !== 0n) compressed--;

	if (lte) {
		const [wordPos, bitPos] = await position(compressed);
		const mask = (1n << bitPos) - 1n + (1n << bitPos);
		const masked = (map.get(wordPos) || 0n) & mask;

		const initialized = masked !== 0n;
		const next = initialized ? (compressed - (bitPos - BigInt(BitMath.mostSignificantBit(masked)))) * tickSpacing : (compressed - bitPos) * tickSpacing;

		return [next, initialized];
	} else {
		const [wordPos, bitPos] = await position(compressed + 1n);
		const mask = ~((1n << bitPos) - 1n);
		const masked = (map.get(wordPos) || 0n) & mask;

		const initialized = masked !== 0n;

		const next = initialized ? (compressed + 1n + (BigInt(BitMath.leastSignificantBit(masked)) - bitPos)) * tickSpacing : (compressed + 1n + (255n - bitPos)) * tickSpacing;

		return [next, initialized];
	}
}

module.exports = { flipTick, nextInitializedTickWithinOneWord };
