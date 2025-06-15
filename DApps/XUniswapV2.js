const {
	ethers,
	ethersV5,
	fs,
	path,
	encoder,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	overhead,
	scalar,
	ERC20,
	chains,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	CoinMarketCapServerPort,
	PythServerPort,
	FeeDataServerPort,
	maxFeePerGas_multiplier,
	maxPriorityFeePerGas_multiplier,
	gasPrice_multiplier,
} = require("../Scripts/Common/Global/Global");

const { saveError, getVendableV3Pools, getVendableV2Pools, getVendableV2AntfarmPools, getFlashPool, getMarketPrice, getAmountOut, getAmountIn, getAmountOut_Antfarm, saveProfit, saveProfitToCSV, getDataFromLocalServer } = require("../Scripts/Library/LibraryV2");

const poolABI = require(path.join(__dirname, `../Scripts/Dex/PoolABIsV2/UniswapV2PoolABI.json`));

// True --> Processing || False --> Not Processing --- START DO NOT DELETE
const PoolProcessController = {
	Linea: {
		DysonFinanceV2: {
			USDC_WETH_POOL: {
				processing: false,
			},
		},
		PancakeSwapV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			WSTETH_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			DAI_WETH_POOL: {
				processing: false,
			},
			WETH_BNB_POOL: {
				processing: false,
			},
			CAKE_WETH_POOL: {
				processing: false,
			},
			FOXY_WETH_POOL: {
				processing: false,
			},
			WBTC_USDT_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			USDC_DAI_POOL: {
				processing: false,
			},
			CAKE_USDC_POOL: {
				processing: false,
			},
			CAKE_USDT_POOL: {
				processing: false,
			},
		},
		SushiSwapV2: {
			USDC_WETH_POOL: {
				processing: false,
			},
			WETH_AXLUSDC_POOL: {
				processing: false,
			},
		},
		EchoDexV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			WSTETH_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			DAI_WETH_POOL: {
				processing: false,
			},
			WETH_AXLUSDC_POOL: {
				processing: false,
			},
			BUSD_WETH_POOL: {
				processing: false,
			},
			MATIC_WETH_POOL: {
				processing: false,
			},
			WETH_BNB_POOL: {
				processing: false,
			},
			AVAX_WETH_POOL: {
				processing: false,
			},
			ECP_WETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			USDC_DAI_POOL: {
				processing: false,
			},
			USDC_BUSD_POOL: {
				processing: false,
			},
			USDT_AXLUSDC_POOL: {
				processing: false,
			},
			MATIC_BUSD_POOL: {
				processing: false,
			},
			AVAX_BUSD_POOL: {
				processing: false,
			},
			BUSD_ECP_POOL: {
				processing: false,
			},
			MATIC_BNB_POOL: {
				processing: false,
			},
			MATIC_AVAX_POOL: {
				processing: false,
			},
			MATIC_ECP_POOL: {
				processing: false,
			},
			AVAX_BNB_POOL: {
				processing: false,
			},
			ECP_BNB_POOL: {
				processing: false,
			},
			AVAX_ECP_POOL: {
				processing: false,
			},
		},
		ElkFinanceV2: {
			USDC_WETH_POOL: {
				processing: false,
			},
			BUSD_WETH_POOL: {
				processing: false,
			},
		},
		SectaFinanceV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			WSTETH_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			DAI_WETH_POOL: {
				processing: false,
			},
			MENDI_WETH_POOL: {
				processing: false,
			},
			DAI_WSTETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			DAI_USDT_POOL: {
				processing: false,
			},
		},
		NileV2: {
			WEETH_WETH_POOL: {
				processing: false,
			},
			WRSETH_WETH_POOL: {
				processing: false,
			},
			EZETH_WETH_POOL: {
				processing: false,
			},
			WSTETH_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			NILE_WETH_POOL: {
				processing: false,
			},
			ZERO_WETH_POOL: {
				processing: false,
			},
			WEETH_WRSETH_POOL: {
				processing: false,
			},
			USDC_EZETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			USDC_NILE_POOL: {
				processing: false,
			},
			USDC_MENDI_POOL: {
				processing: false,
			},
		},
		LynexV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			WEETH_WETH_POOL: {
				processing: false,
			},
			EZETH_WETH_POOL: {
				processing: false,
			},
			WSTETH_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			MATIC_WETH_POOL: {
				processing: false,
			},
			NILE_WETH_POOL: {
				processing: false,
			},
			LYNX_WETH_POOL: {
				processing: false,
			},
			MENDI_WETH_POOL: {
				processing: false,
			},
			ZERO_WETH_POOL: {
				processing: false,
			},
			FOXY_WETH_POOL: {
				processing: false,
			},
			USDC_WBTC_POOL: {
				processing: false,
			},
			LYNX_WBTC_POOL: {
				processing: false,
			},
			USDC_WEETH_POOL: {
				processing: false,
			},
			LYNX_WEETH_POOL: {
				processing: false,
			},
			WEETH_FOXY_POOL: {
				processing: false,
			},
			USDC_EZETH_POOL: {
				processing: false,
			},
			EZETH_USDT_POOL: {
				processing: false,
			},
			USDC_WSTETH_POOL: {
				processing: false,
			},
			LYNX_WSTETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			USDC_DAI_POOL: {
				processing: false,
			},
			USDC_MAI_POOL: {
				processing: false,
			},
			USDC_LYNX_POOL: {
				processing: false,
			},
			USDC_MENDI_POOL: {
				processing: false,
			},
			USDC_FOXY_POOL: {
				processing: false,
			},
			AGEUR_USDT_POOL: {
				processing: false,
			},
			LYNX_USDT_POOL: {
				processing: false,
			},
			MENDI_USDT_POOL: {
				processing: false,
			},
			LYNX_MATIC_POOL: {
				processing: false,
			},
			MATIC_MENDI_POOL: {
				processing: false,
			},
			LYNX_FOXY_POOL: {
				processing: false,
			},
		},
		MetaVaultV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
		},
		LeetSwapV2: {
			WBTC_WETH_POOL: {
				processing: false,
			},
			USDC_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			BUSD_WETH_POOL: {
				processing: false,
			},
			USDC_USDT_POOL: {
				processing: false,
			},
			USDC_BUSD_POOL: {
				processing: false,
			},
			BUSD_USDT_POOL: {
				processing: false,
			},
		},
	},
	PolygonzkEVM: {
		DysonFinanceV2: {
			WETH_USDC_POOL: {
				processing: false,
			},
			DYSN_USDC_POOL: {
				processing: false,
			},
		},
		AntfarmFinanceV2: {
			ATF_WETH_1_POOL: {
				processing: false,
			},
			WETH_MATIC_1_POOL: {
				processing: false,
			},
			ATF_WETH_10_POOL: {
				processing: false,
			},
			ATF_WETH_25_POOL: {
				processing: false,
			},
			ATF_WETH_50_POOL: {
				processing: false,
			},
			WETH_USDC_10_POOL: {
				processing: false,
			},
			WETH_USDC_100_POOL: {
				processing: false,
			},
			WETH_USDC_1_POOL: {
				processing: false,
			},
			ATF_USDC_10_POOL: {
				processing: false,
			},
			ATF_MATIC_10_POOL: {
				processing: false,
			},
			ATF_USDC_1_POOL: {
				processing: false,
			},
			ATF_MATIC_1_POOL: {
				processing: false,
			},
			MATIC_USDC_10_POOL: {
				processing: false,
			},
			WETH_MATIC_10_POOL: {
				processing: false,
			},
			MATIC_USDC_1_POOL: {
				processing: false,
			},
			WETH_USDC_50_POOL: {
				processing: false,
			},
			ATF_USDC_25_POOL: {
				processing: false,
			},
			WETH_USDC_25_POOL: {
				processing: false,
			},
			ATF_USDC_50_POOL: {
				processing: false,
			},
			MATIC_USDC_25_POOL: {
				processing: false,
			},
			USDT_WETH_1_POOL: {
				processing: false,
			},
			USDT_WETH_10_POOL: {
				processing: false,
			},
			ATF_USDT_1_POOL: {
				processing: false,
			},
			USDT_USDC_1_POOL: {
				processing: false,
			},
			USDT_USDC_10_POOL: {
				processing: false,
			},
		},
		BalancerV2: {
			USDC_CFT_DAI_CFT_0_001_POOL: {
				processing: false,
			},
			BAL_WETH_0_003_POOL: {
				processing: false,
			},
			USDT_DAI_0_003_POOL: {
				processing: false,
			},
			USDT_USDC_0_01_POOL: {
				processing: false,
			},
			USDT_USDC_0_0001_POOL: {
				processing: false,
			},
			WETH_MATIC_0_01_POOL: {
				processing: false,
			},
			USDC_DAI_0_005_POOL: {
				processing: false,
			},
			USDC_DAI_0_01_POOL: {
				processing: false,
			},
			MATIC_USDC_0_001_POOL: {
				processing: false,
			},
			USDT_USDC_0_003_POOL: {
				processing: false,
			},
			WETH_WBTC_0_003_POOL: {
				processing: false,
			},
			USDT_USDC_0_001_POOL: {
				processing: false,
			},
			WETH_RETH_0_003_POOL: {
				processing: false,
			},
			USDC_DAI_0_004_POOL: {
				processing: false,
			},
			WETH_USDC_0_003_POOL: {
				processing: false,
			},
			USDC_DAI_0_002_POOL: {
				processing: false,
			},
			USDC_DAI_0_003_POOL: {
				processing: false,
			},
			USDT_MATIC_0_003_POOL: {
				processing: false,
			},
			WETH_STMATIC_0_003_POOL: {
				processing: false,
			},
			WETH_USDC_0_01_POOL: {
				processing: false,
			},
			BAL_DAI_0_01_POOL: {
				processing: false,
			},
			WETH_DAI_0_01_POOL: {
				processing: false,
			},
			WETH_DAI_0_003_POOL: {
				processing: false,
			},
		},
		PancakeSwapV2: {
			USDT_DAI_POOL: {
				processing: false,
			},
			USDC_CFT_USDC_POOL: {
				processing: false,
			},
			USDT_USDC_POOL: {
				processing: false,
			},
			WETH_USDC_POOL: {
				processing: false,
			},
			USDC_WBTC_POOL: {
				processing: false,
			},
			MATIC_USDC_POOL: {
				processing: false,
			},
			CAKE_USDC_POOL: {
				processing: false,
			},
			USDC_CFT_WETH_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			USDT_WBTC_POOL: {
				processing: false,
			},
			USDT_MATIC_POOL: {
				processing: false,
			},
			CAKE_USDT_POOL: {
				processing: false,
			},
			WETH_RETH_POOL: {
				processing: false,
			},
			WETH_WBTC_POOL: {
				processing: false,
			},
			WETH_MATIC_POOL: {
				processing: false,
			},
			ATF_WETH_POOL: {
				processing: false,
			},
			CAKE_WETH_POOL: {
				processing: false,
			},
			CAKE_RETH_POOL: {
				processing: false,
			},
			STMATIC_MATIC_POOL: {
				processing: false,
			},
		},
		zkEVMSwapV2: {
			USDC_DAI_POOL: {
				processing: false,
			},
			WETH_DAI_POOL: {
				processing: false,
			},
			USDT_USDC_POOL: {
				processing: false,
			},
			WETH_USDC_POOL: {
				processing: false,
			},
			MATIC_USDC_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			USDT_MATIC_POOL: {
				processing: false,
			},
			WETH_MATIC_POOL: {
				processing: false,
			},
			MATIC_WBTC_POOL: {
				processing: false,
			},
		},
		FlashLiquidityV2: {
			WETH_USDC_POOL: {
				processing: false,
			},
			MATIC_USDC_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
		},
	},
	XLayer: {
		DysonFinanceV2: {
			USDC_WOKB_POOL: {
				processing: false,
			},
		},
		RevoSwapV2: {
			WETH_WOKB_POOL: {
				processing: false,
			},
			WOKB_WBTC_POOL: {
				processing: false,
			},
			USDT_WOKB_POOL: {
				processing: false,
			},
			USDC_WOKB_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			USDT_USDC_POOL: {
				processing: false,
			},
		},
		PotatoSwapV2: {
			WETH_WOKB_POOL: {
				processing: false,
			},
			USDT_WOKB_POOL: {
				processing: false,
			},
			USDC_WOKB_POOL: {
				processing: false,
			},
			PUFF_WOKB_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			USDT_USDC_POOL: {
				processing: false,
			},
		},
		StationDexV2: {
			WETH_WOKB_POOL: {
				processing: false,
			},
			USDT_WOKB_POOL: {
				processing: false,
			},
			USDT_USDC_POOL: {
				processing: false,
			},
		},
		AbstraDexV2: {
			WETH_WOKB_POOL: {
				processing: false,
			},
			USDT_WOKB_POOL: {
				processing: false,
			},
			ABS_WOKB_POOL: {
				processing: false,
			},
			PEPE_WOKB_POOL: {
				processing: false,
			},
		},
		DackieSwapV2: {
			USDC_WOKB_POOL: {
				processing: false,
			},
		},
		DyorSwapV2: {},
		TitanDexV2: {
			USDC_WOKB_POOL: {
				processing: false,
			},
		},
	},
	Blast: {
		DysonFinanceV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
		},
		UniswapV2: {
			EZETH_WETH_POOL: {
				processing: false,
			},
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_OLE_POOL: {
				processing: false,
			},
			WETH_BAG_POOL: {
				processing: false,
			},
			WETH_JUICE_POOL: {
				processing: false,
			},
			YES_WETH_POOL: {
				processing: false,
			},
			WETH_PAC_POOL: {
				processing: false,
			},
			WETH_YIELD_POOL: {
				processing: false,
			},
			KAP_WETH_POOL: {
				processing: false,
			},
			WETH_ANDY_POOL: {
				processing: false,
			},
			ORBIT_WETH_POOL: {
				processing: false,
			},
			USDB_PAC_POOL: {
				processing: false,
			},
		},
		Thruster03V2: {
			WETH_WBTC_POOL: {
				processing: false,
			},
			EZETH_WETH_POOL: {
				processing: false,
			},
			WEETH_WETH_POOL: {
				processing: false,
			},
			WETH_WRSETH_POOL: {
				processing: false,
			},
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_OLE_POOL: {
				processing: false,
			},
			WETH_BAG_POOL: {
				processing: false,
			},
			WETH_JUICE_POOL: {
				processing: false,
			},
			YES_WETH_POOL: {
				processing: false,
			},
			WETH_SSS_POOL: {
				processing: false,
			},
			WETH_PAC_POOL: {
				processing: false,
			},
			WETH_YIELD_POOL: {
				processing: false,
			},
			KAP_WETH_POOL: {
				processing: false,
			},
			WETH_ANDY_POOL: {
				processing: false,
			},
			WETH_BLADE_POOL: {
				processing: false,
			},
			WETH_EARLY_POOL: {
				processing: false,
			},
			ORBIT_WETH_POOL: {
				processing: false,
			},
			EZETH_USDB_POOL: {
				processing: false,
			},
			WEETH_USDB_POOL: {
				processing: false,
			},
			USDB_AXLUSDC_POOL: {
				processing: false,
			},
			USDB_OLE_POOL: {
				processing: false,
			},
			USDB_JUICE_POOL: {
				processing: false,
			},
			YES_USDB_POOL: {
				processing: false,
			},
			USDB_SSS_POOL: {
				processing: false,
			},
			USDB_PAC_POOL: {
				processing: false,
			},
			USDB_ANDY_POOL: {
				processing: false,
			},
			USDB_EARLY_POOL: {
				processing: false,
			},
			ORBIT_USDB_POOL: {
				processing: false,
			},
			OLE_JUICE_POOL: {
				processing: false,
			},
			PAC_OLE_POOL: {
				processing: false,
			},
			YES_ORBIT_POOL: {
				processing: false,
			},
		},
		Thruster10V2: {
			WEETH_WETH_POOL: {
				processing: false,
			},
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_OLE_POOL: {
				processing: false,
			},
			WETH_JUICE_POOL: {
				processing: false,
			},
			YES_WETH_POOL: {
				processing: false,
			},
			WETH_PAC_POOL: {
				processing: false,
			},
			WETH_YIELD_POOL: {
				processing: false,
			},
			KAP_WETH_POOL: {
				processing: false,
			},
			WETH_ANDY_POOL: {
				processing: false,
			},
			WETH_EARLY_POOL: {
				processing: false,
			},
			ORBIT_WETH_POOL: {
				processing: false,
			},
			YES_USDB_POOL: {
				processing: false,
			},
			USDB_ANDY_POOL: {
				processing: false,
			},
			ORBIT_USDB_POOL: {
				processing: false,
			},
			YES_ORBIT_POOL: {
				processing: false,
			},
		},
		SushiSwapV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
			USDB_AXLUSDC_POOL: {
				processing: false,
			},
		},
		DackieSwapV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
		},
		MonoSwapV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_MUSD_POOL: {
				processing: false,
			},
			WETH_PAC_POOL: {
				processing: false,
			},
			USDB_MUSD_POOL: {
				processing: false,
			},
			OLE_MUSD_POOL: {
				processing: false,
			},
			PAC_ANDY_POOL: {
				processing: false,
			},
		},
		CyberBlastV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
		},
		BlasterSwapV2: {
			EZETH_WETH_POOL: {
				processing: false,
			},
			WETH_WRSETH_POOL: {
				processing: false,
			},
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_OLE_POOL: {
				processing: false,
			},
			WETH_PAC_POOL: {
				processing: false,
			},
			KAP_WETH_POOL: {
				processing: false,
			},
			ORBIT_WETH_POOL: {
				processing: false,
			},
			RBX_WETH_POOL: {
				processing: false,
			},
			EZETH_USDB_POOL: {
				processing: false,
			},
			EZETH_OLE_POOL: {
				processing: false,
			},
			EZETH_PAC_POOL: {
				processing: false,
			},
			USDB_WRSETH_POOL: {
				processing: false,
			},
			PAC_WRSETH_POOL: {
				processing: false,
			},
			USDB_OLE_POOL: {
				processing: false,
			},
			USDB_PAC_POOL: {
				processing: false,
			},
			KAP_USDB_POOL: {
				processing: false,
			},
			ORBIT_USDB_POOL: {
				processing: false,
			},
			RBX_USDB_POOL: {
				processing: false,
			},
			PAC_OLE_POOL: {
				processing: false,
			},
			RBX_OLE_POOL: {
				processing: false,
			},
			KAP_PAC_POOL: {
				processing: false,
			},
			RBX_PAC_POOL: {
				processing: false,
			},
		},
		DyorSwapV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
			WETH_ANDY_POOL: {
				processing: false,
			},
		},
		SwapBlastV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
		},
		HyperBlastV2: {
			USDB_WETH_POOL: {
				processing: false,
			},
			KAP_WETH_POOL: {
				processing: false,
			},
		},
	},
	Avalanche: {
		AntfarmFinanceV2: {
			ATF_WAVAX_1_POOL: {
				processing: false,
			},
			PHAR_WAVAX_22_2_POOL: {
				processing: false,
			},
			ATF_USDC_1_POOL: {
				processing: false,
			},
			WAVAX_USDC_50_POOL: {
				processing: false,
			},
			WAVAX_USDC_22_2_POOL: {
				processing: false,
			},
			CAI_USDC_50_POOL: {
				processing: false,
			},
			CAI_USDC_22_2_POOL: {
				processing: false,
			},
			USDC_CLY_100_POOL: {
				processing: false,
			},
			USDC_CLY_50_POOL: {
				processing: false,
			},
			JOE_WAVAX_22_2_POOL: {
				processing: false,
			},
			ATF_WETH_CFT_10_5_POOL: {
				processing: false,
			},
			ATF_WETH_CFT_22_2_POOL: {
				processing: false,
			},
			ATF_WETH_CFT_50_POOL: {
				processing: false,
			},
			ATF_WAVAX_10_5_POOL: {
				processing: false,
			},
			ATF_WAVAX_22_2_POOL: {
				processing: false,
			},
			ATF_WAVAX_50_POOL: {
				processing: false,
			},
			ATF_USDC_50_POOL: {
				processing: false,
			},
			BTC_CFT_USDC_10_5_POOL: {
				processing: false,
			},
			USDC_CLY_1_POOL: {
				processing: false,
			},
			ATF_USDC_22_2_POOL: {
				processing: false,
			},
			ATF_CLY_1_POOL: {
				processing: false,
			},
			ATF_CAI_1_POOL: {
				processing: false,
			},
			TECH_WAVAX_100_POOL: {
				processing: false,
			},
			TECH_WAVAX_50_POOL: {
				processing: false,
			},
			ATF_TECH_1_POOL: {
				processing: false,
			},
			CAI_TECH_22_2_POOL: {
				processing: false,
			},
			TECH_CLY_50_POOL: {
				processing: false,
			},
			TECH_WAVAX_1_POOL: {
				processing: false,
			},
			TECH_WAVAX_22_2_POOL: {
				processing: false,
			},
			TECH_USDC_100_POOL: {
				processing: false,
			},
			KIMBO_TECH_100_POOL: {
				processing: false,
			},
			KIMBO_TECH_50_POOL: {
				processing: false,
			},
			KIMBO_TECH_22_2_POOL: {
				processing: false,
			},
			ATF_KIMBO_1_POOL: {
				processing: false,
			},
			COQ_TECH_100_POOL: {
				processing: false,
			},
			BTC_CFT_CLY_22_2_POOL: {
				processing: false,
			},
			BTC_CFT_CLY_50_POOL: {
				processing: false,
			},
		},
	},
	Arbitrum: {
		AntfarmFinanceV2: {
			ATF_ARB_1_POOL: {
				processing: false,
			},
			WETH_ARB_25_POOL: {
				processing: false,
			},
			ATF_WETH_1_POOL: {
				processing: false,
			},
			ATF_WETH_10_POOL: {
				processing: false,
			},
			ATF_WETH_25_POOL: {
				processing: false,
			},
			ATF_WETH_50_POOL: {
				processing: false,
			},
			ATF_ARB_10_POOL: {
				processing: false,
			},
			ATF_ARB_25_POOL: {
				processing: false,
			},
			ATF_LUSD_1_POOL: {
				processing: false,
			},
			LUSD_LQTY_25_POOL: {
				processing: false,
			},
			ATF_USDC_1_POOL: {
				processing: false,
			},
		},
	},
	Ethereum: {
		AntfarmFinanceV2: {
			ATF_WETH_1_POOL: {
				processing: false,
			},
			ATF_USDC_1_POOL: {
				processing: false,
			},
			ATF_USDT_1_POOL: {
				processing: false,
			},
			ATF_DAI_1_POOL: {
				processing: false,
			},
			ATF_LUSD_1_POOL: {
				processing: false,
			},
			ATF_WBTC_1_POOL: {
				processing: false,
			},
			ATF_USDC_10_POOL: {
				processing: false,
			},
			ATF_USDC_25_POOL: {
				processing: false,
			},
			ATF_USDC_50_POOL: {
				processing: false,
			},
			ATF_AGT_1_POOL: {
				processing: false,
			},
			ATF_AGT_10_POOL: {
				processing: false,
			},
			ATF_AGT_25_POOL: {
				processing: false,
			},
			ATF_AGT_50_POOL: {
				processing: false,
			},
			ATF_WETH_10_POOL: {
				processing: false,
			},
			ATF_WETH_25_POOL: {
				processing: false,
			},
			ATF_WETH_50_POOL: {
				processing: false,
			},
			USDC_WETH_1_POOL: {
				processing: false,
			},
			MS_WETH_25_POOL: {
				processing: false,
			},
			MS_WETH_50_POOL: {
				processing: false,
			},
			ATF_WBTC_10_POOL: {
				processing: false,
			},
			WBTC_WETH_10_POOL: {
				processing: false,
			},
			MS_USDC_1_POOL: {
				processing: false,
			},
			USDC_WETH_10_POOL: {
				processing: false,
			},
			MATIC_USDC_1_POOL: {
				processing: false,
			},
			MATIC_USDC_10_POOL: {
				processing: false,
			},
			DAI_WETH_100_POOL: {
				processing: false,
			},
			USDC_WETH_50_POOL: {
				processing: false,
			},
			FTM_WETH_100_POOL: {
				processing: false,
			},
			AGT_FTM_100_POOL: {
				processing: false,
			},
			LUSD_WETH_10_POOL: {
				processing: false,
			},
			DAI_MKR_10_POOL: {
				processing: false,
			},
			LINK_WETH_10_POOL: {
				processing: false,
			},
			AGT_WETH_10_POOL: {
				processing: false,
			},
		},
	},
	ArbitrumNova: {
		SushiSwapV2: {
			MOON_BRICK_POOL: {
				processing: false,
			},
			BRICK_SUSHI_POOL: {
				processing: false,
			},
			BRICK_DOUBLOON_POOL: {
				processing: false,
			},
			MOON_BOPE_POOL: {
				processing: false,
			},
			MOON_SUSHI_POOL: {
				processing: false,
			},
			MOON_DOUBLOON_POOL: {
				processing: false,
			},
			DOUBLOON_SUSHI_POOL: {
				processing: false,
			},
		},
		RPCSwapV2: {
			BOPE_BRICK_POOL: {
				processing: false,
			},
			BRICK_AIUS_POOL: {
				processing: false,
			},
			MOON_BRICK_POOL: {
				processing: false,
			},
			MOOND_BRICK_POOL: {
				processing: false,
			},
			MOON_BOPE_POOL: {
				processing: false,
			},
			MOOND_AIUS_POOL: {
				processing: false,
			},
			MOON_MOOND_POOL: {
				processing: false,
			},
		},
		ArbSwapV2: {
			WETH_ARB_POOL: {
				processing: false,
			},
			WBTC_WETH_POOL: {
				processing: false,
			},
			WETH_USDC_POOL: {
				processing: false,
			},
			USDT_WETH_POOL: {
				processing: false,
			},
			WETH_DAI_POOL: {
				processing: false,
			},
			BRICK_WETH_POOL: {
				processing: false,
			},
			BOPE_WETH_POOL: {
				processing: false,
			},
			WETH_ARBS_POOL: {
				processing: false,
			},
			MOON_WETH_POOL: {
				processing: false,
			},
			WETH_SUSHI_POOL: {
				processing: false,
			},
			WBTC_ARB_POOL: {
				processing: false,
			},
			USDC_ARB_POOL: {
				processing: false,
			},
			DAI_ARB_POOL: {
				processing: false,
			},
			BRICK_ARB_POOL: {
				processing: false,
			},
			ARBS_ARB_POOL: {
				processing: false,
			},
			MOON_ARB_POOL: {
				processing: false,
			},
			WBTC_USDC_POOL: {
				processing: false,
			},
			WBTC_DAI_POOL: {
				processing: false,
			},
			WBTC_BRICK_POOL: {
				processing: false,
			},
			MOON_WBTC_POOL: {
				processing: false,
			},
			USDC_DAI_POOL: {
				processing: false,
			},
			BRICK_USDC_POOL: {
				processing: false,
			},
			USDC_ARBS_POOL: {
				processing: false,
			},
			MOON_USDC_POOL: {
				processing: false,
			},
			BRICK_DAI_POOL: {
				processing: false,
			},
			ARBS_DAI_POOL: {
				processing: false,
			},
			MOON_DAI_POOL: {
				processing: false,
			},
			BRICK_ARBS_POOL: {
				processing: false,
			},
			MOON_BRICK_POOL: {
				processing: false,
			},
			MOON_ARBS_POOL: {
				processing: false,
			},
		},
		ArchlyV2: {
			WETH_ARB_POOL: {
				processing: false,
			},
			WBTC_WETH_POOL: {
				processing: false,
			},
			WETH_USDC_POOL: {
				processing: false,
			},
			WETH_DAI_POOL: {
				processing: false,
			},
			MOON_WETH_POOL: {
				processing: false,
			},
			USDC_ARB_POOL: {
				processing: false,
			},
			DAI_ARB_POOL: {
				processing: false,
			},
			USDC_DAI_POOL: {
				processing: false,
			},
		},
	},
	ZKFair: {
		AbstraDexV2: {
			ZKF_WUSDC_POOL: {
				processing: false,
			},
			ETH_WUSDC_POOL: {
				processing: false,
			},
		},
		SideSwapV2: {
			ZKF_ETH_POOL: {
				processing: false,
			},
			ZKF_WBTC_POOL: {
				processing: false,
			},
			ZKF_WUSDC_POOL: {
				processing: false,
			},
			ZKF_USDT_POOL: {
				processing: false,
			},
			ZKF_DAI_POOL: {
				processing: false,
			},
			ZKF_SIDE_POOL: {
				processing: false,
			},
			ZKF_FRS_POOL: {
				processing: false,
			},
			ZKF_HPX_POOL: {
				processing: false,
			},
			ETH_WBTC_POOL: {
				processing: false,
			},
			ETH_WUSDC_POOL: {
				processing: false,
			},
			USDT_ETH_POOL: {
				processing: false,
			},
			WBTC_WUSDC_POOL: {
				processing: false,
			},
			USDT_WBTC_POOL: {
				processing: false,
			},
			USDT_WUSDC_POOL: {
				processing: false,
			},
			DAI_WUSDC_POOL: {
				processing: false,
			},
			SIDE_WUSDC_POOL: {
				processing: false,
			},
			FRS_WUSDC_POOL: {
				processing: false,
			},
			HPX_WUSDC_POOL: {
				processing: false,
			},
			USDT_DAI_POOL: {
				processing: false,
			},
			FRS_SIDE_POOL: {
				processing: false,
			},
		},
		ZKFairSwapV2: {
			ZKF_WUSDC_POOL: {
				processing: false,
			},
			ETH_WBTC_POOL: {
				processing: false,
			},
			WBTC_WUSDC_POOL: {
				processing: false,
			},
			USDT_WUSDC_POOL: {
				processing: false,
			},
		},
		VenuSwapV2: {
			ZKF_WUSDC_POOL: {
				processing: false,
			},
			ETH_WUSDC_POOL: {
				processing: false,
			},
			USDT_WUSDC_POOL: {
				processing: false,
			},
		},
		FurySwapV2: {
			ZKF_WUSDC_POOL: {
				processing: false,
			},
			USDT_WUSDC_POOL: {
				processing: false,
			},
		},
	},
	AstarZKevm: {},
	Fraxtal: {
		FraxSwapV2: {
			SFRXETH_WFRXETH_POOL: {
				processing: false,
			},
			FXS_WFRXETH_POOL: {
				processing: false,
			},
			FRAX_WFRXETH_POOL: {
				processing: false,
			},
			WFRXETH_SFRAX_POOL: {
				processing: false,
			},
			FXD_WFRXETH_POOL: {
				processing: false,
			},
			RWA_WFRXETH_POOL: {
				processing: false,
			},
			KFC_WFRXETH_POOL: {
				processing: false,
			},
			FXS_SFRXETH_POOL: {
				processing: false,
			},
			FRAX_SFRXETH_POOL: {
				processing: false,
			},
			KFC_SFRXETH_POOL: {
				processing: false,
			},
			FRAX_FPIS_POOL: {
				processing: false,
			},
			FRAX_FPI_POOL: {
				processing: false,
			},
			FRAX_FXS_POOL: {
				processing: false,
			},
			FRAX_SFRAX_POOL: {
				processing: false,
			},
			USDC_FRAX_POOL: {
				processing: false,
			},
			RWA_KFC_POOL: {
				processing: false,
			},
		},
		ArchlyV2: {
			ARC_WFRXETH_POOL: {
				processing: false,
			},
			ARC_FRAX_POOL: {
				processing: false,
			},
		},
		RaExchangeV2: {
			FXS_WFRXETH_POOL: {
				processing: false,
			},
			WBTC_WFRXETH_POOL: {
				processing: false,
			},
			FRAX_WFRXETH_POOL: {
				processing: false,
			},
			AXLUSDC_WFRXETH_POOL: {
				processing: false,
			},
			FXD_WFRXETH_POOL: {
				processing: false,
			},
			RWA_WFRXETH_POOL: {
				processing: false,
			},
			KFC_WFRXETH_POOL: {
				processing: false,
			},
			AXLUSDC_FPIS_POOL: {
				processing: false,
			},
			WBTC_FXS_POOL: {
				processing: false,
			},
			AXLUSDC_FXS_POOL: {
				processing: false,
			},
			WBTC_FRAX_POOL: {
				processing: false,
			},
			AXLUSDC_FRAX_POOL: {
				processing: false,
			},
			RWA_FRAX_POOL: {
				processing: false,
			},
			SQUID_RWA_POOL: {
				processing: false,
			},
			KFC_FXD_POOL: {
				processing: false,
			},
			RWA_KFC_POOL: {
				processing: false,
			},
		},
	},
};
// True --> Processing || False --> Not Processing --- END DO NOT DELETE

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

async function BuilderPools() {
	const PoolProcessController = {};

	for (const chain of chains) {
		PoolProcessController[chain] = {};

		const { ProjectsV2 } = require(`../Scripts/Common/Common/${chain}`);

		for (const projectName in ProjectsV2) {
			PoolProcessController[chain][projectName] = {};

			const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));

			for (const pool of poolsData) {
				const poolName = await poolNameSelector(projectName, pool);

				PoolProcessController[chain][projectName][poolName] = {};

				PoolProcessController[chain][projectName][poolName].processing = false;
			}
		}
	}

	return PoolProcessController;
}

async function Creator_PoolProcessController() {
	const PoolProcessController = await BuilderPools();

	try {
		const data = await fs.promises.readFile(__filename, "utf8");

		let lines = data.split("\n");

		const searchString = "// True --> Processing || False --> Not Processing --- START DO NOT DELETE";

		const insertString = `const PoolProcessController = ${JSON.stringify(PoolProcessController, null, 2)}`;

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

// Creator_PoolProcessController();

async function XUniswapV2(chain, projectName, poolName, pool, poolReserves) {
	if (PoolProcessController[chain][projectName][poolName].processing == true || poolReserves.reserve0 == undefined || poolReserves.reserve1 == undefined || poolReserves.reserve0 < 1000n || poolReserves.reserve1 < 1000n) return;

	PoolProcessController[chain][projectName][poolName].processing = true;

	const startTime = performance.now();

	const { pool_name, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = pool;

	const {
		confirmation,
		blockTime,
		Interval,
		minimumEntranceProfit,
		minimumVendableProfit,
		minimumFlashSwapProfit,
		chainID,
		FLASHSWAP_PROVIDER,
		POOL_PROVIDER_V2,
		CONTRACT_PROVIDER,
		flashSwapAddress,
		flashSwapContract,
		Owner_Account,
		ProjectsV2,
		callback_type,
		tx_type,
		native_token_symbol,
	} = require(`../Scripts/Common/Common/${chain}`);

	const { ProjectsV3, QuotersV3, QuoterVersionsV3 } = require(`../Scripts/Common/Common/${chain}`);

	const project = ProjectsV2[projectName];

	let token0_Market_Price = null;
	let token1_Market_Price = null;
	let FeeData = null;

	let reserveIn;
	let reserveIn_dollar;
	let tokenIn_address;
	let tokenIn_symbol;
	let tokenIn_decimal;
	let tokenIn_price;

	let reserveOut;
	let reserveOut_dollar;
	let tokenOut_address;
	let tokenOut_symbol;
	let tokenOut_decimal;
	let tokenOut_price;

	let ZeroToOne;
	let pool_constant_number;
	let token;

	let amountIn = 0n;
	let amountOutMin = 0n;
	let entranceProfit = 0;

	async function initialize() {
		async function getTokenMarketPrices() {
			try {
				token0_Market_Price = await getMarketPrice(token0_symbol);
				token1_Market_Price = await getMarketPrice(token1_symbol);
			} catch (error) {
				getTokenMarketPrices();
			}

			if (token0_Market_Price == null || token1_Market_Price == null) getTokenMarketPrices();
		}

		async function getFeeData() {
			try {
				FeeData = await getDataFromLocalServer(FeeDataServerPort);
			} catch (error) {
				getFeeData();
			}

			if (FeeData == null) getFeeData();
		}

		try {
			await getTokenMarketPrices();
			await getFeeData();
		} catch (error) {
			pool.processing = false;

			return;
		}

		if (token0_Market_Price == null || token0_Market_Price == undefined || token1_Market_Price == null || token1_Market_Price == undefined) {
			pool.processing = false;

			return;
		}

		const token0_Pool_Price = ((ethers.formatUnits(BigInt(poolReserves.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(poolReserves.reserve0), token0_decimal) * token0_Market_Price)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(poolReserves.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;

			reserveOut = BigInt(poolReserves.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(poolReserves.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;

			reserveOut = BigInt(poolReserves.reserve1);
			tokenOut_address = token1_address;
			tokenOut_symbol = token1_symbol;
			tokenOut_decimal = token1_decimal;
			tokenOut_price = token1_Market_Price;

			ZeroToOne = true;
		}

		reserveIn_dollar = ethers.formatUnits(reserveIn, tokenIn_decimal) * tokenIn_price;
		reserveOut_dollar = ethers.formatUnits(reserveOut, tokenOut_decimal) * tokenOut_price;

		pool_constant_number = reserveIn_dollar * reserveOut_dollar;

		token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);
	}

	await initialize();

	async function formula() {
		const mutualReserveTarget_dollar = (reserveIn_dollar + reserveOut_dollar) / 2;

		const amountIn_dollar = mutualReserveTarget_dollar - reserveIn_dollar;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		amountOutMin = await getAmountOut(amountIn, reserveIn, reserveOut, project.fee);

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		entranceProfit = amountOutMin_dollar - amountIn_dollar;

		if (project.comments) {
			console.log(
				`${chain} ${projectName} ${poolName}\n -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
 -- amountOutMin = ${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} === ${amountOutMin_dollar}$
 -- entranceProfit = ${entranceProfit}$`
			);
		}
	}

	try {
		await formula();
	} catch (error) {
		pool.processing = false;

		return;
	}

	if (isNaN(entranceProfit) || amountIn <= 0n || amountOutMin <= 0n || entranceProfit < minimumEntranceProfit) {
		PoolProcessController[chain][projectName][poolName].processing = false;
		return;
	}

	await saveProfit(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const swapData =
		ZeroToOne == true
			? project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountOutMin, flashSwapAddress, "0x"]).slice(2)
			: project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountOutMin, 0, flashSwapAddress, "0x"]).slice(2);

	// -----
	// ----------
	// ---------------
	// V2_to_V2_Vendability

	async function V2_to_V2_Vendability() {
		async function VendabilityV2toV2() {
			const reserves = JSON.parse(await fs.promises.readFile(path.join(__dirname, `../Scripts/Reserves/${chain}.json`)));

			let optimalInputV2 = Infinity;
			let zeroForOneV2 = null;
			let flashPoolV2 = null;
			let flashPoolNameV2 = null;

			for (const VendableProjectNameV2 in reserves) {
				if (VendableProjectNameV2 == projectName) continue;
				if (VendableProjectNameV2 == "zkEVMSwapV2") continue;

				if (VendableProjectNameV2 == "DysonFinanceV2") continue;
				if (VendableProjectNameV2 == "BalancerV2") continue;
				if (VendableProjectNameV2 == "AntfarmFinanceV2") continue;
				if (VendableProjectNameV2 == "CurveV2") continue;
				if (VendableProjectNameV2 == "SyncSwapV2") continue;

				const VendablePoolsDataV2 = JSON.parse(fs.readFileSync(path.join(__dirname, `../Scripts/Dex/PoolDatasV2/${chain}/${VendableProjectNameV2}.json`), "utf8"));

				for (const VendablePoolV2 of VendablePoolsDataV2) {
					if (!((tokenIn_symbol == VendablePoolV2.token0_symbol && tokenOut_symbol == VendablePoolV2.token1_symbol) || (tokenIn_symbol == VendablePoolV2.token1_symbol && tokenOut_symbol == VendablePoolV2.token0_symbol))) continue;

					const VendablePoolNameV2 = await poolNameSelector(VendableProjectNameV2, VendablePoolV2);

					const VendablePoolReservesV2 = reserves[VendableProjectNameV2][VendablePoolNameV2];

					const VendableZeroToOneV2 = tokenIn_symbol == VendablePoolV2.token0_symbol && tokenOut_symbol == VendablePoolV2.token1_symbol ? false : true;

					const VendableProjectV2 = ProjectsV2[VendableProjectNameV2];

					const inputV2 = VendableZeroToOneV2
						? await getAmountIn(amountIn, VendablePoolReservesV2.reserve0, VendablePoolReservesV2.reserve1, VendableProjectV2.fee)
						: await getAmountIn(amountIn, VendablePoolReservesV2.reserve1, VendablePoolReservesV2.reserve0, VendableProjectV2.fee);

					if (inputV2 > optimalInputV2 || inputV2 <= BigInt(0)) continue;

					optimalInputV2 = inputV2;
					zeroForOneV2 = VendableZeroToOneV2;
					flashPoolV2 = VendablePoolV2;
					flashPoolNameV2 = VendablePoolNameV2;

					// console.log(VendablePoolNameV2, VendablePoolV2, VendablePoolReservesV2, VendableZeroToOneV2);

					// console.log("inputV2 for", VendableProjectNameV2, inputV2, ethers.formatUnits(inputV2, VendablePoolV2.token0_decimal), VendablePoolV2.token0_symbol);

					// console.log("inputV2 for", VendableProjectNameV2, inputV2, ethers.formatUnits(inputV2, VendablePoolV2.token1_decimal), VendablePoolV2.token1_symbol);
				}
			}

			return [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2];
		}

		const [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2] = await VendabilityV2toV2();

		if (optimalInputV2 == Infinity || zeroForOneV2 == null || flashPoolV2 == null || flashPoolNameV2 == null) return [null, null, null, null, null, null];

		async function handleDataV2() {
			let callbackV2;

			if (callback_type == 0) {
				callbackV2 = encoder.encode(["address", "bytes", "address", "address", "uint256", "uint256"], [pool.pool_address, swapData, flashPoolV2.token0_address, flashPoolV2.token1_address, optimalInputV2, 0]);
			} else if (callback_type == 1) {
				callbackV2 = encoder.encode(["address", "bytes", "address", "address", "uint256"], [pool.pool_address, swapData, flashPoolV2.token0_address, flashPoolV2.token1_address, optimalInputV2]);
			}

			const flashPoolDataV2 =
				zeroForOneV2 == true
					? ProjectsV2[flashPoolV2.project_name].flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountIn, flashSwapAddress, callbackV2]).slice(2)
					: ProjectsV2[flashPoolV2.project_name].flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountIn, 0, flashSwapAddress, callbackV2]).slice(2);

			const flashSwapDataV2 = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPoolV2.pool_address, flashPoolDataV2]);

			return [callbackV2, flashPoolDataV2, flashSwapDataV2];
		}

		await handleDataV2();

		const [callbackV2, flashPoolDataV2, flashSwapDataV2] = await handleDataV2();

		const tokenRevenueV2 = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInputV2, tokenOut_decimal);

		const vendableProfitV2 = tokenRevenueV2 * tokenOut_price;

		return [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2, tokenRevenueV2, vendableProfitV2, callbackV2, flashPoolDataV2, flashSwapDataV2];
	}

	await V2_to_V2_Vendability();

	const [optimalInputV2, zeroForOneV2, flashPoolV2, flashPoolNameV2, tokenRevenueV2, vendableProfitV2, callbackV2, flashPoolDataV2, flashSwapDataV2] = await V2_to_V2_Vendability();

	if (optimalInputV2 == Infinity || zeroForOneV2 == null || flashPoolV2 == null || flashPoolNameV2 == null || tokenRevenueV2 == null || vendableProfitV2 == null || callbackV2 == undefined || flashPoolDataV2 == undefined || flashSwapDataV2 == undefined) {
		PoolProcessController[chain][projectName][poolName].processing = false;
		return;
	}

	if (vendableProfitV2 < minimumVendableProfit || Number(ethers.formatUnits(amountOutMin, tokenOut_decimal)) < Number(ethers.formatUnits(optimalInputV2, tokenOut_decimal))) {
		PoolProcessController[chain][projectName][poolName].processing = false;
		return;
	}

	if (project.comments) {
		console.log("flashPoolV2", flashPoolV2);
		console.log("flashPoolNameV2", flashPoolNameV2);
		console.log("ZeroToOne", ZeroToOne);
		console.log("zeroForOneV2", zeroForOneV2);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V2`);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(optimalInputV2, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V2`);
		console.log(`tokenRevenue ${tokenRevenueV2} ${tokenOut_symbol}`);
		console.log("entranceProfit", entranceProfit);
		console.log("vendableProfitV2", vendableProfitV2);
	}

	// V2_to_V2_Vendability
	// ---------------
	// ----------
	// -----

	// ---------------------------------------------------------------------------------------
	// ------------------------------------ Seperation ---------------------------------------
	// ---------------------------------------------------------------------------------------

	// *****
	// **********
	// ***************
	// V2_to_V3_Vendability

	async function V2_to_V3_Vendability() {
		async function VendabilityV2toV3() {
			const vendablePoolsV3 = await getVendableV3Pools(chain, tokenIn_address, tokenOut_address);

			async function getSufficientVendablePoolsV3() {
				if (vendablePoolsV3.length == 0) return [];

				let tokenBalancePromisesV3 = [];
				let sufficientVendablePoolsV3 = [];

				for (const pool of vendablePoolsV3) tokenBalancePromisesV3.push(token.balanceOf(pool.pool_address));

				const tokenBalanceResultV3 = await Promise.all(tokenBalancePromisesV3);

				for (let index = 0; index < tokenBalanceResultV3.length; index++) {
					if (tokenBalanceResultV3[index] <= amountIn * 2n) continue;
					if (tokenBalanceResultV3[index] > amountIn * 2n) {
						sufficientVendablePoolsV3.push(vendablePoolsV3[index]);
						continue;
					}
				}

				return sufficientVendablePoolsV3;
			}

			const sufficientVendablePoolsV3 = await getSufficientVendablePoolsV3();

			async function getOptimalInput() {
				if (sufficientVendablePoolsV3.length == 0) return [null, null, null, null];

				let zeroForOneV3 = null;
				let sqrtPriceLimitX96 = null;
				let promisesV3 = [];
				let flashPoolsV3 = [];

				for (const pool of sufficientVendablePoolsV3) {
					const QuoterContract = QuotersV3[pool.project_name];
					const QutoerVersion = QuoterVersionsV3[pool.project_name];

					if (pool.token0_address == tokenIn_address && pool.token1_address == tokenOut_address) {
						zeroForOneV3 = false;
						sqrtPriceLimitX96 = MAX_SQRT_RATIO - 1000n;
					}

					if (pool.token0_address == tokenOut_address && pool.token1_address == tokenIn_address) {
						zeroForOneV3 = true;
						sqrtPriceLimitX96 = MIN_SQRT_RATIO + 1000n;
					}

					if (QutoerVersion == 1) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, pool.pool_fee, amountIn, sqrtPriceLimitX96);

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 2) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
							tokenIn: tokenOut_address,
							tokenOut: tokenIn_address,
							amount: amountIn,
							fee: pool.pool_fee,
							sqrtPriceLimitX96: sqrtPriceLimitX96,
						});

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 3) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, amountIn, sqrtPriceLimitX96);

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (QutoerVersion == 4) {
						const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
							tokenIn: tokenOut_address,
							tokenOut: tokenIn_address,
							amount: amountIn,
							limitSqrtPrice: sqrtPriceLimitX96,
						});

						promisesV3.push(promise);
						flashPoolsV3.push(pool);
					}

					if (zeroForOneV3 == undefined || sqrtPriceLimitX96 == undefined) {
						console.log("undefined error occured zeroForOne !!!", zeroForOneV3);
						console.log("undefined error occured sqrtPriceLimitX96 !!!", sqrtPriceLimitX96);
						return;
					}
				}

				let result = [];

				try {
					result = await Promise.all(promisesV3);
				} catch (error) {
					// console.log("ERROR V2_to_V3_Vendability/getOptimalInput Promise.all Quoters", error);

					PoolProcessController[chain][projectName][poolName].processing = false;
					return;
				}

				if (result.length == 0) return [null, null, null, null];

				let optimalInputV3 = Infinity;
				let flashPoolV3 = null;

				for (let index = 0; index < result.length; index++) {
					if (result[index].amountIn !== undefined && result[index].amountIn < optimalInputV3) {
						optimalInputV3 = result[index].amountIn;
						flashPoolV3 = flashPoolsV3[index];
						continue;
					}

					if (result[index].amountIn == undefined && result[index][0].returnedAmount < optimalInputV3) {
						optimalInputV3 = result[index][0].returnedAmount;
						flashPoolV3 = flashPoolsV3[index];
						continue;
					}
				}

				return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96];
			}

			const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96] = await getOptimalInput();

			return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96];
		}

		const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96] = await VendabilityV2toV3();

		if (optimalInputV3 == Infinity || flashPoolV3 == null || zeroForOneV3 == null || sqrtPriceLimitX96 == null) return [null, null, null, null, null, null];

		async function handleDataV3() {
			let callbackV3;

			if (callback_type == 0) {
				callbackV3 = encoder.encode(["address", "address", "address", "bytes", "uint256"], [pool.address, flashPoolV3.token0_address, flashPoolV3.token1_address, swapData, 0]);
			} else if (callback_type == 1) {
				callbackV3 = encoder.encode(["address", "address", "address", "bytes"], [pool.address, flashPoolV3.token0_address, flashPoolV3.token1_address, swapData]);
			}

			const flashPoolDataV3 = ProjectsV3[flashPoolV3.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOneV3, -amountIn, sqrtPriceLimitX96, callbackV3]).slice(2);

			const flashSwapDataV3 = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["printLira"], [flashPoolV3.pool_address, flashPoolDataV3]);

			return [callbackV3, flashPoolDataV3, flashSwapDataV3];
		}

		const [callbackV3, flashPoolDataV3, flashSwapDataV3] = await handleDataV3();

		const tokenRevenueV3 = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInputV3, tokenOut_decimal);

		const vendableProfitV3 = tokenRevenueV3 * tokenOut_price;

		return [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96, tokenRevenueV3, vendableProfitV3, callbackV3, flashPoolDataV3, flashSwapDataV3];
	}

	// const [optimalInputV3, flashPoolV3, zeroForOneV3, sqrtPriceLimitX96, tokenRevenueV3, vendableProfitV3, callbackV3, flashPoolDataV3, flashSwapDataV3] = await V2_to_V3_Vendability();

	// if (optimalInputV3 == Infinity || flashPoolV3 == null || zeroForOneV3 == null || sqrtPriceLimitX96 == null || tokenRevenueV3 == null || vendableProfitV3 == null || callbackV3 == undefined || flashPoolDataV3 == undefined || flashSwapDataV3 == undefined) {
	// 	PoolProcessController[chain][projectName][poolName].processing = false;
	// 	return;
	// }

	// if (project.comments) {
	// 	console.log("flashPool", flashPool);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V3`);
	// 	console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
	// 	console.log(`${ethers.formatUnits(optimalInput, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V3`);
	// 	console.log(`tokenRevenue ${tokenRevenue} ${tokenOut_symbol}`);
	// 	console.log("entranceProfit", entranceProfit);
	// 	console.log("vendableProfit", vendableProfit);
	// }

	// V2_to_V3_Vendability
	// ***************
	// **********
	// *****

	await saveProfit(chain, entranceProfit, vendableProfitV2, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);
	// await saveProfit(chain, entranceProfit, vendableProfitV3, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	async function handleTx() {
		if (tx_type == 0) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: flashSwapDataV2,
				chainId: chainID,
				value: 0,
				type: 0,
				gasLimit: flashSwap_gasLimit,
				gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 1) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: flashSwapDataV2,
				chainId: chainID,
				value: 0,
				type: 1,
				gasLimit: flashSwap_gasLimit,
				gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 2) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: flashSwapDataV2,
				chainId: chainID,
				value: 0,
				type: 2,
				gasLimit: flashSwap_gasLimit,
				maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
				maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
				// gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		} else if (tx_type == 3) {
			return {
				from: WalletAddress,
				to: flashSwapAddress,
				data: flashSwapDataV2,
				chainId: chainID,
				value: 0,
				type: 3,
				gasLimit: flashSwap_gasLimit,
				// maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
				// maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
				// gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
				// nonce: await Owner_Account.getNonce(),
			};
		}

		return tx;
	}

	const tx = await handleTx();

	async function handleTransactionFeeL2() {
		return Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * gasPrice_multiplier) / 10 ** 18) * (await getMarketPrice(native_token_symbol));
	}

	const transactionFeeL2 = await handleTransactionFeeL2();

	// getL1TransactionFee is Disabled

	const flashSwapProfit = vendableProfitV2 - transactionFeeL2;
	// const flashSwapProfit = vendableProfitV3 - transactionFeeL2;

	// if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
	// 	pool.processing = false;

	// 	return;
	// }

	// if (project.comments) {
	// 	console.log("transactionFeeL2", transactionFeeL2, "$");
	// 	console.log("flashSwapProfit", flashSwapProfit, "$");
	// }

	async function execute() {
		let isErrorOccured;

		try {
			await FLASHSWAP_PROVIDER.call(tx);

			console.log("PASSSSSEEDDDD");

			isErrorOccured = false;
		} catch (error) {
			console.log("erorrrrrrrrrrrrrrrrrr", error);

			return;

			await saveError(
				chain,
				error,
				pool,
				flashPool,
				projectName,
				pool_name,
				amountIn,
				tokenIn_decimal,
				tokenIn_symbol,
				tokenIn_address,
				amountOutMin,
				tokenOut_decimal,
				tokenOut_symbol,
				tokenOut_address,
				optimalInput,
				transactionFeeL2,
				entranceProfit,
				vendableProfit,
				flashSwapProfit
			);

			isErrorOccured = true;

			[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

			pool.processing = false;

			return;
		}

		console.log("execc");

		// return;

		if (isErrorOccured == false) {
			const transaction_body = await Owner_Account.sendTransaction(tx);

			const receipt = await FLASHSWAP_PROVIDER.waitForTransaction(transaction_body.hash, confirmation, blockTime);

			if (receipt.status == 1) {
				await saveProfitToCSV(chain, startTime, projectName, pool_name, transactionFeeL2, entranceProfit, vendableProfit, flashSwapProfit, tokenRevenue, tokenOut_symbol);
			}
		}

		[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

		pool.processing = false;
	}

	await execute();
}

module.exports = {
	XUniswapV2,
};
