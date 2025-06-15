const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 196;
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
const tx_type = 0;
// Creator Settings

// Conflict Tokens
const conflictTokens = [];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "OKB";
const native_token_address = "0xe538905cf8410324e03a5a23c1c177a474d59b2b";
const minimum_native_balance = 500000000000000000n;
const conversion_ether_amount = 100000000000000000n;
// EtherConverter

// Minimum Profit Limits
const minimumEntranceProfit = 0.15;
const minimumVendableProfit = 0.15;
const minimumFlashSwapProfit = 0.15;
// Minimum Profit Limits

// *********
// ******************
// ****************** ProjectsV2 ******************
const ProjectsV2 = {
	DysonFinanceV2: {
		factoryAddress: ["0x51A0D4B81400581d8722627daFCd0c1Ff9357d1D"],
		swap0in: "0xa9d9db4d",
		swap1in: "0x53d56bf5",
		comments: false,
		slippage: 0,
	},
	PotatoSwapV2: {
		factoryAddress: ["0x630DB8E822805c82Ca40a54daE02dd5aC31f7fcF"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	RevoswapV2: {
		factoryAddress: ["0xa38498983e7b31DE851e36090bc9D1D8fB96BE5E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	StationDEXV2: {
		factoryAddress: ["0xF7c16c5C5AF8838A884cF409543fdBE4Abd3D81d"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	TitanDEXV2: {
		factoryAddress: ["0x232962D7831eB6BE5f595a35C2041B0868f65334"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DackieSwapV2: {
		factoryAddress: ["0x757cD583004400ee67e5cC3c7A60C6a62E3F6d30"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DyorSwapV2: {
		factoryAddress: ["0x2CcaDb1e437AA9cDc741574bDa154686B1F04C09"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
};

const blockedProjectListV2 = ["Abstradex(XLayer)V2"];
// ****************** ProjectsV2 ******************
// ******************
// *********

// +++++++++
// +++++++++++++++++
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
const ProjectsV3 = {
	QuickSwapV3: {
		factoryAddress: ["0xd2480162Aa7F02Ead7BF4C127465446150D58452"],
		quoterAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	StationDEXV3: {
		factoryAddress: ["0xA7c6d971586573CBa1870b9b6A281bb0d5f853bC"],
		quoterAddress: "0xAe676a7Bdfc5E7Cb63dE7c514AeeC61B5c5dC9F9",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DackieSwapV3: {
		factoryAddress: ["0xc6f3966E5D08Ced98aC30f8B65BeAB5882Be54C7"],
		quoterAddress: "0xc2BC7A73613B9bD5F373FE10B55C59a69F4D617B",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	RevoswapV3: {
		factoryAddress: ["0x47CdeCafBA3960588d79a328c725c3529d4eC081"],
		quoterAddress: "0xQuoterAddress",
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

const QuickSwapV3_QuoterV3_Contract = new ethers.Contract(ProjectsV3["QuickSwapV3"].quoterAddress, QuoterV3ABI, CONTRACT_PROVIDER);
const StationDEXV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["StationDEXV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const DackieSwapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["DackieSwapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	QuickSwapV3: QuickSwapV3_QuoterV3_Contract,
	StationDEXV3: StationDEXV3_QuoterV2_Contract,
	DackieSwapV3: DackieSwapV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	QuickSwapV3: 3,
	StationDEXV3: 2,
	DackieSwapV3: 2,
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
