const MIN_TICK = -887272n;
const MAX_TICK = 887272n;
const MIN_SQRT_RATIO = 4295128739n;
const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n;

async function getSqrtRatioAtTick(tick) {
	let absTick = tick < 0 ? -tick : tick;

	if (absTick > MAX_TICK) throw new Error("T");

	let ratio = (absTick & 1n) !== 0n ? 0xfffcb933bd6fad37aa2d162d1a594001n : 0x100000000000000000000000000000000n;
	if (absTick & 0x2n) ratio = (ratio * 0xfff97272373d413259a46990580e213an) >> 128n;
	if (absTick & 0x4n) ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdccn) >> 128n;
	if (absTick & 0x8n) ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0n) >> 128n;
	if (absTick & 0x10n) ratio = (ratio * 0xffcb9843d60f6159c9db58835c926644n) >> 128n;
	if (absTick & 0x20n) ratio = (ratio * 0xff973b41fa98c081472e6896dfb254c0n) >> 128n;
	if (absTick & 0x40n) ratio = (ratio * 0xff2ea16466c96a3843ec78b326b52861n) >> 128n;
	if (absTick & 0x80n) ratio = (ratio * 0xfe5dee046a99a2a811c461f1969c3053n) >> 128n;
	if (absTick & 0x100n) ratio = (ratio * 0xfcbe86c7900a88aedcffc83b479aa3a4n) >> 128n;
	if (absTick & 0x200n) ratio = (ratio * 0xf987a7253ac413176f2b074cf7815e54n) >> 128n;
	if (absTick & 0x400n) ratio = (ratio * 0xf3392b0822b70005940c7a398e4b70f3n) >> 128n;
	if (absTick & 0x800n) ratio = (ratio * 0xe7159475a2c29b7443b29c7fa6e889d9n) >> 128n;
	if (absTick & 0x1000n) ratio = (ratio * 0xd097f3bdfd2022b8845ad8f792aa5825n) >> 128n;
	if (absTick & 0x2000n) ratio = (ratio * 0xa9f746462d870fdf8a65dc1f90e061e5n) >> 128n;
	if (absTick & 0x4000n) ratio = (ratio * 0x70d869a156d2a1b890bb3df62baf32f7n) >> 128n;
	if (absTick & 0x8000n) ratio = (ratio * 0x31be135f97d08fd981231505542fcfa6n) >> 128n;
	if (absTick & 0x10000n) ratio = (ratio * 0x9aa508b5b7a84e1c677de54f3e99bc9n) >> 128n;
	if (absTick & 0x20000n) ratio = (ratio * 0x5d6af8dedb81196699c329225ee604n) >> 128n;
	if (absTick & 0x40000n) ratio = (ratio * 0x2216e584f5fa1ea926041bedfe98n) >> 128n;
	if (absTick & 0x80000n) ratio = (ratio * 0x48a170391f7dc42444e8fa2n) >> 128n;

	if (tick > 0) ratio = (2n ** 256n - 1n) / ratio;

	// Divides by 2**32 rounded up
	let sqrtPriceX96 = (ratio >> 32n) + (ratio % (1n << 32n) === 0n ? 0n : 1n);
	return sqrtPriceX96;
}

async function getTickAtSqrtRatio(sqrtPriceX96) {
	if (sqrtPriceX96 < MIN_SQRT_RATIO || sqrtPriceX96 >= MAX_SQRT_RATIO) throw new Error("R");

	let ratio = BigInt(sqrtPriceX96) << 32n;
	let r = ratio;
	let msb = 0n;

	if (r >= 0x100000000000000000000000000000000n) {
		r >>= 128n;
		msb += 128n;
	}
	if (r >= 0x10000000000000000n) {
		r >>= 64n;
		msb += 64n;
	}
	if (r >= 0x100000000n) {
		r >>= 32n;
		msb += 32n;
	}
	if (r >= 0x10000n) {
		r >>= 16n;
		msb += 16n;
	}
	if (r >= 0x100n) {
		r >>= 8n;
		msb += 8n;
	}
	if (r >= 0x10n) {
		r >>= 4n;
		msb += 4n;
	}
	if (r >= 0x4n) {
		r >>= 2n;
		msb += 2n;
	}
	if (r >= 0x2n) msb += 1n;

	let log_2 = (msb - 128n) << 64n;

	r = ratio >> (msb - 127n);
	for (let i = 0; i < 64; i++) {
		r = (r * r) >> 127n;
		let f = r >> 128n;
		log_2 |= f << (63n - BigInt(i));
		r >>= f;
	}

	let log_sqrt10001 = log_2 * 255738958999603826347141n;
	let tickLow = (log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n;
	let tickHi = (log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n;

	return tickLow === tickHi ? tickLow : getSqrtRatioAtTick(tickHi) <= sqrtPriceX96 ? tickHi : tickLow;
}

module.exports = {
	MIN_TICK,
	MAX_TICK,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	getSqrtRatioAtTick,
	getTickAtSqrtRatio,
};
