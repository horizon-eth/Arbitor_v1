const { ethers } = require("../../Common/Global/Global");

function mostSignificantBit(x) {
	if (x <= 0) {
		throw new Error("Input must be greater than 0");
	}

	let r = 0;
	if (x >= BigInt("0x100000000000000000000000000000000")) {
		x >>= BigInt(128);
		r += 128;
	}
	if (x >= BigInt("0x10000000000000000")) {
		x >>= BigInt(64);
		r += 64;
	}
	if (x >= BigInt("0x100000000")) {
		x >>= BigInt(32);
		r += 32;
	}
	if (x >= BigInt("0x10000")) {
		x >>= BigInt(16);
		r += 16;
	}
	if (x >= BigInt("0x100")) {
		x >>= BigInt(8);
		r += 8;
	}
	if (x >= BigInt("0x10")) {
		x >>= BigInt(4);
		r += 4;
	}
	if (x >= BigInt("0x4")) {
		x >>= BigInt(2);
		r += 2;
	}
	if (x >= BigInt("0x2")) {
		r += 1;
	}

	return r;
}

function leastSignificantBit(x) {
	if (x <= 0) {
		throw new Error("Input must be greater than 0");
	}

	let r = 255;
	if (x & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) {
		r -= 128;
	} else {
		x >>= BigInt(128);
	}
	if (x & BigInt("0xFFFFFFFFFFFFFFFF")) {
		r -= 64;
	} else {
		x >>= BigInt(64);
	}
	if (x & BigInt("0xFFFFFFFF")) {
		r -= 32;
	} else {
		x >>= BigInt(32);
	}
	if (x & BigInt("0xFFFF")) {
		r -= 16;
	} else {
		x >>= BigInt(16);
	}
	if (x & BigInt("0xFF")) {
		r -= 8;
	} else {
		x >>= BigInt(8);
	}
	if (x & BigInt("0xF")) {
		r -= 4;
	} else {
		x >>= BigInt(4);
	}
	if (x & BigInt("0x3")) {
		r -= 2;
	} else {
		x >>= BigInt(2);
	}
	if (x & BigInt("0x1")) {
		r -= 1;
	}

	return r;
}

module.exports = {
	mostSignificantBit,
	leastSignificantBit,
};
