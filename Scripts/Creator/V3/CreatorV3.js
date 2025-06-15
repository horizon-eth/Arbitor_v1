const { ethers, fs, path, chains, selectedChain, NonVendableV3PoolsToV3, coins } = require("../../Common/Global/Global");

function ExecutorVariables() {
	const executorVariables = `
		let token0_Market_Price = null;
		let token1_Market_Price = null;
		let nativeToken_Market_Price = null;
		let FeeData = null;

		let tokenIn_address;
		let tokenIn_symbol;
		let tokenIn_decimal;
		let tokenIn_price;

		let tokenOut_address;
		let tokenOut_symbol;
		let tokenOut_decimal;
		let tokenOut_price;

		let ZeroToOne;
		let token;

		let amountIn = 0n;
		let amountOutMin = 0n;
		let entranceProfit = 0;
	`;

	return executorVariables;
}

function Initialize() {
	const initialize = `
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
				pool.feeRatio = await pool.https_contract.getFeeRatio();

				pool.processing = false;

				return;
			}

			if (token0_Market_Price > token0_Pool_Price * token1_Market_Price) {
				tokenIn_address = token1_address;
				tokenIn_symbol = token1_symbol;
				tokenIn_decimal = token1_decimal;
				tokenIn_price = token1_Market_Price;
	
				tokenOut_address = token0_address;
				tokenOut_symbol = token0_symbol;
				tokenOut_decimal = token0_decimal;
				tokenOut_price = token0_Market_Price;
	
				ZeroToOne = false;
			}
	
			if (token0_Market_Price < token0_Pool_Price * token1_Market_Price) {
				tokenIn_address = token0_address;
				tokenIn_symbol = token0_symbol;
				tokenIn_decimal = token0_decimal;
				tokenIn_price = token0_Market_Price;
	
				tokenOut_address = token1_address;
				tokenOut_symbol = token1_symbol;
				tokenOut_decimal = token1_decimal;
				tokenOut_price = token1_Market_Price;
	
				ZeroToOne = true;
			}
	
			token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);
		}

		await initialize();
	`;

	return initialize;
}

function Formula() {
	const formula = `
		async function formula() {
			let inputX = 0n;
			let outputX = 0n;
			let maximumProfit = -1000;

			//
			//

			if (ZeroToOne) {
				for (let inputAsDollar = 1; inputAsDollar < 100000; inputAsDollar += incrementRateV3) {
					const amountSpecified = ethers.parseUnits((inputAsDollar / token0_Market_Price).toFixed(token0_decimal), token0_decimal);
					// const amountSpecified = ethers.parseUnits("1", 18);

					// const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, MAX_SQRT_RATIO - 100n, pool);
					// const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, sqrtRatioTargetX96, pool);
					const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, MIN_SQRT_RATIO + 100n, pool);

					const amount0AsDollar = Number(ethers.formatUnits(amount0, token0_decimal)) * token0_Market_Price;
					const amount1AsDollar = -Number(ethers.formatUnits(amount1, token1_decimal)) * token1_Market_Price;

					const profit = amount1AsDollar - amount0AsDollar;

					console.log("profitttt", ZeroToOne, profit, maximumProfit, profit > maximumProfit, profit <= maximumProfit);
					// console.log("amount0", amount0);
					// console.log("amount1", amount1);
					// console.log("amount1 MUST BE OUTPUT", ethers.formatUnits(amount1, token1_decimal), token1_symbol);
					// console.log("amount1AsDollar MUST BE OUTPUT", amount1AsDollar, "$");
					// console.log("amount0 MUST BE INPUT", ethers.formatUnits(amount0, token0_decimal), token0_symbol);
					// console.log("amount0AsDollar MUST BE INPUT", amount0AsDollar, "$");
					// console.log("profit", profit);

					if (profit > maximumProfit) {
						inputX = amount0;
						outputX = -amount1;
						maximumProfit = profit;

						continue;
					}

					if (profit <= maximumProfit) {
						amountIn = inputX;
						amountOutMin = outputX;
						entranceProfit = maximumProfit;

						const amountIn_dollar = inputAsDollar - incrementRateV3;
						const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

						if (project.comments) {
							console.log(
								\`ZeroToOne === True
						-- amountIn = \${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} === \${amountIn_dollar}$
						-- amountOutMin = \${ethers.formatUnits(amountOutMin, tokenOut_decimal)} \${tokenOut_symbol} === \${amountOutMin_dollar}$
						-- entranceProfit = \${entranceProfit}$\`
							);
						}

						break;
					}
				}
			}

			//
			//

			if (!ZeroToOne) {
				for (let inputAsDollar = 1; inputAsDollar < 100000; inputAsDollar += incrementRateV3) {
					const amountSpecified = ethers.parseUnits((inputAsDollar / token1_Market_Price).toFixed(token1_decimal), token1_decimal);
					// const amountSpecified = ethers.parseUnits("1", 18);

					const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, MAX_SQRT_RATIO - 100n, pool);
					// const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, sqrtRatioTargetX96, pool);
					// const [amount0, amount1] = await LibraryV3.swap(ZeroToOne, amountSpecified, MIN_SQRT_RATIO + 100n, pool);

					const amount0AsDollar = -Number(ethers.formatUnits(amount0, token0_decimal)) * token0_Market_Price;
					const amount1AsDollar = Number(ethers.formatUnits(amount1, token1_decimal)) * token1_Market_Price;

					const profit = amount0AsDollar - amount1AsDollar;

					console.log("profitttt", ZeroToOne, profit, maximumProfit, profit > maximumProfit, profit <= maximumProfit);
					// console.log("amount0", amount0);
					// console.log("amount1", amount1);
					// console.log("amount0 MUST BE OUTPUT", -ethers.formatUnits(amount0, token0_decimal), token0_symbol);
					// console.log("amount0AsDollar MUST BE OUTPUT", amount0AsDollar, "$");
					// console.log("amount1 MUST BE INPUT", ethers.formatUnits(amount1, token1_decimal), token1_symbol);
					// console.log("amount1AsDollar MUST BE INPUT", amount1AsDollar, "$");
					// console.log("profit", profit);

					if (profit > maximumProfit) {
						inputX = amount1;
						outputX = -amount0;
						maximumProfit = profit;

						continue;
					}

					if (profit <= maximumProfit) {
						amountIn = inputX;
						amountOutMin = outputX;
						entranceProfit = maximumProfit;

						const amountIn_dollar = inputAsDollar - incrementRateV3;
						const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

						if (project.comments) {
							console.log(
								\`ZeroToOne === False
						-- amountIn = \${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} === \${amountIn_dollar}$
						-- amountOutMin = \${ethers.formatUnits(amountOutMin, tokenOut_decimal)} \${tokenOut_symbol} === \${amountOutMin_dollar}$
						-- entranceProfit = \${entranceProfit}$\`
							);
						}

						break;
					}
				}
			}

			//
			//

			const QuoterExactOutput = await QuotersV3["PancakeswapV3"].quoteExactInputSingle.staticCallResult({
				tokenIn: tokenIn_address,
				tokenOut: tokenOut_address,
				amountIn: amountIn,
				fee: BigInt(pool_fee),
				// sqrtPriceLimitX96: MAX_SQRT_RATIO - 100n,
				// sqrtPriceLimitX96: BigInt(targetSqrtPriceX96),
				// sqrtPriceLimitX96: MIN_SQRT_RATIO + 100n,
				sqrtPriceLimitX96: ZeroToOne ? MIN_SQRT_RATIO + 100n : MAX_SQRT_RATIO - 100n,
			});

			console.log("QuoterExactOutput.amountOut", QuoterExactOutput.amountOut, ethers.formatUnits(QuoterExactOutput.amountOut, tokenOut_decimal), tokenOut_symbol);
			console.log("QuoterExactOutput.sqrtPriceX96After", QuoterExactOutput.sqrtPriceX96After);

			// const QuoterExactInput = await QuotersV3["PancakeswapV3"].quoteExactOutputSingle.staticCallResult({
			// 	tokenIn: tokenIn_address,
			// 	tokenOut: tokenOut_address,
			// 	amount: amountIn,
			// 	fee: BigInt(pool_fee),
			// 	// sqrtPriceLimitX96: MAX_SQRT_RATIO - 100n,
			// 	// sqrtPriceLimitX96: BigInt(targetSqrtPriceX96),
			// 	// sqrtPriceLimitX96: MIN_SQRT_RATIO + 100n,
			// 	sqrtPriceLimitX96: ZeroToOne ? MIN_SQRT_RATIO + 100n : MAX_SQRT_RATIO - 100n,
			// });

			// console.log("QuoterExactInput.amountOut", QuoterExactInput.amountIn, ethers.formatUnits(QuoterExactInput.amountIn, tokenOut_decimal), tokenOut_symbol);
			// console.log("QuoterExactInput.sqrtPriceX96After", QuoterExactInput.sqrtPriceX96After);
		}
		
		try {
			await formula();
		} catch (error) {
			console.log("formula", error);

			pool.processing = false;

			return;
		}

	`;

	return formula;
}

function GetOptimalInput() {
	const getOptimalInput = `
		async function getOptimalInput() {
			if (vendablePoolsV3.length == 0) return [null, null, null, null];

			let flashPool;
			let zeroForOne;
			let sqrtPriceLimitX96;
			let optimalInput = Infinity;

			const StateV3 = JSON.parse(fs.readFileSync(\`Scripts/StateV3/\${chain}.json\`, "utf8"));

			for (const vendablePool of vendablePoolsV3) {
				if (vendablePool.project_name !== "PancakeswapV3") continue;

				console.log("tokenIn_address", tokenIn_address);
				console.log("tokenOut_address", tokenOut_address);
				console.log("pool.token0_address", vendablePool.token0_address);
				console.log("pool.token1_address", vendablePool.token1_address);

				const vendablePoolObject = StateV3[vendablePool.project_name][vendablePool.pool_object_name];

				vendablePoolObject.sqrtPriceX96 = BigInt(vendablePoolObject.sqrtPriceX96);
				vendablePoolObject.tick = BigInt(vendablePoolObject.tick);
				vendablePoolObject.liquidity = BigInt(vendablePoolObject.liquidity);
				vendablePoolObject.tickSpacing = BigInt(vendablePoolObject.tickSpacing);
				vendablePoolObject.feePips = BigInt(vendablePoolObject.feePips);

				let exactInput;
				let zero_to_one;
				let sqrt_price_x96;


				if (tokenIn_address == vendablePool.token0_address && tokenOut_address == vendablePool.token1_address) {
					zero_to_one = false;
					sqrt_price_x96 = MAX_SQRT_RATIO - 100n;
	
					console.log("testtttttttt 000000000000000");
	
					const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, MAX_SQRT_RATIO - 100n, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);
					// const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, sqrtRatioTargetX96, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);
					// const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, MIN_SQRT_RATIO + 100n, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);
	
					console.log("amount1 == exact input", ethers.formatUnits(amount1, vendablePool.token1_decimal), vendablePool.token1_symbol);
					console.log("amount0 == exact output ", ethers.formatUnits(-amount0, vendablePool.token0_decimal), vendablePool.token0_symbol);
	
					exactInput = amount1;
	
					const QuoterExactInput = await QuotersV3["PancakeswapV3"].quoteExactOutputSingle.staticCallResult({
						tokenIn: vendablePool.token1_address,
						tokenOut: vendablePool.token0_address,
						amount: amountIn,
						fee: vendablePoolObject.feePips,
						// sqrtPriceLimitX96: MAX_SQRT_RATIO - 100n,
						// sqrtPriceLimitX96: BigInt(sqrt_price_x96),
						// sqrtPriceLimitX96: MIN_SQRT_RATIO + 100n,
						sqrtPriceLimitX96: zero_to_one ? MIN_SQRT_RATIO + 100n : MAX_SQRT_RATIO - 100n,
					});
	
					console.log("QuoterExactInput.amountOut", QuoterExactInput.amountIn, ethers.formatUnits(QuoterExactInput.amountIn, tokenOut_decimal), tokenOut_symbol);
					console.log("QuoterExactInput.sqrtPriceX96After", QuoterExactInput.sqrtPriceX96After);
	
					// ***
					// ***
					exactInput = QuoterExactInput.amountIn;
					// ***
					// ***
				}

				if (tokenIn_address == vendablePool.token1_address && tokenOut_address == vendablePool.token0_address) {
					zero_to_one = true;
					sqrt_price_x96 = MIN_SQRT_RATIO + 100n;

					console.log("testtttttttt 11111111111111");

					// const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, MAX_SQRT_RATIO - 100n, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);
					// const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, sqrtRatioTargetX96, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);
					const [amount0, amount1] = await LibraryV3.swap(zero_to_one, -amountIn, MIN_SQRT_RATIO + 100n, StateV3[vendablePool.project_name][vendablePool.pool_object_name]);

					console.log("amount0 == exact input", ethers.formatUnits(amount0, vendablePool.token0_decimal), vendablePool.token0_symbol);
					console.log("amount1 == exact output ", ethers.formatUnits(-amount1, vendablePool.token1_decimal), vendablePool.token1_symbol);

					exactInput = amount0;

					const QuoterExactInput = await QuotersV3["PancakeswapV3"].quoteExactOutputSingle.staticCallResult({
						tokenIn: vendablePool.token0_address,
						tokenOut: vendablePool.token1_address,
						amount: amountIn,
						fee: vendablePoolObject.feePips,
						// sqrtPriceLimitX96: MAX_SQRT_RATIO - 100n,
						// sqrtPriceLimitX96: BigInt(sqrt_price_x96),
						// sqrtPriceLimitX96: MIN_SQRT_RATIO + 100n,
						sqrtPriceLimitX96: zero_to_one ? MIN_SQRT_RATIO + 100n : MAX_SQRT_RATIO - 100n,
					});

					console.log("QuoterExactInput.amountOut", QuoterExactInput.amountIn, ethers.formatUnits(QuoterExactInput.amountIn, tokenOut_decimal), tokenOut_symbol);
					console.log("QuoterExactInput.sqrtPriceX96After", QuoterExactInput.sqrtPriceX96After);

					// ***
					// ***
					exactInput = QuoterExactInput.amountIn;
					// ***
					// ***
				}

				if (zero_to_one == undefined || sqrt_price_x96 == undefined) {
					console.log("undefined error occured zeroForOne !!!", zero_to_one);
					console.log("undefined error occured sqrtPriceLimitX96 !!!", sqrt_price_x96);
					return;
				}

				if (exactInput < optimalInput) {
					flashPool = vendablePool;
					zeroForOne = zero_to_one;
					sqrtPriceLimitX96 = sqrt_price_x96;
					optimalInput = exactInput;
				}

				// break;

			}

			return [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96];
		}

		const [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96] = await getOptimalInput();
	`;

	return getOptimalInput;
}

function Data(callback_type) {
	let data;

	if (callback_type == 0) {
		// PolygonzkEVM, Avalanche, Arbitrum, Ethereum
		data = `
			const swapData = project.flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, ZeroToOne, amountIn, BigInt(targetSqrtPriceX96), "0x"]).slice(2);

			const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]);
	
			const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);
		
			const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);
		`;
	} else if (callback_type == 1) {
		// Linea, Blast, XLayer
		data = `
			const swapData = project.flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, ZeroToOne, amountIn, BigInt(targetSqrtPriceX96), "0x"]).slice(2);
	
			const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]);
		
			const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);
		
			const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);
		`;
	} else if (callback_type == 2) {
		data = `0x`;
	} else if (callback_type == 3) {
		data = `0x`;
	}

	return data;
}

function Tx(tx_type) {
	let tx;

	if (tx_type == 0) {
		tx = `const tx = {
			from: WalletAddress,
			to: flashSwapAddress,
			data: flashSwap_data,
			chainId: chainID,
			value: 0,
			type: 0,
			gasLimit: flashSwap_gasLimit,
			gasPrice: (FeeData[chain].gasPrice * 2).toString(),
			// gasPrice: FeeData[chain].gasPrice,
			// nonce: await Owner_Account.getNonce(),
		};`;
	} else if (tx_type == 1) {
		tx = `const tx = {
			from: WalletAddress,
			to: flashSwapAddress,
			data: flashSwap_data,
			chainId: chainID,
			value: 0,
			type: 1,
			gasLimit: flashSwap_gasLimit,
			gasPrice: (FeeData[chain].gasPrice * 2).toString(),
			// gasPrice: FeeData[chain].gasPrice,
			// nonce: await Owner_Account.getNonce(),
		};`;
	} else if (tx_type == 2) {
		tx = `const tx = {
			from: WalletAddress,
			to: flashSwapAddress,
			data: flashSwap_data,
			chainId: chainID,
			value: 0,
			type: 2,
			gasLimit: flashSwap_gasLimit,
			maxFeePerGas: FeeData[chain].maxFeePerGas,
			maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas,
			// gasPrice: (FeeData[chain].gasPrice * 2).toString(),
			// gasPrice: FeeData[chain].gasPrice,
			// nonce: await Owner_Account.getNonce(),
		};`;
	} else if (tx_type == 3) {
		tx = `const tx = {
			from: WalletAddress,
			to: flashSwapAddress,
			data: flashSwap_data,
			chainId: chainID,
			value: 0,
			type: 3,
			gasLimit: flashSwap_gasLimit,
			// maxFeePerGas: FeeData[chain].maxFeePerGas,
			// maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas,
			// gasPrice: (FeeData[chain].gasPrice * 2).toString(),
			// gasPrice: FeeData[chain].gasPrice,
			// nonce: await Owner_Account.getNonce(),
		};`;
	}

	return tx;
}

function GetL2TransactionFee(l2_fee_type, native_token_symbol) {
	let getL2TransactionFee;

	if (l2_fee_type == 0) {
		getL2TransactionFee = `async function getL2TransactionFee() {
			let transactionFeeL2;
			
			try {
				transactionFeeL2 = await POLYGON_ZKEVM_RPC_API_PROVIDER.send("zkevm_estimateFee", [tx]);
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
					Number(transactionFeeL2),
					entranceProfit,
					vendableProfit,
					-1
				);
	
				[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();
	
				pool.processing = false;
	
				return;
			}
	
			return (Number(transactionFeeL2) / 10 ** 18) * (await getMarketPrice("${native_token_symbol}"));
		}
	
		const transactionFeeL2 = await getL2TransactionFee();

		`;
	} else if (l2_fee_type == 1) {
		getL2TransactionFee = `async function getL2TransactionFee() {
			let gas;
			
			try {
				gas = await GAS_PROVIDER.estimateGas(tx);
	
				// const contractPopulateGasEstimation = await flashSwapContract.connect(Owner_Account).flashSwap.estimateGas(flashPool, flashPoolData);
	
				// console.log("Contract Populate Gas Estimation =====>", contractPopulateGasEstimation);
			} catch (error) {
				await saveError(
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
					Number(gas),
					entranceProfit,
					vendableProfit,
					-1
				);

				[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();
	
				pool.processing = false;
	
				return;
			}

			const L2Fee = Number((gas.toString() * FeeData[chain].gasPrice) / 10 ** 18) * await getMarketPrice("${native_token_symbol}");
	
			if (L2Fee !== null || !isNaN(L2Fee)) return Number(L2Fee);
		}
	
		const transactionFeeL2 = await getL2TransactionFee();
		
		`;
	} else if (l2_fee_type == 2) {
		getL2TransactionFee = `0x`;
	} else if (l2_fee_type == 3) {
		getL2TransactionFee = `0x`;
	} else if (l2_fee_type == -1) {
		getL2TransactionFee = `const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * 2) / 10 ** 18) * (await GlobalLibrary.getMarketPriceBatch(["${native_token_symbol.toUpperCase()}"]));`;
	} else if (l2_fee_type == -2) {
		getL2TransactionFee = `// getL2TransactionFee is Disabled`;
	}

	return getL2TransactionFee;
}

function GetL1TransactionFee(l1_fee_type, native_token_symbol) {
	let getL1TransactionFee;

	if (l1_fee_type == 0) {
		getL1TransactionFee = `async function calculateL1Fee() {
			const bytesArray = ethers.toBeArray(flashSwap_data);
	
			let zeroBytes = 0;
			let nonZeroBytes = 0;
	
			for (const byte of bytesArray) {
				if (byte === 0) {
					zeroBytes++;
				} else {
					nonZeroBytes++;
				}
			}
	
			// const L1payEtherAmount = (((zeroBytes * 4 + nonZeroBytes * 16 + overhead) * L1FeeData[chain].gasPrice * scalar) / 10 ** 27).toFixed(18);
	
			// console.log("L1payEtherAmount", L1payEtherAmount * 0.6); // Decreased %40

			const L1FeeData = JSON.parse(await fs.promises.readFile("Scripts/FeeData/L1FeeData.json", "utf8"));
	
			const L1GasFee = (((zeroBytes * 4 + nonZeroBytes * 16 + overhead) * L1FeeData.gasPrice * scalar) / 10 ** 27) * await getMarketPrice("${native_token_symbol}");
	
			// return L1GasFee * 0.6; // Decreased %40

			return L1GasFee;
		}
	
		const transactionFeeL1 = await calculateL1Fee();
		
		`;
	} else if (l1_fee_type == 1) {
		getL1TransactionFee = `0x`;
	} else if (l1_fee_type == 2) {
		getL1TransactionFee = `0x`;
	} else if (l1_fee_type == 3) {
		getL1TransactionFee = `0x`;
	} else if (l1_fee_type == -1) {
		getL1TransactionFee = null; // Maybe it will be update in the future
	} else if (l1_fee_type == -2) {
		getL1TransactionFee = `// getL1TransactionFee is Disabled`;
	}

	return getL1TransactionFee;
}

function Execute() {
	const execute = `	async function execute() {
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

	await execute();`;

	return execute;
}

function Part10(part10_type) {
	let part10;

	if (part10_type == 0) {
		part10 = `
		
		const flashSwapProfit = vendableProfit - transactionFeeL2;
	
		if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
			pool.processing = false;
		
			return;
		}
		
		if (project.comments) {
			console.log("transactionFeeL2", transactionFeeL2, "$");
			console.log("flashSwapProfit", flashSwapProfit, "$");
		}
		
		`;
	} else if (part10_type == 1) {
		part10 = `
		
		const flashSwapProfit = vendableProfit - transactionFeeL2 - transactionFeeL1;

		if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || transactionFeeL1 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
			pool.processing = false;
		
			return;
		}

		if (project.comments) {
			console.log("transactionFeeL2", transactionFeeL2, "$");
			console.log("transactionFeeL1", transactionFeeL1, "$");
			console.log("flashSwapProfit", flashSwapProfit, "$");
		}

		`;
	} else if (part10_type == 2) {
		part10 = `0x`;
	} else if (part10_type == 3) {
		part10 = `0x`;
	} else if (part10_type == -1) {
		part10 = null; // Maybe it will be update in the future
	} else if (part10_type == -2) {
		part10 = null;
	}

	return part10;
}

function Modules(chain, module_type) {
	let modules;

	if (module_type == 0) {
		modules = `
		const { ethers, ethersV5, fs, path, encoder, ERC20, Q96, flashSwapFunctionSelector, WalletAddress, flashSwap_gasLimit, gasLimit, FeeDataServerPort, QuoterV2ABI, MAX_SQRT_RATIO, MIN_SQRT_RATIO, incrementRateV3 } = require("../../../Scripts/Common/Global/Global");

		const chain = path.basename(path.dirname(path.dirname(__filename)));

		const {
			confirmation,
			blockTime,
			Interval,

			chainID,
			POLYGONZKEVM_RPC_API_PROVIDER,
			FLASHSWAP_PROVIDER,
			POOL_PROVIDER_V3,
			CONTRACT_PROVIDER,
			flashSwapAddress,
			flashSwapContract,
			Owner_Account,
			ProjectsV3,
			QuotersV3,
			QuoterVersionsV3,
			minimumEntranceProfit,
			minimumVendableProfit,
			minimumFlashSwapProfit,
		} = require(\`../../../Scripts/Common/Common/\${chain}\`);

		const GlobalLibrary = require("../../../Scripts/Library/GlobalLibrary");
		const LibraryV2 = require("../../../Scripts/Library/LibraryV2");
		const LibraryV3 = require("../../../Scripts/Library/LibraryV3");

		const projectName = path.basename(__filename, ".js");
		const project = ProjectsV3[projectName];
		const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, \`../../../Scripts/Dex/PoolDatasV3/\${chain}/\${projectName}.json\`), "utf8"));
		const poolABI = require(path.join(__dirname, \`../../../Scripts/Dex/PoolABIsV3/UniswapV3PoolABI.json\`));

		let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL);
		
		let heartbeatInterval;
	
		`;
	} else if (module_type == 1) {
		modules = `
		const { ethers, ethersV5, fs, path, encoder, ERC20, Q96, flashSwapFunctionSelector, WalletAddress, flashSwap_gasLimit, gasLimit, FeeDataServerPort, QuoterV2ABI, MAX_SQRT_RATIO, MIN_SQRT_RATIO, incrementRateV3 } = require("../../../Scripts/Common/Global/Global");

		const chain = path.basename(path.dirname(path.dirname(__filename)));

		const {
			confirmation,
			blockTime,
			Interval,

			chainID,
			FLASHSWAP_PROVIDER,
			POOL_PROVIDER_V3,
			CONTRACT_PROVIDER,
			flashSwapAddress,
			flashSwapContract,
			Owner_Account,
			ProjectsV3,
			QuotersV3,
			QuoterVersionsV3,
			minimumEntranceProfit,
			minimumVendableProfit,
			minimumFlashSwapProfit,
		} = require(\`../../../Scripts/Common/Common/\${chain}\`);

		const GlobalLibrary = require("../../../Scripts/Library/GlobalLibrary");
		const LibraryV2 = require("../../../Scripts/Library/LibraryV2");
		const LibraryV3 = require("../../../Scripts/Library/LibraryV3");

		const projectName = path.basename(__filename, ".js");
		const project = ProjectsV3[projectName];
		const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, \`../../../Scripts/Dex/PoolDatasV3/\${chain}/\${projectName}.json\`), "utf8"));
		const poolABI = require(path.join(__dirname, \`../../../Scripts/Dex/PoolABIsV3/UniswapV3PoolABI.json\`));

		let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL);
		
		let heartbeatInterval;
	
		`;
	} else if (module_type == 2) {
		modules = `
		const { ethers, ethersV5, fs, path, encoder, ERC20, Q96, flashSwapFunctionSelector, WalletAddress, flashSwap_gasLimit, gasLimit, overhead, scalar } = require("../../../Scripts/Common/Global/Global");
	
		const chain = path.basename(path.dirname(path.dirname(__filename)));
		
		const {
			confirmation,
			blockTime,
			Interval,
		
			chainID,
			FLASHSWAP_PROVIDER,
			POOL_PROVIDER_V3,
			CONTRACT_PROVIDER,
			flashSwapAddress,
			flashSwapContract,
			Owner_Account,
			ProjectsV3,
			QuoterV3,
			QuoterVersionsV3,
			minimumEntranceProfit,
			minimumVendableProfit,
			minimumFlashSwapProfit,
		} = require(\`../../../Scripts/Common/Common/\${chain}\`);
		
		const { saveError, getVendableV3Pools, getFlashPool, getMarketPrice, getAmountOut, saveProfit, saveProfitToCSV, getAmountOut_Antfarm } = require("../../../Scripts/Library/LibraryV2");

		const { getVendableV3SpecifiedPools, calculatePoolPriceOfTokenWithSqrtPriceX96 } = require("../../../Scripts/Library/LibraryV3");
		
		const projectName = path.basename(__filename, ".js");
		const project = ProjectsV3[projectName];
		const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, \`../../../Scripts/Dex/PoolDatasV3/\${chain}/\${projectName}.json\`), "utf8"));
		const poolABI = require(path.join(__dirname, \`../../../Scripts/Dex/PoolABIsV3/UniswapV3PoolABI.json\`));

		let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL);
		
		let heartbeatInterval;
	
		`;
	} else if (module_type == 3) {
		module = `0x`;
	}

	return modules;
}

function PoolObjects(pools) {
	let poolObjects = "";

	for (const pool of pools) {
		// if (NonVendableV3PoolsToV3.includes(pool.pool_address)) continue;

		let poolObjectName = `${pool.token0_symbol}_${pool.token1_symbol}_POOL`;

		if (pool.pool_fee !== undefined) poolObjectName = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

		poolObjects += `
		let ${poolObjectName} = {
			address: "${pool.pool_address}",
			https_contract: new ethers.Contract("${pool.pool_address}", poolABI, POOL_PROVIDER_V3),
			wss_contract: null,
			sqrtPriceX96: undefined,
			tick: undefined,
			liquidity: undefined,
			tickSpacing: ${pool.pool_tick_spacing},
			feePips: ${pool.pool_fee},
			processing: false,
			}
		\n`;
	}

	return poolObjects;
}

function Executor(callback_type, tx_type, l2_fee_type, l1_fee_type, native_token_symbol, part10_type) {
	const executorVariables = ExecutorVariables();
	const initialize = Initialize();
	const formula = Formula();
	const getOptimalInput = GetOptimalInput();
	const data = Data(callback_type);
	const tx = Tx(tx_type);
	const getL2TransactionFee = GetL2TransactionFee(l2_fee_type, native_token_symbol);
	const getL1TransactionFee = GetL1TransactionFee(l1_fee_type, native_token_symbol);
	const part10 = Part10(part10_type);
	const execute = Execute();

	const executor = `
		async function Executor(pool) {
			if (pool.processing == true || pool.sqrtPriceX96 == undefined || pool.tick == undefined || pool.liquidity == undefined || pool.sqrtPriceX96 <= 0n || pool.liquidity <= 0n) return;

			pool.processing = true;
		
			const startTime = performance.now();
		
			const { pool_name, pool_fee, pool_tick_spacing, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

			pool.feePips = BigInt(pool_fee);
			pool.tickSpacing = BigInt(pool_tick_spacing);

			const token0_Pool_Price = await LibraryV3.calculatePoolPriceOfTokenWithSqrtPriceX96(pool.sqrtPriceX96, true, token0_decimal, token1_decimal);

			${executorVariables}

			${initialize}

			let targetSqrtPriceX96 = Math.sqrt(token0_Market_Price / token1_Market_Price) * Number(Q96);

			if (token0_decimal > token1_decimal) targetSqrtPriceX96 /= ZeroToOne ? 10 ** tokenOut_decimal : 10 ** tokenIn_decimal;
			if (token0_decimal < token1_decimal) targetSqrtPriceX96 *= ZeroToOne ? 10 ** tokenIn_decimal : 10 ** tokenOut_decimal;

			console.log("pool_fee", pool_fee);
			console.log("pool token0_symbol", token0_symbol);
			console.log("pool token1_symbol", token1_symbol);

			console.log("pool sqrtPriceX96 ", pool.sqrtPriceX96);
			console.log("targetSqrtPriceX96", BigInt(targetSqrtPriceX96));

			console.log("ZeroToOne", ZeroToOne);

			${formula}

			if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit < minimumEntranceProfit) {
				pool.processing = false;

				return;
			}

			await GlobalLibrary.saveProfitToJson(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

			const vendablePoolsV3 = await GlobalLibrary.getVendablePools(chain, "3", pool.address, tokenIn_address, tokenOut_address);

			${getOptimalInput}

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
				console.log(\`\${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} Borrow from flashPoolContract V3\`);
				console.log(\`\${ethers.formatUnits(amountIn, tokenIn_decimal)} \${tokenIn_symbol} Send Input to arbitragePoolContract V3\`);
				console.log(\`\${ethers.formatUnits(amountOutMin, tokenOut_decimal)} \${tokenOut_symbol} Take Output from arbitragePoolContract V3\`);
				console.log(\`\${ethers.formatUnits(optimalInput, tokenOut_decimal)} \${tokenOut_symbol} Payback to flashPoolContract V3\`);
				console.log(\`tokenRevenue \${tokenRevenue} \${tokenOut_symbol}\`);
				console.log("entranceProfit", entranceProfit);
				console.log("vendableProfit", vendableProfit);
			}

			await GlobalLibrary.saveProfitToJson(chain, entranceProfit, vendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);
			
			${data}

			${tx}

			${getL2TransactionFee}

			${getL1TransactionFee}

			${part10}

			${execute}
		}
	\n`;

	return executor;
}

function Initializer() {
	const initializer = `
	async function Initializer() {
		const StateV3 = JSON.parse(fs.readFileSync(\`Scripts/StateV3/\${chain}.json\`, "utf8"));

		let ok = false;

		for (const stateProjectName in StateV3) if (StateV3[stateProjectName] == projectName) ok = true;

		if (ok == false) StateV3[projectName] = {};

		for (const pool of poolsData) {
			let object_name = \`\${pool.token0_symbol}_\${pool.token1_symbol}_POOL\`;

			if (pool.pool_fee !== undefined) object_name = \`\${pool.token0_symbol}_\${pool.token1_symbol}_\${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL\`;

			const pool_object = eval(object_name);

			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

			[[pool_object.sqrtPriceX96, pool_object.tick], pool_object.liquidity] = await Promise.all([pool_object.https_contract.slot0(), pool_object.https_contract.liquidity()]);

			global[object_name] = pool_object;

			StateV3[projectName][object_name].address = pool_object.address;
			StateV3[projectName][object_name].sqrtPriceX96 = pool_object.sqrtPriceX96.toString();
			StateV3[projectName][object_name].tick = pool_object.tick.toString();
			StateV3[projectName][object_name].liquidity = pool_object.liquidity.toString();
			StateV3[projectName][object_name].tickSpacing = pool_object.tickSpacing.toString();

			if (pool_object.feePips !== undefined) StateV3[projectName][object_name].feePips = pool_object.feePips.toString();

			// console.log("sqrtPriceX96 of", pool_object.address, pool_object.sqrtPriceX96);
			// console.log("tick of", pool_object.address, pool_object.tick);
			// console.log("liquidity of", pool_object.address, pool_object.liquidity);
		}

		fs.writeFileSync(\`Scripts/StateV3/\${chain}.json\`, JSON.stringify(StateV3, null, 2));
	}
	\n`;

	return initializer;
}

function Listen(chain) {
	const listen = `async function Listen() {
		async function re_initialize() {
			for (const pool of poolsData) {
				const object_name = \`\${pool.token0_symbol}_\${pool.token1_symbol}_\${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL\`;
	
				const pool_object = eval(object_name);
	
				WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL);
	
				pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);
	
				global[object_name] = pool_object;
			}
		}
	
		async function addListeners() {
			for (const pool of poolsData) {
				const object_name = \`\${pool.token0_symbol}_\${pool.token1_symbol}_\${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL\`;
	
				const pool_object = eval(object_name);
	
				// console.log("Old Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
	
				await pool_object.wss_contract.removeAllListeners("Swap");
	
				// console.log("New Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
	
				pool_object.wss_contract.on("Swap", async (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick, protocolFeesToken0, protocolFeesToken1) => {
					try {
						pool_object.sqrtPriceX96 = BigInt(sqrtPriceX96);
						pool_object.tick = BigInt(tick);
						pool_object.liquidity = BigInt(liquidity);

						// console.log("sqrtPriceX96 of", pool_object.address, pool_object.sqrtPriceX96);
						// console.log("tick of", pool_object.address, pool_object.tick);
						// console.log("liquidity of", pool_object.address, pool_object.liquidity);

						global[object_name] = pool_object;

						const StateV3 = JSON.parse(fs.readFileSync(\`Scripts/StateV3/\${chain}.json\`, "utf8"));

						StateV3[projectName][object_name].sqrtPriceX96 = pool_object.sqrtPriceX96.toString();
						StateV3[projectName][object_name].tick = pool_object.tick.toString();
						StateV3[projectName][object_name].liquidity = pool_object.liquidity.toString();

						fs.writeFileSync(\`Scripts/StateV3/\${chain}.json\`, JSON.stringify(StateV3, null, 2));

						Executor(pool_object);
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
	\n`;

	return listen;
}

function Callee() {
	const callee = `async function Callee() {
		for (const pool of poolsData) {
			const object_name = \`\${pool.token0_symbol}_\${pool.token1_symbol}_\${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL\`;

			// if (object_name !== "MATIC_USDC_0_0025_POOL") continue;

			// if (object_name !== "USDT_MATIC_0_0025_POOL") continue;
			// if (object_name !== "USDT_MATIC_0_0001_POOL") continue;

			// if (object_name !== "WETH_USDC_0_01_POOL") continue;
			// if (object_name !== "WETH_USDC_0_0025_POOL") continue;
			// if (object_name !== "WETH_USDC_0_0005_POOL") continue;
			// if (object_name !== "WETH_USDC_0_0001_POOL") continue;

			// if (object_name !== "USDT_WETH_0_01_POOL") continue;
			// if (object_name !== "USDT_WETH_0_0025_POOL") continue;
			// if (object_name !== "USDT_WETH_0_0005_POOL") continue;
			// if (object_name !== "USDT_WETH_0_0001_POOL") continue;

			// if (object_name !== "WETH_MATIC_0_0025_POOL") continue;
			if (object_name !== "WETH_MATIC_0_0005_POOL") continue;

			// if (object_name !== "USDT_USDC_0_0001_POOL") continue;
			// if (object_name !== "USDT_DAI_0_01_POOL") continue;
	
			const pool_object = eval(object_name);

			[[pool_object.sqrtPriceX96, pool_object.tick], pool_object.liquidity] = await Promise.all([pool_object.https_contract.slot0(), pool_object.https_contract.liquidity()]);

			global[object_name] = pool_object;
	
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

async function Save(chain, module_type, callback_type, tx_type, l2_fee_type, l1_fee_type, native_token_symbol, part10_type) {
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

	const folderPath = `Scripts/Dex/PoolDatasV3/${chain}`;

	fs.readdir(folderPath, async (err, files) => {
		if (err) {
			console.error("Error reading directory:", err);
			return;
		}

		const jsonFiles = files.filter((file) => path.extname(file) === ".json");

		for (const file of jsonFiles) {
			const projectName = path.basename(file, ".json");
			const projectPath = `DApps/${chain}/${path.basename(__dirname)}/${projectName}.js`;
			const pools = require(`../../Dex/PoolDatasV3/${chain}/${projectName}.json`);

			if (projectName != "PancakeswapV3") continue;

			// if (projectName == "DysonFinanceV2") continue;
			// if (projectName == "AntfarmFinanceV2") continue;
			// if (projectName == "BalancerV2") continue;
			// if (projectName == "SyncSwapV2") continue;
			// if (projectName == "VelocoreV2") continue;

			if (!fs.existsSync(projectPath)) fs.writeFileSync(projectPath, "", "utf8");

			try {
				const modules = Modules(chain, module_type);
				const poolObjects = PoolObjects(pools);
				const executor = Executor(callback_type, tx_type, l2_fee_type, l1_fee_type, native_token_symbol, part10_type);
				const initializer = Initializer();
				const listen = Listen(chain);
				const calleee = Callee();
				const functionCalls = FunctionCalls();

				const modifiedFile = modules + poolObjects + executor + initializer + listen + calleee + functionCalls;

				fs.writeFileSync(projectPath, modifiedFile, "utf8");
			} catch (parseError) {
				console.error("Error parsing JSON in file:", file, parseError);
			}
		}
	});
}

async function run() {
	for (const chain of chains) {
		if (chain !== selectedChain) continue;

		const { module_type, callback_type, tx_type, l2_fee_type, l1_fee_type, native_token_symbol, part10_type } = require(`../../Common/Common/${chain}.js`);

		await Save(chain, module_type, callback_type, tx_type, l2_fee_type, l1_fee_type, native_token_symbol, part10_type);
	}
}

run();
