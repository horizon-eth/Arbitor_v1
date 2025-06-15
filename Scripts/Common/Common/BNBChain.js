const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 56;
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
const native_token_symbol = "BNB";
const native_token_address = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
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
	"Nomiswap(Stable)V2": {
		factoryAddress: ["0xC6B7ee49D386bAe4FD501F2d2f8d18828F1f6285"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BiswapV2: {
		factoryAddress: ["0x858E3312ed3A876947EA49d572A7C42DE08af7EE"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"PancakeswapV1(BSC)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"MDEX(BSC)V2": {
		factoryAddress: ["0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"UniswapV2(BSC)V2": {
		factoryAddress: ["0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"ApeSwap(BSC)V2": {
		factoryAddress: ["0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	THENAV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"AmpleSwap(BSC)V2": {
		factoryAddress: ["0x381fEfaDAB5466BFf0e8e96842e8e76A143E8F73"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Orion(BSC)V2": {
		factoryAddress: ["0xE52cCf7B6cE4817449F2E6fA7efD7B567803E4b4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ImpossibleFinanceV2: {
		factoryAddress: ["0x918d7e714243F7d9d463C37e106235dCde294ffC"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BakerySwapV2: {
		factoryAddress: ["0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	NomiswapV2: {
		factoryAddress: ["0xd6715A8be3944ec72738F0BFDC739d48C3c29349"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DinosaurEggsV2: {
		factoryAddress: ["0x73D9F93D53505cB8C4c7f952ae42450d9E859D10"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"DOOAR(BSC)V2": {
		factoryAddress: ["0x1e895bFe59E3A5103e8B7dA3897d1F2391476f3c"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Saitaswap(BSC)V2": {
		factoryAddress: ["0x6a6DeA0cd52689819eb3Bf2c15594Beafb646CB7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DefinixV2: {
		factoryAddress: ["0x43eBb0cb9bD53A3Ed928Dd662095aCE1cef92D19"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Fraxswap(BSC)V2": {
		factoryAddress: ["0xa007a9716dba05289df85A90d0Fd9D39BEE808dE"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	WaultFinanceV2: {
		factoryAddress: ["0xB42E3FE71b7E0673335b3331B3e1053BD9822570"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"ElkFinance(BSC)V2": {
		factoryAddress: ["0x31aFfd875e9f68cd6Cd12Cee8943566c9A4bBA13"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	JulSwapV2: {
		factoryAddress: ["0x553990F2CBA90272390f62C5BDb1681fFc899675"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MarsEcosystemV2: {
		factoryAddress: ["0x6f12482D9869303B998C54D91bCD8bCcba81f3bE"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	OrangeDXV2: {
		factoryAddress: ["0xFEf9d38f6105C6Df2ca4274507F62b44E1E06235"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Justmoney(BSC)V2": {
		factoryAddress: ["0xF2Fb1b5Be475E7E1b3C31082C958e781f73a1712"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"RadioShack(BSC)V2": {
		factoryAddress: ["0x98957ab49b8bc9f7ddbCfD8BcC83728085ecb238"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SWYCHV2: {
		factoryAddress: ["0x80f112CD8Ac529d6993090A0c9a04E01d495BfBf"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"LiquidusFinance(BSC)V2": {
		factoryAddress: ["0x80CEe6A5c97b1003f272ba8C759a7c17796C2Cdc"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	WinerySwapV2: {
		factoryAddress: ["0x79C342FddBBF376cA6B4EFAc7aaA457D6063F8Cb"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"InterCroneSwap(BSC)V2": {
		factoryAddress: ["0xFa51B0746eb96deBC619Fd2EA88d5D8B43BD8230"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	AutoSharkFinanceV2: {
		factoryAddress: ["0xe759Dd4B9f99392Be64f1050a6A8018f73B53a13"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PlanetFinanceV2: {
		factoryAddress: ["0xa053582601214FEb3778031a002135cbBB7DBa18"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Yoshi.exchange(BSC)V2": {
		factoryAddress: ["0x542b6524aBF0Bd47Dc191504E38400Ec14D0290C"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	KyotoSwapV2: {
		factoryAddress: ["0x1c3E50DBBCd05831c3A695d45D2b5bCD691AD8D8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	ConeExchangeV2: {
		factoryAddress: ["0x0EFc2D2D054383462F2cD72eA2526Ef7687E1016"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	LiquidCryptoV2: {
		factoryAddress: ["0x6D642253B6fD96d9D155279b57B8039675E49D8e"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"TraderJoe(BSC)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Jswap(BSC)V2": {
		factoryAddress: ["0xd654CbF99F2907F06c88399AE123606121247D5C"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DAOSwapV2: {
		factoryAddress: ["0x940BEb635cbEeC04720AC97FADb97205676e6aa4"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Firebird(BSC)V2": {
		factoryAddress: ["0x5De74546d3B86C8Df7FEEc30253865e1149818C8"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	NiobV2: {
		factoryAddress: ["0xe0636f192a88De6F1c9ed1a6A0F265C9775c8596"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"PYESwap(BSC)V2": {
		factoryAddress: ["0xb664BDCe35b5EE182e8832d4F3b615232e98a51E"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	StrongHandsDEXV2: {
		factoryAddress: ["0xE184a4047DF6d3Fb4AC962A4606D75F5e8e87094"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	VeplusV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MoonliftV2: {
		factoryAddress: ["0xe9cABbC746C03010020Fd093cD666e40823E0D87"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SphynxSwapV2: {
		factoryAddress: ["0x8BA1a4C24DE655136DEd68410e222cCA80d43444"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	W3SwapV2: {
		factoryAddress: ["0xD04A80baeeF12fD7b1D1ee6b1f8ad354f81bc4d7"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	PandoraDigitalSwapV2: {
		factoryAddress: ["0xFf9A4E72405Df3ca3D909523229677e6B2b8dC71"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DDDXV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"Archly(BSC)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	CorgiSwapV2: {
		factoryAddress: ["0x632F04bd6c9516246c2df373032ABb14159537cd"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HowSwapV2: {
		factoryAddress: ["0xF4866c04a88Cb593374865D73D7cF5B5B3A9c641"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"lif3(BSC)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"EmpireDEX(BSC)V2": {
		factoryAddress: ["0x06530550A48F990360DFD642d2132354A144F31d"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"SpiceTrade(BSC)V2": {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	CreamSwapV2: {
		factoryAddress: ["0x8cb25774298ff036A4849C5828b44F8D865e2B40"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"PipiSwap(BSC)V2": {
		factoryAddress: ["0xa08DAF7f1f4bC97fbD6e67B5E6Ff84f4d0F3868c"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MagicfoxV2: {
		factoryAddress: ["ERRORV2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HKSwapV2: {
		factoryAddress: ["0x510EDA2E4a6E559094E82AED878AeAD6C99345B1"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	"WokenExchange(BSC)V2": {
		factoryAddress: ["0x0Dee376e1DCB4DAE68837de8eE5aBE27e629Acd0"],
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
	UnchainXV3: {
		factoryAddress: ["0x82fA7b2Ce2A76C7888A9D3B0a81E0b2ecfd8d40c"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	THENAFUSIONV3: {
		factoryAddress: ["0x306F06C147f064A010530292A1EB6737c3e378e4"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	"Lif3V3(BSC)V3": {
		factoryAddress: ["0xc84ab9ABCCc3F35D5F8bDD328ed7e20Bc5b81ce4"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SquadSwapV3: {
		factoryAddress: ["0x009c4ef7C0e0Dd6bd1ea28417c01Ea16341367c3"],
		quoterAddress: "0x0000000000000000000000000000000000000000",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	"SMBSwapV3(BSC)V3": {
		factoryAddress: ["0xa9B5d4eAc94cB98117ABdcC0EcBD7731960F91D9"],
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

const UnchainXV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["UnchainXV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const THENAFUSIONV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["THENAFUSIONV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const Lif3V3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["Lif3V3(BSC)V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SquadSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SquadSwapV3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);
const SMBSwapV3_QuoterV4_Contract = new ethers.Contract(ProjectsV3["SMBSwapV3(BSC)V3"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	UnchainXV3: UnchainXV3_QuoterV4_Contract,
	THENAFUSIONV3: THENAFUSIONV3_QuoterV4_Contract,
	Lif3V3: Lif3V3_QuoterV4_Contract,
	SquadSwapV3: SquadSwapV3_QuoterV4_Contract,
	SMBSwapV3: SMBSwapV3_QuoterV4_Contract,
};

const QuoterVersionsV3 = {
	UnchainXV3: 0,
	THENAFUSIONV3: 0,
	"Lif3V3(BSC)V3": 0,
	SquadSwapV3: 0,
	"SMBSwapV3(BSC)V3": 0,
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
