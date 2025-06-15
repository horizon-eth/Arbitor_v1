const { ethers, encoder } = require("../Common/Global/Global");

const getReservesSelector = "0x0902f1ac";

async function getPoolReserves(poolAddress) {
	const { SCRIPT_PROVIDER, flashSwapContract } = require("../Common/Common/PolygonzkEVM");

	const selector = await flashSwapContract.getSelectorID("quoteExactOutputSingle()");

	console.log(selector);

	return;

	try {
		const result = await SCRIPT_PROVIDER.call({
			to: poolAddress,
			data: getReservesSelector,
		});

		const decodedResult = encoder.decode(["uint256", "uint256"], result);

		console.log(`Reserves: Reserve0 = ${decodedResult[0]}, Reserve1 = ${decodedResult[1]}`);
	} catch (error) {
		console.error("Error fetching reserves:", error);
	}
}

getPoolReserves("0xEce7244a0e861C841651401fC22cEE577fEE90AF");
