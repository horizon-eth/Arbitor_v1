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

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.FRAXTAL_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let FRAX_FXS_POOL = {
	address: "0xb4dA8dA10ffF1F6127ab71395053Aa1d499b503F",
	https_contract: new ethers.Contract("0xb4dA8dA10ffF1F6127ab71395053Aa1d499b503F", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FRAX_WFRXETH_POOL = {
	address: "0x4527bcEd9d41706D1436507e9a6e354d3FF44ff9",
	https_contract: new ethers.Contract("0x4527bcEd9d41706D1436507e9a6e354d3FF44ff9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FRAX_SFRXETH_POOL = {
	address: "0xEBD293F2173082320d88533316F5964298dE316E",
	https_contract: new ethers.Contract("0xEBD293F2173082320d88533316F5964298dE316E", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FRAX_FPI_POOL = {
	address: "0x0EFFABede4e31101DE5209096611D073981A817b",
	https_contract: new ethers.Contract("0x0EFFABede4e31101DE5209096611D073981A817b", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FRAX_SFRAX_POOL = {
	address: "0x49C790D0EeE5C841817F7a7FB0B90a84cb55E2cA",
	https_contract: new ethers.Contract("0x49C790D0EeE5C841817F7a7FB0B90a84cb55E2cA", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_FRAX_POOL = {
	address: "0x17b3a995399A113C934C81904367f0195276865d",
	https_contract: new ethers.Contract("0x17b3a995399A113C934C81904367f0195276865d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FRAX_FPIS_POOL = {
	address: "0x78d264E25781f31343352A0f91875B655c79B843",
	https_contract: new ethers.Contract("0x78d264E25781f31343352A0f91875B655c79B843", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FXS_WFRXETH_POOL = {
	address: "0x922Aa688F879050b2e32a63D764cf4E8B79c3Bdb",
	https_contract: new ethers.Contract("0x922Aa688F879050b2e32a63D764cf4E8B79c3Bdb", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FXS_SFRXETH_POOL = {
	address: "0xCd170C41D9d3da1Ba942211e73fb0891C3FA44F4",
	https_contract: new ethers.Contract("0xCd170C41D9d3da1Ba942211e73fb0891C3FA44F4", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_FXS_POOL = {
	address: "0xCfbB241bcc694673E7A2397952474f960648f273",
	https_contract: new ethers.Contract("0xCfbB241bcc694673E7A2397952474f960648f273", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FXS_FPIS_POOL = {
	address: "0x4915218D9069fc0C40ce6F4c76a39e12F4a87162",
	https_contract: new ethers.Contract("0x4915218D9069fc0C40ce6F4c76a39e12F4a87162", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let SFRXETH_WFRXETH_POOL = {
	address: "0x07412F06DB215A20909C3c29FaA3cC7A48777185",
	https_contract: new ethers.Contract("0x07412F06DB215A20909C3c29FaA3cC7A48777185", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WFRXETH_POOL = {
	address: "0x652EBa04c576436765f641739f92475Af7Fc0b1a",
	https_contract: new ethers.Contract("0x652EBa04c576436765f641739f92475Af7Fc0b1a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPI_WFRXETH_POOL = {
	address: "0x0D578A04f385F471B7A4772B9153791246C2ECDb",
	https_contract: new ethers.Contract("0x0D578A04f385F471B7A4772B9153791246C2ECDb", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WFRXETH_SFRAX_POOL = {
	address: "0xf8F4aA78316B15d910003CbE855CE1457A242C4c",
	https_contract: new ethers.Contract("0xf8F4aA78316B15d910003CbE855CE1457A242C4c", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WFRXETH_POOL = {
	address: "0x2CdF13021Ea886272505d363E69bA46386e2AD9d",
	https_contract: new ethers.Contract("0x2CdF13021Ea886272505d363E69bA46386e2AD9d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KFC_WFRXETH_POOL = {
	address: "0xF863fA4e2FB131DeA2C2fc43eD4cF6400CB39747",
	https_contract: new ethers.Contract("0xF863fA4e2FB131DeA2C2fc43eD4cF6400CB39747", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FXD_WFRXETH_POOL = {
	address: "0xe1b8969E412a88DDbc65d6453B2Ccb4Dd996ebdc",
	https_contract: new ethers.Contract("0xe1b8969E412a88DDbc65d6453B2Ccb4Dd996ebdc", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPIS_WFRXETH_POOL = {
	address: "0x8d38aE489ea2c86E8835dD7DF565b23e2C538b93",
	https_contract: new ethers.Contract("0x8d38aE489ea2c86E8835dD7DF565b23e2C538b93", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPI_SFRXETH_POOL = {
	address: "0x44e9F95eaC04956A6c5e0BeB50a8c5D99a0C8738",
	https_contract: new ethers.Contract("0x44e9F95eaC04956A6c5e0BeB50a8c5D99a0C8738", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_SFRXETH_POOL = {
	address: "0xe6522a0401BA50b441472ec23D572AaA22dD0841",
	https_contract: new ethers.Contract("0xe6522a0401BA50b441472ec23D572AaA22dD0841", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KFC_SFRXETH_POOL = {
	address: "0xCeC2f6661d56B136aD2DD65c119d32ae4C95394E",
	https_contract: new ethers.Contract("0xCeC2f6661d56B136aD2DD65c119d32ae4C95394E", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPIS_SFRXETH_POOL = {
	address: "0x920833390d667169484F843237B0eA7Eb9BEeDc6",
	https_contract: new ethers.Contract("0x920833390d667169484F843237B0eA7Eb9BEeDc6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_FPI_POOL = {
	address: "0x461d5eD42aFBe2AFa59eB369b7D7Cc0c4df4a45c",
	https_contract: new ethers.Contract("0x461d5eD42aFBe2AFa59eB369b7D7Cc0c4df4a45c", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPI_FPIS_POOL = {
	address: "0xCB1047e68590d9Ea2E9c0711fE9ab5D871788fc0",
	https_contract: new ethers.Contract("0xCB1047e68590d9Ea2E9c0711fE9ab5D871788fc0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_SFRAX_POOL = {
	address: "0x0596fF12C631061EF2A918bc4694e0b743E80ea6",
	https_contract: new ethers.Contract("0x0596fF12C631061EF2A918bc4694e0b743E80ea6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FPIS_SFRAX_POOL = {
	address: "0x1Dc8E49DfFb7B57B8C250663a7e1421Cc94dB4FD",
	https_contract: new ethers.Contract("0x1Dc8E49DfFb7B57B8C250663a7e1421Cc94dB4FD", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_FPIS_POOL = {
	address: "0x1110633278611Db3070532167d0c74daA7b542d7",
	https_contract: new ethers.Contract("0x1110633278611Db3070532167d0c74daA7b542d7", poolABI, POOL_PROVIDER_V2),
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
				[token0_Market_Price, token1_Market_Price, nativeToken_Market_Price] = await GlobalLibrary.getMarketPriceBatch([token0_symbol, token1_symbol, "FRXETH"]);
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
		// console.log(error);

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

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.FRAXTAL_V2_WSS_POOL_PROVIDER_URL);

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
