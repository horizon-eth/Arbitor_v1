const { ethers, fs, path, flashSwapABI } = require("../Global/Global");

const chain = path.basename(__filename, ".js");

// Tokens
const tokens = require(`../../Tokens/${chain}.json`);
// Tokens

// Providers
const chainID = 81457;
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
const conflictTokens = ["0x4fEE793d435c6D2c10C135983BB9d6D4fC7B9BBd"];
// Conflict Tokens

// EtherConverter
const native_token_symbol = "ETH";
const native_token_address = "0x4300000000000000000000000000000000000004";
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
	DysonFinanceV2: {
		factoryAddress: ["0x51A0D4B81400581d8722627daFCd0c1Ff9357d1D"],
		swap0in: "0xa9d9db4d",
		swap1in: "0x53d56bf5",
		comments: false,
		slippage: 0,
	},
	RingProtocolV2: {
		factoryAddress: ["0x24F5Ac9A706De0cF795A8193F6AB3966B14ECfE6"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BlasterswapV2: {
		factoryAddress: ["0x9CC1599D4378Ea41d444642D18AA9Be44f709ffD"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BladeSwapV2: {
		factoryAddress: ["0x75cB3eC310d3D1E22637F79D61eab5D9aBCD68BD"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SwapBlastV2: {
		factoryAddress: ["0x04C9f118d21e8B767D2e50C946f0cC9F6C367300"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DYORSwapV2: {
		factoryAddress: ["0xA1da7a7eB5A858da410dE8FBC5092c2079B58413"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	SushiSwapV2: {
		factoryAddress: ["0x42Fa929fc636e657AC568C0b5Cf38E203b67aC2b"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	UniswapV2: {
		factoryAddress: ["0x5C346464d33F90bABaf70dB6388507CC889C1070"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	MonoSwapV2: {
		factoryAddress: ["0xE27cb06A15230A7480d02956a3521E78C5bFD2D0"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	HyperBlastV2: {
		factoryAddress: ["0xD97fFc2041a8aB8f6bc4aeE7eE8ECA485381D088"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	CyberblastV2: {
		factoryAddress: ["0x32132625Cd02988Fb105FbbD3138bD383df3aF65"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BitdexV2: {
		factoryAddress: ["0x08938EE323c6da637eFf60E854812C16249d4485"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	DackieSwapV2: {
		factoryAddress: ["0xF5190E64dB4cbf7ee5E72B55cC5b2297e20264c2"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
	BlastDexV2: {
		factoryAddress: ["0x66346aac17d0e61156AC5F2A934ccF2a9BDe4c65"],
		flashSwapFunctionSelector: "0x022c0d9f",
		comments: false,
		slippage: 0,
		fee: 0.003,
	},
};

const blockedProjectListV2 = ["ThrusterV2(0.3%FeeTier)V2", "ThrusterV2(1.0%FeeTier)V2", "BladeSwap(Deprecatedsoon)V2", "ArchlyV2"];
// ****************** ProjectsV2 ******************
// ******************
// *********

// +++++++++
// +++++++++++++++++
// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
const ProjectsV3 = {
	ThrusterV3: {
		factoryAddress: ["0x71b08f13B3c3aF35aAdEb3949AFEb1ded1016127"],
		quoterAddress: "0x3b299f65b47c0bfAEFf715Bc73077ba7A0a685bE",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	// FenixFinanceV3: {
	// 	factoryAddress: ["0x7a44CD060afC1B6F4c80A2B9b37f4473E74E25Df"],
	// 	quoterAddress: "0x94Ca5B835186A37A99776780BF976fAB81D84ED8",
	// 	flashSwapFunctionSelector: "0x128acb08",
	// 	comments: false,
	// 	slippage: 0,
	// },
	BlasterswapV3: {
		factoryAddress: ["0x1A8027625C830aAC43aD82a3f7cD6D5fdCE89d78"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	UniswapV3: {
		factoryAddress: ["0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd"],
		quoterAddress: "0x6Cdcd65e03c1CEc3730AeeCd45bc140D57A25C77",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	MonoSwapV3: {
		factoryAddress: ["0x48d0F09710794313f33619c95147F34458BF7C3b"],
		quoterAddress: "0x29eb40F0A3522C2Baf4346803dA3a4d617bA7C96",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	RogueXProtocolV3: {
		factoryAddress: ["0x5B0b4b97edb7377888E2c37268c46E28f5BD81d0"],
		quoterAddress: "0xE8480B6bF4d0b5B2BE95cc41eCC14a98d528215b",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	CyberblastV3: {
		factoryAddress: ["0x57eF21959CF9536483bA6ddB10Ad73E2a06b85ff"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	SushiSwapV3: {
		factoryAddress: ["0x7680D4B43f3d1d54d6cfEeB2169463bFa7a6cf0d"],
		quoterAddress: "0xD93a91442Afd80243cF12f7110f48aB276fFf33F",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	DackieSwapV3: {
		factoryAddress: ["0xd1575B2e0C82fba9Eddc3de9c9AAF923AFA670cC"],
		quoterAddress: "0xQuoterAddress",
		flashSwapFunctionSelector: "0x128acb08",
		comments: false,
		slippage: 0,
	},
	BlasterDEXV3: {
		factoryAddress: ["0x9792FaeA53Af241bCE57C7C8D6622d5DaAD0D4Fc"],
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

const ThrusterV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["ThrusterV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
// const FenixFinanceV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["FenixFinanceV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const UniswapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["UniswapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const MonoSwapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["MonoSwapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);
const RogueXProtocolV3_QuoterV1_Contract = new ethers.Contract(ProjectsV3["RogueXProtocolV3"].quoterAddress, QuoterV1ABI, CONTRACT_PROVIDER);
const SushiSwapV3_QuoterV2_Contract = new ethers.Contract(ProjectsV3["SushiSwapV3"].quoterAddress, QuoterV2ABI, CONTRACT_PROVIDER);

const QuotersV3 = {
	ThrusterV3: ThrusterV3_QuoterV2_Contract,
	// FenixFinanceV3: FenixFinanceV3_QuoterV2_Contract,
	UniswapV3: UniswapV3_QuoterV2_Contract,
	MonoSwapV3: MonoSwapV3_QuoterV2_Contract,
	RogueXProtocolV3: RogueXProtocolV3_QuoterV1_Contract,
	SushiSwapV3: SushiSwapV3_QuoterV2_Contract,
};

const QuoterVersionsV3 = {
	RogueXProtocolV3: 1,
	UniswapV3: 2,
	ThrusterV3: 2,
	SushiSwapV3: 2,
	MonoSwapV3: 2,
	// FenixFinanceV3: 2,
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
