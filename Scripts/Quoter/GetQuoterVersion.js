const { ethers, fs, path, chains, QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI, MIN_SQRT_RATIO, MAX_SQRT_RATIO, ERC20 } = require("../Common/Global/Global");

const GlobalLibrary = require("../Library/GlobalLibrary");

async function QuoterVersionFinder() {
	const quotersFilePath = path.join("Scripts/Quoter/Quoters.json");

	if (!fs.existsSync(quotersFilePath)) fs.writeFileSync(quotersFilePath, JSON.stringify({}, null, 2), "utf8");

	const data = JSON.parse(fs.readFileSync(quotersFilePath, "utf-8"));

	for (const chain of chains) {
		// if (chain !== "PolygonzkEVM") continue;
		if (chain !== "Linea") continue;

		if (data[chain] == undefined) data[chain] = {};

		const { ProjectsV3 } = require(`../Common/Common/${chain}`);

		for (const projectName in ProjectsV3) {
			// if (projectName !== "QuickswapUniV3") continue;
			// if (projectName !== "ElkFinanceV3") continue;
			// if (projectName !== "PancakeswapV3") continue;

			if (data[chain][projectName] == undefined) {
				data[chain][projectName] = {
					quoterAddress: "0xQuoterAddress",
					quoterVersion: 1234,
				};
			}

			if (data[chain][projectName].quoterAddress == "0xQuoterAddress") {
				if (ProjectsV3[projectName].quoterAddress !== "0xQuoterAddress") data[chain][projectName].quoterAddress = ProjectsV3[projectName].quoterAddress;
			}

			if (data[chain][projectName].quoterVersion == 1234 && data[chain][projectName].quoterAddress !== "0xQuoterAddress") {
				const quoterVersion = await getQuoterVersionOfProject(chain, projectName, data[chain][projectName].quoterAddress);

				console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA", projectName, quoterVersion);

				data[chain][projectName].quoterVersion = quoterVersion;
			}

			// break;
		}

		break;
	}

	fs.writeFileSync(quotersFilePath, JSON.stringify(data, null, 2));
}

async function getQuoterVersionOfProject(chain, projectName, quoterAddress) {
	const { SCRIPT_PROVIDER } = require(`../Common/Common/${chain}`);

	const quoterContractV1 = new ethers.Contract(quoterAddress, QuoterV1ABI, SCRIPT_PROVIDER);
	const quoterContractV2 = new ethers.Contract(quoterAddress, QuoterV2ABI, SCRIPT_PROVIDER);
	const quoterContractV3 = new ethers.Contract(quoterAddress, QuoterV3ABI, SCRIPT_PROVIDER);
	const quoterContractV4 = new ethers.Contract(quoterAddress, QuoterV4ABI, SCRIPT_PROVIDER);

	let isV1orV2;
	let isV3orV4;

	try {
		await quoterContractV3.WNativeToken();
		await quoterContractV4.WNativeToken();

		isV3orV4 = true;

		isV1orV2 = false;
	} catch (error) {
		isV3orV4 = false;

		isV1orV2 = true;
	}

	//
	//
	//

	if (isV3orV4 == true) {
		const projectPoolDataFile = JSON.parse(await fs.promises.readFile(path.join(`Scripts/Dex/PoolDatasV3/${chain}/${projectName}.json`), "utf-8"));

		if (projectPoolDataFile.length == 0) return 34;

		let firstPool = projectPoolDataFile[0];

		let index = 0;

		async function getFirstPool() {
			while (index < projectPoolDataFile.length) {
				const tokenOutContract = new ethers.Contract(firstPool.token1_address, ERC20.abi, SCRIPT_PROVIDER);

				const tokenOutBalance = await tokenOutContract.balanceOf(firstPool.pool_address);

				if (tokenOutBalance < 100n) {
					index += 1;

					firstPool = projectPoolDataFile[index];
				} else {
					return 100n;
				}
			}
		}

		const tokenOutBalance = await getFirstPool();

		try {
			await quoterContractV3.quoteExactOutputSingle.staticCallResult(firstPool.token0_address, firstPool.token1_address, tokenOutBalance, MIN_SQRT_RATIO + 1n);

			return 3;
		} catch (error1) {
			try {
				await quoterContractV3.quoteExactOutputSingle.staticCallResult(firstPool.token0_address, firstPool.token1_address, tokenOutBalance, MAX_SQRT_RATIO - 1n);

				return 3;
			} catch (error2) {
				return 4;
			}
		}
	}

	//
	//
	//

	if (isV1orV2 == true) {
		const projectPoolDataFile = JSON.parse(await fs.promises.readFile(path.join(`Scripts/Dex/PoolDatasV3/${chain}/${projectName}.json`), "utf-8"));

		if (projectPoolDataFile.length == 0) return 12;

		let firstPool = projectPoolDataFile[0];

		let index = 0;

		async function getFirstPool() {
			while (index < projectPoolDataFile.length) {
				const tokenOutContract = new ethers.Contract(firstPool.token1_address, ERC20.abi, SCRIPT_PROVIDER);

				const tokenOutBalance = await tokenOutContract.balanceOf(firstPool.pool_address);

				if (tokenOutBalance < 100n) {
					index += 1;

					firstPool = projectPoolDataFile[index];
				} else {
					return 100n;
				}
			}
		}

		const tokenOutBalance = await getFirstPool();

		try {
			await quoterContractV2.quoteExactOutputSingle.staticCallResult({
				tokenIn: firstPool.token0_address,
				tokenOut: firstPool.token1_address,
				amount: tokenOutBalance,
				fee: firstPool.pool_fee,
				sqrtPriceLimitX96: MIN_SQRT_RATIO + 1n,
			});

			return 2;
		} catch (error1) {
			try {
				await quoterContractV2.quoteExactOutputSingle.staticCallResult({
					tokenIn: firstPool.token0_address,
					tokenOut: firstPool.token1_address,
					amount: tokenOutBalance,
					fee: firstPool.pool_fee,
					sqrtPriceLimitX96: MAX_SQRT_RATIO - 1n,
				});

				return 2;
			} catch (error2) {
				return 1;
			}
		}
	}
}

QuoterVersionFinder();
