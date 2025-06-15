// Modules
require("dotenv").config();
const hardhat = require("hardhat");
const ethers = require("ethers");
const ethersV5 = require("../../Dependencies/node_modules/ethers");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const { expect } = require("chai");
const http = require("http");
const axios = require("axios");
const csv = require("csv-parser");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");
const { spawn } = require("child_process");
// Modules

// flashSwapABI
const flashSwapABI = require(`../../../artifacts/Contracts/Arbitor.sol/Arbitor.json`);
// flashSwapABI

// Encoder
const encoder = ethers.AbiCoder.defaultAbiCoder();
// Encoder

// Intervals
const Interval = 1000;
const RunnerInterval = 1000;
// Intervals

// sqrtPriceX96
const MIN_SQRT_RATIO = 4295128739n;
const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n;
// sqrtPriceX96

// Low-level Gas Calculation Statics
const overhead = 2500;
const scalar = 1150000000;
// Low-level Gas Calculation Statics

// ABIs
const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
// ABIs

// Non Vendable Pools
const NonVendableV2PoolsToV3 = JSON.parse(fs.readFileSync("Scripts/Vendability/NonVendableV2PoolsToV3.json", "utf8"));

// const NonVendableV3PoolsToV3 = JSON.parse(fs.readFileSync("Scripts/Vendability/NonVendableV3PoolsToV3.json", "utf8"));
// Non Vendable Pools

// Coins & IDs
// https://pyth.network/developers/price-feed-ids#pyth-evm-stable
// const coins_pyth = {
// 	BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
// 	ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
// 	MATIC: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
// 	POL: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
// 	AAVE: "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445",
// 	CRV: "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8",
// 	STRK: "0x6a182399ff70ccf3e06024898942028204125a819e519a335ffa4579e66cd870",
// 	ARB: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
// 	BNB: "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
// 	SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
// 	AVAX: "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
// 	LINK: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
// 	TIA: "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723",
// 	STETH: "0x846ae1bdb6300b817cee5fdee2a6da192775030db5615b94a465f53bd40850b5",
// 	WSTETH: "0x6df640f3b8963d8f8358f791f352b8364513f6ab1cca5ed3f1f7b5448980e784",
// 	RETH: "0xa0255134973f4fdf2f8f7808354274a3b1ebc6ee438be898d045e8b56ba1fe13",
// 	FXS: "0x735f591e4fed988cd38df74d8fcedecf2fe8d9111664e0fd500db9aa78b316b1",
// 	FRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
// 	WFRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
// 	SFRXETH: "0xb2bb466ff5386a63c18aa7c3bc953cb540c755e2aa99dafb13bc4c177692bed0",
// 	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
// 	BAL: "0x07ad7b4a7662d19a6bc675f6b467172d2f3947fa653ca97555a9b20236406628",
// 	UNI: "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501",
// 	LDO: "0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad",
// 	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
// 	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
// 	QUICK: "0xd28fd418fef97f1b21f72a6bc39687b52ab368d291a5ee8f16e6033ec81c81d8",
// 	SUSHI: "0x26e4f737fde0263a9eea10ae63ac36dcedab2aaf629261a994e1eeb6ee0afe53",
// 	OKB: "0xd6f83dfeaff95d596ddec26af2ee32f391c206a183b161b7980821860eeef2f5",
// 	COQ: "0x5cc87aaa7df22e5ac77f6a4bc50569129eb00396fd9fd68569e748e7e96fdf90",
// 	GMX: "0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf",
// 	JOE: "0xa3f37baf54dbd24e1d67040d566a762e62be3edbf8ef423038b091afc1722915",
// 	ZERO: "0x9a11b5c6c8d6d266444459316c3aee7684aaa5a5434b189a173d8cddbb3deaae",
// 	SHIB: "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a",
// 	RSETH: "0x0caec284d34d836ca325cf7b3256c078c597bc052fbd3c0283d52b581d68d71f",
// 	PEPE: "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4",
// 	WEETH: "0x9ee4e7c60b940440a261eb54b6d8149c23b580ed7da3139f7f08f4ea29dad395",
// 	EZETH: "0x06c217a791f5c4f988b36629af4cb88fad827b2485400a358f3b02886b54de92",
// 	STG: "0x008546b175392b878c5c7ff0b6327b1cb12669be012fc2935c09a16fc8f6c58f",
// 	ASTR: "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853",
// 	EURA: "0x84755269cafa0a552ce2962c5ac7369a4da7aef57a01379b87736698387b793b",
// 	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
// 	WEETH: "0x9ee4e7c60b940440a261eb54b6d8149c23b580ed7da3139f7f08f4ea29dad395",
// 	RPL: "0x24f94ac0fd8638e3fc41aab2e4df933e63f763351b640bf336a6ec70651c4503",
// 	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
// 	BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
// 	ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
// 	MATIC: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472", // Symbol is POL
// 	POL: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
// 	AAVE: "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445",
// 	CRV: "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8",
// 	STRK: "0x6a182399ff70ccf3e06024898942028204125a819e519a335ffa4579e66cd870",
// 	ARB: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
// 	BNB: "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
// 	SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
// 	AVAX: "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
// 	LINK: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
// 	TIA: "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723",
// 	STETH: "0x846ae1bdb6300b817cee5fdee2a6da192775030db5615b94a465f53bd40850b5",
// 	WSTETH: "0x6df640f3b8963d8f8358f791f352b8364513f6ab1cca5ed3f1f7b5448980e784",
// 	RETH: "0xa0255134973f4fdf2f8f7808354274a3b1ebc6ee438be898d045e8b56ba1fe13",
// 	FXS: "0x735f591e4fed988cd38df74d8fcedecf2fe8d9111664e0fd500db9aa78b316b1",
// 	FRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
// 	WFRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
// 	SFRXETH: "0xb2bb466ff5386a63c18aa7c3bc953cb540c755e2aa99dafb13bc4c177692bed0",
// 	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
// 	BAL: "0x07ad7b4a7662d19a6bc675f6b467172d2f3947fa653ca97555a9b20236406628",
// 	UNI: "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501",
// 	LDO: "0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad",
// 	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
// 	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
// 	QUICK: "0xd28fd418fef97f1b21f72a6bc39687b52ab368d291a5ee8f16e6033ec81c81d8",
// 	SUSHI: "0x26e4f737fde0263a9eea10ae63ac36dcedab2aaf629261a994e1eeb6ee0afe53",
// 	OKB: "0xd6f83dfeaff95d596ddec26af2ee32f391c206a183b161b7980821860eeef2f5",
// 	COQ: "0x5cc87aaa7df22e5ac77f6a4bc50569129eb00396fd9fd68569e748e7e96fdf90",
// 	GMX: "0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf",
// 	JOE: "0xa3f37baf54dbd24e1d67040d566a762e62be3edbf8ef423038b091afc1722915",
// 	ZERO: "0x9a11b5c6c8d6d266444459316c3aee7684aaa5a5434b189a173d8cddbb3deaae",
// 	SHIB: "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a",
// 	RSETH: "0x0caec284d34d836ca325cf7b3256c078c597bc052fbd3c0283d52b581d68d71f",
// 	PEPE: "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4",
// 	WEETH: "0x9ee4e7c60b940440a261eb54b6d8149c23b580ed7da3139f7f08f4ea29dad395",
// 	EZETH: "0x06c217a791f5c4f988b36629af4cb88fad827b2485400a358f3b02886b54de92",
// 	MKR: "0x9375299e31c0deb9c6bc378e6329aab44cb48ec655552a70d4b9050346a30378",
// 	STG: "0x008546b175392b878c5c7ff0b6327b1cb12669be012fc2935c09a16fc8f6c58f",
// 	ASTR: "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853",

// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// 	// TESTOOOOOO: "TETTTTTTTTTTTTTOOOOOOOO",
// };

const coins_pyth = {
	BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
	ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
	MATIC: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
	POL: "0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472",
	AAVE: "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445",
	CRV: "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8",
	STRK: "0x6a182399ff70ccf3e06024898942028204125a819e519a335ffa4579e66cd870",
	ARB: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
	BNB: "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
	SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
	AVAX: "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
	LINK: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
	TIA: "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723",
	STETH: "0x846ae1bdb6300b817cee5fdee2a6da192775030db5615b94a465f53bd40850b5",
	WSTETH: "0x6df640f3b8963d8f8358f791f352b8364513f6ab1cca5ed3f1f7b5448980e784",
	RETH: "0xa0255134973f4fdf2f8f7808354274a3b1ebc6ee438be898d045e8b56ba1fe13",
	FXS: "0x735f591e4fed988cd38df74d8fcedecf2fe8d9111664e0fd500db9aa78b316b1",
	FRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
	WFRXETH: "0x29240ee3a9024d107888eb1d4c527216f06bd64cee030c6b5575b1a8d77cb659",
	SFRXETH: "0xb2bb466ff5386a63c18aa7c3bc953cb540c755e2aa99dafb13bc4c177692bed0",
	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
	BAL: "0x07ad7b4a7662d19a6bc675f6b467172d2f3947fa653ca97555a9b20236406628",
	UNI: "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501",
	LDO: "0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad",
	CAKE: "0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9",
	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
	QUICK: "0xd28fd418fef97f1b21f72a6bc39687b52ab368d291a5ee8f16e6033ec81c81d8",
	SUSHI: "0x26e4f737fde0263a9eea10ae63ac36dcedab2aaf629261a994e1eeb6ee0afe53",
	OKB: "0xd6f83dfeaff95d596ddec26af2ee32f391c206a183b161b7980821860eeef2f5",
	COQ: "0x5cc87aaa7df22e5ac77f6a4bc50569129eb00396fd9fd68569e748e7e96fdf90",
	GMX: "0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf",
	JOE: "0xa3f37baf54dbd24e1d67040d566a762e62be3edbf8ef423038b091afc1722915",
	ZERO: "0x9a11b5c6c8d6d266444459316c3aee7684aaa5a5434b189a173d8cddbb3deaae",
	SHIB: "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a",
	RSETH: "0x0caec284d34d836ca325cf7b3256c078c597bc052fbd3c0283d52b581d68d71f",
	PEPE: "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4",
	WEETH: "0x9ee4e7c60b940440a261eb54b6d8149c23b580ed7da3139f7f08f4ea29dad395",
	EZETH: "0x06c217a791f5c4f988b36629af4cb88fad827b2485400a358f3b02886b54de92",
	STG: "0x008546b175392b878c5c7ff0b6327b1cb12669be012fc2935c09a16fc8f6c58f",
	ASTR: "0x89b814de1eb2afd3d3b498d296fca3a873e644bafb587e84d181a01edd682853",
	EURA: "0x84755269cafa0a552ce2962c5ac7369a4da7aef57a01379b87736698387b793b",
	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
	WEETH: "0x9ee4e7c60b940440a261eb54b6d8149c23b580ed7da3139f7f08f4ea29dad395",
	RPL: "0x24f94ac0fd8638e3fc41aab2e4df933e63f763351b640bf336a6ec70651c4503",
	EURC: "0x76fa85158bf14ede77087fe3ae472f66213f6ea2f5b411cb2de472794990fa5c",
};

const coins_coinmarketcap = [
	"lido-staked-matic",
	"dovish-finance",
	"aura-finance",
	"kimbo",
	"numbergouptech",
	"gogopool",
	"benqi",
	"platypus-finance",
	"heroes-of-nft",
	"avalaunch",
	"pangolin",
	"colony-avalanche-index",
	"colony",
	"rabbitx",
	"lynex",
	"mendi-finance",
	"izumi-finance",
	"echodex",
	"arc",
	"polkamon",
	"book-of-pepe",
	"arbswap",
	"arbius",
	"moon",
	"moonsdust",
	"reboot",
	"nftearth",
	"foxy",
	"bricks",
	"frax-price-index",
	"frax-price-index-share",

	"gravita-protocol",
	"universal-eth",
	"kelp-dao-wrapped-rseth",
	"dackieswap",
	"ankr",
	"eesee",
	"pstake-finance",
	"juice-finance",
	"orbit-protocol",
	"pacmoon",
	"blast",

	// "lido-finance-wsteth",
	// "coinbase-wrapped-staked-eth",
	// "lido-staked-matic",
	// "avalanche",
	// "celo",
	// "sushiswap",
	// "rocketswap",
	// "toshithecat",
	// "bald",
	// "swapbased-base",
	// "synthswap",
	// "unidex",
	// "chainlink",
	// "lido-finance-wsteth",
	// "rocket-pool-eth",
	// "bnb",
	// "uniswap",
	// "aptos",
	// "near-protocol",
	// "optimism-ethereum",
	// "mantle",
	// "aave",
	// "arbitrum",
	// "algorand",
	// "celestia",
	// "curve-dao-token",
	// "frax-share",
	// "frax-finance-frax-ether",
	// "frax-staked-ether",
];
// Coins & IDs

const AdditionalMarketPrices = {
	ATF: 0.14,
	DYSN: 0.26,
};
// Additional Market Prices

// Chains
const selectedChain = "PolygonzkEVM";

const chains = JSON.parse(fs.readFileSync(path.join("Scripts/GeckoTerminal/ChainList.json"), "utf-8"));
// Chains

// Chains
const providerNames = ["FLASHSWAP_PROVIDER", "SCRIPT_PROVIDER", "V2_POOL_PROVIDER", "V3_POOL_PROVIDER", "V2_CONTRACT_PROVIDER", "V3_CONTRACT_PROVIDER"];
// Chains

// Flash Swap Contract Selectors
const flashSwapFunctionSelector = {
	flashSwap: "0x835786c0",
	PrintLira: "0x140f57dc",
	printLira: "0x3bc79b91",
	printTL: "0x9a0a61d9",
	printMoney: "0xb0f8d83c",
	printer: "0xefe890b4",
	arbitor: "0x5c0a70d7",
	arbitarator: "0x50f12e46",
};
// Flash Swap Contract Selectors

// Signer
const WalletAddress = ethers.HDNodeWallet.fromPhrase(process.env.HOT_WALLET_PHRASE).address;
// Signer

// Transaction Gas Limits
const flashSwap_gasLimit = 700000;
const gasLimit = 275000;
// Transaction Gas Limits

// Transaction Gas Multipliers
const maxFeePerGas_multiplier = 2;
const maxPriorityFeePerGas_multiplier = 2;
const gasPrice_multiplier = 2;
// Transaction Gas Multipliers

// Q96
const Q96 = 2n ** 96n;
// Q96

// fees
const feesV3 = ["100", "500", "2500", "10000"];
// fees

// Quoter ABIs
const QuoterV1ABI = require("../../Dex/QuoterABIsV3/QuoterV1ABI.json");
const QuoterV2ABI = require("../../Dex/QuoterABIsV3/QuoterV2ABI.json");
const QuoterV3ABI = require("../../Dex/QuoterABIsV3/QuoterV3ABI.json");
const QuoterV4ABI = require("../../Dex/QuoterABIsV3/QuoterV4ABI.json");
// Quoter ABIs

// Callbacks for V2 Pools
const callbackListV2 = {
	PancakeSwapV2: "PancakeSwapV2Callback",
	PancakeswapV2: "PancakeSwapV2Callback",
};
// Callbacks for V2 Pools

// Callbacks for V3 Pools
const callbackListV3 = {
	PancakeSwapV3: "PancakeSwapV3Callback",
	PancakeswapV3: "PancakeSwapV3Callback",
};
// Callbacks for V3 Pools

// WSS Settings
const wss_reconnection_timeout = 15000; // Retrying after 15 seconds
// WSS Settings

const SpecialProjectsCredentialsV2 = {
	AntfarmV2: {
		PolygonzkEVM: ["0x40DF0C3BBAAE5Ea3A509d8F2aa9E086776C98E6c"],
		Arbitrum: ["0xFB9fbcB328317123f5275CDA30b6589d5841216B"],
		Avalanche: ["0x8aF94528FBE3c4C148523E7aAD48BcEbcC0A71d7"],
		Ethereum: ["0x518b63Da813D46556FEa041A88b52e3CAa8C16a8"],
	},
	DysonFinanceV2: ["PolygonzkEVM", "Linea", "Blast", "XLayer"],
	BalancerV2: ["PolygonzkEVM", "Avalanche", "Arbitrum"],
};

// minimumNativeBalanceTable, conversionNativeBalanceTable
const minimumNativeBalanceTable = {
	ETH: 0.01,
	FRXETH: 0.01,
	OKB: 0.5,
	AVAX: 1,
};

const conversionNativeBalanceTable = {
	ETH: 0.005,
	FRXETH: 0.005,
	OKB: 0.1,
	AVAX: 0.5,
};
// minimumNativeBalanceTable, conversionNativeBalanceTable

// Api Key List
const coinmarketcap_apikeylist = [
	"22959653-4a2c-41bf-8189-241c325eab12",
	"f43d0ee7-06af-47d6-b719-898da47ecf06",
	"de922e1f-04d3-460e-84ac-fece36a8e897",
	"da8a5ede-a97f-4350-8ebf-1277487cf8c6",
	"fb2dd9c5-4fd5-4ddd-9f07-1d1e7997f822",
	"7c97e537-78cf-4aa0-8751-df495b6aa272",
	"49c710c9-689c-48cf-94c3-d00148105b1a",
	"35f8f943-f614-49c8-8747-9ccbf10719f5",
	"d1cf1020-c551-4c57-828e-96c0b3712707",
	"4361b799-fb62-4909-8679-a2e8fea8d246",
	"8f58e87e-513d-4cbb-85eb-dd74063bcd99",
	"9db5bb3a-f813-49fd-b23d-cb3fc318fddf",
	"a352383a-3427-4d59-89eb-5ea39a48949e",
	"90bf1560-f68f-4de9-8b36-116256593d53",
	"05ea1fc5-1bd6-45db-8bba-d8ac55c64e0f",
	"aa0ec750-2bd3-4a8c-9dcc-8b570a7d42ee",
	"8768fb47-9464-4024-8ae4-376421c6a637",
	"38bb0f0b-e0ed-4dcd-8b06-5957dfd82e72",
	"e5fbe765-1dab-4516-a7e5-9f24ee3a6f45",
	"e065c0b2-889f-4786-8054-a145972e4d5d",
	"fb2dd9c5-4fd5-4ddd-9f07-1d1e7997f822",
	"94b1194b-b3db-4a20-ba34-14111b1d03ca",
	"c7f3749f-1eaf-4265-9b5d-2ed2ea8d9331",
	"d19d09e6-0faf-4710-bc30-db03cde835cd",
	"be327370-2dd5-4da9-846c-faefc485ae34",
	"7f8b7e1d-37e9-4d6b-bbc3-b526da74921d",
	"b4ee170b-76de-429b-9f77-085a64cdd27a",
	"59a74035-42ee-4369-8c14-c5d138f1232e",
	"0c0cda40-1f54-4b8d-8d65-dd7014b3f12e",
	"05323676-ff9f-425a-b4e0-b05a6967b18c",
	"391acbec-0994-40cf-8c08-3e67763cbfab",
	"be0215ad-db31-44e5-8504-3f6fc5bbbded",
	"910c3593-e0b0-4a1b-8369-c3b35400dcf8",
	"f917d860-4c93-46cc-80ca-6ebb1d8021cd",
	"e8680f46-8d81-4e2b-8ec7-443001a90848",
];
// Api Key List

// V3 Pools' For Increment Rate
const incrementRateV3 = 1;
// V3 Pools' For Increment Rate

module.exports = {
	hardhat,
	ethers,
	ethersV5,
	fs,
	path,
	EventEmitter,
	expect,
	http,
	axios,
	csv,
	EvmPriceServiceConnection,
	spawn,
	flashSwapABI,
	encoder,
	Interval,
	RunnerInterval,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	overhead,
	scalar,
	ERC20,
	NonVendableV2PoolsToV3,
	// NonVendableV3PoolsToV3
	coins_pyth,
	coins_coinmarketcap,
	AdditionalMarketPrices,
	selectedChain,
	chains,
	providerNames,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	maxFeePerGas_multiplier,
	maxPriorityFeePerGas_multiplier,
	gasPrice_multiplier,
	Q96,
	feesV3,
	QuoterV1ABI,
	QuoterV2ABI,
	QuoterV3ABI,
	QuoterV4ABI,
	minimumNativeBalanceTable,
	conversionNativeBalanceTable,
	coinmarketcap_apikeylist,
	incrementRateV3,
	SpecialProjectsCredentialsV2,
};

/*
	QuoterV1.quoteExactOutputSingle (
		tokenIn,
		tokenOut,
		fee,
		amountOut,
		sqrtPriceLimitX96
	)

	QuoterV2.quoteExactOutputSingle ({
		tokenIn: tokenIn,
		tokenOut: tokenOut,
		amount: amount,
		fee: fee,
		sqrtPriceLimitX96: sqrtPriceLimitX96
	})

	QuoterV3.quoteExactOutputSingle (
		tokenIn,
		tokenOut,
		amountOut,
		limitSqrtPrice
	)

	QuoterV4.quoteExactOutputSingle ({
		tokenIn: tokenIn,
		tokenOut: tokenOut,
		amount: amount,
		limitSqrtPrice: limitSqrtPrice
	})
*/
