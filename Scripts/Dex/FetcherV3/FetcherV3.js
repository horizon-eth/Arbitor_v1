const { ethers, fs, path, ERC20, chains, selectedChain, feesV3 } = require("../../Common/Global/Global");

const factoryABI = require("./UniversalABIsV3/UniversalFactoryABIV3.json");
const poolABI = require("./UniversalABIsV3/UniversalPoolABIV3.json");

let lastRequestTime = 0;
const requestInterval = 50;
const maxRetries = 25;
const baseDelay = 50;

async function checkPoolDataFolderExistance(chain) {
	try {
		await fs.promises.access(path.join("Scripts/Dex/PoolDatasV3", chain));
	} catch (error) {
		if (error.code === "ENOENT") await fs.promises.mkdir(path.join("Scripts/Dex/PoolDatasV3", chain), { recursive: true });
	}
}

async function checkStateChainFileExistance(chain) {
	const filePathV3 = path.join(`Scripts/StateV3/${chain}.json`);

	try {
		await fs.promises.access(filePathV3);
	} catch (error) {
		if (error.code === "ENOENT") {
			await fs.promises.writeFile(filePathV3, "{}");
		}
	}
}

async function initializeStateV3ChainFile(chain, projectName) {
	const StateV3 = JSON.parse(fs.readFileSync(`Scripts/StateV3/${chain}.json`, "utf8"));

	const poolsData = JSON.parse(fs.readFileSync(`Scripts/Dex/PoolDatasV3/${chain}/${projectName}.json`, "utf8"));

	StateV3[projectName] = {};

	for (const pool of poolsData) {
		let pool_object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

		if (pool.pool_fee == undefined) pool_object_name = `${pool.token0_symbol}_${pool.token1_symbol}_POOL`;

		StateV3[projectName][pool_object_name] = {};

		StateV3[projectName][pool_object_name].address = pool.pool_address;
		StateV3[projectName][pool_object_name].sqrtPriceX96 = "777";
		StateV3[projectName][pool_object_name].tick = "777";
		StateV3[projectName][pool_object_name].liquidity = "777";
		StateV3[projectName][pool_object_name].tickSpacing = "777";
		StateV3[projectName][pool_object_name].feePips = "777";
	}

	fs.writeFileSync(`Scripts/StateV3/${chain}.json`, JSON.stringify(StateV3, null, 2));
}

async function getPools(chain) {
	await checkPoolDataFolderExistance(chain);
	await checkStateChainFileExistance(chain);

	const { SCRIPT_PROVIDER, tokens, conflictTokens } = require(`../../Common/Common/${chain}`);
	const { ProjectsV3 } = require(`../../Common/Common/${chain}`);

	for (const projectName in ProjectsV3) {
		// if (projectName !== "PancakeswapV3") continue;

		if (ProjectsV3.hasOwnProperty(projectName)) {
			if (ProjectsV3[projectName].factoryAddress !== "") {
				const factoryAddress = ProjectsV3[projectName].factoryAddress[0];
				await runner(projectName, factoryAddress);
			}
		}
	}

	async function runner(projectName, factoryAddress) {
		const poolDataPath = path.join(__dirname, `../PoolDatasV3/${chain}/${projectName}.json`);
		const factoryContract = new ethers.Contract(factoryAddress, factoryABI, SCRIPT_PROVIDER);

		let pools = [];

		if (projectName == "QuickswapV3" || projectName == "QuickSwapV3" || projectName == "FenixFinanceV3" || projectName == "LynexV3") {
			for (let index = 0; index < tokens.length; index++) {
				for (let i = 0; i < tokens.length; i++) {
					if (index == i) continue;
					const pool = await factoryContract.poolByPair(tokens[index], tokens[i]);
					if (pool == "0x0000000000000000000000000000000000000000") continue;
					if (pools.includes(pool)) continue;
					pools.push(pool);
					console.log("pool", pool);
				}
			}
		} else {
			for (let index = 0; index < tokens.length; index++) {
				for (let i = 0; i < tokens.length; i++) {
					for (let j = 0; j < feesV3.length; j++) {
						if (index == i) continue;
						const pool = await factoryContract.getPool(tokens[index], tokens[i], feesV3[j]);
						if (pool == "0x0000000000000000000000000000000000000000") continue;
						if (pools.includes(pool)) continue;
						pools.push(pool);
						console.log("pool", pool);
					}
				}
			}
		}

		try {
			const poolsData = [];

			for (const pool of pools) {
				try {
					await waitAndMakeRequest();
					poolsData.push(await retry(getPoolInfo, [pool], maxRetries));
				} catch (error) {
					setTimeout(async () => {
						try {
							poolsData.push(await retry(getPoolInfo, [pool], maxRetries));
						} catch (innerError) {
							console.error("Failed to get pool info after retry", innerError);
						}
					}, 3000);
				}
			}

			const filteredPoolsData = poolsData.filter((pool) => pool !== null);
			const jsonData = JSON.stringify(filteredPoolsData, null, 2);
			fs.writeFileSync(poolDataPath, jsonData, "utf-8");
		} catch (error) {
			console.error("Error:", error.message);
			throw error;
		}

		async function getPoolInfo(poolAddress) {
			try {
				const poolContract = new ethers.Contract(poolAddress, poolABI, SCRIPT_PROVIDER);

				let token0_address;
				let token1_address;

				let pool_tick_spacing;

				try {
					[token0_address, token1_address, pool_tick_spacing] = await Promise.all([poolContract.token0(), poolContract.token1(), poolContract.tickSpacing()]);
				} catch (error) {}

				const token0_Contract = new ethers.Contract(token0_address, ERC20.abi, SCRIPT_PROVIDER);
				const token1_Contract = new ethers.Contract(token1_address, ERC20.abi, SCRIPT_PROVIDER);

				let token0_symbol;
				let token1_symbol;

				let token0_decimal;
				let token1_decimal;

				try {
					[token0_symbol, token1_symbol, token0_decimal, token1_decimal] = await Promise.all([token0_Contract.symbol(), token1_Contract.symbol(), token0_Contract.decimals(), token1_Contract.decimals()]);
				} catch (error) {
					if (token0_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token0_symbol = "MKR";
					if (token1_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token1_symbol = "MKR";
					if (token0_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token0_symbol = 18;
					if (token1_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token1_symbol = 18;
				}

				console.log(token0_symbol, token1_symbol, token0_decimal, token1_decimal);

				if (token0_symbol == undefined || token1_symbol == undefined) return null;

				if (token0_symbol.includes(".e")) token0_symbol = token0_symbol.replace(/\.e/g, "");
				if (token0_symbol.includes(".E")) token0_symbol = token0_symbol.replace(/\.E/g, "");
				if (token0_symbol.includes(".b")) token0_symbol = token0_symbol.replace(/\.b/g, "");
				if (token0_symbol.includes(".B")) token0_symbol = token0_symbol.replace(/\.B/g, "");

				if (token1_symbol.includes(".e")) token1_symbol = token1_symbol.replace(/\.e/g, "");
				if (token1_symbol.includes(".E")) token1_symbol = token1_symbol.replace(/\.E/g, "");
				if (token1_symbol.includes(".b")) token1_symbol = token1_symbol.replace(/\.b/g, "");
				if (token1_symbol.includes(".B")) token1_symbol = token1_symbol.replace(/\.B/g, "");

				if (conflictTokens.map((token) => token.toLowerCase()).includes(token0_address.toLowerCase()) || conflictTokens.map((token) => token.toUpperCase()).includes(token0_address.toUpperCase())) token0_symbol = `${token0_symbol}_CFT`;
				if (conflictTokens.map((token) => token.toLowerCase()).includes(token1_address.toLowerCase()) || conflictTokens.map((token) => token.toUpperCase()).includes(token1_address.toUpperCase())) token1_symbol = `${token1_symbol}_CFT`;

				const token0_base = tokens.map((token) => token.toLowerCase()).includes(token0_address.toLowerCase()) || tokens.map((token) => token.toUpperCase()).includes(token0_address.toUpperCase());
				const token1_base = tokens.map((token) => token.toLowerCase()).includes(token1_address.toLowerCase()) || tokens.map((token) => token.toUpperCase()).includes(token1_address.toUpperCase());

				if (!token0_base || !token1_base) {
					return null;
				}

				const pool_name = `${token0_symbol} / ${token1_symbol}`;

				let data;

				if (projectName == "QuickswapV3" || projectName == "QuickSwapV3" || projectName == "FenixFinanceV3" || projectName == "LynexV3") {
					data = {
						pool_address: poolAddress,
						pool_name: pool_name,
						pool_object_name: `${token0_symbol.toUpperCase()}_${token1_symbol.toUpperCase()}_POOL`,
						project_name: projectName,
						pool_tick_spacing: Number(pool_tick_spacing),
						token0_symbol: token0_symbol.toUpperCase(),
						token0_address: token0_address,
						token0_decimal: Number(token0_decimal),
						token1_symbol: token1_symbol.toUpperCase(),
						token1_address: token1_address,
						token1_decimal: Number(token1_decimal),
					};
				} else {
					const pool_fee = await poolContract.fee();
					data = {
						pool_address: poolAddress,
						pool_name: pool_name,
						pool_object_name: `${token0_symbol.toUpperCase()}_${token1_symbol.toUpperCase()}_${(Number(pool_fee) / 1000000).toString().replace(".", "_")}_POOL`,
						project_name: projectName,
						pool_fee: Number(pool_fee),
						pool_tick_spacing: Number(pool_tick_spacing),
						token0_symbol: token0_symbol.toUpperCase(),
						token0_address: token0_address,
						token0_decimal: Number(token0_decimal),
						token1_symbol: token1_symbol.toUpperCase(),
						token1_address: token1_address,
						token1_decimal: Number(token1_decimal),
					};
				}

				return data;
			} catch (error) {
				console.error(`Error fetching pool info: ${error.message}`);
				throw error;
			}
		}

		async function waitAndMakeRequest() {
			const currentTime = Date.now();
			const timeSinceLastRequest = currentTime - lastRequestTime;

			if (timeSinceLastRequest < requestInterval) {
				const waitTime = requestInterval - timeSinceLastRequest;
				await sleep(waitTime);
			}

			lastRequestTime = Date.now();
		}

		async function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}

		async function retry(fn, args, retries) {
			let attempt = 0;
			while (attempt < retries) {
				try {
					return await fn(...args);
				} catch (error) {
					attempt++;
					if (attempt >= retries) {
						console.error(`Function ${fn.name} failed after ${retries} retries`);
						throw error;
					}
					const delay = baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
					console.log(`Retrying ${fn.name} in ${delay}ms... (Attempt ${attempt + 1})`);
					await sleep(delay);
				}
			}
		}

		await initializeStateV3ChainFile(chain, projectName);
	}
}

getPools(selectedChain);

// for (const chain of chains) getPools(chain);
