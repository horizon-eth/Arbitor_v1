const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 8453;
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
const native_token_address = "0x4200000000000000000000000000000000000006";
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
	SushiSwapV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	UniswapV2: {
		factoryAddress: ["0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	AerodromeV2: {
		factoryAddress: ["0x420DD381b31aEf6683db6B902084cB0FFECe40Da"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BalancerV2: {
		factoryAddress: ["0xBA12222222228d8Ba445958a75a0704d566BF2C8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	AlienBaseV2: {
		factoryAddress: ["0x3E84D913803b02A4a7f027165E8cA42C14C0FdE7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	EqualizerV2: {
		factoryAddress: ["0xEd8db60aCc29e14bC867a497D94ca6e3CeB5eC04"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BunnySwapV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DackieSwapV2: {
		factoryAddress: ["0x591f122D1df761E616c13d265006fcbf4c6d6551"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SoswapV2: {
		factoryAddress: ["0x539db2B4FE8016DB2594d7CfbeAb4d2B730b723E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SynthswapV2: {
		factoryAddress: ["0x4bd16d59A5E1E0DB903F724aa9d721a31d7D720D"],
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
	EtherVistaV2: {
		factoryAddress: ["0x9C9Dfc8b5D8F1cb1b7f854108Db16BE1C21ea400"],
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
		fee: 0.003,
	},
	CitadelSwapV2: {
		factoryAddress: ["0xbe720274c24b5Ec773559b8C7e28c2503DaC7645"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BluedexV2: {
		factoryAddress: ["0x8437100eD18dbea089e0FA3CaAae7f6f40e4A05C"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SatoriV2: {
		factoryAddress: ["0x4858C605862A91A34d83C19a9704f837f64fa405"],
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
	"Area51(AlienBase)V2": {
		factoryAddress: ["0x2d5dd5fa7B8a1BFBDbB0916B42280208Ee6DE51e"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LFGSwapV2: {
		factoryAddress: ["0xE5552e0318531F9Ec585c83bDc8956C08Bf74b71"],
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
	MoonBaseV2: {
		factoryAddress: ["0xe396465A85deDB00FA8774162B106833dE51Ea41"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	CloudBaseV2: {
		factoryAddress: ["0x0dcCfdF227c3f7b1E5d34B2488A7B0ca01d400a4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	OasisSwapV2: {
		factoryAddress: ["0xC8126578093366968199707B7f8eDFf258F473B6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	TorusV2: {
		factoryAddress: ["0x259b3217A01878ea9d64b45eE48231e660863ee7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PlantBaseSwapV2: {
		factoryAddress: ["0xA081Ce40F079A381b59893b4Dc0abf8B1817af70"],
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
	LeetswapV2: {
		factoryAddress: ["0x169C06b4cfB09bFD73A81e6f2Bb1eB514D75bB19"],
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
	UniswapV3: {
		factoryAddress: ["0x33128a8fC17869897dcE68Ed026d694621f6FDfD"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	PancakeswapV3: {
		factoryAddress: ["0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	BaseSwapV3: {
		factoryAddress: ["0x38015D05f4fEC8AFe15D7cc0386a126574e8077B"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiswapV3: {
		factoryAddress: ["0xc35DADB65012eC5796536bD9864eD8773aBc74C4"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SwapBasedV3: {
		factoryAddress: ["0xb5620F90e803C7F957A9EF351B8DB3C746021BEa"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DackieSwapV3: {
		factoryAddress: ["ERRORV3"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SolidlyV3: {
		factoryAddress: ["0x70Fe4a44EA505cFa3A57b95cF2862D4fd5F0f687"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SynthswapV3: {
		factoryAddress: ["0xa37359E63D1aa44C0ACb2a4605D3B45785C97eE3"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	BaseXV3: {
		factoryAddress: ["0xdC323d16C451819890805737997F4Ede96b95e3e"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	YumYumSwapV3: {
		factoryAddress: ["0xf6C96aC4251905572c7083B1804825850B9BC9e6"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DerpDEXV3: {
		factoryAddress: ["0xedDef4273518b137CDbcB3a7FA1C6a688303dFe2"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	ThroneV3: {
		factoryAddress: ["0xE8839bF8175812691c6578C0Fc80E721bC3e00fB"],
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

const UniswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const PancakeswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["PancakeswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const BaseSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["BaseSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SushiswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SushiswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SwapBasedV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SwapBasedV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const DackieSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["DackieSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SolidlyV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SolidlyV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SynthswapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SynthswapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const BaseXV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["BaseXV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const YumYumSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["YumYumSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const DerpDEXV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["DerpDEXV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const ThroneV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["ThroneV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	UniswapV3: UniswapV3_QuoterV4_Contract,
	PancakeswapV3: PancakeswapV3_QuoterV4_Contract,
	BaseSwapV3: BaseSwapV3_QuoterV4_Contract,
	SushiswapV3: SushiswapV3_QuoterV4_Contract,
	SwapBasedV3: SwapBasedV3_QuoterV4_Contract,
	DackieSwapV3: DackieSwapV3_QuoterV4_Contract,
	SolidlyV3: SolidlyV3_QuoterV4_Contract,
	SynthswapV3: SynthswapV3_QuoterV4_Contract,
	BaseXV3: BaseXV3_QuoterV4_Contract,
	YumYumSwapV3: YumYumSwapV3_QuoterV4_Contract,
	DerpDEXV3: DerpDEXV3_QuoterV4_Contract,
	ThroneV3: ThroneV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	UniswapV3: 0,
	PancakeswapV3: 0,
	BaseSwapV3: 0,
	SushiswapV3: 0,
	SwapBasedV3: 0,
	DackieSwapV3: 0,
	SolidlyV3: 0,
	SynthswapV3: 0,
	BaseXV3: 0,
	YumYumSwapV3: 0,
	DerpDEXV3: 0,
	ThroneV3: 0,
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
