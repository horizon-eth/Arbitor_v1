const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 59144;
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
const conflictTokens = [];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "ETH";
const native_token_address = "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f";
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
		factoryAddress: ["0xecD30C099c222AbffDaf3E2A3d2455FC8e8c739E"],
		swap0in: "0xa9d9db4d",
		swap1in: "0x53d56bf5",
		comments: false,
		slippage: 0,
	},
	NILEV2: {
		factoryAddress: ["0xAAA16c016BF556fcD620328f0759252E29b1AB57"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LeetSwapV2: {
		factoryAddress: ["0xa2899c776bAAF9925d432F83C950D5054A6CF59C"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ElkFinanceV2: {
		factoryAddress: ["0xfbb4E52FEcc90924c79F980eb24a9794ae4aFFA4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LynexV2: {
		factoryAddress: ["0xBc7695Fd00E3b32D08124b7a4287493aEE99f9ee"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SectaFinanceV2: {
		factoryAddress: ["0x8Ad39bf99765E24012A28bEb0d444DE612903C43"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	EchoDEXV2: {
		factoryAddress: ["0x6D1063F2187442Cc9adbFAD2f55A96B846FCB399"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiSwapV2: {
		factoryAddress: ["0xFbc12984689e5f15626Bad03Ad60160Fe98B303C"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PancakeswapV2: {
		factoryAddress: ["0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.0025,
	},
	SatoriV2: {
		factoryAddress: ["0xfF5859B60BCb3F153431cA216B1b269EB66A2020"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PheasantswapV2: {
		factoryAddress: ["0x7bf960B15Cbd9976042257Be3F6Bb2361E107384"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LineHubV2: {
		factoryAddress: ["0x7811DeF28977060784cC509641f2DD23584b7671"],
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
	DackieSwapV2: {
		factoryAddress: ["0x9790713770039CeFcf4FAaf076E2846c9B7a4630"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
};

const blockedProjectListV2 = ["ChimpExchangeV2"];
// ****************** ProjectsV2 ******************
// ******************
// *********

// +++++++++
// +++++++++++++++++
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
const ProjectsV3 = {
	NILEV3: {
		factoryAddress: ["0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"],
		quoterAddress: "0xAAAEA10b0e6FBe566FE27c3A023DC5D8cA6Bca3d",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	LynexV3: {
		factoryAddress: ["0x622b2c98123D303ae067DB4925CD6282B3A08D0F"],
		quoterAddress: "0xcE829655b864E56fc34B783874cf9590053A0640",
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
	OkuTradeV3: {
		factoryAddress: ["0x31FAfd4889FA1269F7a13A66eE0fB458f27D72A9"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0xc35DADB65012eC5796536bD9864eD8773aBc74C4"],
		quoterAddress: "0xFB7eF66a7e61224DD6FcD0D7d9C3be5C8B049b9f",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SectaFinanceV3: {
		factoryAddress: ["0x9BD425a416A276C72a13c13bBd8145272680Cf07"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	LineHubV3: {
		factoryAddress: ["0x6c379d538F2F7cb642851e154A8E572D63238DF4"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	MetavaultV3: {
		factoryAddress: ["0x9367c561915f9D062aFE3b57B18e30dEC62b8488"],
		quoterAddress: "0x63A8A929fA175667832329dee1Bc4c4922AfFe6d",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	EchoDexV3: {
		factoryAddress: ["0x559Fa53Be355835a038aC303A750E8788668636B"],
		quoterAddress: "0xb8c4C88adb2f09D2CCF3Bd9DD3495B231354c787",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	ElkFinanceV3: {
		factoryAddress: ["0xC05A5aA56DF0Dc97D6B9849A06627a079790014f"],
		quoterAddress: "0xC4b501cf8f974B7e2AeF41B8cF252d5B77cC0e20",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DackieSwapV3: {
		factoryAddress: ["0xc6255ec7CDb11C890d02EBfE77825976457B2470"],
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

const NILEV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["NILEV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const LynexV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["LynexV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const PancakeswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const MetavaultV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["MetavaultV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const EchoDexV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["EchoDexV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const ElkFinanceV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["ElkFinanceV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	NILEV3: NILEV3_QuoterV2_Contract,
	LynexV3: LynexV3_QuoterV4_Contract,
	PancakeswapV3: PancakeswapV3_QuoterV2_Contract,
	SushiswapV3: SushiswapV3_QuoterV2_Contract,
	MetavaultV3: MetavaultV3_QuoterV2_Contract,
	EchoDexV3: EchoDexV3_QuoterV2_Contract,
	ElkFinanceV3: ElkFinanceV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	PancakeswapV3: 2,
	SushiswapV3: 2,
	EchoDexV3: 2,
	NILEV3: 2,
	MetavaultV3: 2,
	ElkFinanceV3: 2,
	LynexV3: 4,
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
