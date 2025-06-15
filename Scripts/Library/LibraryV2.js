const { ethers, fs, path } = require("../Common/Global/Global");

async function getAmountIn(amountOut, reserveIn, reserveOut, fee) {
	if (amountOut <= BigInt(0)) throw new Error("LibraryV2/getAmountIn: INSUFFICIENT_INPUT_AMOUNT");
	if (BigInt(reserveIn) <= BigInt(0) || BigInt(reserveOut) <= BigInt(0)) throw new Error("LibraryV2/getAmountIn: INSUFFICIENT_LIQUIDITY");

	const numerator = BigInt(reserveIn) * amountOut * BigInt(10000);
	const denominator = (BigInt(reserveOut) - amountOut) * BigInt(10000 - fee * 10000);
	const amountIn = numerator / denominator + BigInt(1);

	return amountIn;
}

async function getAmountOut(amountIn, reserveIn, reserveOut, fee) {
	if (amountIn <= BigInt(0)) throw new Error("LibraryV2/getAmountOut: INSUFFICIENT_INPUT_AMOUNT");
	if (BigInt(reserveIn) <= BigInt(0) || BigInt(reserveOut) <= BigInt(0)) throw new Error("LibraryV2/getAmountOut: INSUFFICIENT_LIQUIDITY");

	const amountInWithFee = amountIn * BigInt(10000 - fee * 10000);
	const numerator = amountInWithFee * reserveOut;
	const denominator = reserveIn * BigInt(10000) + amountInWithFee;
	const amountOut = numerator / denominator;

	return amountOut;
}

async function getAmountOut_Antfarm(amountIn, reserveIn, reserveOut) {
	if (amountIn <= BigInt(0)) {
		throw new Error("INSUFFICIENT_INPUT_AMOUNT");
	}

	if (reserveIn <= BigInt(0) || reserveOut <= BigInt(0)) {
		throw new Error("INSUFFICIENT_LIQUIDITY");
	}

	let numerator = amountIn * reserveOut;
	let denominator = reserveIn + amountIn;
	let amountOut = numerator / denominator;

	return amountOut;
}

// async function getVendableV2AntfarmPools(token0_address, token1_address, chain, pool_address) {
// 	const matchingPools = [];

// 	try {
// 		const pools = JSON.parse(fs.readFileSync(`Scripts/Dex/PoolDatasV2/${chain}/AntfarmFinanceV2.json`, "utf8"));

// 		pools.forEach((pool) => {
// 			if (pool_address !== pool.pool_address) {
// 				if ((pool.token0_address == token0_address && pool.token1_address == token1_address) || (pool.token0_address == token1_address && pool.token1_address == token0_address)) {
// 					matchingPools.push({
// 						pool_address: pool.pool_address,
// 						token0_address: pool.token0_address,
// 						token1_address: pool.token1_address,
// 						pool_fee: pool.pool_fee,
// 						param_fee: pool.param_fee,
// 						project_name: pool.project_name,
// 					});
// 				}
// 			}
// 		});
// 	} catch (error) {
// 		console.error("Error reading directory:", error);
// 		throw error;
// 	}

// 	return matchingPools;
// }

module.exports = {
	getAmountIn,
	getAmountOut,
	getAmountOut_Antfarm,
	// getVendableV2AntfarmPools,
};
