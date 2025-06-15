const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 250;
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
const native_token_symbol = "FTM";
const native_token_address = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
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
	EqualizerV2: {
		factoryAddress: ["0xc6366EFD0AF1d09171fe0EBF32c7943BB310832a"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SpookySwapV2: {
		factoryAddress: ["0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BeethovenXV2: {
		factoryAddress: ["0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	FraxswapV2: {
		factoryAddress: ["0xF55C563148cA0c0F1626834ec1B8651844D76792"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SpiritSwapV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	TombSwapV2: {
		factoryAddress: ["0xE236f6890F1824fa0a7ffc39b1597A5A6077Cfe9"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	VelocimeterV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DegenExpressV2: {
		factoryAddress: ["0x1C2Aa07EF924616042DD5FA4b0b48CB2e725BFb1"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ElkFinanceV2: {
		factoryAddress: ["0x7Ba73c99e6f01a37f3e33854c8F544BbbadD3420"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PyreSwapV2: {
		factoryAddress: ["0x045D720873f0260e23DA812501a7c5930E510aA4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SoulSwapV2: {
		factoryAddress: ["0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Yoshi.exchangeV2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SolidlyV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ProtoFiV2: {
		factoryAddress: ["0x39720E5Fe53BEEeb9De4759cb91d8E7d42c17b76"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PaintSwapV2: {
		factoryAddress: ["0x733A9D1585f2d14c77b49d39BC7d7dd14CdA4aa5"],
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
	DarkKnightV2: {
		factoryAddress: ["0x7d82F56ea0820A9d42b01C3C28F1997721732218"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ExcaliburV2: {
		factoryAddress: ["0x08b3CCa975a82cFA6f912E0eeDdE53A629770D3f"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HyperJumpV2: {
		factoryAddress: ["0x991152411A7B5A14A8CF0cDDE8439435328070dF"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MemeboxV2: {
		factoryAddress: ["0x079463f811e6EB2E226908E79144CDDB59a7fB71"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	JetswapV2: {
		factoryAddress: ["0xf6488205957f0b4497053d6422F49e27944eE3Dd"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	FbombFinanceV2: {
		factoryAddress: ["0xD9473A05b2edf4f614593bA5D1dBd3021d8e0Ebe"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	WingSwapV2: {
		factoryAddress: ["0xc0719a9A35a2D9eBBFdf1C6d383a5E8E7b2ef7a8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	RedemptionV2: {
		factoryAddress: ["0xa2dF50d1401afF182D19Bb41d76cf35953942c51"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MagikSwapV2: {
		factoryAddress: ["0x349D953cA03C9D63c040d463545E21Fe4b713C2e"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DfynV2: {
		factoryAddress: ["0xd9820a17053d6314B20642E465a84Bf01a3D64f5"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	RadioShackV2: {
		factoryAddress: ["0x5eF0153590D4a762F129dCf3c59186D91365e4e1"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Archly(FTM)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SkullSwapV2: {
		factoryAddress: ["0x67BDF64a26A6B08f003580873448346c1C8bA93c"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	FirebirdV2: {
		factoryAddress: ["0xc7A50FE12C864963Ea5A5E0858a0E7Abe5b875c4"],
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
	SolidlyV3: {
		factoryAddress: ["0x70Fe4a44EA505cFa3A57b95cF2862D4fd5F0f687"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SpookySwapV3: {
		factoryAddress: ["0x7928a2c48754501f3a8064765ECaE541daE5c3E6"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0x7770978eED668a3ba661d51a773d3a992Fc9DDCB"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	Lif3V3: {
		factoryAddress: ["0x5Af34712aE630b7754764a81D815A56963e6214a"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SkeletonFinanceV3: {
		factoryAddress: ["0x650b8F4869B57Ba90E107ff6a33aE97D4bC2Fdb2"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	WAGMIV3: {
		factoryAddress: ["0xaf20f5f19698f1D19351028cd7103B63D30DE7d7"],
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

const SolidlyV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SolidlyV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SpookySwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SpookySwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const Lif3V3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["Lif3V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SkeletonFinanceV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SkeletonFinanceV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const WAGMIV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["WAGMIV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	SolidlyV3: SolidlyV3_QuoterV4_Contract,
	SpookySwapV3: SpookySwapV3_QuoterV4_Contract,
	SushiswapV3: SushiswapV3_QuoterV4_Contract,
	Lif3V3: Lif3V3_QuoterV4_Contract,
	SkeletonFinanceV3: SkeletonFinanceV3_QuoterV4_Contract,
	WAGMIV3: WAGMIV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	SolidlyV3: 0,
	SpookySwapV3: 0,
	SushiswapV3: 0,
	Lif3V3: 0,
	SkeletonFinanceV3: 0,
	WAGMIV3: 0,
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
