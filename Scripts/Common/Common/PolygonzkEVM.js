const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 1101;
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
const ATF_address = "0x40DF0C3BBAAE5Ea3A509d8F2aa9E086776C98E6c";
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
const callback_type = 0;
const tx_type = 0;
// Creator Settings

// Conflict Tokens
const conflictTokens = ["0x37eAA0eF3549a5Bb7D431be78a3D99BD360d19e5", "0x744C5860ba161b5316F7E80D9Ec415e2727e5bD5", "0x5D8cfF95D7A57c0BF50B30b43c7CC0D52825D4a9"];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "eth";
const native_token_address = "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9";
const minimum_native_balance = 10000000000000000n;
const conversion_ether_amount = 7500000000000000n;
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
	BalancerV2: {
		factoryAddress: ["0x03F3Fb107e74F2EAC9358862E91ad3c692712054"],
		flashSwapFunctionSelector: "0x52bbbe29",
		comments: false,
		slippage: 0,
	},
	AntfarmV2: {
		factoryAddress: ["0x8aF94528FBE3c4C148523E7aAD48BcEbcC0A71d7"],
		flashSwapFunctionSelector: "0x6d9a640a",
		comments: false,
		slippage: 0,
	},
	ClipperV2: {
		factoryAddress: ["0x0000000000000000000000000000000000000000"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: true,
		slippage: 0,
		fee: 0,
	},
	PancakeswapV2: {
		factoryAddress: ["0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.0025,
	},
	ZkEVMSwapV2: {
		factoryAddress: ["0x213c25900f365F1BE338Df478CD82beF7Fd43F85"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	FlashLiquidityV2: {
		factoryAddress: ["0x6e553d5f028bD747a27E138FA3109570081A23aE"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiSwapV2: {
		factoryAddress: ["0xb45e53277a7e0f1d35f2a77160e91e25507f1763"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LeetSwapV2: {
		factoryAddress: ["0xa2899c776baaf9925d432f83c950d5054a6cf59c"],
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
		quoterAddress: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
		flashSwapFunctionSelector: "0x128acb08",
		comments: true,
		slippage: 0,
	},
	QuickswapV3: {
		factoryAddress: ["0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57"],
		quoterAddress: "0x55BeE1bD3Eb9986f6d2d963278de09eE92a3eF1D",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	QuickswapUniV3: {
		factoryAddress: ["0xD9a2AD9E927Bd7014116CC5c7328f028D4318178"],
		quoterAddress: "0xB18FB423Fb241CE0DE345d74904f97D60792FFd8",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DoveSwapV3: {
		factoryAddress: ["0xdE474Db1Fa59898BC91314328D29507AcD0D593c"],
		quoterAddress: "0x3F886B1274bB2ec14e0543c51fe0F9b73C975219",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"],
		quoterAddress: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
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

const PancakeswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const QuickswapV3_QuoterV3_Contract = new ethers.Contract(ProjectsV3["QuickswapV3"].quoterAddress, QuoterV3ABI, CONTRACT_PROVIDER);
const QuickswapUniV3_QuoterV1_Contract = new ethers.Contract(ProjectsV3["QuickswapUniV3"].quoterAddress, QuoterV1ABI, CONTRACT_PROVIDER);
const DoveSwapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["DoveSwapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	PancakeswapV3: PancakeswapV3_QuoterV2_Contract,
	QuickswapV3: QuickswapV3_QuoterV3_Contract,
	QuickswapUniV3: QuickswapUniV3_QuoterV1_Contract,
	DoveSwapV3: DoveSwapV3_QuoterV2_Contract,
	SushiswapV3: SushiswapV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	QuickswapUniV3: 1,
	PancakeswapV3: 2,
	DoveSwapV3: 2,
	SushiswapV3: 2,
	QuickswapV3: 3,
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
