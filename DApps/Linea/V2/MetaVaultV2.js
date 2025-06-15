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
const poolABI = require(path.join(__dirname, `../../../Scripts/Dex/PoolABIsV2/UniswapV2PoolABI.json`));

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.LINEA_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let USDC_WETH_POOL = {
	address: "0x0a700e8a842a86A03abcCD0F535661bA7F0858bF",
	https_contract: new ethers.Contract("0x0a700e8a842a86A03abcCD0F535661bA7F0858bF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_POOL = {
	address: "0x3106f32AF4C7B7B59FA0303277Ed8DA305964813",
	https_contract: new ethers.Contract("0x3106f32AF4C7B7B59FA0303277Ed8DA305964813", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_WETH_POOL = {
	address: "0x392cFC2D27A9EF38c9e85e7CB256CfD0F334007a",
	https_contract: new ethers.Contract("0x392cFC2D27A9EF38c9e85e7CB256CfD0F334007a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WBTC_WETH_POOL = {
	address: "0xE696d6c42a4Cd1dF3A5422569cd4cc04d792AB7b",
	https_contract: new ethers.Contract("0xE696d6c42a4Cd1dF3A5422569cd4cc04d792AB7b", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MVX_WETH_POOL = {
	address: "0x7674d89De8af434f3B6b4D15C76ebBB3FBB46Ff6",
	https_contract: new ethers.Contract("0x7674d89De8af434f3B6b4D15C76ebBB3FBB46Ff6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_USDT_POOL = {
	address: "0x822531Bce0471893EaD44D931Ae994a6161d51BF",
	https_contract: new ethers.Contract("0x822531Bce0471893EaD44D931Ae994a6161d51BF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_EZETH_POOL = {
	address: "0xB2B2cC21f049105D5D4c03AEcd0faba03BBb0f82",
	https_contract: new ethers.Contract("0xB2B2cC21f049105D5D4c03AEcd0faba03BBb0f82", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DAI_USDT_POOL = {
	address: "0x2468B75Ec0a4f2E91e0EC4cd30f94cB22737342A",
	https_contract: new ethers.Contract("0x2468B75Ec0a4f2E91e0EC4cd30f94cB22737342A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.reserve0 < 1000n || pool.reserve1 < 1000n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

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

	let reserveOut;
	let reserveOut_dollar;
	let tokenOut_address;
	let tokenOut_symbol;
	let tokenOut_decimal;
	let tokenOut_price;

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

		const token0_Pool_Price = ((ethers.formatUnits(BigInt(pool.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(pool.reserve0), token0_decimal) * token0_Market_Price)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;

			reserveOut = BigInt(pool.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;

			reserveOut = BigInt(pool.reserve1);
			tokenOut_address = token1_address;
			tokenOut_symbol = token1_symbol;
			tokenOut_decimal = token1_decimal;
			tokenOut_price = token1_Market_Price;

			ZeroToOne = true;
		}

		reserveIn_dollar = ethers.formatUnits(reserveIn, tokenIn_decimal) * tokenIn_price;
		reserveOut_dollar = ethers.formatUnits(reserveOut, tokenOut_decimal) * tokenOut_price;

		pool_constant_number = reserveIn_dollar * reserveOut_dollar;

		token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);
	}

	await initialize();

	async function formula() {
		const mutualReserveTarget_dollar = (reserveIn_dollar + reserveOut_dollar) / 2;

		const amountIn_dollar = mutualReserveTarget_dollar - reserveIn_dollar;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		amountOutMin = await LibraryV2.getAmountOut(amountIn, reserveIn, reserveOut, project.fee);

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

	const swapData =
		ZeroToOne == true
			? project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountOutMin, flashSwapAddress, "0x"]).slice(2)
			: project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountOutMin, 0, flashSwapAddress, "0x"]).slice(2);

	const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]);

	const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

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

	const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * gasPrice_multiplier) / 10 ** 18) * nativeToken_Market_Price;

	// getL1TransactionFee is Disabled

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

			[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

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

		[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

		pool.processing = false;
	}

	await execute();
}

async function Initializer() {
	for (const pool of poolsData) {
		const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

		const pool_object = eval(object_name);

		pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

		const reserves = await pool_object.https_contract.getReserves();

		pool_object.reserve0 = BigInt(reserves[0]);
		pool_object.reserve1 = BigInt(reserves[1]);

		// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
		// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

		global[object_name] = pool_object;
	}
}

async function Listen() {
	async function re_initialize() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

			const pool_object = eval(object_name);

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.LINEA_V2_WSS_POOL_PROVIDER_URL);

			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

			global[object_name] = pool_object;
		}
	}

	async function addListeners() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

			const pool_object = eval(object_name);

			// console.log("Old Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));

			await pool_object.wss_contract.removeAllListeners("Sync");

			// console.log("New Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));

			pool_object.wss_contract.on("Sync", async (reserve0, reserve1) => {
				try {
					pool_object.reserve0 = BigInt(reserve0);
					pool_object.reserve1 = BigInt(reserve1);

					// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
					// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

					global[object_name] = pool_object;

					await Executor(pool_object);
				} catch (error) {
					console.error("Error fetching reserves or fee ratio:", error);
				}
			});

			// console.log("Added Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
		}
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
		const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

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
