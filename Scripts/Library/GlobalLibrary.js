const { ethers, fs, path, http, AdditionalMarketPrices } = require("../Common/Global/Global");

async function saveErrorToJson(
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
) {
	const currentDate = new Date();
	const errorDetails = {
		Chain: chain,
		ArbitragePool: projectName + " " + pool_name + " --> " + pool.address,
		FlashPool: flashPool.project_name + " --> " + flashPool.pool_address,
		Inputs_Outputs: {
			borrow: ethers.formatUnits(amountIn, tokenIn_decimal) + " " + tokenIn_symbol + " --> " + tokenIn_address,
			amountIn: ethers.formatUnits(amountIn, tokenIn_decimal) + " " + tokenIn_symbol + " --> " + tokenIn_address,
			amountOutMin: ethers.formatUnits(amountOutMin, tokenOut_decimal) + " " + tokenOut_symbol + " --> " + tokenOut_address,
			payback: ethers.formatUnits(optimalInput, tokenOut_decimal) + " " + tokenOut_symbol + " --> " + tokenOut_address,
			transactionFeeL2: transactionFeeL2,
			entranceProfit: entranceProfit,
			vendableProfit: vendableProfit,
			flashSwapProfit: flashSwapProfit,
		},
		Error_shortMessage: error.shortMessage,
		Error_code: error.code,
		Date: currentDate.toLocaleString(),
	};

	let errorsArray = JSON.parse(fs.readFileSync("Errors.json", "utf-8"));
	errorsArray.push(errorDetails);

	fs.writeFileSync("Errors.json", JSON.stringify(errorsArray, null, 2));
}

async function saveProfitToJson(chain, profit, vendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address) {
	let profitsData = {};

	try {
		const data = fs.readFileSync(`Profits.json`, "utf8");

		if (data.trim() !== "") profitsData = JSON.parse(data);
	} catch (error) {}

	if (!profitsData[chain]) profitsData[chain] = {};

	profitsData[chain][projectName + " " + pool_name] = {
		amountIn: ethers.formatUnits(amountIn, tokenIn_decimal) + " " + tokenIn_symbol + " --> " + tokenIn_address,
		amountOutMin: ethers.formatUnits(amountOutMin, tokenOut_decimal) + " " + tokenOut_symbol + " --> " + tokenOut_address,
		profit: profit.toFixed(3) + "$",
		vendableProfit: vendableProfit.toFixed(3) + "$",
		time: new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }),
	};

	try {
		fs.writeFileSync(`Profits.json`, JSON.stringify(profitsData, null, 2));
	} catch (error) {}
}

async function saveProfitToCsv(chain, startTime, projectName, poolName, transactionFee, entranceProfit, vendableProfit, flashSwapProfit, tokenRevenue, tokenOut_symbol) {
	const executionTime = (performance.now() - startTime) / 1000;

	const currentDateTime = new Date().toLocaleDateString(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	const data = [
		// WHOLE DATA
		chain,
		currentDateTime,
		projectName,
		poolName,
		Math.floor(executionTime * 1000) + " ms",
		transactionFee + " $",
		entranceProfit + " $",
		vendableProfit + " $",
		flashSwapProfit + " $",
		tokenRevenue.toFixed(9) + " " + tokenOut_symbol,
		// WHOLE DATA
	];

	fs.appendFileSync(`Revenues.csv`, "\n" + data.join(","), "utf-8");
}

async function old_v1_getMarketPrice(symbol) {
	let MarketPricesPyth;
	let MarketPricesCoinMarketCap;
	let MarketPricesCoinGecko;
	try {
		MarketPricesPyth = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPrices.json", "utf8"));
		MarketPricesCoinMarketCap = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPricesCoinMarketCap.json", "utf8"));
		MarketPricesCoinGecko = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPricesCoinGecko.json", "utf8"));
	} catch (error) {
		return null;
	}

	if (symbol.includes("USD") || symbol.includes("DAI") || symbol.includes("FRAX") || symbol.includes("MIM") || symbol.includes("DOLA") || symbol.includes("MAI")) {
		return 1;
	} else {
		if (symbol == "WSTETH" || symbol == "ankrETH") return MarketPricesPyth["WSTETH"];
		if (symbol == "EURC" || symbol == "EURA") return MarketPricesPyth["EURC"];
		if (symbol == "kMATIC") return MarketPricesPyth["MATIC"];
		if (symbol == "QUICK") return MarketPricesPyth["QUICK"];

		let tokenKey = symbol.startsWith("W") ? symbol.substring(1).toUpperCase() : symbol.toUpperCase();

		if (symbol.match(/(\_CFT|\.B|\.b|\.E|\.e)$/)) {
			tokenKey = tokenKey.replace(/(\_CFT|\.B|\.b|\.E|\.e)$/, "");
		}

		let price = MarketPricesPyth[tokenKey];

		if (price == undefined) price = AdditionalMarketPrices[tokenKey];

		if (price == undefined) price = MarketPricesCoinMarketCap[tokenKey];

		if (price == undefined) price = MarketPricesCoinGecko[tokenKey];

		if (price == undefined) return null;

		return price;
	}
}

async function getMarketPrice(symbol) {
	// const MarketPricesPyth = await getDataFromLocalServer(PythServerPort);
	// const MarketPricesCoinMarketCap = await getDataFromLocalServer(CoinMarketCapServerPort);
	// const MarketPricesCoinGecko = await getDataFromLocalServer(CoinGeckoServerPort);

	if (symbol.includes("USD") || symbol.includes("DAI") || symbol.includes("FRAX") || symbol.includes("MIM") || symbol.includes("DOLA") || symbol.includes("MAI")) {
		return 1;
	} else {
		if (symbol == "WSTETH" || symbol == "ankrETH") return MarketPricesPyth["WSTETH"];
		if (symbol == "EURC" || symbol == "EURA") return MarketPricesPyth["EURC"];
		if (symbol == "kMATIC") return MarketPricesPyth["MATIC"];
		if (symbol == "QUICK") return MarketPricesPyth["QUICK"];

		let tokenKey = symbol.startsWith("W") ? symbol.substring(1).toUpperCase() : symbol.toUpperCase();

		if (symbol.match(/(\_CFT|\.B|\.b|\.E|\.e)$/)) {
			tokenKey = tokenKey.replace(/(\_CFT|\.B|\.b|\.E|\.e)$/, "");
		}

		let price = MarketPricesPyth[tokenKey];

		if (price == undefined) price = AdditionalMarketPrices[tokenKey];

		if (price == undefined) price = MarketPricesCoinMarketCap[tokenKey];

		// if (price == undefined) price = MarketPricesCoinGecko[tokenKey];

		if (price == undefined) return null;

		return price;
	}
}

async function getMarketPriceBatch(symbols) {
	const MarketPricesPyth = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPricesPyth.json"));
	const MarketPricesCoinMarketCap = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPricesCoinMarketCap.json"));
	const MarketPricesCoinGecko = JSON.parse(await fs.promises.readFile("Scripts/MarketPrices/MarketPricesCoinGecko.json"));

	const prices = [];

	for (const symbol of symbols) {
		if (symbol.includes("USD") || symbol.includes("DAI") || symbol.includes("FRAX") || symbol.includes("MIM") || symbol.includes("DOLA") || symbol.includes("MAI")) {
			prices.push(1);
		} else {
			if (symbol == "WSTETH" || symbol == "ankrETH") prices.push(MarketPricesPyth["WSTETH"]);
			if (symbol == "EURC" || symbol == "EURA") prices.push(MarketPricesPyth["EURC"]);
			if (symbol == "kMATIC") prices.push(MarketPricesPyth["MATIC"]);
			if (symbol == "QUICK") prices.push(MarketPricesPyth["QUICK"]);

			const DoNotRemoveFirstLetterList = [
				"WFRXETH",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
				// "TOKEN",
			];

			let tokenKey;

			if (symbol.toUpperCase().startsWith("W") && !DoNotRemoveFirstLetterList.includes(symbol)) {
				tokenKey = symbol.substring(1).toUpperCase();
			} else {
				tokenKey = symbol.toUpperCase();
			}

			if (symbol.match(/(\_CFT|\.B|\.b|\.E|\.e)$/)) tokenKey = tokenKey.replace(/(\_CFT|\.B|\.b|\.E|\.e)$/, "");

			let price = MarketPricesPyth[tokenKey];

			if (price == undefined) price = MarketPricesCoinMarketCap[tokenKey];

			if (price == undefined) price = MarketPricesCoinGecko[tokenKey];

			if (price == undefined) price = AdditionalMarketPrices[tokenKey];

			prices.push(price);
		}
	}

	return prices;
}

async function getDataFromLocalServer(serverPort) {
	return new Promise((resolve, reject) => {
		http.get(`http://localhost:${serverPort}/data`, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				try {
					const jsonData = JSON.parse(data);
					resolve(jsonData);
				} catch (error) {
					reject(error);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

async function getVendablePools(chain, version, poolAddress, token0_address, token1_address) {
	const matchingPools = [];

	try {
		const files = fs.readdirSync(`Scripts/Dex/PoolDatasV${version}/${chain}`);

		for (const file of files) {
			if (file.endsWith(".json")) {
				const filePath = path.join(`Scripts/Dex/PoolDatasV${version}/${chain}`, file);

				const pools = JSON.parse(fs.readFileSync(filePath, "utf8"));

				pools.forEach((pool) => {
					if (pool.pool_address !== poolAddress) {
						if ((pool.token0_address == token0_address && pool.token1_address == token1_address) || (pool.token0_address == token1_address && pool.token1_address == token0_address)) {
							matchingPools.push(pool);
						}
					}
				});
			}
		}
	} catch (error) {
		console.error("Error reading directory:", error);
		throw error;
	}

	return matchingPools;
}

async function getFlashPool(poolAddress) {
	const matchingPools = [];

	try {
		const files = fs.readdirSync("scripts/Dex/PoolDatasV3");

		for (const file of files) {
			if (file.endsWith(".json")) {
				const filePath = path.join("scripts/Dex/PoolDatasV3", file);
				const pools = JSON.parse(fs.readFileSync(filePath, "utf8"));

				pools.forEach((pool) => {
					if (pool.pool_address == poolAddress) {
						matchingPools.push({
							pool_address: pool.pool_address,
							token0_address: pool.token0_address,
							token1_address: pool.token1_address,
							pool_fee: pool.pool_fee,
							project_name: pool.project_name,
						});
					}
				});
			}
		}
	} catch (error) {
		console.error("Error reading directory:", error);
		throw error;
	}

	return matchingPools;
}

module.exports = {
	saveErrorToJson,
	saveProfitToJson,
	saveProfitToCsv,
	// old_v1_getMarketPrice,
	// getMarketPrice,
	getMarketPriceBatch,
	// getDataFromLocalServer,
	getVendablePools,
	// getFlashPool,
};
