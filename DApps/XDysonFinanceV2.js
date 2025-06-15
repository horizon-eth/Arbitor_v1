const {
	ethers,
	ethersV5,
	fs,
	path,
	encoder,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	overhead,
	scalar,
	ERC20,
	chains,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	CoinMarketCapServerPort,
	PythServerPort,
	FeeDataServerPort,
	maxFeePerGas_multiplier,
	maxPriorityFeePerGas_multiplier,
	gasPrice_multiplier,
} = require("../Scripts/Common/Global/Global");

const {
	saveError,
	getVendableV3Pools,
	getVendableV2Pools,
	getVendableV2AntfarmPools,
	getFlashPool,
	getMarketPrice,
	GlobalLibrary.getMarketPriceBatch,
	getAmountOut,
	getAmountIn,
	getAmountOut_Antfarm,
	saveProfit,
	saveProfitToCSV,
	getDataFromLocalServer,
} = require("../Scripts/Library/LibraryV2");

const { poolNameSelectorV2 } = require("../Scripts/Library/V2/UniversalV2");

const poolABI = require("../Scripts/Dex/PoolABIsV2/DysonFinanceV2PoolABI.json");

// True --> Processing || False --> Not Processing --- START DO NOT DELETE
const PoolProcessController = {
	Ethereum: {},
	Linea: {
		DysonFinanceV2: {
			USDC_WETH_POOL: {
				processing: false,
			},
		},
	},
	PolygonzkEVM: {
		DysonFinanceV2: {
			WETH_USDC_POOL: {
				processing: false,
			},
			DYSN_USDC_POOL: {
				processing: false,
			},
		},
	},
	XLayer: {
		DysonFinanceV2: {
			USDC_WOKB_POOL: {
				processing: false,
			},
		},
	},
	Blast: {
		DysonFinanceV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
		},
	},
	Avalanche: {},
	ArbitrumNova: {},
	AstarZKevm: {},
	Fraxtal: {},
};

// True --> Processing || False --> Not Processing --- END DO NOT DELETE

async function XDysonFinanceV2(chain, projectName, poolName, pool, poolReserves) {
	if (PoolProcessController[chain][projectName][poolName].processing == true || poolReserves.reserve0 == undefined || poolReserves.reserve1 == undefined || poolReserves.reserve0 < 1000n || poolReserves.reserve1 < 1000n) return;

	PoolProcessController[chain][projectName][poolName].processing = true;

	const startTime = performance.now();

	const { pool_name, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = pool;

	const {
		confirmation,
		blockTime,
		minimumEntranceProfit,
		minimumVendableProfit,
		minimumFlashSwapProfit,
		chainID,
		FLASHSWAP_PROVIDER,
		POOL_PROVIDER_V2,
		CONTRACT_PROVIDER,
		flashSwapAddress,
		flashSwapContract,
		Owner_Account,
		ProjectsV2,
		callback_type,
		tx_type,
		native_token_symbol,
		ProjectsV3,
		QuotersV3,
		QuoterVersionsV3,
	} = require(`../Scripts/Common/Common/${chain}`);

	const poolContract = new ethers.Contract(pool.pool_address, poolABI, POOL_PROVIDER_V2);

	const reservesData = JSON.parse(await fs.promises.readFile(`Scripts/Reserves/${chain}.json`));

	// const [reserves, feeRatio] = await Promise.all([poolContract.getReserves(), poolContract.getFeeRatio()]);

	// poolReserves.reserve0 = reserves[0].toString();
	// poolReserves.reserve1 = reserves[1].toString();
	// poolReserves.feeRatio = [feeRatio[0].toString(), feeRatio[1].toString()];

	const feeRatio = await poolContract.getFeeRatio();

	poolReserves.feeRatio = [feeRatio[0].toString(), feeRatio[1].toString()];

	const project = ProjectsV2[projectName];

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

		if (token0_Market_Price == null || token0_Market_Price == undefined || token1_Market_Price == null || token1_Market_Price == undefined || FeeData == null || FeeData == undefined) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();

			pool.processing = false;

			return;
		}

		const token0_Pool_Price = ((ethers.formatUnits(BigInt(poolReserves.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(poolReserves.reserve0), token0_decimal) * token0_Market_Price)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(poolReserves.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;

			reserveOut = BigInt(poolReserves.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(poolReserves.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;

			reserveOut = BigInt(poolReserves.reserve1);
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

		feeRatioSelector = ZeroToOne == true ? 0 : 1;
	}

	await initialize();

	async function formula() {
		const mutualReserveTarget_dollar = (reserveIn_dollar + reserveOut_dollar) / 2;

		const amountIn_dollar = mutualReserveTarget_dollar - reserveIn_dollar;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		const amountInInput = amountIn - (BigInt(poolReserves.feeRatio[feeRatioSelector]) * amountIn) / 2n ** 64n;

		amountOutMin = (amountInInput * reserveOut) / (reserveIn + amountInInput);

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		entranceProfit = amountOutMin_dollar - amountIn_dollar;

		if (project.comments) {
			console.log(
				`${chain} ${projectName} ${poolName}\n -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
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
		PoolProcessController[chain][projectName][poolName].processing = false;
		return;
	}

	await saveProfit(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const swapData = ZeroToOne
		? project.swap0in + encoder.encode(["address", "uint256", "uint256"], [flashSwapAddress, amountIn, amountOutMin]).slice(2)
		: project.swap1in + encoder.encode(["address", "uint256", "uint256"], [flashSwapAddress, amountIn, amountOutMin]).slice(2);

	// -----
	// ----------
	// ---------------
	// V2_to_V2_Vendability

	async function V2_to_V2_Vendability() {
		async function VendabilityV2toV2() {
			const reserves = JSON.parse(await fs.promises.readFile(path.join(__dirname, `../Scripts/Reserves/${chain}.json`)));

			let optimalInputV2 = Infinity;
			let zeroForOneV2 = null;
			let flashPoolV2 = null;
			let flashPoolNameV2 = null;

			for (const VendableProjectNameV2 in reserves) {
				if (VendableProjectNameV2 == projectName) continue;
				if (VendableProjectNameV2 == "AntfarmFinanceV2") continue;
				if (VendableProjectNameV2 == "BalancerV2") continue;
				if (VendableProjectNameV2 == "CurveV2") continue;
				if (VendableProjectNameV2 == "SyncSwapV2") continue;

				const VendablePoolsDataV2 = JSON.parse(fs.readFileSync(path.join(__dirname, `../Scripts/Dex/PoolDatasV2/${chain}/${VendableProjectNameV2}.json`), "utf8"));

				for (const VendablePoolV2 of VendablePoolsDataV2) {
					if (!((tokenIn_symbol == VendablePoolV2.token0_symbol && tokenOut_symbol == VendablePoolV2.token1_symbol) || (tokenIn_symbol == VendablePoolV2.token1_symbol && tokenOut_symbol == VendablePoolV2.token0_symbol))) continue;

					const VendablePoolNameV2 = await poolNameSelectorV2(VendableProjectNameV2, VendablePoolV2);

					const VendablePoolReservesV2 = reserves[VendableProjectNameV2][VendablePoolNameV2];

					const VendableZeroToOneV2 = tokenIn_symbol == VendablePoolV2.token0_symbol && tokenOut_symbol == VendablePoolV2.token1_symbol ? false : true;

					const VendableProjectV2 = ProjectsV2[VendableProjectNameV2];

					const inputV2 = VendableZeroToOneV2
						? await getAmountIn(amountIn, VendablePoolReservesV2.reserve0, VendablePoolReservesV2.reserve1, VendableProjectV2.fee)
						: await getAmountIn(amountIn, VendablePoolReservesV2.reserve1, VendablePoolReservesV2.reserve0, VendableProjectV2.fee);

					if (inputV2 > optimalInputV2 || inputV2 <= BigInt(0)) continue;

					optimalInputV2 = inputV2;
					zeroForOneV2 = VendableZeroToOneV2;
					flashPoolV2 = VendablePoolV2;
					flashPoolNameV2 = VendablePoolNameV2;

					// console.log(VendablePoolNameV2, VendablePoolV2, VendablePoolReservesV2, VendableZeroToOneV2);

					// console.log("inputV2 for", VendableProjectNameV2, inputV2, ethers.formatUnits(inputV2, VendablePoolV2.token0_decimal), VendablePoolV2.token0_symbol);

					// console.log("inputV2 for", VendableProjectNameV2, inputV2, ethers.formatUnits(inputV2, VendablePoolV2.token1_decimal), VendablePoolV2.token1_symbol);
				}
			}

			return [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2];
		}

		const [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2] = await VendabilityV2toV2();

		if (optimalInputV2 == Infinity || zeroForOneV2 == null || flashPoolV2 == null || flashPoolNameV2 == null) return [null, null, null, null, null, null];

		async function handleDataV2() {
			let callbackV2;

			if (callback_type == 0) {
				callbackV2 = encoder.encode(["address", "bytes", "address", "address", "uint256", "uint256"], [pool.pool_address, swapData, flashPoolV2.token0_address, flashPoolV2.token1_address, optimalInputV2, 0]);
			} else if (callback_type == 1) {
				callbackV2 = encoder.encode(["address", "bytes", "address", "address", "uint256"], [pool.pool_address, swapData, flashPoolV2.token0_address, flashPoolV2.token1_address, optimalInputV2]);
			}

			const flashPoolDataV2 =
				zeroForOneV2 == true
					? ProjectsV2[flashPoolV2.project_name].flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountIn, flashSwapAddress, callbackV2]).slice(2)
					: ProjectsV2[flashPoolV2.project_name].flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountIn, 0, flashSwapAddress, callbackV2]).slice(2);

			const flashSwapDataV2 = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPoolV2.pool_address, flashPoolDataV2]);

			return [callbackV2, flashPoolDataV2, flashSwapDataV2];
		}

		await handleDataV2();

		const [callbackV2, flashPoolDataV2, flashSwapDataV2] = await handleDataV2();

		const tokenRevenueV2 = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInputV2, tokenOut_decimal);

		const vendableProfitV2 = tokenRevenueV2 * tokenOut_price;

		return [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2, tokenRevenueV2, vendableProfitV2, callbackV2, flashPoolDataV2, flashSwapDataV2];
	}

	const [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2, tokenRevenueV2, vendableProfitV2, callbackV2, flashPoolDataV2, flashSwapDataV2] = await V2_to_V2_Vendability();

	// if (project.comments) {
	// 	console.log("flashPoolV2", flashPoolV2);
	// 	console.log("flashPoolNameV2", flashPoolNameV2);
	// 	console.log("ZeroToOne", ZeroToOne);
	// 	console.log("zeroForOneV2", zeroForOneV2);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V2`);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(optimalInputV2, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V2`);
	// 	console.log(`tokenRevenue ${tokenRevenueV2} ${tokenOut_symbol}`);
	// 	console.log("entranceProfit", entranceProfit);
	// 	console.log("vendableProfitV2", vendableProfitV2);
	// }

	// V2_to_V2_Vendability
	// ---------------
	// ----------
	// -----

	// ---------------------------------------------------------------------------------------
	// ------------------------------------ Seperation ---------------------------------------
	// ---------------------------------------------------------------------------------------

	// *****
	// **********
	// ***************
	// V2_to_V3_Vendability

	async function V2_to_V3_Vendability() {
		async function VendabilityV2toV3() {
			const vendablePoolsV3 = await getVendableV3Pools(chain, tokenIn_address, tokenOut_address);

			async function getSufficientVendablePoolsV3() {
				if (vendablePoolsV3.length == 0) return [];

				let tokenBalancePromisesV3 = [];
				let sufficientVendablePoolsV3 = [];

				for (const pool of vendablePoolsV3) tokenBalancePromisesV3.push(token.balanceOf(pool.pool_address));

				const tokenBalanceResultV3 = await Promise.all(tokenBalancePromisesV3);

				for (let index = 0; index < tokenBalanceResultV3.length; index++) {
					if (tokenBalanceResultV3[index] <= amountIn * 2n) continue;
					if (tokenBalanceResultV3[index] > amountIn * 2n) {
						sufficientVendablePoolsV3.push(vendablePoolsV3[index]);
						continue;
					}
				}

				return sufficientVendablePoolsV3;
			}

			const sufficientVendablePoolsV3 = await getSufficientVendablePoolsV3();

			async function getOptimalInput() {
				if (sufficientVendablePoolsV3.length == 0) return [null, null, null, null];

				let zeroForOneV3 = null;
				let sqrtPriceLimitX96 = null;
				let promisesV3 = [];
				let flashPoolsV3 = [];

				for (const pool of sufficientVendablePoolsV3) {
					const QuoterContract = QuotersV3[pool.project_name];
					const QutoerVersion = QuoterVersionsV3[pool.project_name];

					if (pool.token0_address == tokenIn_address && pool.token1_address == tokenOut_address) {
						zeroForOneV3 = false;
						sqrtPriceLimitX96 = MAX_SQRT_RATIO - 1000n;
					}

					if (pool.token0_address == tokenOut_address && pool.token1_address == tokenIn_address) {
						zeroForOneV3 = true;
						sqrtPriceLimitX96 = MIN_SQRT_RATIO + 1000n;
					}

					if (QutoerVersion == 1) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, pool.pool_fee, amountIn, sqrtPriceLimitX96);

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 2) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
							tokenIn: tokenOut_address,
							tokenOut: tokenIn_address,
							amount: amountIn,
							fee: pool.pool_fee,
							sqrtPriceLimitX96: sqrtPriceLimitX96,
						});

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 3) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, amountIn, sqrtPriceLimitX96);

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 4) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
							tokenIn: tokenOut_address,
							tokenOut: tokenIn_address,
							amount: amountIn,
							limitSqrtPrice: sqrtPriceLimitX96,
						});

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (zeroForOneV3 == undefined || sqrtPriceLimitX96 == undefined) {
						console.log("undefined error occured zeroForOne !!!", zeroForOneV3);
						console.log("undefined error occured sqrtPriceLimitX96 !!!", sqrtPriceLimitX96);
						return;
					}
				}

				let result = [];

				try {
					result = await Promise.all(promisesV3);
				} catch (error) {
					// console.log("ERROR V2_to_V3_Vendability/getOptimalInput Promise.all Quoters", error);

					PoolProcessController[chain][projectName][poolName].processing = false;
					return;
				}

				if (result.length == 0) return [null, null, null, null];

				let optimalInputV3 = Infinity;
				let flashPoolV3 = null;

				for (let index = 0; index < result.length; index++) {
					if (result[index].amountIn !== undefined && result[index].amountIn < optimalInputV3) {
						optimalInputV3 = result[index].amountIn;
						flashPoolV3 = flashPoolsV3[index];
						continue;
					}

					if (result[index].amountIn == undefined && result[index][0].returnedAmount < optimalInputV3) {
						optimalInputV3 = result[index][0].returnedAmount;
						flashPoolV3 = flashPoolsV3[index];
						continue;
					}
				}

				return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96];
			}

			const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96] = await getOptimalInput();

			return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96];
		}

		const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96] = await VendabilityV2toV3();

		if (optimalInputV3 == Infinity || flashPoolV3 == null || zeroForOneV3 == null || sqrtPriceLimitX96 == null) return [null, null, null, null, null, null];

		async function handleDataV3() {
			let callbackV3;

			if (callback_type == 0) {
				callbackV3 = encoder.encode(["address", "address", "address", "bytes", "uint256"], [pool.pool_address, flashPoolV3.token0_address, flashPoolV3.token1_address, swapData, 0]);
			} else if (callback_type == 1) {
				callbackV3 = encoder.encode(["address", "address", "address", "bytes"], [pool.pool_address, flashPoolV3.token0_address, flashPoolV3.token1_address, swapData]);
			}

			const flashPoolDataV3 = ProjectsV3[flashPoolV3.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, zeroForOneV3, -amountIn, sqrtPriceLimitX96, callbackV3]).slice(2);

			const flashSwapDataV3 = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPoolV3.pool_address, flashPoolDataV3]);

			return [callbackV3, flashPoolDataV3, flashSwapDataV3];
		}

		const [callbackV3, flashPoolDataV3, flashSwapDataV3] = await handleDataV3();

		const tokenRevenueV3 = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInputV3, tokenOut_decimal);

		const vendableProfitV3 = tokenRevenueV3 * tokenOut_price;

		return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96, tokenRevenueV3, vendableProfitV3, callbackV3, flashPoolDataV3, flashSwapDataV3];
	}

	const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96, tokenRevenueV3, vendableProfitV3, callbackV3, flashPoolDataV3, flashSwapDataV3] = await V2_to_V3_Vendability();

	// if (project.comments) {
	// 	console.log("flashPoolV3", flashPoolV3);
	// 	console.log("ZeroToOne", ZeroToOne);
	// 	console.log("zeroForOneV3", zeroForOneV3);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V3`);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(optimalInputV3, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V3`);
	// 	console.log(`tokenRevenueV3 ${tokenRevenueV3} ${tokenOut_symbol}`);
	// 	console.log("entranceProfit", entranceProfit);
	// 	console.log("vendableProfitV3", vendableProfitV3);
	// 	// console.log("callbackV3", callbackV3);
	// 	// console.log("flashPoolDataV3", flashPoolDataV3);
	// 	// console.log("flashSwapDataV3", flashSwapDataV3);
	// }

	// V2_to_V3_Vendability
	// ***************
	// **********
	// *****

	async function selectMostProfitableWay() {
		if (optimalInputV2 == Infinity || flashPoolV2 == null || zeroForOneV2 == null || flashPoolNameV2 == null || tokenRevenueV2 == null || vendableProfitV2 == null || callbackV2 == undefined || flashPoolDataV2 == undefined || flashSwapDataV2 == undefined) return [false];

		if (optimalInputV3 == Infinity || flashPoolV3 == null || zeroForOneV3 == null || sqrtPriceLimitX96 == null || tokenRevenueV3 == null || vendableProfitV3 == null || callbackV3 == undefined || flashPoolDataV3 == undefined || flashSwapDataV3 == undefined)
			return [false];

		let XoptimalInput;
		let XflashPool;
		let XzeroForOne;
		let XflashPoolName;
		let XsqrtPriceLimitX96;
		let XtokenRevenue;
		let XvendableProfit;
		let Xcallback;
		let XflashPoolData;
		let XflashSwapData;

		if (vendableProfitV3 > vendableProfitV2) {
			XoptimalInput = optimalInputV3;
			XflashPool = flashPoolV3;
			XzeroForOne = zeroForOneV3;
			XsqrtPriceLimitX96 = sqrtPriceLimitX96;
			XtokenRevenue = tokenRevenueV3;
			XvendableProfit = vendableProfitV3;
			Xcallback = callbackV3;
			XflashPoolData = flashPoolDataV3;
			XflashSwapData = flashSwapDataV3;
		} else {
			XoptimalInput = optimalInputV2;
			XflashPool = flashPoolV2;
			XzeroForOne = zeroForOneV2;
			XflashPoolName = flashPoolNameV2;
			XtokenRevenue = tokenRevenueV2;
			XvendableProfit = vendableProfitV2;
			Xcallback = callbackV2;
			XflashPoolData = flashPoolDataV2;
			XflashSwapData = flashSwapDataV2;
		}

		if (XvendableProfit < minimumVendableProfit || Number(ethers.formatUnits(amountOutMin, tokenOut_decimal)) < Number(ethers.formatUnits(XoptimalInput, tokenOut_decimal))) return [false];

		return [true, XoptimalInput, XflashPool, XzeroForOne, XflashPoolName, XsqrtPriceLimitX96, XtokenRevenue, XvendableProfit, Xcallback, XflashPoolData, XflashSwapData];
	}

	const [isOkay, XoptimalInput, XflashPool, XzeroForOne, XflashPoolName, XsqrtPriceLimitX96, XtokenRevenue, XvendableProfit, Xcallback, XflashPoolData, XflashSwapData] = await selectMostProfitableWay();

	if (!isOkay) {
		PoolProcessController[chain][projectName][poolName].processing = false;

		// REQUEST NEW POOL FEE RATIO EN EQUALIZE IT TO RESERVES JSON DYSONFINANCEV2 ITS CHAIN

		return;
	}

	// if (project.comments) {
	// 	console.log("XflashPool", XflashPool);
	// 	console.log("ZeroToOne", ZeroToOne);
	// 	console.log("XzeroForOne", XzeroForOne);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract`);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(XoptimalInput, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract`);
	// 	console.log(`XtokenRevenue ${XtokenRevenue} ${tokenOut_symbol}`);
	// 	console.log("entranceProfit", entranceProfit);
	// 	console.log("XvendableProfit", XvendableProfit);
	// 	// console.log("Xcallback", Xcallback);
	// 	// console.log("XflashPoolData", XflashPoolData);
	// 	// console.log("XflashSwapData", XflashSwapData);
	// }

	await saveProfit(chain, entranceProfit, XvendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	async function handleTx() {
		if (tx_type == 0) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: XflashSwapData,
				chainId: chainID,
				value: 0,
				type: 0,
				gasLimit: flashSwap_gasLimit,
				gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 1) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: XflashSwapData,
				chainId: chainID,
				value: 0,
				type: 1,
				gasLimit: flashSwap_gasLimit,
				gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 2) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: XflashSwapData,
				chainId: chainID,
				value: 0,
				type: 2,
				gasLimit: flashSwap_gasLimit,
				maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
				maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
				// gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 3) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: XflashSwapData,
				chainId: chainID,
				value: 0,
				type: 3,
				gasLimit: flashSwap_gasLimit,
				maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
				maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
				gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				nonce: await Owner_Account.getNonce(),
			};
		}

		return tx;
	}

	const tx = await handleTx();

	async function handleTransactionFeeL2() {
		return Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * gasPrice_multiplier) / 10 ** 18) * (await GlobalLibrary.getMarketPriceBatch([native_token_symbol]));
	}

	const transactionFeeL2 = await handleTransactionFeeL2();

	// getL1TransactionFee is Disabled

	const flashSwapProfit = XvendableProfit - transactionFeeL2;

	if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
		PoolProcessController[chain][projectName][poolName].processing = false;

		// REQUEST NEW POOL FEE RATIO EN EQUALIZE IT TO RESERVES JSON DYSONFINANCEV2 ITS CHAIN

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

			console.log("PASSSSSEEDDDD");

			isErrorOccured = false;
		} catch (error) {
			await saveError(
				chain,
				error,
				pool,
				XflashPool,
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
				XoptimalInput,
				transactionFeeL2,
				entranceProfit,
				XvendableProfit,
				flashSwapProfit
			);

			isErrorOccured = true;

			console.log("isErrorOccured", isErrorOccured);

			PoolProcessController[chain][projectName][poolName].processing = false;

			// const reservesData = JSON.parse(await fs.promises.readFile(`Scripts/Reserves/${chain}.json`));

			// const [reserves, feeRatio] = await Promise.all([poolContract.getReserves(), poolContract.getFeeRatio()]);

			// reservesData[projectName][poolName].reserve0 = reserves[0].toString();
			// reservesData[projectName][poolName].reserve1 = reserves[1].toString();
			// reservesData[projectName][poolName].feeRatio = [feeRatio[0].toString(), feeRatio[1].toString()];

			// fs.writeFileSync(`Scripts/Reserves/${chain}.json`, JSON.stringify(reservesData, null, 2));

			return;
		}

		console.log("isErrorOccured", isErrorOccured);

		// return;

		if (isErrorOccured == false) {
			const transaction_body = await Owner_Account.sendTransaction(tx);

			const receipt = await FLASHSWAP_PROVIDER.waitForTransaction(transaction_body.hash, confirmation, blockTime);

			if (receipt.status == 1) {
				await saveProfitToCSV(chain, startTime, projectName, pool_name, transactionFeeL2, entranceProfit, XvendableProfit, flashSwapProfit, XtokenRevenue, tokenOut_symbol);
			}
		}

		[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

		pool.processing = false;
	}

	await execute();
}

async function Creator_PoolProcessController() {
	async function BuilderPools() {
		const PoolProcessController = {};

		for (const chain of chains) {
			PoolProcessController[chain] = {};

			const { ProjectsV2 } = require(`../Scripts/Common/Common/${chain}`);

			for (const projectName in ProjectsV2) {
				if (projectName !== "DysonFinanceV2") continue;

				PoolProcessController[chain][projectName] = {};

				const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

				for (const pool of poolsData) {
					const poolName = await poolNameSelectorV2(projectName, pool);

					PoolProcessController[chain][projectName][poolName] = {};

					PoolProcessController[chain][projectName][poolName].processing = false;
				}
			}
		}

		return PoolProcessController;
	}

	const PoolProcessController = await BuilderPools();

	try {
		const data = await fs.promises.readFile(__filename, "utf8");

		let lines = data.split("\n");

		const searchString = "// True --> Processing || False --> Not Processing --- START DO NOT DELETE";

		const insertString = `const PoolProcessController = ${JSON.stringify(PoolProcessController, null, 2)}`;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(searchString)) {
				lines.splice(i + 1, 0, insertString); // Insert after the found line
				break;
			}
		}

		const modifiedData = lines.join("\n");

		await fs.promises.writeFile(__filename, modifiedData, "utf8");
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}

// Creator_PoolProcessController();

module.exports = {
	XDysonFinanceV2,
};
