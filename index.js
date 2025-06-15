const { spawn: nodeSpawn } = require("child_process");

const scripts = [
	// Global -- 6
	"Scripts/ProviderChanger/ProviderChanger.js",
	"Scripts/Oracle/Pyth/Pyth.js",
	"Scripts/MarketPrices/CoinMarketCap.js",
	"Scripts/FeeData/FeeData.js",
	// "Scripts/EtherConverter/EtherConverter.js",
	// Global

	// // PolygonzkEVM -- 6
	"DApps/PolygonzkEVM/V2/AntfarmV2.js",
	// "DApps/PolygonzkEVM/V2/BalancerV2.js",
	"DApps/PolygonzkEVM/V2/DysonFinanceV2.js",
	"DApps/PolygonzkEVM/V2/FlashLiquidityV2.js",
	"DApps/PolygonzkEVM/V2/PancakeSwapV2.js",
	"DApps/PolygonzkEVM/V2/SushiSwapV2.js",
	// "DApps/PolygonzkEVM/V2/LeetSwapV2.js",
	"DApps/PolygonzkEVM/V2/ZkEVMSwapV2.js",
	// PolygonzkEVM

	// Linea -- 10
	"DApps/Linea/V2/DysonFinanceV2.js",
	// "DApps/Linea/V2/EchoDexV2.js",
	// "DApps/Linea/V2/ElkFinanceV2.js",
	// "DApps/Linea/V2/LeetSwapV2.js",
	// "DApps/Linea/V2/LineHubV2.js",
	// "DApps/Linea/V2/LynexV2.js",
	// "DApps/Linea/V2/MetaVaultV2.js",
	// "DApps/Linea/V2/NileV2.js",
	// "DApps/Linea/V2/PancakeSwapV2.js",
	// "DApps/Linea/V2/PheasantswapV2.js",
	// "DApps/Linea/V2/SatoriV2.js",
	// "DApps/Linea/V2/SectaFinanceV2.js",
	// "DApps/Linea/V2/SushiSwapV2.js",
	// Linea

	// Blast -- 12
	"DApps/Blast/V2/DysonFinanceV2.js",
	// Blast

	// XLayer -- 6
	"DApps/XLayer/V2/DysonFinanceV2.js",
	// XLayer

	// Avalanche
	// "DApps/Avalanche/V2/AntfarmV2.js",
	// "DApps/Avalanche/V2/BalancerV2.js",
	// Avalanche

	// Arbitrum
	// "DApps/Arbitrum/V2/AntfarmV2.js",
	// "DApps/Arbitrum/V2/BalancerV2.js",
	// Arbitrum

	// Fraxtal
	// "DApps/Fraxtal/V2/BalancerV2.js",
	// "DApps/Fraxtal/V2/FraxswapV2.js",
	// "DApps/Fraxtal/V2/RaExchangeV2.js",
	// Fraxtal

	// Ethereum
	// "DApps/Ethereum/V2/AntfarmV2.js",
	// "DApps/Ethereum/V2/BalancerV2.js",
	// Ethereum
];

function spawn(command, args) {
	// For Windows, add options to prevent new console window
	const options = process.platform === "win32" ? { stdio: "pipe", windowsHide: true, detached: false } : { stdio: "pipe" };

	return nodeSpawn(command, args, options);
}

async function startScript(script) {
	const process = spawn("node", [script]);

	process.stdout.on("data", (data) => {
		console.log(`${script}: ${data}`);
	});

	process.stderr.on("data", (data) => {
		console.error(`${script}: ${data}`);
	});

	process.on("error", async (err) => {
		console.error(`${script} encountered an error: ${err.message}`);
		console.log(`Restarting ${script}...`);
		process.kill();
		await startScript(script); // Restart the script
	});

	process.on("close", async (code) => {
		console.log(`${script} exited with code ${code}. Restarting...`);
		await startScript(script); // Restart the script
	});
}

async function run() {
	for (const script of scripts) {
		await startScript(script);
	}
}

run();
