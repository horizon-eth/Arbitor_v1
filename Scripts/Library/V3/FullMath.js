const { ethers } = require("../../Common/Global/Global");

function mulDiv(a, b, denominator) {
	let prod0 = BigInt(a) * BigInt(b);
	let prod1 = BigInt.asUintN(256, BigInt.asUintN(256, a) * BigInt.asUintN(256, b) - prod0);

	// Handle non-overflow cases, 256 by 256 division
	if (prod1 === 0n) {
		if (denominator === 0n) {
			throw new Error("Division by zero");
		}
		return prod0 / denominator;
	}

	if (denominator <= prod1) {
		throw new Error("Denominator too small");
	}

	///////////////////////////////////////////////
	// 512 by 256 division.
	///////////////////////////////////////////////

	// Make division exact by subtracting the remainder from [prod1 prod0]
	// Compute remainder using mulmod
	let remainder = prod0 % denominator;
	prod1 -= remainder > prod0 ? 1n : 0n;
	prod0 -= remainder;

	// Factor powers of two out of denominator
	// Compute largest power of two divisor of denominator.
	// Always >= 1.
	let twos = -denominator & denominator;
	// Divide denominator by power of two
	denominator /= twos;

	// Divide [prod1 prod0] by the factors of two
	prod0 /= twos;

	// Shift in bits from prod1 into prod0.
	prod0 |= prod1 * (2n - denominator * prod1);

	// Invert denominator mod 2**256
	let inv = (3n * denominator) ^ 2n;
	inv *= 2n - denominator * inv; // inverse mod 2**8
	inv *= 2n - denominator * inv; // inverse mod 2**16
	inv *= 2n - denominator * inv; // inverse mod 2**32
	inv *= 2n - denominator * inv; // inverse mod 2**64
	inv *= 2n - denominator * inv; // inverse mod 2**128
	inv *= 2n - denominator * inv; // inverse mod 2**256

	// Because the division is now exact we can divide by multiplying
	// with the modular inverse of denominator. This will give us the
	// correct result modulo 2**256.
	return prod0 * inv;
}

function mulDivRoundingUp(a, b, denominator) {
	let result = mulDiv(a, b, denominator);

	if ((a * b) % denominator > 0) {
		if (result >= ethers.MaxUint256) {
			throw new Error("Result exceeds maximum safe integer");
		}

		result++;
	}

	return result;
}

module.exports = {
	mulDiv,
	mulDivRoundingUp,
};
