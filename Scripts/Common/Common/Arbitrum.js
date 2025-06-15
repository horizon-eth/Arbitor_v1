const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 42161;
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
const ATF_address = "0xFB9fbcB328317123f5275CDA30b6589d5841216B";
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
const native_token_symbol = "ETH";
const native_token_address = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const minimum_native_balance = 10000000000000000n;
const conversion_ether_amount = 7500000000000000n;
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
		factoryAddress: ["0xc7E5ED1054A24Ef31D827E6F86caA58B3Bc168d7"],
		flashSwapFunctionSelector: "0x52bbbe29",
		comments: false,
		slippage: 0,
	},
	AntfarmV2: {
		factoryAddress: ["0x61f4ECD130291e5D5D7809A112f9F9081b8Ed3A5"],
		flashSwapFunctionSelector: "0x6d9a640a",
		comments: false,
		slippage: 0,
	},
	// CamelotV2: {
	// 	factoryAddress: ["0x6EcCab422D763aC031210895C81787E87B43A652"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SushiSwapV2: {
	// 	factoryAddress: ["0xc35DADB65012eC5796536bD9864eD8773aBc74C4"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// DeltaswapV2: {
	// 	factoryAddress: ["0xCb85E1222f715a81b8edaeB73b28182fa37cffA8"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// UniswapV2: {
	// 	factoryAddress: ["0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// RamsesV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SpartaDEXV2: {
	// 	factoryAddress: ["0xFe8EC10Fe07A6a6f4A2584f8cD9FE232930eAF55"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// FraxswapV2: {
	// 	factoryAddress: ["0x8374A74A728f06bEa6B7259C68AA7BBB732bfeaD"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// GasXV2: {
	// 	factoryAddress: ["0x7e299DdF7E12663570dBfA8F3F20CB54f8fD04fA"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// dexSWAPV2: {
	// 	factoryAddress: ["0x3E40739d8478c58f9B973266974C58998D4F9e8b"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// PancakeswapV2: {
	// 	factoryAddress: ["0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// MagicswapV2: {
	// 	factoryAddress: ["0x015e379Ce0Ff195228b3A9eBDFA13F9afC155Dd7"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SolidLizardV2: {
	// 	factoryAddress: ["0x734d84631f00dC0d3FCD18b04b6cf42BFd407074"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SwaprV2: {
	// 	factoryAddress: ["0x359F20Ad0F42D75a5077e65F30274cABe6f4F01a"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ChronosV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// "Arbswap(ArbitrumOne)V2": {
	// 	factoryAddress: ["0xd394E9CC20f43d2651293756F8D320668E850F1b"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ElkFinanceV2: {
	// 	factoryAddress: ["0xA59B2044EAFD15ee4deF138D410d764c9023E1F0"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// LFGswapV2: {
	// 	factoryAddress: ["0xE5552e0318531F9Ec585c83bDc8956C08Bf74b71"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ZyberswapV2: {
	// 	factoryAddress: ["0xaC2ee06A14c52570Ef3B9812Ed240BCe359772e7"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// MMFinanceV2: {
	// 	factoryAddress: ["0xfe3699303D3Eb460638e8aDA2bf1cFf092C33F22"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SterlingV2: {
	// 	factoryAddress: ["0xF7A23B9A9dCB8d0aff67012565C5844C20C11AFC"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ArbidexV2: {
	// 	factoryAddress: ["0x1C6E968f2E6c9DEC61DB874E28589fd5CE3E1f2c"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// ApeswapV2: {
	// 	factoryAddress: ["0xCf083Be4164828f00cAE704EC15a36D711491284"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// OreoSwapV2: {
	// 	factoryAddress: ["0x20fAfD2B0Ba599416D75Eb54f48cda9812964f46"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// OasisSwapV2: {
	// 	factoryAddress: ["0x947D83b35Cd2e71df4aC7B359C6761B07d0bce19"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SoluneaV2: {
	// 	factoryAddress: ["0x6EF065573Cd3fff4c375d4D36E6ca93CD6e3d499"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// MoonbaseAlphaV2: {
	// 	factoryAddress: ["0x44B678F32a2f6aBB72eeFA2df58f12D17c3eD403"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// WokenExchangeV2: {
	// 	factoryAddress: ["0x0Dee376e1DCB4DAE68837de8eE5aBE27e629Acd0"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// KaleidoSwapV2: {
	// 	factoryAddress: ["0x427a733Bd14a949eA771a558f6934bB0004c0c4E"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SwapFishV2: {
	// 	factoryAddress: ["0x71539D09D3890195dDa87A6198B98B75211b72F3"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// AuragiV2: {
	// 	factoryAddress: ["ERRORV2"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// MindgamesV2: {
	// 	factoryAddress: ["0x7C7F1c8E2b38d4C06218565BC4C9D8231b0628c0"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// AegisV2: {
	// 	factoryAddress: ["0xF51d966Dc5596f56434F76311cd9563c352d8939"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SharkySwapV2: {
	// 	factoryAddress: ["0x36800286f652dDC9bDcFfEDc4e71FDd207C1d07C"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// "3xcaliburV2": {
	// 	factoryAddress: ["0xD158bd9E8b6efd3ca76830B66715Aa2b7Bad2218"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// AlienFiV2: {
	// 	factoryAddress: ["0xac9d019B7c8B7a4bbAC64b2Dbf6791ED672ba98B"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// SwaprumV2: {
	// 	factoryAddress: ["0xD757C986a28F82761Fe874Bc40073718dC1e980C"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// WhiteholeV2: {
	// 	factoryAddress: ["0xf7304B14036118dE12DbAb3c36b201A587990e75"],
	// 	flashSwapFunctionSelector: "0x022c0d9f",
	// 	comments: false,
	// 	slippage: 0,
	// 	fee: 0.003,
	// },
	// KEWLSwapV2: {
	// 	factoryAddress: ["0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0"],
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
	CamelotV3: {
		factoryAddress: ["0x1a3c9B1d2F0529D97f2afC5136Cc23e58f1FD35B"],
		quoterAddress: "0x0Fc73040b26E9bC8514fA028D998E73A254Fa76E",
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
	RamsesV2V3: {
		factoryAddress: ["0xAA2cd7477c451E703f3B9Ba5663334914763edF8"],
		quoterAddress: "0xAA20EFF7ad2F523590dE6c04918DaAE0904E3b20",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e"],
		quoterAddress: "0x0524E833cCD057e4d7A296e3aaAb9f7675964Ce1",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	// SolidlyV3: {
	// 	factoryAddress: ["0x70Fe4a44EA505cFa3A57b95cF2862D4fd5F0f687"],
	// 	quoterAddress: "0x0000000000000000000000000000000000000000",
	// 	flashSwapFunctionSelector: "0x128acb08",
	// 	comments: false,
	// 	slippage: 0,
	// },
	// DackieSwapV3: {
	// 	factoryAddress: ["0xaEdc38bD52b0380b2Af4980948925734fD54FbF4"],
	// 	quoterAddress: "0x0000000000000000000000000000000000000000",
	// 	flashSwapFunctionSelector: "0x128acb08",
	// 	comments: false,
	// 	slippage: 0,
	// },
	// ArbidexV3: {
	// 	factoryAddress: ["0x855F2c70cf5cb1D56C15ed309a4DfEfb88ED909E"],
	// 	quoterAddress: "0x0000000000000000000000000000000000000000",
	// 	flashSwapFunctionSelector: "0x128acb08",
	// 	comments: false,
	// 	slippage: 0,
	// },
	// MMFinanceV3: {
	// 	factoryAddress: ["0x947bc57CEFDd22420C9a6d61387FE4D4cf8A090d"],
	// 	quoterAddress: "0x0000000000000000000000000000000000000000",
	// 	flashSwapFunctionSelector: "0x128acb08",
	// 	comments: false,
	// 	slippage: 0,
	// },
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

const UniswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const CamelotV3_QuoterV3_Contract = new ethers.Contract(ProjectsV3["CamelotV3"].quoterAddress, QuoterV3ABI, CONTRACT_PROVIDER);
const PancakeswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const RamsesV2V3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["RamsesV2V3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	UniswapV3: UniswapV3_QuoterV2_Contract,
	CamelotV3: CamelotV3_QuoterV3_Contract,
	PancakeswapV3: PancakeswapV3_QuoterV2_Contract,
	RamsesV2V3: RamsesV2V3_QuoterV2_Contract,
	SushiswapV3: SushiswapV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	UniswapV3: 2,
	CamelotV3: 3,
	PancakeswapV3: 2,
	RamsesV2V3: 2,
	SushiswapV3: 2,
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
