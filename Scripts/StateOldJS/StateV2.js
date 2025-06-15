const { ethers, ethersV5, fs, path, http, chains, StateV2ServerPort } = require("../Common/Global/Global");

const VAULT_ABI = require("../Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

const { POOL_PROVIDER_V2 } = require("../Common/Common/PolygonzkEVM");

let POLYGONZK_VAULT = {
	address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
	https_contract: new ethers.Contract("0xBA12222222228d8Ba445958a75a0704d566BF2C8", VAULT_ABI, POOL_PROVIDER_V2),
	wss_contract: null,
};

let balancerChains = ["PolygonzkEVM"]; // All the other chains will be added as soon as dapp file is added

// Exec...
// Exec...
// Exec...

// WSS_POOL_PROVIDER START --- DO NOT DELETE
let FRAXTAL_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.FRAXTAL_WSS_POOL_PROVIDER_URL);
let ASTARZKEVM_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ASTARZKEVM_WSS_POOL_PROVIDER_URL);
let ZKFAIR_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ZKFAIR_WSS_POOL_PROVIDER_URL);
let ARBITRUMNOVA_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ARBITRUMNOVA_WSS_POOL_PROVIDER_URL);
let ETHEREUM_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ETHEREUM_WSS_POOL_PROVIDER_URL);
let ARBITRUM_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.ARBITRUM_WSS_POOL_PROVIDER_URL);
let AVALANCHE_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.AVALANCHE_WSS_POOL_PROVIDER_URL);
let BLAST_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.BLAST_WSS_POOL_PROVIDER_URL);
let XLAYER_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.XLAYER_WSS_POOL_PROVIDER_URL);
let POLYGONZK_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZK_WSS_POOL_PROVIDER_URL);
let LINEA_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.LINEA_WSS_POOL_PROVIDER_URL);
// WSS_POOL_PROVIDER END --- DO NOT DELETE

// HEART_BEAT_INTERVAL START --- DO NOT DELETE
let FRAXTAL_HEART_BEAT_INTERVAL;
let ASTARZKEVM_HEART_BEAT_INTERVAL;
let ZKFAIR_HEART_BEAT_INTERVAL;
let ARBITRUMNOVA_HEART_BEAT_INTERVAL;
let ETHEREUM_HEART_BEAT_INTERVAL;
let ARBITRUM_HEART_BEAT_INTERVAL;
let AVALANCHE_HEART_BEAT_INTERVAL;
let BLAST_HEART_BEAT_INTERVAL;
let XLAYER_HEART_BEAT_INTERVAL;
let POLYGONZK_HEART_BEAT_INTERVAL;
let LINEA_HEART_BEAT_INTERVAL;
// HEART_BEAT_INTERVAL END --- DO NOT DELETE

// POOLS START --- DO NOT DELETE
const Pools = {
	Linea: {
		DysonFinanceV2: {
			USDC_WETH_POOL: {
				wss_contract: null,
			},
		},
		PancakeSwapV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WSTETH_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			DAI_WETH_POOL: {
				wss_contract: null,
			},
			WETH_BNB_POOL: {
				wss_contract: null,
			},
			CAKE_WETH_POOL: {
				wss_contract: null,
			},
			FOXY_WETH_POOL: {
				wss_contract: null,
			},
			WBTC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_DAI_POOL: {
				wss_contract: null,
			},
			CAKE_USDC_POOL: {
				wss_contract: null,
			},
			CAKE_USDT_POOL: {
				wss_contract: null,
			},
		},
		SushiSwapV2: {
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			WETH_AXLUSDC_POOL: {
				wss_contract: null,
			},
		},
		EchoDexV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WSTETH_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			DAI_WETH_POOL: {
				wss_contract: null,
			},
			WETH_AXLUSDC_POOL: {
				wss_contract: null,
			},
			BUSD_WETH_POOL: {
				wss_contract: null,
			},
			MATIC_WETH_POOL: {
				wss_contract: null,
			},
			WETH_BNB_POOL: {
				wss_contract: null,
			},
			AVAX_WETH_POOL: {
				wss_contract: null,
			},
			ECP_WETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_DAI_POOL: {
				wss_contract: null,
			},
			USDC_BUSD_POOL: {
				wss_contract: null,
			},
			USDT_AXLUSDC_POOL: {
				wss_contract: null,
			},
			MATIC_BUSD_POOL: {
				wss_contract: null,
			},
			AVAX_BUSD_POOL: {
				wss_contract: null,
			},
			BUSD_ECP_POOL: {
				wss_contract: null,
			},
			MATIC_BNB_POOL: {
				wss_contract: null,
			},
			MATIC_AVAX_POOL: {
				wss_contract: null,
			},
			MATIC_ECP_POOL: {
				wss_contract: null,
			},
			AVAX_BNB_POOL: {
				wss_contract: null,
			},
			ECP_BNB_POOL: {
				wss_contract: null,
			},
			AVAX_ECP_POOL: {
				wss_contract: null,
			},
		},
		ElkFinanceV2: {
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			BUSD_WETH_POOL: {
				wss_contract: null,
			},
		},
		SectaFinanceV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WSTETH_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			DAI_WETH_POOL: {
				wss_contract: null,
			},
			MENDI_WETH_POOL: {
				wss_contract: null,
			},
			DAI_WSTETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			DAI_USDT_POOL: {
				wss_contract: null,
			},
		},
		NileV2: {
			WEETH_WETH_POOL: {
				wss_contract: null,
			},
			WRSETH_WETH_POOL: {
				wss_contract: null,
			},
			EZETH_WETH_POOL: {
				wss_contract: null,
			},
			WSTETH_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			NILE_WETH_POOL: {
				wss_contract: null,
			},
			ZERO_WETH_POOL: {
				wss_contract: null,
			},
			WEETH_WRSETH_POOL: {
				wss_contract: null,
			},
			USDC_EZETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_NILE_POOL: {
				wss_contract: null,
			},
			USDC_MENDI_POOL: {
				wss_contract: null,
			},
		},
		LynexV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WEETH_WETH_POOL: {
				wss_contract: null,
			},
			EZETH_WETH_POOL: {
				wss_contract: null,
			},
			WSTETH_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			MATIC_WETH_POOL: {
				wss_contract: null,
			},
			NILE_WETH_POOL: {
				wss_contract: null,
			},
			LYNX_WETH_POOL: {
				wss_contract: null,
			},
			MENDI_WETH_POOL: {
				wss_contract: null,
			},
			ZERO_WETH_POOL: {
				wss_contract: null,
			},
			FOXY_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WBTC_POOL: {
				wss_contract: null,
			},
			LYNX_WBTC_POOL: {
				wss_contract: null,
			},
			USDC_WEETH_POOL: {
				wss_contract: null,
			},
			LYNX_WEETH_POOL: {
				wss_contract: null,
			},
			WEETH_FOXY_POOL: {
				wss_contract: null,
			},
			USDC_EZETH_POOL: {
				wss_contract: null,
			},
			EZETH_USDT_POOL: {
				wss_contract: null,
			},
			USDC_WSTETH_POOL: {
				wss_contract: null,
			},
			LYNX_WSTETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_DAI_POOL: {
				wss_contract: null,
			},
			USDC_MAI_POOL: {
				wss_contract: null,
			},
			USDC_LYNX_POOL: {
				wss_contract: null,
			},
			USDC_MENDI_POOL: {
				wss_contract: null,
			},
			USDC_FOXY_POOL: {
				wss_contract: null,
			},
			AGEUR_USDT_POOL: {
				wss_contract: null,
			},
			LYNX_USDT_POOL: {
				wss_contract: null,
			},
			MENDI_USDT_POOL: {
				wss_contract: null,
			},
			LYNX_MATIC_POOL: {
				wss_contract: null,
			},
			MATIC_MENDI_POOL: {
				wss_contract: null,
			},
			LYNX_FOXY_POOL: {
				wss_contract: null,
			},
		},
		MetaVaultV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
		},
		LeetSwapV2: {
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			USDC_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			BUSD_WETH_POOL: {
				wss_contract: null,
			},
			USDC_USDT_POOL: {
				wss_contract: null,
			},
			USDC_BUSD_POOL: {
				wss_contract: null,
			},
			BUSD_USDT_POOL: {
				wss_contract: null,
			},
		},
	},
	PolygonzkEVM: {
		DysonFinanceV2: {
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			DYSN_USDC_POOL: {
				wss_contract: null,
			},
		},
		AntfarmFinanceV2: {
			ATF_WETH_1_POOL: {
				wss_contract: null,
			},
			WETH_MATIC_1_POOL: {
				wss_contract: null,
			},
			ATF_WETH_10_POOL: {
				wss_contract: null,
			},
			ATF_WETH_25_POOL: {
				wss_contract: null,
			},
			ATF_WETH_50_POOL: {
				wss_contract: null,
			},
			WETH_USDC_10_POOL: {
				wss_contract: null,
			},
			WETH_USDC_100_POOL: {
				wss_contract: null,
			},
			WETH_USDC_1_POOL: {
				wss_contract: null,
			},
			ATF_USDC_10_POOL: {
				wss_contract: null,
			},
			ATF_MATIC_10_POOL: {
				wss_contract: null,
			},
			ATF_USDC_1_POOL: {
				wss_contract: null,
			},
			ATF_MATIC_1_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_10_POOL: {
				wss_contract: null,
			},
			WETH_MATIC_10_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_1_POOL: {
				wss_contract: null,
			},
			WETH_USDC_50_POOL: {
				wss_contract: null,
			},
			ATF_USDC_25_POOL: {
				wss_contract: null,
			},
			WETH_USDC_25_POOL: {
				wss_contract: null,
			},
			ATF_USDC_50_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_25_POOL: {
				wss_contract: null,
			},
			USDT_WETH_1_POOL: {
				wss_contract: null,
			},
			USDT_WETH_10_POOL: {
				wss_contract: null,
			},
			ATF_USDT_1_POOL: {
				wss_contract: null,
			},
			USDT_USDC_1_POOL: {
				wss_contract: null,
			},
			USDT_USDC_10_POOL: {
				wss_contract: null,
			},
		},
		BalancerV2: {
			VAULT: {
				wss_contract: null,
			},
		},
		PancakeSwapV2: {
			USDT_DAI_POOL: {
				wss_contract: null,
			},
			USDC_CFT_USDC_POOL: {
				wss_contract: null,
			},
			USDT_USDC_POOL: {
				wss_contract: null,
			},
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			USDC_WBTC_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_POOL: {
				wss_contract: null,
			},
			CAKE_USDC_POOL: {
				wss_contract: null,
			},
			USDC_CFT_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			USDT_WBTC_POOL: {
				wss_contract: null,
			},
			USDT_MATIC_POOL: {
				wss_contract: null,
			},
			CAKE_USDT_POOL: {
				wss_contract: null,
			},
			WETH_RETH_POOL: {
				wss_contract: null,
			},
			WETH_WBTC_POOL: {
				wss_contract: null,
			},
			WETH_MATIC_POOL: {
				wss_contract: null,
			},
			ATF_WETH_POOL: {
				wss_contract: null,
			},
			CAKE_WETH_POOL: {
				wss_contract: null,
			},
			CAKE_RETH_POOL: {
				wss_contract: null,
			},
			STMATIC_MATIC_POOL: {
				wss_contract: null,
			},
		},
		zkEVMSwapV2: {
			USDC_DAI_POOL: {
				wss_contract: null,
			},
			WETH_DAI_POOL: {
				wss_contract: null,
			},
			USDT_USDC_POOL: {
				wss_contract: null,
			},
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			USDT_MATIC_POOL: {
				wss_contract: null,
			},
			WETH_MATIC_POOL: {
				wss_contract: null,
			},
			MATIC_WBTC_POOL: {
				wss_contract: null,
			},
		},
		FlashLiquidityV2: {
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
		},
	},
	XLayer: {
		DysonFinanceV2: {
			USDC_WOKB_POOL: {
				wss_contract: null,
			},
		},
		RevoSwapV2: {
			WETH_WOKB_POOL: {
				wss_contract: null,
			},
			WOKB_WBTC_POOL: {
				wss_contract: null,
			},
			USDT_WOKB_POOL: {
				wss_contract: null,
			},
			USDC_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			USDT_USDC_POOL: {
				wss_contract: null,
			},
		},
		PotatoSwapV2: {
			WETH_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_WOKB_POOL: {
				wss_contract: null,
			},
			USDC_WOKB_POOL: {
				wss_contract: null,
			},
			PUFF_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			USDT_USDC_POOL: {
				wss_contract: null,
			},
		},
		StationDexV2: {
			WETH_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_USDC_POOL: {
				wss_contract: null,
			},
		},
		AbstraDexV2: {
			WETH_WOKB_POOL: {
				wss_contract: null,
			},
			USDT_WOKB_POOL: {
				wss_contract: null,
			},
			ABS_WOKB_POOL: {
				wss_contract: null,
			},
			PEPE_WOKB_POOL: {
				wss_contract: null,
			},
		},
		DackieSwapV2: {
			USDC_WOKB_POOL: {
				wss_contract: null,
			},
		},
		DyorSwapV2: {},
		TitanDexV2: {
			USDC_WOKB_POOL: {
				wss_contract: null,
			},
		},
	},
	Blast: {
		DysonFinanceV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
		},
		UniswapV2: {
			EZETH_WETH_POOL: {
				wss_contract: null,
			},
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_OLE_POOL: {
				wss_contract: null,
			},
			WETH_BAG_POOL: {
				wss_contract: null,
			},
			WETH_JUICE_POOL: {
				wss_contract: null,
			},
			YES_WETH_POOL: {
				wss_contract: null,
			},
			WETH_PAC_POOL: {
				wss_contract: null,
			},
			WETH_YIELD_POOL: {
				wss_contract: null,
			},
			KAP_WETH_POOL: {
				wss_contract: null,
			},
			WETH_ANDY_POOL: {
				wss_contract: null,
			},
			ORBIT_WETH_POOL: {
				wss_contract: null,
			},
			USDB_PAC_POOL: {
				wss_contract: null,
			},
		},
		Thruster03V2: {
			WETH_WBTC_POOL: {
				wss_contract: null,
			},
			EZETH_WETH_POOL: {
				wss_contract: null,
			},
			WEETH_WETH_POOL: {
				wss_contract: null,
			},
			WETH_WRSETH_POOL: {
				wss_contract: null,
			},
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_OLE_POOL: {
				wss_contract: null,
			},
			WETH_BAG_POOL: {
				wss_contract: null,
			},
			WETH_JUICE_POOL: {
				wss_contract: null,
			},
			YES_WETH_POOL: {
				wss_contract: null,
			},
			WETH_SSS_POOL: {
				wss_contract: null,
			},
			WETH_PAC_POOL: {
				wss_contract: null,
			},
			WETH_YIELD_POOL: {
				wss_contract: null,
			},
			KAP_WETH_POOL: {
				wss_contract: null,
			},
			WETH_ANDY_POOL: {
				wss_contract: null,
			},
			WETH_BLADE_POOL: {
				wss_contract: null,
			},
			WETH_EARLY_POOL: {
				wss_contract: null,
			},
			ORBIT_WETH_POOL: {
				wss_contract: null,
			},
			EZETH_USDB_POOL: {
				wss_contract: null,
			},
			WEETH_USDB_POOL: {
				wss_contract: null,
			},
			USDB_AXLUSDC_POOL: {
				wss_contract: null,
			},
			USDB_OLE_POOL: {
				wss_contract: null,
			},
			USDB_JUICE_POOL: {
				wss_contract: null,
			},
			YES_USDB_POOL: {
				wss_contract: null,
			},
			USDB_SSS_POOL: {
				wss_contract: null,
			},
			USDB_PAC_POOL: {
				wss_contract: null,
			},
			USDB_ANDY_POOL: {
				wss_contract: null,
			},
			USDB_EARLY_POOL: {
				wss_contract: null,
			},
			ORBIT_USDB_POOL: {
				wss_contract: null,
			},
			OLE_JUICE_POOL: {
				wss_contract: null,
			},
			PAC_OLE_POOL: {
				wss_contract: null,
			},
			YES_ORBIT_POOL: {
				wss_contract: null,
			},
		},
		Thruster10V2: {
			WEETH_WETH_POOL: {
				wss_contract: null,
			},
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_OLE_POOL: {
				wss_contract: null,
			},
			WETH_JUICE_POOL: {
				wss_contract: null,
			},
			YES_WETH_POOL: {
				wss_contract: null,
			},
			WETH_PAC_POOL: {
				wss_contract: null,
			},
			WETH_YIELD_POOL: {
				wss_contract: null,
			},
			KAP_WETH_POOL: {
				wss_contract: null,
			},
			WETH_ANDY_POOL: {
				wss_contract: null,
			},
			WETH_EARLY_POOL: {
				wss_contract: null,
			},
			ORBIT_WETH_POOL: {
				wss_contract: null,
			},
			YES_USDB_POOL: {
				wss_contract: null,
			},
			USDB_ANDY_POOL: {
				wss_contract: null,
			},
			ORBIT_USDB_POOL: {
				wss_contract: null,
			},
			YES_ORBIT_POOL: {
				wss_contract: null,
			},
		},
		SushiSwapV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			USDB_AXLUSDC_POOL: {
				wss_contract: null,
			},
		},
		DackieSwapV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
		},
		MonoSwapV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_MUSD_POOL: {
				wss_contract: null,
			},
			WETH_PAC_POOL: {
				wss_contract: null,
			},
			USDB_MUSD_POOL: {
				wss_contract: null,
			},
			OLE_MUSD_POOL: {
				wss_contract: null,
			},
			PAC_ANDY_POOL: {
				wss_contract: null,
			},
		},
		CyberBlastV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
		},
		BlasterSwapV2: {
			EZETH_WETH_POOL: {
				wss_contract: null,
			},
			WETH_WRSETH_POOL: {
				wss_contract: null,
			},
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_OLE_POOL: {
				wss_contract: null,
			},
			WETH_PAC_POOL: {
				wss_contract: null,
			},
			KAP_WETH_POOL: {
				wss_contract: null,
			},
			ORBIT_WETH_POOL: {
				wss_contract: null,
			},
			RBX_WETH_POOL: {
				wss_contract: null,
			},
			EZETH_USDB_POOL: {
				wss_contract: null,
			},
			EZETH_OLE_POOL: {
				wss_contract: null,
			},
			EZETH_PAC_POOL: {
				wss_contract: null,
			},
			USDB_WRSETH_POOL: {
				wss_contract: null,
			},
			PAC_WRSETH_POOL: {
				wss_contract: null,
			},
			USDB_OLE_POOL: {
				wss_contract: null,
			},
			USDB_PAC_POOL: {
				wss_contract: null,
			},
			KAP_USDB_POOL: {
				wss_contract: null,
			},
			ORBIT_USDB_POOL: {
				wss_contract: null,
			},
			RBX_USDB_POOL: {
				wss_contract: null,
			},
			PAC_OLE_POOL: {
				wss_contract: null,
			},
			RBX_OLE_POOL: {
				wss_contract: null,
			},
			KAP_PAC_POOL: {
				wss_contract: null,
			},
			RBX_PAC_POOL: {
				wss_contract: null,
			},
		},
		DyorSwapV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			WETH_ANDY_POOL: {
				wss_contract: null,
			},
		},
		SwapBlastV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
		},
		HyperBlastV2: {
			USDB_WETH_POOL: {
				wss_contract: null,
			},
			KAP_WETH_POOL: {
				wss_contract: null,
			},
		},
	},
	Avalanche: {
		AntfarmFinanceV2: {
			ATF_WAVAX_1_POOL: {
				wss_contract: null,
			},
			PHAR_WAVAX_22_2_POOL: {
				wss_contract: null,
			},
			ATF_USDC_1_POOL: {
				wss_contract: null,
			},
			WAVAX_USDC_50_POOL: {
				wss_contract: null,
			},
			WAVAX_USDC_22_2_POOL: {
				wss_contract: null,
			},
			CAI_USDC_50_POOL: {
				wss_contract: null,
			},
			CAI_USDC_22_2_POOL: {
				wss_contract: null,
			},
			USDC_CLY_100_POOL: {
				wss_contract: null,
			},
			USDC_CLY_50_POOL: {
				wss_contract: null,
			},
			JOE_WAVAX_22_2_POOL: {
				wss_contract: null,
			},
			ATF_WETH_CFT_10_5_POOL: {
				wss_contract: null,
			},
			ATF_WETH_CFT_22_2_POOL: {
				wss_contract: null,
			},
			ATF_WETH_CFT_50_POOL: {
				wss_contract: null,
			},
			ATF_WAVAX_10_5_POOL: {
				wss_contract: null,
			},
			ATF_WAVAX_22_2_POOL: {
				wss_contract: null,
			},
			ATF_WAVAX_50_POOL: {
				wss_contract: null,
			},
			ATF_USDC_50_POOL: {
				wss_contract: null,
			},
			BTC_CFT_USDC_10_5_POOL: {
				wss_contract: null,
			},
			USDC_CLY_1_POOL: {
				wss_contract: null,
			},
			ATF_USDC_22_2_POOL: {
				wss_contract: null,
			},
			ATF_CLY_1_POOL: {
				wss_contract: null,
			},
			ATF_CAI_1_POOL: {
				wss_contract: null,
			},
			TECH_WAVAX_100_POOL: {
				wss_contract: null,
			},
			TECH_WAVAX_50_POOL: {
				wss_contract: null,
			},
			ATF_TECH_1_POOL: {
				wss_contract: null,
			},
			CAI_TECH_22_2_POOL: {
				wss_contract: null,
			},
			TECH_CLY_50_POOL: {
				wss_contract: null,
			},
			TECH_WAVAX_1_POOL: {
				wss_contract: null,
			},
			TECH_WAVAX_22_2_POOL: {
				wss_contract: null,
			},
			TECH_USDC_100_POOL: {
				wss_contract: null,
			},
			KIMBO_TECH_100_POOL: {
				wss_contract: null,
			},
			KIMBO_TECH_50_POOL: {
				wss_contract: null,
			},
			KIMBO_TECH_22_2_POOL: {
				wss_contract: null,
			},
			ATF_KIMBO_1_POOL: {
				wss_contract: null,
			},
			COQ_TECH_100_POOL: {
				wss_contract: null,
			},
			BTC_CFT_CLY_22_2_POOL: {
				wss_contract: null,
			},
			BTC_CFT_CLY_50_POOL: {
				wss_contract: null,
			},
		},
	},
	Arbitrum: {
		AntfarmFinanceV2: {
			ATF_ARB_1_POOL: {
				wss_contract: null,
			},
			WETH_ARB_25_POOL: {
				wss_contract: null,
			},
			ATF_WETH_1_POOL: {
				wss_contract: null,
			},
			ATF_WETH_10_POOL: {
				wss_contract: null,
			},
			ATF_WETH_25_POOL: {
				wss_contract: null,
			},
			ATF_WETH_50_POOL: {
				wss_contract: null,
			},
			ATF_ARB_10_POOL: {
				wss_contract: null,
			},
			ATF_ARB_25_POOL: {
				wss_contract: null,
			},
			ATF_LUSD_1_POOL: {
				wss_contract: null,
			},
			LUSD_LQTY_25_POOL: {
				wss_contract: null,
			},
			ATF_USDC_1_POOL: {
				wss_contract: null,
			},
		},
	},
	Ethereum: {
		AntfarmFinanceV2: {
			ATF_WETH_1_POOL: {
				wss_contract: null,
			},
			ATF_USDC_1_POOL: {
				wss_contract: null,
			},
			ATF_USDT_1_POOL: {
				wss_contract: null,
			},
			ATF_DAI_1_POOL: {
				wss_contract: null,
			},
			ATF_LUSD_1_POOL: {
				wss_contract: null,
			},
			ATF_WBTC_1_POOL: {
				wss_contract: null,
			},
			ATF_USDC_10_POOL: {
				wss_contract: null,
			},
			ATF_USDC_25_POOL: {
				wss_contract: null,
			},
			ATF_USDC_50_POOL: {
				wss_contract: null,
			},
			ATF_AGT_1_POOL: {
				wss_contract: null,
			},
			ATF_AGT_10_POOL: {
				wss_contract: null,
			},
			ATF_AGT_25_POOL: {
				wss_contract: null,
			},
			ATF_AGT_50_POOL: {
				wss_contract: null,
			},
			ATF_WETH_10_POOL: {
				wss_contract: null,
			},
			ATF_WETH_25_POOL: {
				wss_contract: null,
			},
			ATF_WETH_50_POOL: {
				wss_contract: null,
			},
			USDC_WETH_1_POOL: {
				wss_contract: null,
			},
			MS_WETH_25_POOL: {
				wss_contract: null,
			},
			MS_WETH_50_POOL: {
				wss_contract: null,
			},
			ATF_WBTC_10_POOL: {
				wss_contract: null,
			},
			WBTC_WETH_10_POOL: {
				wss_contract: null,
			},
			MS_USDC_1_POOL: {
				wss_contract: null,
			},
			USDC_WETH_10_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_1_POOL: {
				wss_contract: null,
			},
			MATIC_USDC_10_POOL: {
				wss_contract: null,
			},
			DAI_WETH_100_POOL: {
				wss_contract: null,
			},
			USDC_WETH_50_POOL: {
				wss_contract: null,
			},
			FTM_WETH_100_POOL: {
				wss_contract: null,
			},
			AGT_FTM_100_POOL: {
				wss_contract: null,
			},
			LUSD_WETH_10_POOL: {
				wss_contract: null,
			},
			DAI_MKR_10_POOL: {
				wss_contract: null,
			},
			LINK_WETH_10_POOL: {
				wss_contract: null,
			},
			AGT_WETH_10_POOL: {
				wss_contract: null,
			},
		},
	},
	ArbitrumNova: {
		SushiSwapV2: {
			MOON_BRICK_POOL: {
				wss_contract: null,
			},
			BRICK_SUSHI_POOL: {
				wss_contract: null,
			},
			BRICK_DOUBLOON_POOL: {
				wss_contract: null,
			},
			MOON_BOPE_POOL: {
				wss_contract: null,
			},
			MOON_SUSHI_POOL: {
				wss_contract: null,
			},
			MOON_DOUBLOON_POOL: {
				wss_contract: null,
			},
			DOUBLOON_SUSHI_POOL: {
				wss_contract: null,
			},
		},
		RPCSwapV2: {
			BOPE_BRICK_POOL: {
				wss_contract: null,
			},
			BRICK_AIUS_POOL: {
				wss_contract: null,
			},
			MOON_BRICK_POOL: {
				wss_contract: null,
			},
			MOOND_BRICK_POOL: {
				wss_contract: null,
			},
			MOON_BOPE_POOL: {
				wss_contract: null,
			},
			MOOND_AIUS_POOL: {
				wss_contract: null,
			},
			MOON_MOOND_POOL: {
				wss_contract: null,
			},
		},
		ArbSwapV2: {
			WETH_ARB_POOL: {
				wss_contract: null,
			},
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			USDT_WETH_POOL: {
				wss_contract: null,
			},
			WETH_DAI_POOL: {
				wss_contract: null,
			},
			BRICK_WETH_POOL: {
				wss_contract: null,
			},
			BOPE_WETH_POOL: {
				wss_contract: null,
			},
			WETH_ARBS_POOL: {
				wss_contract: null,
			},
			MOON_WETH_POOL: {
				wss_contract: null,
			},
			WETH_SUSHI_POOL: {
				wss_contract: null,
			},
			WBTC_ARB_POOL: {
				wss_contract: null,
			},
			USDC_ARB_POOL: {
				wss_contract: null,
			},
			DAI_ARB_POOL: {
				wss_contract: null,
			},
			BRICK_ARB_POOL: {
				wss_contract: null,
			},
			ARBS_ARB_POOL: {
				wss_contract: null,
			},
			MOON_ARB_POOL: {
				wss_contract: null,
			},
			WBTC_USDC_POOL: {
				wss_contract: null,
			},
			WBTC_DAI_POOL: {
				wss_contract: null,
			},
			WBTC_BRICK_POOL: {
				wss_contract: null,
			},
			MOON_WBTC_POOL: {
				wss_contract: null,
			},
			USDC_DAI_POOL: {
				wss_contract: null,
			},
			BRICK_USDC_POOL: {
				wss_contract: null,
			},
			USDC_ARBS_POOL: {
				wss_contract: null,
			},
			MOON_USDC_POOL: {
				wss_contract: null,
			},
			BRICK_DAI_POOL: {
				wss_contract: null,
			},
			ARBS_DAI_POOL: {
				wss_contract: null,
			},
			MOON_DAI_POOL: {
				wss_contract: null,
			},
			BRICK_ARBS_POOL: {
				wss_contract: null,
			},
			MOON_BRICK_POOL: {
				wss_contract: null,
			},
			MOON_ARBS_POOL: {
				wss_contract: null,
			},
		},
		ArchlyV2: {
			WETH_ARB_POOL: {
				wss_contract: null,
			},
			WBTC_WETH_POOL: {
				wss_contract: null,
			},
			WETH_USDC_POOL: {
				wss_contract: null,
			},
			WETH_DAI_POOL: {
				wss_contract: null,
			},
			MOON_WETH_POOL: {
				wss_contract: null,
			},
			USDC_ARB_POOL: {
				wss_contract: null,
			},
			DAI_ARB_POOL: {
				wss_contract: null,
			},
			USDC_DAI_POOL: {
				wss_contract: null,
			},
		},
	},
	ZKFair: {
		AbstraDexV2: {
			ZKF_WUSDC_POOL: {
				wss_contract: null,
			},
			ETH_WUSDC_POOL: {
				wss_contract: null,
			},
		},
		SideSwapV2: {
			ZKF_ETH_POOL: {
				wss_contract: null,
			},
			ZKF_WBTC_POOL: {
				wss_contract: null,
			},
			ZKF_WUSDC_POOL: {
				wss_contract: null,
			},
			ZKF_USDT_POOL: {
				wss_contract: null,
			},
			ZKF_DAI_POOL: {
				wss_contract: null,
			},
			ZKF_SIDE_POOL: {
				wss_contract: null,
			},
			ZKF_FRS_POOL: {
				wss_contract: null,
			},
			ZKF_HPX_POOL: {
				wss_contract: null,
			},
			ETH_WBTC_POOL: {
				wss_contract: null,
			},
			ETH_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_ETH_POOL: {
				wss_contract: null,
			},
			WBTC_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_WBTC_POOL: {
				wss_contract: null,
			},
			USDT_WUSDC_POOL: {
				wss_contract: null,
			},
			DAI_WUSDC_POOL: {
				wss_contract: null,
			},
			SIDE_WUSDC_POOL: {
				wss_contract: null,
			},
			FRS_WUSDC_POOL: {
				wss_contract: null,
			},
			HPX_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_DAI_POOL: {
				wss_contract: null,
			},
			FRS_SIDE_POOL: {
				wss_contract: null,
			},
		},
		ZKFairSwapV2: {
			ZKF_WUSDC_POOL: {
				wss_contract: null,
			},
			ETH_WBTC_POOL: {
				wss_contract: null,
			},
			WBTC_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_WUSDC_POOL: {
				wss_contract: null,
			},
		},
		VenuSwapV2: {
			ZKF_WUSDC_POOL: {
				wss_contract: null,
			},
			ETH_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_WUSDC_POOL: {
				wss_contract: null,
			},
		},
		FurySwapV2: {
			ZKF_WUSDC_POOL: {
				wss_contract: null,
			},
			USDT_WUSDC_POOL: {
				wss_contract: null,
			},
		},
	},
	AstarZKevm: {},
	Fraxtal: {
		FraxSwapV2: {
			SFRXETH_WFRXETH_POOL: {
				wss_contract: null,
			},
			FXS_WFRXETH_POOL: {
				wss_contract: null,
			},
			FRAX_WFRXETH_POOL: {
				wss_contract: null,
			},
			WFRXETH_SFRAX_POOL: {
				wss_contract: null,
			},
			FXD_WFRXETH_POOL: {
				wss_contract: null,
			},
			RWA_WFRXETH_POOL: {
				wss_contract: null,
			},
			KFC_WFRXETH_POOL: {
				wss_contract: null,
			},
			FXS_SFRXETH_POOL: {
				wss_contract: null,
			},
			FRAX_SFRXETH_POOL: {
				wss_contract: null,
			},
			KFC_SFRXETH_POOL: {
				wss_contract: null,
			},
			FRAX_FPIS_POOL: {
				wss_contract: null,
			},
			FRAX_FPI_POOL: {
				wss_contract: null,
			},
			FRAX_FXS_POOL: {
				wss_contract: null,
			},
			FRAX_SFRAX_POOL: {
				wss_contract: null,
			},
			USDC_FRAX_POOL: {
				wss_contract: null,
			},
			RWA_KFC_POOL: {
				wss_contract: null,
			},
		},
		ArchlyV2: {
			ARC_WFRXETH_POOL: {
				wss_contract: null,
			},
			ARC_FRAX_POOL: {
				wss_contract: null,
			},
		},
		RaExchangeV2: {
			FXS_WFRXETH_POOL: {
				wss_contract: null,
			},
			WBTC_WFRXETH_POOL: {
				wss_contract: null,
			},
			FRAX_WFRXETH_POOL: {
				wss_contract: null,
			},
			AXLUSDC_WFRXETH_POOL: {
				wss_contract: null,
			},
			FXD_WFRXETH_POOL: {
				wss_contract: null,
			},
			RWA_WFRXETH_POOL: {
				wss_contract: null,
			},
			KFC_WFRXETH_POOL: {
				wss_contract: null,
			},
			AXLUSDC_FPIS_POOL: {
				wss_contract: null,
			},
			WBTC_FXS_POOL: {
				wss_contract: null,
			},
			AXLUSDC_FXS_POOL: {
				wss_contract: null,
			},
			WBTC_FRAX_POOL: {
				wss_contract: null,
			},
			AXLUSDC_FRAX_POOL: {
				wss_contract: null,
			},
			RWA_FRAX_POOL: {
				wss_contract: null,
			},
			SQUID_RWA_POOL: {
				wss_contract: null,
			},
			KFC_FXD_POOL: {
				wss_contract: null,
			},
			RWA_KFC_POOL: {
				wss_contract: null,
			},
		},
	},
};
// POOLS END --- DO NOT DELETE

// ------------- Creators
async function Creator_HeartBeatInterval() {
	try {
		const data = await fs.promises.readFile(__filename, "utf8");

		let lines = data.split("\n");

		for (const chain of chains) {
			const searchString = "// HEART_BEAT_INTERVAL START --- DO NOT DELETE";
			const insertString = `let ${chain.toUpperCase()}_HEART_BEAT_INTERVAL;`;

			if (data.includes(insertString)) continue;

			for (let i = 0; i < lines.length; i++) {
				if (lines[i].includes(searchString)) {
					lines.splice(i + 1, 0, insertString); // Insert after the found line
					break;
				}
			}
		}

		const modifiedData = lines.join("\n");

		await fs.promises.writeFile(__filename, modifiedData, "utf8");
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}

async function Creator_WssPoolProvider() {
	try {
		const data = await fs.promises.readFile(__filename, "utf8");

		let lines = data.split("\n");

		for (const chain of chains) {
			const searchString = "// WSS_POOL_PROVIDER START --- DO NOT DELETE";
			const insertString = `let ${chain.toUpperCase()}_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.${chain.toUpperCase()}_WSS_POOL_PROVIDER_URL);`;

			if (data.includes(insertString)) continue;

			for (let i = 0; i < lines.length; i++) {
				if (lines[i].includes(searchString)) {
					lines.splice(i + 1, 0, insertString); // Insert after the found line
					break;
				}
			}
		}

		const modifiedData = lines.join("\n");

		await fs.promises.writeFile(__filename, modifiedData, "utf8");
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}

async function Creator_Pools() {
	const pools = await BuilderPools();

	try {
		const data = await fs.promises.readFile(__filename, "utf8");

		let lines = data.split("\n");

		const searchString = "// POOLS START --- DO NOT DELETE";

		const insertString = `const Pools = ${JSON.stringify(pools, null, 2)}`;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes(searchString)) {
				lines.splice(i + 1, 0, insertString); // Insert after the found line
				break;
			}
		}

		const modifiedData = lines.join("\n");

		await fs.promises.writeFile(__filename, modifiedData, "utf8");
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}
// ------------- Creators

// ------------- Library
async function eventNameSelector(projectName) {
	if (projectName == "DysonFinanceV2") {
		return "Swap";
	} else if (projectName == "BalancerV2") {
		return "Swap";
	} else {
		return "Sync";
	}
}

async function poolNameSelector(projectName, pool) {
	if (projectName == "BalancerV2") {
		return `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_POOL`;
	} else if (projectName == "AntfarmFinanceV2") {
		const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

		return `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;
	} else {
		return pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	}
}

async function poolABISelector(projectName) {
	if (projectName == "BalancerV2") {
		return require(path.join(__dirname, `../Dex/PoolABIsV2/${projectName}WeightedPoolABI.json`));
	} else if (projectName == "DysonFinanceV2" || projectName == "AntfarmFinanceV2") {
		return require(path.join(__dirname, `../Dex/PoolABIsV2/${projectName}PoolABI.json`));
	} else {
		return require(path.join(__dirname, `../Dex/PoolABIsV2/UniswapV2PoolABI.json`));
	}
}

async function Server() {
	const server = http.createServer((req, res) => {
		if (req.url === "/data") {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify(global.StateV2));
		} else {
			res.writeHead(404);
			res.end();
		}
	});

	server.listen(StateV2ServerPort, () => {
		console.log(`Server listening on port ${StateV2ServerPort}`);
	});
}
// ------------- Library

// ------------- Initiator
async function BuilderPools() {
	const pools = {};

	for (const chain of chains) {
		pools[chain] = {};

		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const projectName in ProjectsV2) {
			pools[chain][projectName] = {};

			if (projectName == "BalancerV2") {
				pools[chain][projectName]["VAULT"] = {};
				pools[chain][projectName]["VAULT"].wss_contract = null;
				continue;
			}

			const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			for (const pool of poolsData) {
				const poolName = await poolNameSelector(projectName, pool);

				pools[chain][projectName][poolName] = {};

				pools[chain][projectName][poolName].wss_contract = null;
			}
		}
	}

	return pools;
}

async function BuilderReserves() {
	for (const chain of chains) {
		const reservesData = {};

		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const projectName in ProjectsV2) {
			reservesData[projectName] = {};

			const pools = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			for (const pool of pools) {
				const poolName = await poolNameSelector(projectName, pool);

				if (projectName == "DysonFinanceV2") {
					reservesData[projectName][poolName] = {
						address: "0x",
						reserve0: "100",
						reserve1: "100",
						feeRatio: ["100", "100"],
					};
				} else if (projectName == "BalancerV2") {
					reservesData[projectName][poolName] = {
						address: "0x",
						poolId: "0x",
						reserve0: "100",
						reserve1: "100",
					};
				} else {
					reservesData[projectName][poolName] = {
						address: "0x",
						reserve0: "100",
						reserve1: "100",
					};
				}
			}
		}

		const reservesPath = path.join(__dirname, `../Reserves/${chain}.json`);

		if (!fs.existsSync(reservesPath)) fs.writeFileSync(reservesPath, "", "utf8");

		fs.writeFileSync(reservesPath, JSON.stringify(reservesData, null, 2), "utf8");

		// console.log(reservesData);
	}
}

async function InitializerReserves() {
	for (const chain of chains) {
		const { POOL_PROVIDER_V2, ProjectsV2 } = require(`../Common/Common/${chain}`);

		const reservesPath = path.join(__dirname, `../Reserves/${chain}.json`);
		const reserveData = JSON.parse(fs.readFileSync(reservesPath, "utf8"));

		let VAULT;

		if (balancerChains.includes(chain)) {
			const { VAULT_ADDRESS } = require(`../Common/Common/${chain}`);

			VAULT = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, POOL_PROVIDER_V2);
		}

		for (const projectName in ProjectsV2) {
			const pools = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));
			const poolABI = await poolABISelector(projectName);

			for (const pool of pools) {
				const poolContractHttps = new ethers.Contract(pool.pool_address, poolABI, POOL_PROVIDER_V2);

				const poolName = await poolNameSelector(projectName, pool);

				reserveData[projectName][poolName].address = pool.pool_address;

				let reserves;
				let feeRatio;

				if (projectName == "DysonFinanceV2") {
					[reserves, feeRatio] = await Promise.all([poolContractHttps.getReserves(), poolContractHttps.getFeeRatio()]);

					reserveData[projectName][poolName].feeRatio = [feeRatio[0].toString(), feeRatio[1].toString()];
				} else if (projectName == "BalancerV2") {
					[, reserves] = await VAULT.getPoolTokens(pool.pool_id);

					reserveData[projectName][poolName].poolId = pool.pool_id;
				} else {
					reserves = await poolContractHttps.getReserves();
				}

				reserveData[projectName][poolName].reserve0 = reserves[0].toString();
				reserveData[projectName][poolName].reserve1 = reserves[1].toString();

				fs.writeFileSync(reservesPath, JSON.stringify(reserveData, null, 2), "utf8");

				// console.log(reserveData[projectName][poolName], chain);
			}
		}
	}
}

async function InitializerPools() {
	for (const chain of chains) {
		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const projectName in ProjectsV2) {
			const poolABI = await poolABISelector(projectName);
			const pools = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			if (projectName == "BalancerV2") {
				const { VAULT_ADDRESS } = require(`../Common/Common/${chain}`);

				const VAULT_ABI = require("../Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

				Pools[chain][projectName]["VAULT"].wss_contract = new ethersV5.Contract(VAULT_ADDRESS, VAULT_ABI, eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`));

				continue;
			}

			for (const pool of pools) {
				const poolName = await poolNameSelector(projectName, pool);

				Pools[chain][projectName][poolName].wss_contract = new ethersV5.Contract(pool.pool_address, poolABI, eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`));
			}
		}
	}
}
// ------------- Initiator

// ------------- Event Listening
async function Listen() {
	async function re_initialize(chain) {
		console.log("re_initialize started for -->", chain);

		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		// global[`${chain.toUpperCase()}_WSS_POOL_PROVIDER`] = new ethersV5.providers.WebSocketProvider(process.env[`${chain.toUpperCase()}_WSS_POOL_PROVIDER_URL`]);

		const NEW_WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env[`${chain.toUpperCase()}_WSS_POOL_PROVIDER_URL`]);

		for (const projectName in ProjectsV2) {
			const poolABI = await poolABISelector(projectName);
			const pools = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			if (projectName == "BalancerV2") {
				const { VAULT_ADDRESS } = require(`../Common/Common/${chain}`);

				const VAULT_ABI = require("../Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

				// Pools[chain][projectName]["VAULT"].wss_contract = new ethersV5.Contract(VAULT_ADDRESS, VAULT_ABI, eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`));

				Pools[chain][projectName]["VAULT"].wss_contract = new ethersV5.Contract(VAULT_ADDRESS, VAULT_ABI, NEW_WSS_POOL_PROVIDER);

				continue;
			}

			for (const pool of pools) {
				const poolName = await poolNameSelector(projectName, pool);

				// Pools[chain][projectName][poolName].wss_contract = new ethersV5.Contract(pool.pool_address, poolABI, eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`));

				Pools[chain][projectName][poolName].wss_contract = new ethersV5.Contract(pool.pool_address, poolABI, NEW_WSS_POOL_PROVIDER);
			}
		}

		console.log("re_initialize doneeeeeeeee for -->", chain);
	}

	async function addListeners(chain) {
		const { ProjectsV2, POOL_PROVIDER_V2 } = require(`../Common/Common/${chain}`);

		const reservesPath = path.join(__dirname, `../Reserves/${chain}.json`);
		const reserveData = JSON.parse(fs.readFileSync(reservesPath, "utf8"));

		for (const projectName in ProjectsV2) {
			const pools = JSON.parse(fs.readFileSync(path.join(__dirname, `../Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));
			const poolABI = await poolABISelector(projectName);
			const eventName = await eventNameSelector(projectName);

			if (projectName == "BalancerV2") {
				const { VAULT_ADDRESS } = require(`../Common/Common/${chain}`);

				const VAULT_ABI = require("../Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

				const VAULT = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, POOL_PROVIDER_V2);

				console.log("Old Listener Count of", VAULT_ADDRESS, Pools[chain][projectName]["VAULT"].wss_contract.listenerCount(eventName));

				await Pools[chain][projectName]["VAULT"].wss_contract.removeAllListeners("Swap");

				console.log("Removed Listener Count of", VAULT_ADDRESS, Pools[chain][projectName]["VAULT"].wss_contract.listenerCount(eventName));

				Pools[chain][projectName]["VAULT"].wss_contract.on(eventName, async (poolId, tokenIn, tokenOut, amountIn, amountOut) => {
					try {
						for (const pool of pools) {
							if (pool.pool_id !== poolId) continue;

							const poolName = await poolNameSelector(projectName, pool);

							const [, reserves] = await VAULT.getPoolTokens(poolId);

							reserveData[projectName][poolName].reserve0 = reserves[0].toString();
							reserveData[projectName][poolName].reserve1 = reserves[1].toString();

							console.log("reserve0 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve0, chain, projectName, poolName);
							console.log("reserve1 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve1, chain, projectName, poolName);

							fs.writeFileSync(reservesPath, JSON.stringify(reserveData, null, 2), "utf8");
						}
					} catch (error) {
						console.error("Error fetching reserves or fee ratio:", error);
					}
				});

				console.log("Added Listener Count of", VAULT_ADDRESS, Pools[chain][projectName]["VAULT"].wss_contract.listenerCount(eventName));

				continue;
			}

			for (const pool of pools) {
				const poolName = await poolNameSelector(projectName, pool);
				const eventName = await eventNameSelector(projectName);

				console.log("Old Listener Count of", reserveData[projectName][poolName].address, Pools[chain][projectName][poolName].wss_contract.listenerCount(eventName));

				await Pools[chain][projectName][poolName].wss_contract.removeAllListeners("Swap");

				console.log("Removed Listener Count of", reserveData[projectName][poolName].address, Pools[chain][projectName][poolName].wss_contract.listenerCount(eventName));

				if (projectName == "DysonFinanceV2") {
					Pools[chain][projectName][poolName].wss_contract.on(eventName, async (sender, isSwap0, amountIn, amountOut, to) => {
						try {
							const poolContract = new ethers.Contract(reserveData[projectName][poolName].address, poolABI, POOL_PROVIDER_V2);

							const [reserves, feeRatio] = await Promise.all([poolContract.getReserves(), poolContract.getFeeRatio()]);

							reserveData[projectName][poolName].reserve0 = reserves[0].toString();
							reserveData[projectName][poolName].reserve1 = reserves[1].toString();
							reserveData[projectName][poolName].feeRatio = [feeRatio[0].toString(), feeRatio[1].toString()];

							console.log("reserve0 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve0, chain, projectName, poolName);
							console.log("reserve1 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve1, chain, projectName, poolName);
							console.log("feeRatio of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].feeRatio, chain, projectName, poolName);

							fs.writeFileSync(reservesPath, JSON.stringify(reserveData, null, 2), "utf8");
						} catch (error) {
							console.error("Error Listening on DysonFinanceV2", error);
							console.error("Error Listening on DysonFinanceV2", chain, projectName, poolName);
						}
					});
				} else {
					Pools[chain][projectName][poolName].wss_contract.on(eventName, async (reserve0, reserve1) => {
						try {
							reserveData[projectName][poolName].reserve0 = reserve0.toString();
							reserveData[projectName][poolName].reserve1 = reserve1.toString();

							console.log("reserve0 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve0, chain, projectName, poolName);
							console.log("reserve1 of", reserveData[projectName][poolName].address, reserveData[projectName][poolName].reserve1, chain, projectName, poolName);

							fs.writeFileSync(reservesPath, JSON.stringify(reserveData, null, 2), "utf8");
						} catch (error) {
							console.error("Error Listening on V2", error);
							console.error("Error Listening on V2", chain, projectName, poolName);
						}
					});
				}

				console.log("Added Listener Count of", reserveData[projectName][poolName].address, Pools[chain][projectName][poolName].wss_contract.listenerCount(eventName));
			}
		}
	}

	async function setupHeartbeat(chain) {
		clearInterval(eval(`${chain.toUpperCase()}_HEART_BEAT_INTERVAL`));

		global[`${chain.toUpperCase()}_HEART_BEAT_INTERVAL`] = setInterval(() => {
			eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`)._websocket.ping();
		}, 15000);
	}

	async function monitorPool(chain) {
		await addListeners(chain);

		eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`)._websocket.on("open", async () => {
			console.log("WebSocket connection opened.", chain);
			await setupHeartbeat(chain);
		});

		eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`)._websocket.on("close", async () => {
			console.log("WebSocket connection closed. Attempting to reconnect...", chain);
			clearInterval(eval(`${chain.toUpperCase()}_HEART_BEAT_INTERVAL`));
			await reconnect(chain);
		});

		eval(`${chain.toUpperCase()}_WSS_POOL_PROVIDER`)._websocket.on("error", async (error) => {
			console.error("WebSocket error:", error, chain);
			clearInterval(eval(`${chain.toUpperCase()}_HEART_BEAT_INTERVAL`));
			await reconnect(chain);
		});
	}

	async function reconnect(chain) {
		setTimeout(async () => {
			console.log("Reconnecting to WebSocket...", chain);
			await re_initialize(chain);
			monitorPool(chain);
		}, 15000);
	}

	for (const chain of chains) {
		await monitorPool(chain);
	}
}
// ------------- Event Listening

async function Runner() {
	try {
		// ------- Creators
		// await Creator_HeartBeatInterval();
		// console.log("Creator_HeartBeatInterval Done");

		// await Creator_WssPoolProvider();
		// console.log("Creator_WssPoolProvider Done");

		// await Creator_Pools();
		// console.log("Creator_Pools Done");
		// ------- Creators

		// ------- Builders
		// await BuilderReserves();
		// console.log("BuilderReserves Done");

		await InitializerReserves();
		console.log("InitializerReserves Done");

		await InitializerPools();
		console.log("InitializerPools Done");
		// ------- Builders

		await Listen();
		console.log("Listen Done");

		// await Server();
		// console.log("Server Done");
	} catch (error) {
		console.error("Error occurred -->", error);
	}
}

Runner();
