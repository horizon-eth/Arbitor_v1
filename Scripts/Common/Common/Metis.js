const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 1088;
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
const native_token_symbol = "METIS";
const native_token_address = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000";
const minimum_native_balance = ethers.parseEther("undefined");
const conversion_ether_amount = ethers.parseEther("undefined");
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
	NetswapV2: {
		factoryAddress: ["0x70f51d68D16e8f9e418441280342BD43AC9Dff9f"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HerculesV2: {
		factoryAddress: ["0xF38E7c7f8eA779e8A193B61f9155E6650CbAE095"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	TethysV2: {
		factoryAddress: ["0x2CdFB20205701FF01689461610C9F321D1d00F80"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	StandardV2: {
		factoryAddress: ["0xFA68bAAdBDCf014fA20bD1A4542967AE40Ddca53"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HyperJumpV2: {
		factoryAddress: ["0xAA1504c878B158906B78A471fD6bDbf328688aeB"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiSwapV2: {
		factoryAddress: ["0x580ED43F3BBa06555785C81c2957efCCa71f7483"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ArchlyV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	AgoraSwapV2: {
		factoryAddress: ["0x3c4063B964B1b3bF229315fCc4df61a694B0aE84"],
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
	HerculesV3: {
		factoryAddress: ["0xC5BfA92f27dF36d268422EE314a1387bB5ffB06A"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	WAGMIV3: {
		factoryAddress: ["0x8112E18a34b63964388a3B2984037d6a2EFE5B8A"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiSwapV3: {
		factoryAddress: ["0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F"],
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

const HerculesV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["HerculesV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const WAGMIV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["WAGMIV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SushiSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SushiSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	HerculesV3: HerculesV3_QuoterV4_Contract,
	WAGMIV3: WAGMIV3_QuoterV4_Contract,
	SushiSwapV3: SushiSwapV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	HerculesV3: 0,
	WAGMIV3: 0,
	SushiSwapV3: 0,
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
