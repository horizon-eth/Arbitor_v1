const {
	ethers,
	ethersV5,
	fs,
	path,
	encoder,
	ERC20,
	Q96,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	FeeDataServerPort,
	QuoterV2ABI,
	MAX_SQRT_RATIO,
	MIN_SQRT_RATIO,
	incrementRateV3,
} = require("../../../Scripts/Common/Global/Global");

const chain = path.basename(path.dirname(path.dirname(__filename)));

const {
	confirmation,
	blockTime,
	Interval,

	chainID,
	FLASHSWAP_PROVIDER,
	POOL_PROVIDER_V2,
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
} = require(`../../../Scripts/Common/Common/${chain}`);

const GlobalLibrary = require("../../../Scripts/Library/GlobalLibrary");
const LibraryV2 = require("../../../Scripts/Library/LibraryV2");
const LibraryV3 = require("../../../Scripts/Library/LibraryV3");

const projectName = path.basename(__filename, ".js");
const project = ProjectsV3[projectName];
const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../../Scripts/Dex/PoolDatasV3/${chain}/${projectName}.json`), "utf8"));
const poolABI = require(path.join(__dirname, `../../../Scripts/Dex/PoolABIsV3/UniswapV3PoolABI.json`));

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V3_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let USDT_WETH_0_0001_POOL = {
	address: "0x337AF062CE32bB423010415196E315c4154D36C3",
	https_contract: new ethers.Contract("0x337AF062CE32bB423010415196E315c4154D36C3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let USDT_WETH_0_0005_POOL = {
	address: "0x4A080D9488cE2C8258185d78852275D6d3c2820c",
	https_contract: new ethers.Contract("0x4A080D9488cE2C8258185d78852275D6d3c2820c", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let USDT_WETH_0_0025_POOL = {
	address: "0xc8742BC59AA168118F7d056400c4c370246de542",
	https_contract: new ethers.Contract("0xc8742BC59AA168118F7d056400c4c370246de542", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let USDT_WETH_0_01_POOL = {
	address: "0xF9d73C67fB502E98Ff3Bb8Dbf57aF63491a0e439",
	https_contract: new ethers.Contract("0xF9d73C67fB502E98Ff3Bb8Dbf57aF63491a0e439", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let USDT_MATIC_0_0001_POOL = {
	address: "0x893C031AE19097688Db592CA77fcc71a38346F8C",
	https_contract: new ethers.Contract("0x893C031AE19097688Db592CA77fcc71a38346F8C", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let USDT_MATIC_0_0025_POOL = {
	address: "0x411A3De77Ce5C81f771614C1793098769d3D1D8A",
	https_contract: new ethers.Contract("0x411A3De77Ce5C81f771614C1793098769d3D1D8A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let USDT_USDC_0_0001_POOL = {
	address: "0xca06375be938a2d6eF311dfaFab7E326d55D23Cc",
	https_contract: new ethers.Contract("0xca06375be938a2d6eF311dfaFab7E326d55D23Cc", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let USDT_USDC_0_0005_POOL = {
	address: "0xB91CeC385c698cBC2a802d9F661341836939692f",
	https_contract: new ethers.Contract("0xB91CeC385c698cBC2a802d9F661341836939692f", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let USDT_DAI_0_01_POOL = {
	address: "0xD68F984770736e73181B92cbf839F0F9e565D95a",
	https_contract: new ethers.Contract("0xD68F984770736e73181B92cbf839F0F9e565D95a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let USDT_USDC_CFT_0_0005_POOL = {
	address: "0x2E8eFeF372DCB753b2991f224120445eDaA186e0",
	https_contract: new ethers.Contract("0x2E8eFeF372DCB753b2991f224120445eDaA186e0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let USDT_USDC_CFT_0_01_POOL = {
	address: "0x0b0347E65B4B30E85C8110fda4E86Cc1EB63A7C2",
	https_contract: new ethers.Contract("0x0b0347E65B4B30E85C8110fda4E86Cc1EB63A7C2", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let CAKE_USDT_0_01_POOL = {
	address: "0x77665D6fE54Cb47E3dd04A76BF9D4EB637F0D67d",
	https_contract: new ethers.Contract("0x77665D6fE54Cb47E3dd04A76BF9D4EB637F0D67d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let WETH_MATIC_0_0005_POOL = {
	address: "0x7a816241EdaF060e33b774D6D3D6398485dFf9AF",
	https_contract: new ethers.Contract("0x7a816241EdaF060e33b774D6D3D6398485dFf9AF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let WETH_MATIC_0_0025_POOL = {
	address: "0xaE30fcdEE41dC9eC265e841D8185d055B87d1B7a",
	https_contract: new ethers.Contract("0xaE30fcdEE41dC9eC265e841D8185d055B87d1B7a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let WETH_USDC_0_0001_POOL = {
	address: "0x9f37552b87b68E7F169c442D595c1Be7A0F03b92",
	https_contract: new ethers.Contract("0x9f37552b87b68E7F169c442D595c1Be7A0F03b92", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_USDC_0_0005_POOL = {
	address: "0xD43b9dCbB61e6ccFbCFef9f21e1BB5064F1CB33f",
	https_contract: new ethers.Contract("0xD43b9dCbB61e6ccFbCFef9f21e1BB5064F1CB33f", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let WETH_USDC_0_0025_POOL = {
	address: "0x4641377ba87c2640B4f8D2EEcCE1F5c20048f7ed",
	https_contract: new ethers.Contract("0x4641377ba87c2640B4f8D2EEcCE1F5c20048f7ed", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let WETH_USDC_0_01_POOL = {
	address: "0x43b0599BaFCafe014A97b07e5342F47C0b50CBf3",
	https_contract: new ethers.Contract("0x43b0599BaFCafe014A97b07e5342F47C0b50CBf3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let WETH_DAI_0_0025_POOL = {
	address: "0x8Ebc143FB436dcD9bDFcb6B50d909F632dd12Ca4",
	https_contract: new ethers.Contract("0x8Ebc143FB436dcD9bDFcb6B50d909F632dd12Ca4", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let WETH_WBTC_0_0001_POOL = {
	address: "0xb5d9E1622BFA6Efb3FB50c0bDc6a0EE2b2d046fA",
	https_contract: new ethers.Contract("0xb5d9E1622BFA6Efb3FB50c0bDc6a0EE2b2d046fA", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_WBTC_0_0005_POOL = {
	address: "0xf1e501f74Ed9dc619be53Fddb698c94AbF9D56B6",
	https_contract: new ethers.Contract("0xf1e501f74Ed9dc619be53Fddb698c94AbF9D56B6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let WETH_WBTC_0_0025_POOL = {
	address: "0x2376fC177F2Ac738D6Be5Aba3bd911DF502AD53F",
	https_contract: new ethers.Contract("0x2376fC177F2Ac738D6Be5Aba3bd911DF502AD53F", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let USDC_CFT_WETH_0_0001_POOL = {
	address: "0x462f40F6426F90993caC0E240E7980c9Ef8b32B0",
	https_contract: new ethers.Contract("0x462f40F6426F90993caC0E240E7980c9Ef8b32B0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_RETH_0_0001_POOL = {
	address: "0x66f1320E9f77C6036a39C884E7fDC63F88e39E50",
	https_contract: new ethers.Contract("0x66f1320E9f77C6036a39C884E7fDC63F88e39E50", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_RETH_0_0005_POOL = {
	address: "0x2e780D6666C2C44754a0cA7A8e2Ed97506B47751",
	https_contract: new ethers.Contract("0x2e780D6666C2C44754a0cA7A8e2Ed97506B47751", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let CAKE_WETH_0_0025_POOL = {
	address: "0x58684788c718D0CfeC837ff65ADDA6C8721FE1e9",
	https_contract: new ethers.Contract("0x58684788c718D0CfeC837ff65ADDA6C8721FE1e9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let CAKE_WETH_0_01_POOL = {
	address: "0x3Fa1c450f3842C1252e4cB443e3F435b41D6f472",
	https_contract: new ethers.Contract("0x3Fa1c450f3842C1252e4cB443e3F435b41D6f472", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let WETH_WSTETH_CFT_0_0001_POOL = {
	address: "0xE0a5B3A014084B7E0fF6526986497629AEE16533",
	https_contract: new ethers.Contract("0xE0a5B3A014084B7E0fF6526986497629AEE16533", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_WSTETH_CFT_0_0005_POOL = {
	address: "0x3752BDb9215A2C0609d71407b50A528e1C6ECaBD",
	https_contract: new ethers.Contract("0x3752BDb9215A2C0609d71407b50A528e1C6ECaBD", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let WETH_RSETH_0_0001_POOL = {
	address: "0xbAABf57B49eaa079523b29EC9D25879D82D17Dc6",
	https_contract: new ethers.Contract("0xbAABf57B49eaa079523b29EC9D25879D82D17Dc6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let WETH_RSETH_0_0005_POOL = {
	address: "0x435564Fb7E82daB83B2733D6Bc1fDB8B5a732DE8",
	https_contract: new ethers.Contract("0x435564Fb7E82daB83B2733D6Bc1fDB8B5a732DE8", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let MATIC_USDC_0_0025_POOL = {
	address: "0xFfDb00470ADda49f0eCf893b9160f35EFB79418A",
	https_contract: new ethers.Contract("0xFfDb00470ADda49f0eCf893b9160f35EFB79418A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let MATIC_GRAI_0_0025_POOL = {
	address: "0x942568C0F1216cC4B01d1fCEF8B87Ce4a5986234",
	https_contract: new ethers.Contract("0x942568C0F1216cC4B01d1fCEF8B87Ce4a5986234", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let USDC_DAI_0_0001_POOL = {
	address: "0x9Bc342259cCEdA0487E70b71A3161F002a95F0e8",
	https_contract: new ethers.Contract("0x9Bc342259cCEdA0487E70b71A3161F002a95F0e8", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let USDC_CFT_USDC_0_0001_POOL = {
	address: "0x849c0ae884bFDc14DDdeB7Cae95494f368414855",
	https_contract: new ethers.Contract("0x849c0ae884bFDc14DDdeB7Cae95494f368414855", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 1,
	feePips: 100,
	processing: false,
};

let CAKE_USDC_0_0025_POOL = {
	address: "0x2D2D6C2429721E6a31d986C2c866a724D6ea4e68",
	https_contract: new ethers.Contract("0x2D2D6C2429721E6a31d986C2c866a724D6ea4e68", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let CAKE_USDC_0_01_POOL = {
	address: "0xb4BAB40e5a869eF1b5ff440a170A57d9feb228e9",
	https_contract: new ethers.Contract("0xb4BAB40e5a869eF1b5ff440a170A57d9feb228e9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 200,
	feePips: 10000,
	processing: false,
};

let USDC_GRAI_0_0005_POOL = {
	address: "0x39aCc7cf02af19A1eB0e3628bA0F5C48f44beBF3",
	https_contract: new ethers.Contract("0x39aCc7cf02af19A1eB0e3628bA0F5C48f44beBF3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let DUSD_USDC_0_0005_POOL = {
	address: "0x65E003Ac1682cFF56B4a187E7cf90DdBeD736aF0",
	https_contract: new ethers.Contract("0x65E003Ac1682cFF56B4a187E7cf90DdBeD736aF0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let DYSN_USDC_0_0025_POOL = {
	address: "0x7aC3D204C17Cf57C0e0f9bc5D11cd51c967ba1F9",
	https_contract: new ethers.Contract("0x7aC3D204C17Cf57C0e0f9bc5D11cd51c967ba1F9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 50,
	feePips: 2500,
	processing: false,
};

let USDC_CFT_GRAI_0_0005_POOL = {
	address: "0x160f3d3af6A2ECe5274AfD0925137e0387BAA5F2",
	https_contract: new ethers.Contract("0x160f3d3af6A2ECe5274AfD0925137e0387BAA5F2", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

let WSTETH_CFT_RETH_0_0005_POOL = {
	address: "0xf142d852c9c805e419399c9B3Ce2A8485F950BBf",
	https_contract: new ethers.Contract("0xf142d852c9c805e419399c9B3Ce2A8485F950BBf", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	sqrtPriceX96: undefined,
	tick: undefined,
	liquidity: undefined,
	tickSpacing: 10,
	feePips: 500,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.sqrtPriceX96 == undefined || pool.tick == undefined || pool.liquidity == undefined || pool.sqrtPriceX96 <= 0n || pool.liquidity <= 0n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, pool_fee, pool_tick_spacing, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find(
		(executionPool) => executionPool.pool_address == pool.address
	);

	pool.feePips = BigInt(pool_fee);
	pool.tickSpacing = BigInt(pool_tick_spacing);

	const token0_Pool_Price = await LibraryV3.calculatePoolPriceOfTokenWithSqrtPriceX96(pool.sqrtPriceX96, true, token0_decimal, token1_decimal);

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

	let targetSqrtPriceX96 = Math.sqrt(token0_Market_Price / token1_Market_Price) * Number(Q96);

	if (token0_decimal > token1_decimal) targetSqrtPriceX96 /= ZeroToOne ? 10 ** tokenOut_decimal : 10 ** tokenIn_decimal;
	if (token0_decimal < token1_decimal) targetSqrtPriceX96 *= ZeroToOne ? 10 ** tokenIn_decimal : 10 ** tokenOut_decimal;

	console.log("pool_fee", pool_fee);
	console.log("pool token0_symbol", token0_symbol);
	console.log("pool token1_symbol", token1_symbol);

	console.log("pool sqrtPriceX96 ", pool.sqrtPriceX96);
	console.log("targetSqrtPriceX96", BigInt(targetSqrtPriceX96));

	console.log("ZeroToOne", ZeroToOne);

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
							`ZeroToOne === True
						-- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
						-- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
						-- entranceProfit = ${entranceProfit}$`
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
							`ZeroToOne === False
						-- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
						-- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
						-- entranceProfit = ${entranceProfit}$`
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

		// ****
		// ****
		amountOutMin = QuoterExactOutput.amountOut;
		// ****
		// ****

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

	if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit < minimumEntranceProfit) {
		pool.processing = false;

		return;
	}

	await GlobalLibrary.saveProfitToJson(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const vendablePoolsV3 = await GlobalLibrary.getVendablePools(chain, "3", pool.address, tokenIn_address, tokenOut_address);

	async function getOptimalInput() {
		if (vendablePoolsV3.length == 0) return [null, null, null, null];

		let flashPool;
		let zeroForOne;
		let sqrtPriceLimitX96;
		let optimalInput = Infinity;

		const StateV3 = JSON.parse(fs.readFileSync(`Scripts/StateV3/${chain}.json`, "utf8"));

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
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V3`);
		console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V3`);
		console.log(`${ethers.formatUnits(optimalInput, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V3`);
		console.log(`tokenRevenue ${tokenRevenue} ${tokenOut_symbol}`);
		console.log("entranceProfit", entranceProfit);
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

	const swapData = project.flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, ZeroToOne, amountIn, BigInt(targetSqrtPriceX96), "0x"]).slice(2);

	const callback = encoder.encode(
		["address", "address", "address", "bytes", "address", "uint256"],
		[pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]
	);

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
		gasPrice: (FeeData[chain].gasPrice * 2).toString(),
		// gasPrice: FeeData[chain].gasPrice,
		// nonce: await Owner_Account.getNonce(),
	};

	const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * 2) / 10 ** 18) * (await GlobalLibrary.getMarketPriceBatch(["ETH"]));

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
			console.log(error, "ERRRRRRRRRRRRRRRRRR");

			return;

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

		console.log("PASSEDDD");

		return;

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
	const StateV3 = JSON.parse(fs.readFileSync(`Scripts/StateV3/${chain}.json`, "utf8"));

	let ok = false;

	for (const stateProjectName in StateV3) if (StateV3[stateProjectName] == projectName) ok = true;

	if (ok == false) StateV3[projectName] = {};

	for (const pool of poolsData) {
		let object_name = `${pool.token0_symbol}_${pool.token1_symbol}_POOL`;

		if (pool.pool_fee !== undefined) object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

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

	fs.writeFileSync(`Scripts/StateV3/${chain}.json`, JSON.stringify(StateV3, null, 2));
}

async function Listen() {
	async function re_initialize() {
		for (const pool of poolsData) {
			const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

			const pool_object = eval(object_name);

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V3_WSS_POOL_PROVIDER_URL);

			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

			global[object_name] = pool_object;
		}
	}

	async function addListeners() {
		for (const pool of poolsData) {
			const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

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

					const StateV3 = JSON.parse(fs.readFileSync(`Scripts/StateV3/${chain}.json`, "utf8"));

					StateV3[projectName][object_name].sqrtPriceX96 = pool_object.sqrtPriceX96.toString();
					StateV3[projectName][object_name].tick = pool_object.tick.toString();
					StateV3[projectName][object_name].liquidity = pool_object.liquidity.toString();

					fs.writeFileSync(`Scripts/StateV3/${chain}.json`, JSON.stringify(StateV3, null, 2));

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

async function Callee() {
	for (const pool of poolsData) {
		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${(pool.pool_fee / 1000000).toString().replace(".", "_")}_POOL`;

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

// Initializer().then(() => {
// 	Listen().then(() => {
// 		setInterval(Callee, Interval);
// 		// Callee();
// 	});
// });

// Initializer().then(() => {
// 	Callee();
// });

Callee();
