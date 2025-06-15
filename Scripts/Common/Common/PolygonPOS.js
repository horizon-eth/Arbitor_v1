const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 137;
const FLASHSWAP_PROVIDER = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });
const SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_SCRIPT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });
const SECONDARY_SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });
const POOL_PROVIDER_V2 = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_V2_POOL_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });
const POOL_PROVIDER_V3 = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_V3_POOL_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });
// Providers

// Flash Swap Contract
const flashSwapAddress = JSON.parse(fs.readFileSync("Scripts/Resources/Deployments.json", "utf-8"))[chain];
const flashSwapContract = new ethers.Contract(flashSwapAddress, flashSwapABI.abi, FLASHSWAP_PROVIDER);
// Flash Swap Contract

// Signer
const Owner_Account = ethers.HDNodeWallet.fromPhrase(process.env.HOT_WALLET_PHRASE).connect(FLASHSWAP_PROVIDER);
// Signer

// ATF Address
const ATF_address = "0x0000000000000000000000000000000000000000";
// ATF Address

// Transaction Waiting Process
const confirmation = 2;
const blockTime = 60000;
// Transaction Waiting Process

// Creator Settings
const module_type = 1; // standart structure
const l2_fee_type = -1; // transactionFeeL2 is enabled
const l1_fee_type = -2; // getL1TransactionFee is disabled
const part10_type = 0; // transactionFeeL1 is disabled
// Creator Settings

// ^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^
// Stays Not Changed Part !!!
// Stays Not Changed Part !!!
// Stays Not Changed Part !!!

// **************************************************************************
// **************************************************************************
// **************************************************************************

// Creator Settings
const callback_type = 1;
const tx_type = 2;
// Creator Settings

// Conflict Tokens
const conflictTokens = [
	// "0xConflictToken",
];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "ETH";
const native_token_address = "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619";
const minimum_native_balance = ethers.parseEther("0.01");
const conversion_ether_amount = ethers.parseEther("0.0075");
// EtherConverter

// Minimum Profit Limits
const minimumEntranceProfit = 0.25;
const minimumVendableProfit = 0.25;
const minimumFlashSwapProfit = 0.25;
// Minimum Profit Limits

// *********
// ******************
// ****************** ProjectsV2 ******************
const ProjectsV2 = {
	"BalancerV2(Polygon)V2": {
		factoryAddress: ["0xBA12222222228d8Ba445958a75a0704d566BF2C8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"DOOAR(Polygon)V2": {
		factoryAddress: ["0xBdd46Fd173ad1d158578FEb5d10573BaF8ee89d2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiswapV2: {
		factoryAddress: ["0xc35DADB65012eC5796536bD9864eD8773aBc74C4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DfynV2: {
		factoryAddress: ["0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"ElkFinance(Polygon)V2": {
		factoryAddress: ["0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ComethSwapV2: {
		factoryAddress: ["0x800b052609c355cA8103E06F022aA30647eAd60a"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"CrowdSwap(Polygon)V2": {
		factoryAddress: ["0x14Fb5ABeA0578B37D9E1A831Bb7e77Bd3d7684a6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PolycatFinanceV2: {
		factoryAddress: ["0x477Ce834Ae6b7aB003cCe4BC4d8697763FF456FA"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"WaultFinance(Polygon)V2": {
		factoryAddress: ["0xa98ea6356A316b44Bf710D5f9b6b4eA0081409Ef"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Jetswap(Polygon)V2": {
		factoryAddress: ["0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"lif3(Polygon)V2": {
		factoryAddress: ["0x3FB1E7D5d9C974141A5B6E5fa4edab0a7Aa15C6A"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	GravityFinanceV2: {
		factoryAddress: ["0x3ed75AfF4094d2Aaa38FaFCa64EF1C152ec1Cf20"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"MMFinance(Polygon)V2": {
		factoryAddress: ["0x7cFB780010e9C861e03bCbC7AC12E013137D47A5"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	RadioShackV2: {
		factoryAddress: ["0xB581D0A3b7Ea5cDc029260e989f768Ae167Ef39B"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DystopiaV2: {
		factoryAddress: ["0x1d21Db6cde1b18c7E47B0F7F42f4b3F68b9beeC9"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DinoswapV2: {
		factoryAddress: ["0x624Ccf581371F8A4493e6AbDE46412002555A1b6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	NachoSwapV2: {
		factoryAddress: ["0x1B44bf43111A26206F9735319A0c438dd1c030b2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PearlFiV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Archly(Polygon)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	AuraSwapV2: {
		factoryAddress: ["0x015DE3ec460869eb5ceAe4224Dc7112ac0a39303"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SatinExchangeV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"PhenixFinance(Polygon)V2": {
		factoryAddress: ["0x9A3F01dfA086C2E234fC88742c692368438fBb30"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"SpiceTrade(Polygon)V2": {
		factoryAddress: ["0x9eF87bA6EEc990E44F1BB56676C65Fd8f5bb5770"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PurpleBridgeV2: {
		factoryAddress: ["0x9c9238b2E47D61482D36deaFcDCD448D8bAAd75b"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
};

const blockedProjectListV2 = [];
// ****************** ProjectsV2 ******************
// ******************
// *********

// +++++++++
// +++++++++++++++++
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
const ProjectsV3 = {
	UniswapV3: {
		factoryAddress: ["ERRORV3"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	RetroV3: {
		factoryAddress: ["0x91e1B99072f238352f59e58de875691e20Dc19c1"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
};

const blockedProjectListV3 = [];
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
// +++++++++++++++++
// +++++++++

// DELETED !!!!!
// DELETED !!!!!
// DELETED !!!!!
const { QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI } = require("../Global/Global");

const CONTRACT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });

const UniswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const RetroV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["RetroV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	UniswapV3: UniswapV3_QuoterV4_Contract,
	RetroV3: RetroV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	UniswapV3: 0,
	RetroV3: 0,
};
// DELETED !!!!!
// DELETED !!!!!
// DELETED !!!!!

module.exports = {
	tokens,

	chainID,
	FLASHSWAP_PROVIDER,
	SCRIPT_PROVIDER,
	SECONDARY_SCRIPT_PROVIDER,
	POOL_PROVIDER_V2,
	POOL_PROVIDER_V3,
	CONTRACT_PROVIDER,

	flashSwapAddress,
	flashSwapContract,
	Owner_Account,

	ATF_address,
	confirmation,
	blockTime,
	module_type,
	l2_fee_type,
	l1_fee_type,
	part10_type,
	callback_type,
	tx_type,

	conflictTokens,

	native_token_symbol,
	native_token_address,
	minimum_native_balance,
	conversion_ether_amount,

	minimumEntranceProfit,
	minimumVendableProfit,
	minimumFlashSwapProfit,

	ProjectsV2,
	ProjectsV3,

	blockedProjectListV2,
	blockedProjectListV3,

	QuotersV3,
	QuoterVersionsV3,
};
