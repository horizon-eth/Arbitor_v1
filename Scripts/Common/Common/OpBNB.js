const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 204;
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
const native_token_symbol = "bnb";
const native_token_address = "0x4200000000000000000000000000000000000006";
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
	"PancakeswapV2(opBnb)V2": {
		factoryAddress: ["0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Thena(opBnb)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	CUBISwapV2: {
		factoryAddress: ["0xE6c8488a3078f474D0B75E4ac06a369e3Fb39d76"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BinarySwapV2: {
		factoryAddress: ["0xd50aaE6C73E2486B0Da718D23F35Dcf5aad25911"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"AllInXSwap(opBnb)V2": {
		factoryAddress: ["0xAFcA85A70Bd1C2Bf98DB7F24b2380134F76Af7f1"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PixelSwapV2: {
		factoryAddress: ["0xD07739a9E9C46D3DedeD97c0edC49cea8BAB1Bb9"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LuigiswapV2: {
		factoryAddress: ["0x0dAe6d22182c20AB9150a4DCB3160591Dc41027a"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	FourdexV2: {
		factoryAddress: ["0x0f93649C2BA0F64fA939eCe899f1afD0b15C7Bd2"],
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
	PancakeswapV3: {
		factoryAddress: ["0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	"DerpDex(opBnb)V3": {
		factoryAddress: ["0xb91331Ea9539ee881e3A45191076c454E482dAc7"],
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

const PancakeswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const DerpDexV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["DerpDex(opBnb)V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	PancakeswapV3: PancakeswapV3_QuoterV4_Contract,
	DerpDexV3: DerpDexV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	PancakeswapV3: 0,
	"DerpDex(opBnb)V3": 0,
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
