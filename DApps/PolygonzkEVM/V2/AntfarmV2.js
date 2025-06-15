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
	ATF_address,
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
const poolABI = require(path.join(__dirname, `../../../Scripts/Dex/PoolABIsV2/${projectName}PoolABI.json`));

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let ATF_WETH_1_POOL = {
	address: "0x968AA62488d5A412e21ce5F4A8284ffaa588F472",
	https_contract: new ethers.Contract("0x968AA62488d5A412e21ce5F4A8284ffaa588F472", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_1_POOL = {
	address: "0x2a48d1DaCdBCd1CdDE815E3BE0c58C0A29EA7168",
	https_contract: new ethers.Contract("0x2a48d1DaCdBCd1CdDE815E3BE0c58C0A29EA7168", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_WETH_10_POOL = {
	address: "0x3D09B07ff21C91a1E7D77E3c3d1D10B4E2Daa3CF",
	https_contract: new ethers.Contract("0x3D09B07ff21C91a1E7D77E3c3d1D10B4E2Daa3CF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_WETH_25_POOL = {
	address: "0xfa1C4eebDd4a4315b91E3758d8926D95ACFc2650",
	https_contract: new ethers.Contract("0xfa1C4eebDd4a4315b91E3758d8926D95ACFc2650", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_WETH_50_POOL = {
	address: "0x9F97853f72cDeAD98214398BFf6aA6d4160822dd",
	https_contract: new ethers.Contract("0x9F97853f72cDeAD98214398BFf6aA6d4160822dd", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_10_POOL = {
	address: "0x7cF42Ec4A100D6cfCcbbA46fD2797098802f4aa2",
	https_contract: new ethers.Contract("0x7cF42Ec4A100D6cfCcbbA46fD2797098802f4aa2", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_100_POOL = {
	address: "0x2906bE04939952B1Da9730C60a80EB96a9585168",
	https_contract: new ethers.Contract("0x2906bE04939952B1Da9730C60a80EB96a9585168", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_1_POOL = {
	address: "0x26af23bA66651F62278D84826b2e80FF5bc14361",
	https_contract: new ethers.Contract("0x26af23bA66651F62278D84826b2e80FF5bc14361", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_USDC_10_POOL = {
	address: "0xb373916942016387F2327ea07355554a96d886Fb",
	https_contract: new ethers.Contract("0xb373916942016387F2327ea07355554a96d886Fb", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_MATIC_10_POOL = {
	address: "0x6b218fe0fc205281f5d2151A16A6242c19967023",
	https_contract: new ethers.Contract("0x6b218fe0fc205281f5d2151A16A6242c19967023", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_USDC_1_POOL = {
	address: "0xb6C3C27769842d982f69409B36202c64c03f40A6",
	https_contract: new ethers.Contract("0xb6C3C27769842d982f69409B36202c64c03f40A6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_MATIC_1_POOL = {
	address: "0xbF67c89cf4B0eA793E565791A8b9c8273149d077",
	https_contract: new ethers.Contract("0xbF67c89cf4B0eA793E565791A8b9c8273149d077", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_10_POOL = {
	address: "0x8931b669D1C1A8e847fafae6b6081C3493cbaF3e",
	https_contract: new ethers.Contract("0x8931b669D1C1A8e847fafae6b6081C3493cbaF3e", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_10_POOL = {
	address: "0x566B91a4bc5C0E89F157bCDA0FA7f71339724b3d",
	https_contract: new ethers.Contract("0x566B91a4bc5C0E89F157bCDA0FA7f71339724b3d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_1_POOL = {
	address: "0x5927Ac02f09E6F2eBa288EF520B32A09A27fD6cd",
	https_contract: new ethers.Contract("0x5927Ac02f09E6F2eBa288EF520B32A09A27fD6cd", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_50_POOL = {
	address: "0x3d9b60e8654cD8317BD385231F36D958D04c4688",
	https_contract: new ethers.Contract("0x3d9b60e8654cD8317BD385231F36D958D04c4688", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_USDC_25_POOL = {
	address: "0x88a0E8234d79f49ab67C6f3Bc1d8d09e17ff823d",
	https_contract: new ethers.Contract("0x88a0E8234d79f49ab67C6f3Bc1d8d09e17ff823d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_25_POOL = {
	address: "0x7CcF92b838022eEe3c6b3fFDbf6a30Fac774919E",
	https_contract: new ethers.Contract("0x7CcF92b838022eEe3c6b3fFDbf6a30Fac774919E", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_USDC_50_POOL = {
	address: "0x99dd46d60078DFF5e3EEa160033Ed6789EB32bA7",
	https_contract: new ethers.Contract("0x99dd46d60078DFF5e3EEa160033Ed6789EB32bA7", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_25_POOL = {
	address: "0x3ECB46fb482B1FaA8eEdD37e6be3F36E15b0ad08",
	https_contract: new ethers.Contract("0x3ECB46fb482B1FaA8eEdD37e6be3F36E15b0ad08", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_1_POOL = {
	address: "0xE5747904Df1340b3E02f6b02DbFefacB2B91a7f3",
	https_contract: new ethers.Contract("0xE5747904Df1340b3E02f6b02DbFefacB2B91a7f3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_10_POOL = {
	address: "0x4D1C76AF4881BFEaa441A04Cd7e577B77Ac75E34",
	https_contract: new ethers.Contract("0x4D1C76AF4881BFEaa441A04Cd7e577B77Ac75E34", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ATF_USDT_1_POOL = {
	address: "0x8b8486Ac44A6b585217b99cF80448703376BB4da",
	https_contract: new ethers.Contract("0x8b8486Ac44A6b585217b99cF80448703376BB4da", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_1_POOL = {
	address: "0x4FcCE5FF168E143f2C8CA754d1e479EbA3477039",
	https_contract: new ethers.Contract("0x4FcCE5FF168E143f2C8CA754d1e479EbA3477039", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_10_POOL = {
	address: "0x81e5473F1586EE915ec13255587d4D4Ff43f9149",
	https_contract: new ethers.Contract("0x81e5473F1586EE915ec13255587d4D4Ff43f9149", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.reserve0 < 1000n || pool.reserve1 < 1000n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, pool_fee, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

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
	let feeToPay = ethers.parseEther("100000");
	let ATF_price = 0.1;

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

		amountOutMin = await LibraryV2.getAmountOut_Antfarm(amountIn, reserveIn, reserveOut);

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		if (tokenIn_symbol == "ATF") {
			feeToPay = 0n;
			const do_not_send_feeToPay = (amountIn_dollar * (pool_fee / 100)) / tokenIn_price;

			const old = amountIn;

			amountIn += ethers.parseUnits(do_not_send_feeToPay.toFixed(tokenIn_decimal), tokenIn_decimal);

			entranceProfit = amountOutMin_dollar - amountIn_dollar - do_not_send_feeToPay * ATF_price;

			if (project.comments) {
				console.log(
					`-- amountIn = ${ethers.formatUnits(old, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
 -- amountIn PARAM = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${ethers.formatUnits(amountIn, tokenIn_decimal) * tokenIn_price}$
 -- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
 -- do_not_send_feeToPay = ${do_not_send_feeToPay} ATF === ${do_not_send_feeToPay * ATF_price}$
 -- entranceProfit = ${entranceProfit}$`
				);
			}
		} else if (tokenOut_symbol == "ATF") {
			feeToPay = 0n;
			const do_not_send_feeToPay = (amountOutMin_dollar * (pool_fee / 100)) / tokenOut_price;

			const old = amountOutMin;

			amountOutMin -= ethers.parseUnits(do_not_send_feeToPay.toFixed(tokenOut_decimal), tokenOut_decimal);

			entranceProfit = amountOutMin_dollar - amountIn_dollar - do_not_send_feeToPay * ATF_price;

			if (project.comments) {
				console.log(
					` -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
 -- amountOutMin = ${ethers.formatUnits(old, tokenOut_decimal)} ${token0_symbol} === ${amountOutMin_dollar}$
 -- amountOutMin PARAM = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${token0_symbol} === ${ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price}$
 -- do_not_send_feeToPay = ${do_not_send_feeToPay} ATF === ${do_not_send_feeToPay * ATF_price}$
 -- entranceProfit = ${entranceProfit}$`
				);
			}
		} else {
			try {
				// amount0Out, amount0In, amount1Out, amount1In
				if (tokenIn_address == token0_address && tokenOut_address == token1_address) {
					feeToPay = await pool.https_contract.getFees(0, amountIn, amountOutMin, 0);
				} else if (tokenIn_address == token1_address && tokenOut_address == token0_address) {
					feeToPay = await pool.https_contract.getFees(amountOutMin, 0, 0, amountIn);
				}
			} catch (error) {
				pool.processing = false;

				return;
			}

			if (feeToPay == ethers.parseEther("100000") || feeToPay == null || feeToPay == undefined || feeToPay == 0n || feeToPay == 0) {
				pool.processing = false;

				return;
			}

			entranceProfit = amountOutMin_dollar - amountIn_dollar;

			if (project.comments) {
				console.log(
					` -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
 -- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
 -- feeToPay = ${ethers.formatEther(feeToPay)} ATF === ${ethers.formatEther(feeToPay) * ATF_price}$
 -- entranceProfit = ${entranceProfit}$`
				);
			}
		}
	}

	try {
		await formula();
	} catch (error) {
		pool.processing = false;

		return;
	}

	if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit - ethers.formatEther(feeToPay) * ATF_price < minimumEntranceProfit) {
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

	const vendableProfit = tokenRevenue * tokenOut_price - ethers.formatEther(feeToPay) * ATF_price;

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
		console.log("feeToPay", ethers.formatEther(feeToPay) * ATF_price);
		console.log("vendableProfit without fee", vendableProfit + ethers.formatEther(feeToPay) * ATF_price);
		console.log("vendableProfit", vendableProfit);
	}

	await GlobalLibrary.saveProfitToJson(
		chain,
		entranceProfit,
		vendableProfit,
		projectName,
		pool_name,
		amountIn,
		tokenIn_decimal,
		tokenIn_symbol,
		tokenIn_address,
		amountOutMin,
		tokenOut_decimal,
		tokenOut_symbol,
		tokenOut_address
	);

	const swapData =
		ZeroToOne == true
			? project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountOutMin, flashSwapAddress, "0x"]).slice(2)
			: project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountOutMin, 0, flashSwapAddress, "0x"]).slice(2);

	const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, ATF_address, feeToPay]);

	const flashPoolData =
		ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

	const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);

	const tx = {
		from: WalletAddress,
		to: flashSwapAddress,
		data: flashSwap_data,
		chainId: chainID,
		value: 0,
		type: 0,
		gasLimit: flashSwap_gasLimit,
		gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
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
		const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;

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
			const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

			const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;

			const pool_object = eval(object_name);

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V2_WSS_POOL_PROVIDER_URL);

			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

			global[object_name] = pool_object;
		}
	}

	async function addListeners() {
		for (const pool of poolsData) {
			const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

			const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;

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
		if (pool.token0_symbol == "ATF" || pool.token1_symbol == "ATF") continue;

		const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;

		const pool_object = eval(object_name);

		Executor(pool_object);
	}
}

Initializer().then(() => {
	Listen().then(() => {
		setInterval(Callee, Interval);
	});
});
