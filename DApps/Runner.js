const { fs, path, http, chains, FeeDataServerPort, PythServerPort, CoinMarketCapServerPort, StateV2ServerPort, StateV3ServerPort } = require("../Scripts/Common/Global/Global");

const { XUniswapV2 } = require("./XUniswapV2");
const { XDysonFinanceV2 } = require("./XDysonFinanceV2");

async function Runner() {
	for (const chain of chains) {
		// if (chain !== "PolygonzkEVM") continue;
		if (chain !== "Linea") continue;

		const reserves = JSON.parse(await fs.promises.readFile(path.join(__dirname, `../Scripts/Reserves/${chain}.json`)));

		for (const projectName in reserves) {
			if (projectName !== "DysonFinanceV2") continue;
			// if (projectName !== "FlashLiquidityV2") continue;
			// if (projectName !== "PancakeSwapV2") continue;
			// if (projectName !== "zkEVMSwapV2") continue;

			const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			for (const poolName in reserves[projectName]) {
				if (poolName !== "USDC_WETH_POOL") continue;
				// if (poolName !== "WETH_USDC_POOL") continue;
				// if (poolName !== "USDT_MATIC_POOL") continue;
				// if (poolName !== "MATIC_USDC_POOL") continue;

				const pool = poolsData.find((executionPool) => executionPool.pool_address == reserves[projectName][poolName].address);

				// await XUniswapV2(chain, projectName, poolName, pool, reserves[projectName][poolName]);

				try {
					await XDysonFinanceV2(chain, projectName, poolName, pool, reserves[projectName][poolName]);
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
}

Runner();
