const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 534352;
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
const native_token_address = "0x5300000000000000000000000000000000000004";
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
	TokanExchangeV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SpaceFiV2: {
		factoryAddress: ["0x6cC370Ed99f1C11e7AC439F845d0BA6aed55cf50"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SkydromeV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ZProtocolV2: {
		factoryAddress: ["0xED93e976d43AF67Cc05aa9f6Ab3D2234358F0C81"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ZebraV2: {
		factoryAddress: ["0xa63eb44c67813cad20A9aE654641ddc918412941"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiSwapV2: {
		factoryAddress: ["0xB45e53277a7e0F1D35f2a77160e91e25507f1763"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ScrollSwapV2: {
		factoryAddress: ["0x0082123Cf29a85f48Cd977D3000aec145A3B452F"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PunkSwapV2: {
		factoryAddress: ["0x5640113EA7F369E6DAFbe54cBb1406E5BF153E90"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PapyrusSwapV2: {
		factoryAddress: ["0xD5f3D3fb72210bfe71a59c05e0b8D72973baa2a6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ZadaFinanceV2: {
		factoryAddress: ["0x113260531ecd733584B93A3Fb256fD69a3D40163"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	QuillSwapV2: {
		factoryAddress: ["0xab8aEfe85faD683A6bDE16EeD04C3420C713324b"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MetavaultV2: {
		factoryAddress: ["0xCc570Ec20eCB62cd9589FA33724514BDBc98DC7E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SanctuaryV2: {
		factoryAddress: ["0xAD71e466d6E9c5CbAC804dBF60dE2543d58B4b5B"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	IcecreamswapV2: {
		factoryAddress: ["0x9E6d21E759A7A288b80eef94E4737D313D31c13f"],
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
	NuriV2V3: {
		factoryAddress: ["0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	ZebraV2V3: {
		factoryAddress: ["0x96a7F53f7636c93735bf85dE416A4Ace94B56Bd9"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiSwapV3: {
		factoryAddress: ["0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	OkuTradeV3: {
		factoryAddress: ["0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	ScribeV3: {
		factoryAddress: ["0xDc62aCDF75cc7EA4D93C69B2866d9642E79d5e2e"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	MetavaultV3: {
		factoryAddress: ["0x9367c561915f9D062aFE3b57B18e30dEC62b8488"],
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

const NuriV2V3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["NuriV2V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const ZebraV2V3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["ZebraV2V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SushiSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SushiSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const OkuTradeV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["OkuTradeV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const ScribeV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["ScribeV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const MetavaultV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["MetavaultV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	NuriV2V3: NuriV2V3_QuoterV4_Contract,
	ZebraV2V3: ZebraV2V3_QuoterV4_Contract,
	SushiSwapV3: SushiSwapV3_QuoterV4_Contract,
	OkuTradeV3: OkuTradeV3_QuoterV4_Contract,
	ScribeV3: ScribeV3_QuoterV4_Contract,
	MetavaultV3: MetavaultV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	NuriV2V3: 0,
	ZebraV2V3: 0,
	SushiSwapV3: 0,
	OkuTradeV3: 0,
	ScribeV3: 0,
	MetavaultV3: 0,
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
