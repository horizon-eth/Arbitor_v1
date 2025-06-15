const { ethers, fs, path } = require("../../../Common/Global/Global");

// NOT ALIGNED
// NOT ALIGNED
// NOT ALIGNED
// NOT ALIGNED
// NOT ALIGNED
// NOT ALIGNED
// NOT ALIGNED

const projectName = path.basename(__filename, "Single.js");
const pools = require(`../Dex/PoolDatasV2/${projectName}.json`);
const filePath = `dapps/${projectName}Single.js`;

function ExecutorVariables() {
	const executorVariables = `
	let FeeData;

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
	let feeRatioSelector;

	let amountIn = 0n;
	let amountOutMin = 0n;
	let entranceProfit = 0;
	`;

	return executorVariables;
}

function Initialize() {
	const initialize = `async function initialize() {
		const token0_Market_Price = await getMarketPrice(token0_symbol);
		const token1_Market_Price = await getMarketPrice(token1_symbol);

		if (token0_Market_Price == null || token0_Market_Price == undefined || token1_Market_Price == null || token1_Market_Price == undefined) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();

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

		FeeData = await getFeeDataL2();

		reserveIn_dollar = ethers.formatUnits(reserveIn, tokenIn_decimal) * tokenIn_price;
		reserveOut_dollar = ethers.formatUnits(reserveOut, tokenOut_decimal) * tokenOut_price;

		pool_constant_number = reserveIn_dollar * reserveOut_dollar;

		token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);

		feeRatioSelector = ZeroToOne == true ? 0 : 1;
	}

	await initialize();`;

	return initialize;
}

function Formula() {
	const formula = `async function formula() {
		const mutualReserveTarget_dollar = (reserveIn_dollar + reserveOut_dollar) / 2;

		const amountIn_dollar = mutualReserveTarget_dollar - reserveIn_dollar;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		const amountInInput = amountIn - (BigInt(pool.feeRatio[feeRatioSelector]) * amountIn) / 2n ** 64n;

		amountOutMin = (amountInInput * reserveOut) / (reserveIn + amountInInput);

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		entranceProfit = amountOutMin_dollar - amountIn_dollar;

		if (project.comments) {
			console.log(
				\` -- amountIn = \${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} === \${amountIn_dollar}$
			 -- amountOutMin = \${ethers.formatUnits(amountOutMin, tokenOut_decimal)} \${tokenOut_symbol} === \${amountOutMin_dollar}$
			 -- entranceProfit = \${entranceProfit}$\`
			);
		}
	}

	try {
		await formula();
	} catch (error) {
		pool.feeRatio = await pool.https_contract.getFeeRatio();

		pool.processing = false;

		return;
	}`;

	return formula;
}

function GetSufficientVendablePools() {
	const getSufficientVendablePools = `async function getSufficientVendablePools() {
		if (vendablePools.length == 0) return [];

		let tokenBalancePromises = [];
		let sufficientVendablePools = [];
	
		for (const pool of vendablePools) tokenBalancePromises.push(token.balanceOf(pool.pool_address));
	
		const tokenBalanceResult = await Promise.all(tokenBalancePromises);
	
		for (let index = 0; index < tokenBalanceResult.length; index++) {
			if (tokenBalanceResult[index] <= amountIn) continue;
			if (tokenBalanceResult[index] > amountIn) {
				sufficientVendablePools.push(vendablePools[index]);
				continue;
			}
		}
	
		return sufficientVendablePools;
	}
	
	const sufficientVendablePools = await getSufficientVendablePools();`;

	return getSufficientVendablePools;
}

function GetOptimalInput() {
	const getOptimalInput = `async function getOptimalInput() {
		if (sufficientVendablePools.length == 0) return [null, null, null];

		let zeroForOne;
		let sqrtPriceLimitX96;
		let promises = [];

		const QuoterContract = QuotersV3[flashPool.project_name];
		const QutoerVersion = QuoterVersionsV3[flashPool.project_name];

		if (flashPool.token0_address == tokenIn_address && flashPool.token1_address == tokenOut_address) {
			zeroForOne = false;
			sqrtPriceLimitX96 = MAX_SQRT_RATIO - 1000n;
		}

		if (flashPool.token0_address == tokenOut_address && flashPool.token1_address == tokenIn_address) {
			zeroForOne = true;
			sqrtPriceLimitX96 = MIN_SQRT_RATIO + 1000n;
		}

		if (QutoerVersion == 1) {
			const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, flashPool.pool_fee, amountIn, sqrtPriceLimitX96);

			promises.push(promise);
		}

		if (QutoerVersion == 2) {
			const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
				tokenIn: tokenOut_address,
				tokenOut: tokenIn_address,
				amount: amountIn,
				fee: flashPool.pool_fee,
				sqrtPriceLimitX96: sqrtPriceLimitX96,
			});

			promises.push(promise);
		}

		if (QutoerVersion == 3) {
			const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, amountIn, sqrtPriceLimitX96);

			promises.push(promise);
		}

		if (QutoerVersion == 4) {
			// console.log("TestV4");
		}

		const result = await Promise.all(promises);

		if (result.length == 0) return [null, null, null, null];

		if (zeroForOne == undefined || sqrtPriceLimitX96 == undefined || result.length == 0) return;

		let optimalInput = Infinity;

		if (result[0].amountIn !== undefined && result[0].amountIn < optimalInput) {
			optimalInput = result[0].amountIn;
		}

		if (result[0].amountIn == undefined && result[0][0].returnedAmount < optimalInput) {
			optimalInput = result[0][0].returnedAmount;
		}

		return [optimalInput, zeroForOne, sqrtPriceLimitX96];
	}

	const [optimalInput, zeroForOne, sqrtPriceLimitX96] = await getOptimalInput();`;

	return getOptimalInput;
}

function Data() {
	const data = `
	const swapData =
		ZeroToOne == true
			? project.swap0in + encoder.encode(["address", "uint256", "uint256"], [flashSwapAddress, amountIn, amountOutMin]).slice(2)
			: project.swap1in + encoder.encode(["address", "uint256", "uint256"], [flashSwapAddress, amountIn, amountOutMin]).slice(2);

		const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]);

	const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

	const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);`;

	return data;
}

function Tx() {
	const tx = `const tx = {
		from: WalletAddress,
		to: flashSwapAddress,
		data: flashSwap_data,
		chainId: chainID,
		value: 0,
		type: 0,
		// nonce: await Owner_Account.getNonce(),
		gasLimit: flashSwap_gasLimit,
		// maxFeePerGas: FeeData.maxFeePerGas,
		// maxPriorityFeePerGas: FeeData.maxPriorityFeePerGas,
		gasPrice: (FeeData.gasPrice * 2n).toString(),
		// gasPrice: FeeData.gasPrice,
	};`;

	return tx;
}

function GetL2TransactionFee() {
	const getL2TransactionFee = `async function getL2TransactionFee() {
		let transactionFeeL2;
		let gas;
		
		try {
			transactionFeeL2 = await POLYGON_ZKEVM_RPC_API_PROVIDER.send("zkevm_estimateFee", [tx]);

			// gas = await GAS_PROVIDER.estimateGas(tx);

			// const contractPopulateGasEstimation = await flashSwapContract.connect(Owner_Account).flashSwap.estimateGas(flashPool, flashPoolData);

			// console.log("Contract Populate Gas Estimation =====>", contractPopulateGasEstimation);
		} catch (error) {
			await saveError(
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

			[[pool.reserve0, pool.reserve1], pool.feeRatio] = await Promise.all([pool.https_contract.getReserves(), pool.https_contract.getFeeRatio()]);

			pool.processing = false;

			return;
		}

		return (Number(transactionFeeL2) / 10 ** 18) * (await getMarketPrice("ETH"));

		// if (Market_Prices["ETH"] == null || isNaN(Market_Prices["ETH"] || gas === "11")) return;

		// const L2Fee = Number((gas.toString() * FeeData.gasPrice) / 10 ** 18) * Market_Prices["ETH"];

		// if (L2Fee !== null || !isNaN(L2Fee)) return Number(L2Fee.toFixed(6));
	}

	// const transactionFeeL2 = await getL2TransactionFee();`;

	return getL2TransactionFee;
}

function Execute() {
	const execute = `async function execute() {
		let isErrorOccured;
	
		try {
			await FLASHSWAP_PROVIDER.call(tx);
	
			isErrorOccured = false;
		} catch (error) {
			await saveError(
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

			[[pool.reserve0, pool.reserve1], pool.feeRatio] = await Promise.all([pool.https_contract.getReserves(), pool.https_contract.getFeeRatio()]);
	
			pool.processing = false;
	
			return;
		}
	
		if (isErrorOccured == false) {
			const transaction_body = await Owner_Account.sendTransaction(tx);
	
			const receipt = await FLASHSWAP_PROVIDER.waitForTransaction(transaction_body.hash, confirmation, blockTime);
	
			if (receipt.status == 1) {
				await saveProfitToCSV(startTime, projectName, pool_name, transactionFeeL2, entranceProfit, vendableProfit, flashSwapProfit, tokenRevenue, tokenOut_symbol);
			}
		}
	
		[[pool.reserve0, pool.reserve1], pool.feeRatio] = await Promise.all([pool.https_contract.getReserves(), pool.https_contract.getFeeRatio()]);
	
		pool.processing = false;
	}
	
	await execute();`;

	return execute;
}

function Modules() {
	const modules = `
	const {
		ethers,
		ethersV5,
		fs,
		path,
		ERC20,
		confirmation,
		blockTime,
		encoder,
		Interval,
		ProjectsV2,
		MIN_SQRT_RATIO,
		MAX_SQRT_RATIO,
		flashSwap_gasLimit,
		minimumEntranceProfit,
		minimumVendableProfit,
		minimumFlashSwapProfit,
		gasLimit,
	
		chainID,
		POLYGON_ZKEVM_RPC_API_PROVIDER,
		CONTRACT_PROVIDER,
		POOL_PROVIDER_V2,
		FLASHSWAP_PROVIDER,
	
		flashSwapAddress,
		flashSwapContract,
		flashSwapFunctionSelector,
		Owner_Account,
		WalletAddress,
	} = require("../scripts/Common/Common");

	const { ProjectsV3, QuotersV3, QuoterVersionsV3 } = require("../scripts/Common/Common");

	const { saveError, getVendableV3Pools, getFlashPool, getMarketPrice, getAmountOut, saveProfit, saveProfitToCSV } = require("../scripts/Library/Library");

	const { getFeeDataL2 } = require("../scripts/FeeData/FeeData");

	const { getFeeDataL1 } = require("../scripts/FeeData/L1FeeData");

	const projectName = path.basename(__filename, "Single.js");
	const project = ProjectsV2[projectName];
	const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, \`../scripts/Dex/PoolDatasV2/\${projectName}.json\`), "utf8"));
	const poolABI = require(path.join(__dirname, \`../scripts/Dex/PoolABIsV2/\${projectName}PoolABI.json\`));

	let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.WSS_POOL_PROVIDER_URL);

	let heartbeatInterval;

	`;

	return modules;
}

function PoolObjects() {
	let poolOjbects = "";

	pools.forEach((pool, index) => {
		const { token0_symbol, token1_symbol, pool_address } = pool;
		const poolObjectName = `${token0_symbol}_${token1_symbol}_POOL`;

		poolOjbects += `
		let ${poolObjectName} = {
			contract: null,
				address: "${pool_address}",
				https_contract: new ethers.Contract("${pool_address}", poolABI, POOL_PROVIDER_V2),
				wss_contract: null,
				reserve0: undefined,
				reserve1: undefined,
				feeRatio: undefined,
				processing: false,
			}
		\n`;
	});

	return poolOjbects;
}

function FlashPoolSelectors() {
	let flashPoolSelectors = {};

	pools.forEach((pool, index) => {
		const { pool_address, token0_symbol, token1_symbol } = pool;
		flashPoolSelectors[pool_address] = `"0xFlashPool"`;
	});

	let flashPoolSelectorCode = "\n\nconst flashPoolSelector = {\n";
	Object.entries(flashPoolSelectors).forEach(([address, functionName], index) => {
		flashPoolSelectorCode += `\t"${address}": ${functionName}`;
		flashPoolSelectorCode += index !== Object.keys(flashPoolSelectors).length - 1 ? ",\n" : "\n";
	});
	flashPoolSelectorCode += "};\n\n";

	return flashPoolSelectorCode;
}

function Executor() {
	const executorVariables = ExecutorVariables();
	const initialize = Initialize();
	const formula = Formula();
	const getSufficientVendablePools = GetSufficientVendablePools();
	const getOptimalInput = GetOptimalInput();
	const data = Data();
	const tx = Tx();
	const execute = Execute();

	const executor = `async function Executor(pool) {
		if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.feeRatio == undefined || pool.reserve0 == 1000n || pool.reserve1 < 1000n) return;

		pool.processing = true;
	
		const startTime = performance.now();
	
		const { pool_name, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

		${executorVariables}

		${initialize}

		${formula}

		if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit < minimumEntranceProfit) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();
	
			pool.processing = false;
	
			return;
		}
	
		await saveProfit(entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

		const [flashPool] = await getFlashPool(flashPoolSelector[poolAddress]);
	
		const tokenBalanceResult = await token.balanceOf(flashPool.pool_address);
	
		if (tokenBalanceResult <= amountIn) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();

			pool.processing = false;
	
			return;
		}

		${getOptimalInput}

		if (optimalInput == null || zeroForOne == null || sqrtPriceLimitX96 == null) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();
	
			pool.processing = false;
	
			return;
		}

		const tokenRevenue = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInput, tokenOut_decimal);
	
		const vendableProfit = tokenRevenue * tokenOut_price;
	
		if (vendableProfit < minimumVendableProfit) return;
	
		if (vendableProfit < minimumVendableProfit || Number(ethers.formatUnits(amountOutMin, tokenOut_decimal)) < Number(ethers.formatUnits(optimalInput, tokenOut_decimal))) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();
		
			pool.processing = false;
		
			return;
		}
	
		if (project.comments) {
			console.log("flashPool", flashPool);
			console.log(\`\${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} Borrow from flashPoolContract V3\`);
			console.log(\`\${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} Send Input to arbitragePoolContract V2\`);
			console.log(\`\${ethers.formatUnits(amountOutMin, tokenOut_decimal)} \${tokenOut_symbol} Take Output from arbitragePoolContract V2\`);
			console.log(\`\${ethers.formatUnits(optimalInput, tokenOut_decimal)} \${tokenOut_symbol} Payback to flashPoolContract V3\`);
			console.log(\`tokenRevenue \${tokenRevenue} \${tokenOut_symbol}\`);
			console.log("entranceProfit", entranceProfit);
			console.log("vendableProfit", vendableProfit);
		}

		await saveProfit(entranceProfit, vendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

		${data}

		${tx}

		const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData.gasPrice) * 2) / 10 ** 18) * (await getMarketPrice("ETH"));

		const flashSwapProfit = vendableProfit - transactionFeeL2;

		if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
			pool.feeRatio = await pool.https_contract.getFeeRatio();
		
			pool.processing = false;
		
			return;
		}
		
		if (project.comments) {
			console.log("transactionFeeL2", transactionFeeL2, "$");
			console.log("flashSwapProfit", flashSwapProfit, "$");
		}

		${execute}
	}
	\n`;

	return executor;
}

function Initializer() {
	const initializer = `async function Initializer() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	
			const pool_object = eval(object_name);
	
			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);
	
			const [reserves, feeRatio] = await Promise.all([pool_object.https_contract.getReserves(), pool_object.https_contract.getFeeRatio()]);
	
			pool_object.reserve0 = BigInt(reserves[0]);
			pool_object.reserve1 = BigInt(reserves[1]);
			pool_object.feeRatio = [BigInt(feeRatio[0].toString()), BigInt(feeRatio[1].toString())];
	
			// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
			// console.log("reserve1 of", pool_object.address, pool_object.reserve1);
			// console.log("feeRatio of", pool_object.address, pool_object.feeRatio);
	
			global[object_name] = pool_object;
		}
	}
	\n`;

	return initializer;
}

function Listen() {
	const listen = `async function Listen() {
		async function re_initialize() {
			for (const pool of poolsData) {
				const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	
				const pool_object = eval(object_name);
	
				WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.WSS_POOL_PROVIDER_URL);
	
				pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);
	
				global[object_name] = pool_object;
			}
		}
	
		async function addListeners() {
			for (const pool of poolsData) {
				const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	
				const pool_object = eval(object_name);
	
				// console.log("Old Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
	
				await pool_object.wss_contract.removeAllListeners("Swap");
	
				// console.log("New Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
	
				pool_object.wss_contract.on("Swap", async (sender, isSwap0, amountIn, amountOut, to) => {
					try {
						const [reserves, feeRatio] = await Promise.all([pool_object.https_contract.getReserves(), pool_object.https_contract.getFeeRatio()]);
	
						pool_object.reserve0 = BigInt(reserves[0]);
						pool_object.reserve1 = BigInt(reserves[1]);
						pool_object.feeRatio = [BigInt(feeRatio[0]), BigInt(feeRatio[1])];
	
						// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
						// console.log("reserve1 of", pool_object.address, pool_object.reserve1);
						// console.log("feeRatio of", pool_object.address, pool_object.feeRatio);
	
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
				reconnect();
			});
	
			WSS_POOL_PROVIDER._websocket.on("error", async (error) => {
				// console.error("WebSocket error:", error);
				clearInterval(heartbeatInterval);
				reconnect();
			});
	
			WSS_POOL_PROVIDER._websocket.on("open", () => {
				// console.log("WebSocket connection opened.");
				setupHeartbeat();
			});
		}
	
		await monitorPool();
	
		function reconnect() {
			setTimeout(() => {
				// console.log("Reconnecting to WebSocket...");
				re_initialize(); // Re Initialize Websocket Provider and Pool Contract of each Pool
				monitorPool();
			}, 3000);
		}
	}
	\n`;

	return listen;
}

function Callee() {
	const callee = `async function Callee() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	
			const pool_object = eval(object_name);
	
			Executor(pool_object);

			// await Executor(pool_object);
		}
	}
	\n`;

	return callee;
}

function FunctionCalls() {
	const functionCalls = `Initializer().then(() => {
		Listen().then(() => {
			setInterval(Callee, Interval);
		});
	});
	\n`;

	return functionCalls;
}

async function Save() {
	async function checkChainFileExistance() {
		try {
			await fs.promises.access(path.join("DApps", chain));
		} catch (error) {
			if (error.code === "ENOENT") {
				await fs.promises.mkdir(path.join("DApps", chain), { recursive: true });
				await fs.promises.mkdir(path.join("DApps", chain, "V2"), { recursive: true });
				await fs.promises.mkdir(path.join("DApps", chain, "V3"), { recursive: true });
			}
		}
	}

	await checkChainFileExistance();

	if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "", "utf8");

	const modules = Modules();
	const flashPoolSelectors = FlashPoolSelectors();
	const poolObjects = PoolObjects();
	const executor = Executor();
	const initializer = Initializer();
	const listen = Listen();
	const calleee = Callee();
	const functionCalls = FunctionCalls();

	const modifiedFile = modules + flashPoolSelectors + poolObjects + executor + initializer + listen + calleee + functionCalls;

	fs.writeFileSync(filePath, modifiedFile, "utf8");
}

Save();
