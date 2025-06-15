const { ethers, chains, WalletAddress } = require("../Common/Global/Global");

const weth_abi = [
	{
		constant: false,
		inputs: [
			{
				name: "wad",
				type: "uint256",
			},
		],
		name: "withdraw",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

let isProcessing = {
	Linea: false,
	PolygonzkEVM: false,
	Blast: false,
	XLayer: false,
	Avalanche: false,
	Arbitrum: false,
};

async function etherConverter() {
	for (const chain of chains) {
		if (isProcessing[chain]) continue;

		// Skips For Now
		if (chain == "Ethereum") continue;
		if (chain == "Arbitrum") continue;
		if (chain == "Avalanche") continue;
		if (chain == "Fraxtal") continue;
		if (chain == "AstarZKevm") continue;
		if (chain == "ArbitrumNova") continue;
		if (chain == "ZKFair") continue;
		// Skips For Now

		isProcessing[chain] = true;

		try {
			const { SCRIPT_PROVIDER, Owner_Account, flashSwapContract, flashSwapAddress, native_token_address, minimum_native_balance, conversion_ether_amount } = require(`../Common/Common/${chain}`);

			const weth = new ethers.Contract(native_token_address, weth_abi, SCRIPT_PROVIDER);

			const nativeBalance = await SCRIPT_PROVIDER.getBalance(WalletAddress);
			const wethBalance = await weth.balanceOf(flashSwapAddress);

			if (nativeBalance < minimum_native_balance) {
				if (wethBalance < conversion_ether_amount) {
					isProcessing[chain] = false;
					return;
				}

				try {
					const withdraw_tx = await flashSwapContract.connect(Owner_Account).withdraw([native_token_address], [conversion_ether_amount]);
					await SCRIPT_PROVIDER.waitForTransaction(withdraw_tx.hash);

					const unwrap_tx = await weth.connect(Owner_Account).withdraw(conversion_ether_amount);
					await SCRIPT_PROVIDER.waitForTransaction(unwrap_tx.hash);
				} catch (error) {
					console.error(`Error during transaction on chain ${chain}:`, error);
					isProcessing[chain] = false;
					continue;
				}
			}
		} catch (error) {
			console.error(`Error processing chain ${chain}:`, error);
			isProcessing[chain] = false;
			return;
		} finally {
			isProcessing[chain] = false;
		}
	}
}

etherConverter();
setInterval(etherConverter, 60000);
