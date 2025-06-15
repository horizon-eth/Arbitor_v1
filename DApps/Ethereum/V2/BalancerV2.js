const {
	ethers,
	ethersV5,
	fs,
	path,
	encoder,
	Interval,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	ERC20,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	FeeDataServerPort,
	maxFeePerGas_multiplier,
	maxPriorityFeePerGas_multiplier,
	gasPrice_multiplier,
} = require("../../../Scripts/Common/Global/Global");

const chain = path.basename(path.dirname(path.dirname(__filename)));

const {
	confirmation,
	blockTime,
	minimumEntranceProfit,
	minimumVendableProfit,
	minimumFlashSwapProfit,

	chainID,
	FLASHSWAP_PROVIDER,
	POOL_PROVIDER_V2,
	POOL_PROVIDER_V3,
	CONTRACT_PROVIDER,
	flashSwapAddress,
	flashSwapContract,
	Owner_Account,
	ProjectsV2,
	ProjectsV3,
	QuotersV3,
	QuoterVersionsV3,
} = require(`../../../Scripts/Common/Common/${chain}`);

const GlobalLibrary = require("../../../Scripts/Library/GlobalLibrary");
const LibraryV2 = require("../../../Scripts/Library/LibraryV2");
const LibraryV3 = require("../../../Scripts/Library/LibraryV3");

const projectName = path.basename(__filename, ".js");
const project = ProjectsV2[projectName];
const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../../Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ETHEREUM_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

const VAULT_ABI = require("../../../Scripts/Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

let VAULT = {
	address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
	https_contract: new ethers.Contract("0xBA12222222228d8Ba445958a75a0704d566BF2C8", VAULT_ABI, POOL_PROVIDER_V2),
	wss_contract: null,
};

let WSTETH_AAVE_0_005_0x3de2_POOL = {
	address: "0x3de27EFa2F1AA663Ae5D458857e731c129069F29",
	poolId: "0x3de27efa2f1aa663ae5d458857e731c129069f29000200000000000000000588",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_STG_0_01_0x3ff3_POOL = {
	address: "0x3ff3a210e57cFe679D9AD1e9bA6453A716C56a2e",
	poolId: "0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e0002000000000000000005d5",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_ALCX_0_01_0xf16a_POOL = {
	address: "0xf16aEe6a71aF1A9Bc8F56975A4c2705ca7A782Bc",
	poolId: "0xf16aee6a71af1a9bc8f56975a4c2705ca7a782bc0002000000000000000004bb",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PENDLE_WETH_0_01_0xfd1c_POOL = {
	address: "0xFD1Cf6FD41F229Ca86ada0584c63C49C3d66BbC9",
	poolId: "0xfd1cf6fd41f229ca86ada0584c63c49c3d66bbc9000200000000000000000438",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WBTC_WETH_0_0025_0xa6f5_POOL = {
	address: "0xA6F548DF93de924d73be7D25dC02554c6bD66dB5",
	poolId: "0xa6f548df93de924d73be7d25dc02554c6bd66db500020000000000000000000e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_ONDO_0_003_0x98b7_POOL = {
	address: "0x98b76Fb35387142f97d601A297276bB152Ae8ab0",
	poolId: "0x98b76fb35387142f97d601a297276bb152ae8ab0000200000000000000000662",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WNCG_0_003_0xe8cc_POOL = {
	address: "0xe8cc7E765647625B95F59C15848379D10B9AB4af",
	poolId: "0xe8cc7e765647625b95f59c15848379d10b9ab4af0002000000000000000001de",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WETH_0_003_0x9664_POOL = {
	address: "0x96646936b91d6B9D7D0c47C496AfBF3D6ec7B6f8",
	poolId: "0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8000200000000000000000019",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LINK_WETH_0_0027_0xe994_POOL = {
	address: "0xE99481DC77691d8E2456E5f3F61C1810adFC1503",
	poolId: "0xe99481dc77691d8e2456e5f3f61c1810adfc1503000200000000000000000018",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DAI_WETH_0_0005_0x0b09_POOL = {
	address: "0x0b09deA16768f0799065C475bE02919503cB2a35",
	poolId: "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let APW_WETH_0_01_0x0932_POOL = {
	address: "0x093254005743b7Af89e24F645730Ba2dD8441333",
	poolId: "0x093254005743b7af89e24f645730ba2dd84413330002000000000000000006a4",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WBTC_BADGER_0_003_0xb460_POOL = {
	address: "0xb460DAa847c45f1C4a41cb05BFB3b51c92e41B36",
	poolId: "0xb460daa847c45f1c4a41cb05bfb3b51c92e41b36000200000000000000000194",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let QNT_USDC_0_003_0xdbc4_POOL = {
	address: "0xDbC4F138528B6B893cBCc3fd9c15D8B34D0554aE",
	poolId: "0xdbc4f138528b6b893cbcc3fd9c15d8b34d0554ae0002000000000000000003bf",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_WETH_0_0025_0xa02e_POOL = {
	address: "0xa02E4b3d18D4E6B8d18Ac421fBc3dfFF8933c40a",
	poolId: "0xa02e4b3d18d4e6b8d18ac421fbc3dfff8933c40a00020000000000000000004b",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDT_0_0009_0x3e5f_POOL = {
	address: "0x3e5FA9518eA95c3E533EB377C001702A9AaCAA32",
	poolId: "0x3e5fa9518ea95c3e533eb377c001702a9aacaa32000200000000000000000052",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WBTC_WETH_0_001_0x9f2a_POOL = {
	address: "0x9F2a5E84abf5AA0771f4027c726B5697d9D2010a",
	poolId: "0x9f2a5e84abf5aa0771f4027c726b5697d9d2010a000200000000000000000342",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DAI_WETH_0_0025_0xc6a5_POOL = {
	address: "0xC6A5032dC4bF638e15b4a66BC718ba7bA474FF73",
	poolId: "0xc6a5032dc4bf638e15b4a66bc718ba7ba474ff73000200000000000000000004",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WSTETH_COMP_0_005_0x87a8_POOL = {
	address: "0x87a867f5D240a782d43D90b6B06DEa470F3f8F22",
	poolId: "0x87a867f5d240a782d43d90b6b06dea470f3f8f22000200000000000000000516",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.reserve0 < 1000n || pool.reserve1 < 1000n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, pool_fee, weight0, weight1, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

	let token0_Market_Price = null;
	let token1_Market_Price = null;
	let nativeToken_Market_Price = null;
	let FeeData = null;

	let reserveIn;
	let reserveIn_dollar;
	let tokenIn_address;
	let tokenIn_symbol;
	let tokenIn_decimal;
	let tokenIn_price;
	let weightIn;

	let reserveOut;
	let reserveOut_dollar;
	let tokenOut_address;
	let tokenOut_symbol;
	let tokenOut_decimal;
	let tokenOut_price;
	let weightOut;

	let ZeroToOne;
	let pool_constant_number;
	let token;

	let amountIn = 0n;
	let amountOutMin = 0n;
	let entranceProfit = 0;

	async function initialize() {
		async function getTokenMarketPrices() {
			try {
				[token0_Market_Price, token1_Market_Price, nativeToken_Market_Price] = await GlobalLibrary.getMarketPriceBatch([token0_symbol, token1_symbol, "ETH"]);
			} catch (error) {
				getTokenMarketPrices();
			}

			if (token0_Market_Price == null || token1_Market_Price == null || token0_Market_Price == undefined || token1_Market_Price == undefined) return;
		}

		async function getFeeData() {
			try {
				FeeData = JSON.parse(await fs.promises.readFile("Scripts/FeeData/FeeData.json"));
			} catch (error) {
				getFeeData();
			}

			if (FeeData == null || FeeData == undefined) return;
		}

		await Promise.all([getTokenMarketPrices(), getFeeData()]);

		if (token0_Market_Price == null || token1_Market_Price == null || nativeToken_Market_Price == null || FeeData == null) {
			pool.processing = false;

			return;
		}

		const diff = ethers.formatEther(weight1) / ethers.formatEther(weight0);

		const token0_Pool_Price = ((ethers.formatUnits(BigInt(pool.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(pool.reserve0), token0_decimal) * token0_Market_Price * diff)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;
			weightIn = weight1;

			reserveOut = BigInt(pool.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;
			weightOut = weight0;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;
			weightIn = weight0;

			reserveOut = BigInt(pool.reserve1);
			tokenOut_address = token1_address;
			tokenOut_symbol = token1_symbol;
			tokenOut_decimal = token1_decimal;
			tokenOut_price = token1_Market_Price;
			weightOut = weight1;

			ZeroToOne = true;
		}

		reserveIn_dollar = ethers.formatUnits(reserveIn, tokenIn_decimal) * tokenIn_price;
		reserveOut_dollar = ethers.formatUnits(reserveOut, tokenOut_decimal) * tokenOut_price;

		pool_constant_number = reserveIn_dollar * reserveOut_dollar;

		token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);
	}

	await initialize();

	async function formula() {
		const Bi = reserveIn; // input
		const Bo = reserveOut; // output
		const Wi = weightIn; // input
		const Wo = weightOut; // output
		const exponentiate = Wi / Wo; // input / output

		const isWeightsEqual = Wi == Wo ? 2 : exponentiate;

		const mutualReserveTarget_dollar = Wi == Wo ? reserveOut_dollar - (reserveOut_dollar - reserveIn_dollar) / isWeightsEqual : reserveOut_dollar * exponentiate;

		const amountIn_dollar = (mutualReserveTarget_dollar - reserveIn_dollar) / isWeightsEqual;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		const amountInLessFee = amountIn - (amountIn * BigInt(pool_fee * 10000)) / 10000n;

		const Ai = amountInLessFee; // input

		amountOutMin = BigInt(Number(Bo) * (1 - (Number(Bi) / (Number(Bi) + Number(Ai))) ** exponentiate));

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		entranceProfit = amountOutMin_dollar - amountIn_dollar;

		if (project.comments) {
			console.log(
				` -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
	 -- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
	 -- entranceProfit = ${entranceProfit}$`
			);
		}
	}

	try {
		await formula();
	} catch (error) {
		pool.processing = false;

		return;
	}

	if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit < minimumEntranceProfit) {
		pool.processing = false;

		return;
	}

	await GlobalLibrary.saveProfitToJson(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const vendablePools = await GlobalLibrary.getVendablePools(chain, "3", "0x", tokenIn_address, tokenOut_address);

	async function getSufficientVendablePools() {
		if (vendablePools.length == 0) return [];

		let tokenBalancePromises = [];
		let sufficientVendablePools = [];

		for (const pool of vendablePools) tokenBalancePromises.push(token.balanceOf(pool.pool_address));

		const tokenBalanceResult = await Promise.all(tokenBalancePromises);

		for (let index = 0; index < tokenBalanceResult.length; index++) {
			if (tokenBalanceResult[index] <= amountIn * 2n) continue;
			if (tokenBalanceResult[index] > amountIn * 2n) {
				sufficientVendablePools.push(vendablePools[index]);
				continue;
			}
		}

		return sufficientVendablePools;
	}

	const sufficientVendablePools = await getSufficientVendablePools();

	async function getOptimalInput() {
		if (sufficientVendablePools.length == 0) return [null, null, null, null];

		let zeroForOne;
		let sqrtPriceLimitX96;
		let promises = [];
		let flashPools = [];

		for (const pool of sufficientVendablePools) {
			const QuoterContract = QuotersV3[pool.project_name];
			const QutoerVersion = QuoterVersionsV3[pool.project_name];

			if (pool.token0_address == tokenIn_address && pool.token1_address == tokenOut_address) {
				zeroForOne = false;
				sqrtPriceLimitX96 = MAX_SQRT_RATIO - 1000n;
			}

			if (pool.token0_address == tokenOut_address && pool.token1_address == tokenIn_address) {
				zeroForOne = true;
				sqrtPriceLimitX96 = MIN_SQRT_RATIO + 1000n;
			}

			if (QutoerVersion == 1) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, pool.pool_fee, amountIn, sqrtPriceLimitX96);

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 2) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
					tokenIn: tokenOut_address,
					tokenOut: tokenIn_address,
					amount: amountIn,
					fee: pool.pool_fee,
					sqrtPriceLimitX96: sqrtPriceLimitX96,
				});

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 3) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, amountIn, sqrtPriceLimitX96);

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 4) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
					tokenIn: tokenOut_address,
					tokenOut: tokenIn_address,
					amount: amountIn,
					limitSqrtPrice: sqrtPriceLimitX96,
				});

				promises.push(promise);
				flashPools.push(pool);
			}

			if (zeroForOne == undefined || sqrtPriceLimitX96 == undefined) {
				console.log("undefined error occured zeroForOne !!!", zeroForOne);
				console.log("undefined error occured sqrtPriceLimitX96 !!!", sqrtPriceLimitX96);
				return;
			}
		}

		let result = [];

		try {
			result = await Promise.all(promises);
		} catch (error) {
			pool.processing = false;

			return;
		}

		if (result.length == 0) return [null, null, null, null];

		let optimalInput = Infinity;
		let flashPool;

		for (let index = 0; index < result.length; index++) {
			if (result[index].amountIn !== undefined && result[index].amountIn < optimalInput) {
				optimalInput = result[index].amountIn;
				flashPool = flashPools[index];
				continue;
			}

			if (result[index].amountIn == undefined && result[index][0].returnedAmount < optimalInput) {
				optimalInput = result[index][0].returnedAmount;
				flashPool = flashPools[index];
				continue;
			}
		}

		return [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96];
	}

	const [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96] = await getOptimalInput();

	if (optimalInput == null || flashPool == null || zeroForOne == null || sqrtPriceLimitX96 == null) {
		pool.processing = false;

		return;
	}

	const tokenRevenue = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInput, tokenOut_decimal);

	const vendableProfit = tokenRevenue * tokenOut_price;

	if (vendableProfit < minimumVendableProfit || Number(ethers.formatUnits(amountOutMin, tokenOut_decimal)) < Number(ethers.formatUnits(optimalInput, tokenOut_decimal))) {
		pool.processing = false;

		return;
	}

	if (project.comments) {
		console.log("flashPool", flashPool);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V3`);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(optimalInput, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V3`);
		console.log(`tokenRevenue ${tokenRevenue} ${tokenOut_symbol}`);
		console.log("entranceProfit", entranceProfit);
		console.log("vendableProfit", vendableProfit);
	}

	await GlobalLibrary.saveProfitToJson(chain, entranceProfit, vendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const singleSwap = {
		poolId: pool.poolId,
		kind: 0, // GIVEN_IN // EXACT_INPUT
		assetIn: tokenIn_address,
		assetOut: tokenOut_address,
		amount: amountIn,
		userData: "0x",
	};

	const funds = {
		sender: flashSwapAddress,
		fromInternalBalance: false,
		recipient: flashSwapAddress,
		toInternalBalance: false,
	};

	const deadline = Date.now() + 1000 * 60 * 1;

	const swapData = VAULT.https_contract.interface.encodeFunctionData("0x52bbbe29", [singleSwap, funds, amountOutMin, deadline]);

	const callback = encoder.encode(["address", "address", "address", "bytes"], [VAULT.address, flashPool.token0_address, flashPool.token1_address, swapData]);

	const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

	const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);

	const tx = {
		from: WalletAddress,
		to: flashSwapAddress,
		data: flashSwap_data,
		chainId: chainID,
		value: 0,
		type: 2,
		gasLimit: flashSwap_gasLimit,
		maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
		maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
		// gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
		// nonce: await Owner_Account.getNonce(),
	};

	const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * 2) / 10 ** 18) * nativeToken_Market_Price;

	const flashSwapProfit = vendableProfit - transactionFeeL2;

	if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
		pool.processing = false;

		return;
	}

	if (project.comments) {
		console.log("transactionFeeL2", transactionFeeL2, "$");
		console.log("flashSwapProfit", flashSwapProfit, "$");
	}

	async function execute() {
		let isErrorOccured;

		try {
			await FLASHSWAP_PROVIDER.call(tx);

			isErrorOccured = false;
		} catch (error) {
			await GlobalLibrary.saveErrorToJson(
				chain,
				error,
				pool,
				flashPool,
				projectName,
				pool_name,
				amountIn,
				tokenIn_decimal,
				tokenIn_symbol,
				tokenIn_address,
				amountOutMin,
				tokenOut_decimal,
				tokenOut_symbol,
				tokenOut_address,
				optimalInput,
				transactionFeeL2,
				entranceProfit,
				vendableProfit,
				flashSwapProfit
			);

			isErrorOccured = true;

			[, [pool.reserve0, pool.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.poolId);

			pool.processing = false;

			return;
		}

		if (isErrorOccured == false) {
			const transaction_body = await Owner_Account.sendTransaction(tx);

			const receipt = await FLASHSWAP_PROVIDER.waitForTransaction(transaction_body.hash, confirmation, blockTime);

			if (receipt.status == 1) {
				await GlobalLibrary.saveProfitToCsv(chain, startTime, projectName, pool_name, transactionFeeL2, entranceProfit, vendableProfit, flashSwapProfit, tokenRevenue, tokenOut_symbol);
			}
		}

		[, [pool.reserve0, pool.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.poolId);

		pool.processing = false;
	}

	await execute();
}

async function Initializer() {
	const object_name = `VAULT`;

	const pool_object = eval(object_name);

	pool_object.wss_contract = new ethersV5.Contract(pool_object.address, VAULT_ABI, WSS_POOL_PROVIDER);

	for (const pool of poolsData) {
		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

		const pool_object = eval(object_name);

		[, [pool_object.reserve0, pool_object.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.pool_id);

		// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
		// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

		global[object_name] = pool_object;
	}
}

async function Listen() {
	async function re_initialize() {
		const object_name = `VAULT`;

		const vault_object = eval(object_name);

		WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ETHEREUM_V2_WSS_POOL_PROVIDER_URL);

		vault_object.wss_contract = new ethersV5.Contract(vault_object.address, VAULT_ABI, WSS_POOL_PROVIDER);

		global[object_name] = vault_object;
	}

	async function addListeners() {
		const object_name = `VAULT`;

		const vault_object = eval(object_name);

		// console.log("Old Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));

		await vault_object.wss_contract.removeAllListeners("Swap");

		// console.log("New Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));

		vault_object.wss_contract.on("Swap", async (poolId, tokenIn, tokenOut, amountIn, amountOut) => {
			try {
				for (const pool of poolsData) {
					if (pool.pool_id !== poolId) continue;

					const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

					const pool_object = eval(object_name);

					[, [pool_object.reserve0, pool_object.reserve1]] = await VAULT.https_contract.getPoolTokens(poolId);

					// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
					// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

					global[object_name] = pool_object;

					await Executor(pool_object);
				}
			} catch (error) {
				console.error("Error fetching reserves or fee ratio:", error);
			}
		});

		// console.log("Added Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));
	}

	function setupHeartbeat() {
		clearInterval(heartbeatInterval);
		heartbeatInterval = setInterval(() => {
			WSS_POOL_PROVIDER._websocket.ping();
		}, 15000);
	}

	async function monitorPool() {
		await addListeners();

		WSS_POOL_PROVIDER._websocket.on("close", async () => {
			// console.log("WebSocket connection closed. Attempting to reconnect...");
			clearInterval(heartbeatInterval);
			await reconnect();
		});

		WSS_POOL_PROVIDER._websocket.on("error", async (error) => {
			// console.error("WebSocket error:", error);
			clearInterval(heartbeatInterval);
			await reconnect();
		});

		WSS_POOL_PROVIDER._websocket.on("open", async () => {
			// console.log("WebSocket connection opened.");
			setupHeartbeat();
		});
	}

	await monitorPool();

	function reconnect() {
		setTimeout(async () => {
			// console.log("Reconnecting to WebSocket...");
			await re_initialize(); // Re Initialize Websocket Provider and Pool Contract of each Pool
			monitorPool();
		}, 3000);
	}
}

async function Callee() {
	for (const pool of poolsData) {
		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

		const pool_object = eval(object_name);

		Executor(pool_object);

		// await Executor(pool_object);
	}
}

Initializer().then(() => {
	Listen().then(() => {
		setInterval(Callee, Interval);
	});
});
