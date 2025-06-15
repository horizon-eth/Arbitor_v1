const {
	hardhat,
	ethers,
	fs,
	path,
	ERC20,
	HttpsProvider,

	minSingleSwapProfit,
	minFirstProfit,
	minSecondProfit,
	minThirdProfit,

	flashLoanContract,
	flashLoanAddress,
	Owner_Account,
	WalletAddress,

	flashLoanFunctionSelector,
	routerV2Selectors,
	routerV2AddressSelectors,

	FlashLiquidityV2_Router_Contract,
	ZKEVMSwapV2_Router_Contract,
	PancakeSwapV2_Router_Contract,

	FlashLiquidityV2_Router_Address,
	ZKEVMSwapV2_Router_Address,
	PancakeSwapV2_Router_Address,
	DysonFinanceV2_Router_Contract,
	AntfarmFinanceV2_Router_Contract,
	BalancerV2_Vault_Contract,
} = require("../DApps/v2/v2_common");

const {
	allV3DexNames,
	routerV3Selectors, // IN USE -- DO NOT DELETE

	PancakeSwapV3_QuoterV2_Contract,
	DoveSwapV3_QuoterV2_Contract,
	SushiSwapV3_QuoterV2_Contract,
	QuickSwapUNIV3_QuoterV1_Contract,
	QuickSwapAlgebraV3_Quoter_Contract,

	PancakeSwapV3_Router_Contract,
	DoveSwapV3_Router_Contract,
	SushiSwapV3_Router_Contract,
	QuickSwapUNIV3_Router_Contract,
	QuickSwapAlgebraV3_Router_Contract,

	PancakeSwapV3_Router_Address,
	DoveSwapV3_Router_Address,
	SushiSwapV3_Router_Address,
	QuickSwapUNIV3_Router_Address,
	QuickSwapAlgebraV3_Router_Address,
} = require("../DApps/v3/v3_common");

const V2ProjcetNameSelector = {
	"0xaf5990f587f4e10aE0361f657712F9B1067e25b3": "FlashLiquidityV2",
	"0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB": "ZKEVMSwapV2",
	"0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb": "PancakeSwapV2",
	"0xADa6e69781399990d42bEcB1a9427955FFA73Bdc": "DysonFinanceV2",
	"0x61f4ECD130291e5D5D7809A112f9F9081b8Ed3A5": "AntfarmFinanceV2",
	"0xBA12222222228d8Ba445958a75a0704d566BF2C8": "BalancerV2",
};

const V2RouterSelector = {
	"0xaf5990f587f4e10aE0361f657712F9B1067e25b3": FlashLiquidityV2_Router_Contract,
	"0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB": ZKEVMSwapV2_Router_Contract,
	"0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb": PancakeSwapV2_Router_Contract,
	"0xADa6e69781399990d42bEcB1a9427955FFA73Bdc": DysonFinanceV2_Router_Contract,
	"0x61f4ECD130291e5D5D7809A112f9F9081b8Ed3A5": AntfarmFinanceV2_Router_Contract,
	"0xBA12222222228d8Ba445958a75a0704d566BF2C8": BalancerV2_Vault_Contract,
};

const V2RouterFunctionSelector = {
	"0xaf5990f587f4e10aE0361f657712F9B1067e25b3": "0x38ed1739",
	"0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB": "0x38ed1739",
	"0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb": "0x38ed1739",
	"0xADa6e69781399990d42bEcB1a9427955FFA73Bdc": "0x7129b640",
	"0x61f4ECD130291e5D5D7809A112f9F9081b8Ed3A5": "0x59c90959",
	"0xBA12222222228d8Ba445958a75a0704d566BF2C8": "0x52bbbe29",
};

const V3ProjcetNameSelector = {
	"0x1b81D678ffb9C0263b24A97847620C99d213eB14": "PancakeSwapV3",
	"0x95bF28C6502a0544c7ADc154BC60D886d9A80a5c": "DoveSwapV3",
	"0xc14Ee6B248787847527e11b8d7Cf257b212f7a9F": "SushiSwapV3",
	"0x1E7E4c855520b2106320952A570a3e5E3E618101": "QuickSwapUNIV3",
	"0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd": "QuickSwapAlgebraV3",
};

const V3RouterSelector = {
	"0x1b81D678ffb9C0263b24A97847620C99d213eB14": PancakeSwapV3_Router_Contract,
	"0x95bF28C6502a0544c7ADc154BC60D886d9A80a5c": DoveSwapV3_Router_Contract,
	"0xc14Ee6B248787847527e11b8d7Cf257b212f7a9F": SushiSwapV3_Router_Contract,
	"0x1E7E4c855520b2106320952A570a3e5E3E618101": QuickSwapUNIV3_Router_Contract,
	"0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd": QuickSwapAlgebraV3_Router_Contract,
};

const V3RouterFunctionSelector = {
	"0x1b81D678ffb9C0263b24A97847620C99d213eB14": "0x414bf389",
	"0x95bF28C6502a0544c7ADc154BC60D886d9A80a5c": "0x414bf389",
	"0xc14Ee6B248787847527e11b8d7Cf257b212f7a9F": "0x414bf389",
	"0x1E7E4c855520b2106320952A570a3e5E3E618101": "0x414bf389",
	"0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd": "0xbc651188",
};

async function encode(data) {
	const [calldata1, calldata2, routerAddress1, routerAddress2, tokens, amounts] = flashLoanContract.interface.decodeFunctionData(flashLoanFunctionSelector["flashLoan"], data);

	console.log("routerAddress1", routerAddress1);
	console.log("routerAddress2", routerAddress2);
	console.log("tokens", tokens);
	console.log("amounts", amounts);
	console.log("calldata1", calldata1);
	console.log("calldata2", calldata2);

	const Router1 = V2RouterSelector[routerAddress1];

	if (routerAddress1 == "0xaf5990f587f4e10aE0361f657712F9B1067e25b3" || routerAddress1 == "0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB" || routerAddress1 == "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb") {
		const [amountIn, amountOutMin, path, to, deadline] = Router1.interface.decodeFunctionData(V2RouterFunctionSelector[routerAddress1], calldata1);

		console.log(V2ProjcetNameSelector[routerAddress1], "Outputs");
		console.log("amountIn", amountIn);
		console.log("amountOutMin", amountOutMin);
		console.log("path", path);
		console.log("to", to);
		console.log("deadline", deadline);
	} else if (routerAddress1 == "0xADa6e69781399990d42bEcB1a9427955FFA73Bdc") {
		const [tokenIn, tokenOut, index, to, input, output] = Router1.interface.decodeFunctionData(V2RouterFunctionSelector[routerAddress1], calldata1);

		console.log(V2ProjcetNameSelector[routerAddress1], "Outputs");
		console.log("tokenIn", tokenIn);
		console.log("tokenOut", tokenOut);
		console.log("index", index);
		console.log("to", to);
		console.log("input", input);
		console.log("output", output);
	} else if (routerAddress1 == "0x61f4ECD130291e5D5D7809A112f9F9081b8Ed3A5") {
		const [[amountIn, amountOutMin, maxFee, path, fees, to, deadline]] = Router1.interface.decodeFunctionData(V2RouterFunctionSelector[routerAddress1], calldata1);

		console.log(V2ProjcetNameSelector[routerAddress1], "Outputs");
		console.log("amountIn", amountIn);
		console.log("amountOutMin", amountOutMin);
		console.log("maxFee", maxFee);
		console.log("path", path);
		console.log("fees", fees);
		console.log("to", to);
		console.log("deadline", deadline);
	} else if (routerAddress1 == "0xBA12222222228d8Ba445958a75a0704d566BF2C8") {
		const [[pool_id, kind, assetIn, assetOut, amountIn, userData], [sender, fromInternalBalance, recipient, toInternalBalance], amountOutMin, deadline] = Router1.interface.decodeFunctionData(V2RouterFunctionSelector[routerAddress1], calldata1);

		console.log(V2ProjcetNameSelector[routerAddress1], "Outputs");
		console.log("pool_id", pool_id);
		console.log("kind", kind);
		console.log("assetIn", assetIn);
		console.log("assetOut", assetOut);
		console.log("amountIn", amountIn);
		console.log("userData", userData);
		console.log("sender", sender);
		console.log("fromInternalBalance", fromInternalBalance);
		console.log("recipient", recipient);
		console.log("toInternalBalance", toInternalBalance);
		console.log("amountOutMin", amountOutMin);
		console.log("deadline", deadline);
	}

	console.log("\n");

	const Router2 = V3RouterSelector[routerAddress2];

	console.log(routerAddress2);

	if (routerAddress2 == "0x1b81D678ffb9C0263b24A97847620C99d213eB14" || routerAddress2 == "0x95bF28C6502a0544c7ADc154BC60D886d9A80a5c" || routerAddress2 == "0xc14Ee6B248787847527e11b8d7Cf257b212f7a9F" || routerAddress2 == "0x1E7E4c855520b2106320952A570a3e5E3E618101") {
		const [[tokenIn, tokenOut, fee, recipient, deadline, amountIn, amountOutMinimum, sqrtPriceLimitX96]] = Router2.interface.decodeFunctionData(V3RouterFunctionSelector[routerAddress2], calldata2);

		console.log(V3ProjcetNameSelector[routerAddress2], "Outputs");
		console.log("tokenIn", tokenIn);
		console.log("tokenOut", tokenOut);
		console.log("fee", fee);
		console.log("recipient", recipient);
		console.log("deadline", deadline);
		console.log("amountIn", amountIn);
		console.log("amountOutMinimum", amountOutMinimum);
		console.log("sqrtPriceLimitX96", sqrtPriceLimitX96);
	} else if (routerAddress2 == "0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd") {
		const [[tokenIn, tokenOut, recipient, deadline, amountIn, amountOutMinimum, limitSqrtPrice]] = Router2.interface.decodeFunctionData(V3RouterFunctionSelector[routerAddress2], calldata2);

		console.log(V3ProjcetNameSelector[routerAddress2], "Outputs");
		console.log("tokenIn", tokenIn);
		console.log("tokenOut", tokenOut);
		console.log("recipient", recipient);
		console.log("deadline", deadline);
		console.log("amountIn", amountIn);
		console.log("amountOutMinimum", amountOutMinimum);
		console.log("limitSqrtPrice", limitSqrtPrice);
	} else if (routerAddress2 == "0xaf5990f587f4e10aE0361f657712F9B1067e25b3" || routerAddress2 == "0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB" || routerAddress2 == "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb") {
		const [amountIn, amountOutMin, path, to, deadline] = Router1.interface.decodeFunctionData(V2RouterFunctionSelector[routerAddress1], calldata1);

		console.log(V2ProjcetNameSelector[routerAddress1], "Outputs");
		console.log("amountIn", amountIn);
		console.log("amountOutMin", amountOutMin);
		console.log("path", path);
		console.log("to", to);
		console.log("deadline", deadline);
	}
}

encode(
	"0x133eecc500000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000052bfe8fe06c8197a8e3dcce57ce012e13a7315eb0000000000000000000000008cfe327cec66d1c090dd72bd0ff11d690c33a2eb00000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000380000000000000000000000000000000000000000000000000000000000000010438ed17390000000000000000000000000000000000000000000000000000000003dd3a30000000000000000000000000000000000000000000000000004e0baaa73681a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000e8aa8a5bd8703b2bb3f7b27a7625455784734160000000000000000000000000000000000000000000000000000018dc9144cfe0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a8ce8aee21bc2a48a5ef670afcc9274c7bbbc0350000000000000000000000004f9a0e7fd2bf6067db6994cf12e4495df938e6e900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010438ed1739000000000000000000000000000000000000000000000000004e0baaa73681a10000000000000000000000000000000000000000000000000000000003dd3a3000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000e8aa8a5bd8703b2bb3f7b27a7625455784734160000000000000000000000000000000000000000000000000000018dc9144cfe00000000000000000000000000000000000000000000000000000000000000020000000000000000000000004f9a0e7fd2bf6067db6994cf12e4495df938e6e9000000000000000000000000a8ce8aee21bc2a48a5ef670afcc9274c7bbbc035000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a8ce8aee21bc2a48a5ef670afcc9274c7bbbc03500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000003dd3a30"
);
