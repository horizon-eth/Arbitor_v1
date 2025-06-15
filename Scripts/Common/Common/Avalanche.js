const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 43114;
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
const ATF_address = "0x8aF94528FBE3c4C148523E7aAD48BcEbcC0A71d7";
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
const conflictTokens = [];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "AVAX";
const native_token_address = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
const minimum_native_balance = 1000000000000000000n;
const conversion_ether_amount = 500000000000000000n;
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
		factoryAddress: ["0x230a59F4d9ADc147480f03B0D3fFfeCd56c3289a"],
		flashSwapFunctionSelector: "0x52bbbe29",
		comments: false,
		slippage: 0,
	},
	AntfarmV2: {
		factoryAddress: ["0xDC0BD72CdeF330786BF6f331a6Aca539c0bb4EaB"],
		flashSwapFunctionSelector: "0x6d9a640a",
		comments: false,
		slippage: 0,
	},
	// PangolinV2: {
	// 	factoryAddress: ["0xefa94DE7a4656D787667C749f7E1223D71E9FD88"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// PharaohExchangeV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// FraxswapV2: {
	// 	factoryAddress: ["0xf77ca9B635898980fb219b4F4605C50e4ba58afF"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// VaporDexV2: {
	// 	factoryAddress: ["0xC009a670E2B02e21E7e75AE98e254F467f7ae257"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ElkFinanceV2: {
	// 	factoryAddress: ["0x091d35d7F63487909C863001ddCA481c6De47091"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// FWXV2: {
	// 	factoryAddress: ["0x2131Bdb0E0B451BC1C5A53F2cBC80B16D43634Fa"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SushiswapV2: {
	// 	factoryAddress: ["0xc35DADB65012eC5796536bD9864eD8773aBc74C4"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// LydiaFinanceV2: {
	// 	factoryAddress: ["0xe0C1bb6DF4851feEEdc3E14Bd509FEAF428f7655"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// HurricaneSwapV2: {
	// 	factoryAddress: ["0x7009b3619d5ee60d0665BA27Cf85eDF95fd8Ad01"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// CanaryExchangeV2: {
	// 	factoryAddress: ["0xCFBA329d49C24b70F3a8b9CC0853493d4645436b"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// RadioShackV2: {
	// 	factoryAddress: ["0xA0FbfDa09B8815Dd42dDC70E4f9fe794257CD9B6"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// PyreSwapV2: {
	// 	factoryAddress: ["0x045D720873f0260e23DA812501a7c5930E510aA4"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// HakuSwapV2: {
	// 	factoryAddress: ["0x2Db46fEB38C57a6621BCa4d97820e1fc1de40f41"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SwapsicleV2: {
	// 	factoryAddress: ["0x9C60C867cE07a3c403E2598388673C10259EC768"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SoulswapV2: {
	// 	factoryAddress: ["0x5BB2a9984de4a69c05c996F7EF09597Ac8c9D63a"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// YetiSwapV2: {
	// 	factoryAddress: ["0x58C8CD291Fa36130119E6dEb9E520fbb6AcA1c3a"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ThorusV2: {
	// 	factoryAddress: ["0xa98ea6356A316b44Bf710D5f9b6b4eA0081409Ef"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// UniswapV2: {
	// 	factoryAddress: ["0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// HunnySwapV2: {
	// 	factoryAddress: ["0x0c6A0061F9D0afB30152b8761a273786e51bec6d"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SoliSnekV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// GlacierV2: {
	// 	factoryAddress: ["0xaC7B7EaC8310170109301034b8FdB75eCa4CC491"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// FlairDexV2: {
	// 	factoryAddress: ["0x634e02EB048eb1B5bDDc0CFdC20D34503E9B362d"],
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
	PharaohExchangeV3: {
		factoryAddress: ["0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42"],
		quoterAddress: "0xAAAEA10b0e6FBe566FE27c3A023DC5D8cA6Bca3d",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	UniswapV3: {
		factoryAddress: ["0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD"],
		quoterAddress: "0xbe0F5544EC67e9B3b2D979aaA43f18Fd87E6257F",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	VaporDEXV2V3: {
		factoryAddress: ["0x62B672E531f8c11391019F6fba0b8B6143504169"],
		quoterAddress: "0xC8C97D11184069CdD2dfE85f097c607ed3272572",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0x3e603C14aF37EBdaD31709C4f848Fc6aD5BEc715"],
		quoterAddress: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
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

const PharaohExchangeV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["PharaohExchangeV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const UniswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const VaporDEXV2V3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["VaporDEXV2V3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const ElkFinanceV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["ElkFinanceV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	PharaohExchangeV3: PharaohExchangeV3_QuoterV2_Contract,
	UniswapV3: UniswapV3_QuoterV2_Contract,
	VaporDEXV2V3: VaporDEXV2V3_QuoterV2_Contract,
	SushiswapV3: SushiswapV3_QuoterV2_Contract,
	ElkFinanceV3: ElkFinanceV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	PharaohExchangeV3: 2,
	UniswapV3: 2,
	VaporDEXV2V3: 2,
	SushiswapV3: 2,
	ElkFinanceV3: 2,
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
