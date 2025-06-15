const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 1;
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
const ATF_address = "0x518b63Da813D46556FEa041A88b52e3CAa8C16a8";
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
const tx_type = 2;
// Creator Settings

// Conflict Tokens
const conflictTokens = [
	// "0xConflictToken",
];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "ETH";
const native_token_address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
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
	BalancerV2: {
		factoryAddress: ["0x897888115Ada5773E02aA29F775430BFB5F34c51"],
		flashSwapFunctionSelector: "0x52bbbe29",
		comments: false,
		slippage: 0,
	},
	AntfarmV2: {
		factoryAddress: ["0xE48AEE124F9933661d4DD3Eb265fA9e153e32CBe"],
		flashSwapFunctionSelector: "0x6d9a640a",
		comments: false,
		slippage: 0,
	},
	// UniswapV2: {
	// 	factoryAddress: ["0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// EthervistaV2: {
	// 	factoryAddress: ["0x9a27cb5ae0B2cEe0bb71f9A85C0D60f3920757B4"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SushiSwapV2: {
	// 	factoryAddress: ["0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ShibaswapV2: {
	// 	factoryAddress: ["0x115934131916C8b277DD010Ee02de363c09d037c"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// FraxswapV2: {
	// 	factoryAddress: ["0xB076b06F669e682609fb4a8C6646D2619717Be4b"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// DefiSwapV2: {
	// 	factoryAddress: ["0x9DEB29c9a4c7A88a3C0257393b7f3335338D9A9D"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// x7FinanceV2: {
	// 	factoryAddress: ["0x7de800467aFcE442019884f51A4A1B9143a34fAc"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// PancakeswapV2: {
	// 	factoryAddress: ["0x1097053Fd2ea711dad45caCcc45EfF7548fCB362"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// DOOARV2: {
	// 	factoryAddress: ["0x1e895bFe59E3A5103e8B7dA3897d1F2391476f3c"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// "9inchV2": {
	// 	factoryAddress: ["0xcBAE5C3f8259181EB7E2309BC4c72fDF02dD56D8"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// VerseV2: {
	// 	factoryAddress: ["0xee3E9E46E34a27dC755a63e2849C9913Ee1A06E2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ConvergenceFinanceV2: {
	// 	factoryAddress: ["0x4eef5746ED22A2fD368629C1852365bf5dcb79f1"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// OrionV2: {
	// 	factoryAddress: ["0x5FA0060FcfEa35B31F7A5f6025F0fF399b98Edf1"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// WhiteswapV2: {
	// 	factoryAddress: ["0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SakeSwapV2: {
	// 	factoryAddress: ["0x75e48C954594d64ef9613AeEF97Ad85370F13807"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// RadioShackV2: {
	// 	factoryAddress: ["0x91fAe1bc94A9793708fbc66aDcb59087C46dEe10"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// StandardV2: {
	// 	factoryAddress: ["0x53AC1d1FA4F9F6c604B8B198cE29A50d28cbA893"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SolidlyV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// JustMoneyV2: {
	// 	factoryAddress: ["0xd36Aba9Ec96523b0A89886c76065852aDFE2Eb39"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SaitaswapV2: {
	// 	factoryAddress: ["0x25393bb68C89a894B5e20FA3fC3B3b34F843C672"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// PepedexV2: {
	// 	factoryAddress: ["0x460b2005b3318982feADA99f7ebF13e1D6f6eFfE"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ElkFinanceV2: {
	// 	factoryAddress: ["0x6511eBA915fC1b94b2364289CCa2b27AE5898d80"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ApeSwapV2: {
	// 	factoryAddress: ["0xBAe5dc9B19004883d0377419FeF3c2C8832d7d7B"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SwaprV2: {
	// 	factoryAddress: ["0xd34971BaB6E5E356fd250715F5dE0492BB070452"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
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
		factoryAddress: ["0x1F98431c8aD98523631AE4a59f267346ea31F984"],
		quoterAddress: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	PancakeswapV3: {
		factoryAddress: ["0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865"],
		quoterAddress: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiSwapV3: {
		factoryAddress: ["0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F"],
		quoterAddress: "0x64e8802FE490fa7cc61d3463958199161Bb608A7",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
};

const blockedProjectListV3 = ["SolidlyV3", "Lif3V3", "VVSV3", "WAGMIV3"];
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
// +++++++++++++++++
// +++++++++

// DELETED !!!!!
// DELETED !!!!!
// DELETED !!!!!
const { QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI } = require("../Global/Global");

const CONTRACT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(chainID) });

const UniswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const PancakeswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const SushiSwapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiSwapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	UniswapV3: UniswapV3_QuoterV2_Contract,
	PancakeswapV3: PancakeswapV3_QuoterV2_Contract,
	SushiSwapV3: SushiSwapV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	UniswapV3: 2,
	PancakeswapV3: 2,
	SushiSwapV3: 2,
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
