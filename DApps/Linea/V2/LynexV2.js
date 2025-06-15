const {
	ethers,
	ethersV5,
	fs,
	path,
	encoder,
	Interval,
	MIN_SQRT_RATIO,
	MAX_SQRT_RATIO,
	ERC20,
	flashSwapFunctionSelector,
	WalletAddress,
	flashSwap_gasLimit,
	gasLimit,
	FeeDataServerPort,
	maxFeePerGas_multiplier,
	maxPriorityFeePerGas_multiplier,
	gasPrice_multiplier,
} = require("../../../Scripts/Common/Global/Global");

const chain = path.basename(path.dirname(path.dirname(__filename)));

const {
	confirmation,
	blockTime,
	minimumEntranceProfit,
	minimumVendableProfit,
	minimumFlashSwapProfit,

	chainID,
	FLASHSWAP_PROVIDER,
	POOL_PROVIDER_V2,
	POOL_PROVIDER_V3,
	CONTRACT_PROVIDER,
	flashSwapAddress,
	flashSwapContract,
	Owner_Account,
	ProjectsV2,
	ProjectsV3,
	QuotersV3,
	QuoterVersionsV3,
} = require(`../../../Scripts/Common/Common/${chain}`);

const GlobalLibrary = require("../../../Scripts/Library/GlobalLibrary");
const LibraryV2 = require("../../../Scripts/Library/LibraryV2");
const LibraryV3 = require("../../../Scripts/Library/LibraryV3");

const projectName = path.basename(__filename, ".js");
const project = ProjectsV2[projectName];
const poolsData = JSON.parse(fs.readFileSync(path.join(__dirname, `../../../Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`), "utf8"));
const poolABI = require(path.join(__dirname, `../../../Scripts/Dex/PoolABIsV2/UniswapV2PoolABI.json`));

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.LINEA_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let WEETH_WETH_POOL = {
	address: "0x9D2495eE468dd08E072514B6924a140632c281B1",
	https_contract: new ethers.Contract("0x9D2495eE468dd08E072514B6924a140632c281B1", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WEETH_POOL = {
	address: "0x6057F9dff137315e0eb9560F6bC3759061a5c013",
	https_contract: new ethers.Contract("0x6057F9dff137315e0eb9560F6bC3759061a5c013", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WEETH_FOXY_POOL = {
	address: "0x80b3b2BDC115b70F4fD5A50352F81cbd3AaF48B3",
	https_contract: new ethers.Contract("0x80b3b2BDC115b70F4fD5A50352F81cbd3AaF48B3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WEETH_WSTETH_POOL = {
	address: "0xbcFd78835d3c6bADE26a606F40fD90Fc580FA3F6",
	https_contract: new ethers.Contract("0xbcFd78835d3c6bADE26a606F40fD90Fc580FA3F6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_WEETH_POOL = {
	address: "0x9a146698b16DC334f9B99aF20b359649e6f4C844",
	https_contract: new ethers.Contract("0x9a146698b16DC334f9B99aF20b359649e6f4C844", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WEETH_STONE_POOL = {
	address: "0x4Cc73F7240F29a9F5d419a4696eBe8138a06D438",
	https_contract: new ethers.Contract("0x4Cc73F7240F29a9F5d419a4696eBe8138a06D438", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let CROAK_WETH_POOL = {
	address: "0x8954bc9a15176Ba2302Fa68C6ec6a7534B563CA0",
	https_contract: new ethers.Contract("0x8954bc9a15176Ba2302Fa68C6ec6a7534B563CA0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WETH_POOL = {
	address: "0x6FB44889a9aA69F7290258D3716BfFcB33CdE184",
	https_contract: new ethers.Contract("0x6FB44889a9aA69F7290258D3716BfFcB33CdE184", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_POOL = {
	address: "0x94769abFbEb114cF7BA2e7B9cEF242ac70da20d6",
	https_contract: new ethers.Contract("0x94769abFbEb114cF7BA2e7B9cEF242ac70da20d6", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_WETH_POOL = {
	address: "0x80295173FD6962F38671C39ba726309B637cA241",
	https_contract: new ethers.Contract("0x80295173FD6962F38671C39ba726309B637cA241", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FOXY_WETH_POOL = {
	address: "0x8F63B44D31FbCA1D62Ab4e32663Fb91B4a363D01",
	https_contract: new ethers.Contract("0x8F63B44D31FbCA1D62Ab4e32663Fb91B4a363D01", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WSTETH_WETH_POOL = {
	address: "0xaC716681656D3F22C23BF09C9b52786216827Ac3",
	https_contract: new ethers.Contract("0xaC716681656D3F22C23BF09C9b52786216827Ac3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let NILE_WETH_POOL = {
	address: "0xc97CE419663d9E1c06F48C5032ab61715A62272A",
	https_contract: new ethers.Contract("0xc97CE419663d9E1c06F48C5032ab61715A62272A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WBTC_WETH_POOL = {
	address: "0x8d2a23eb25A0a8213319A4ED2984602a7C23f06B",
	https_contract: new ethers.Contract("0x8d2a23eb25A0a8213319A4ED2984602a7C23f06B", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ZERO_WETH_POOL = {
	address: "0x904e2BBDb669cB30f51d69DaEfdcDeB83759D833",
	https_contract: new ethers.Contract("0x904e2BBDb669cB30f51d69DaEfdcDeB83759D833", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MENDI_WETH_POOL = {
	address: "0x53c3B77DF14d9dbE572a858ba6ed2Cc073A0cfE0",
	https_contract: new ethers.Contract("0x53c3B77DF14d9dbE572a858ba6ed2Cc073A0cfE0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_WETH_POOL = {
	address: "0x2a73093943232aFD02661a112E149c777cf01e57",
	https_contract: new ethers.Contract("0x2a73093943232aFD02661a112E149c777cf01e57", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BUSD_WETH_POOL = {
	address: "0x4d999d130bAA971cc640Bfea3AD704b58553Bc17",
	https_contract: new ethers.Contract("0x4d999d130bAA971cc640Bfea3AD704b58553Bc17", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_WETH_POOL = {
	address: "0x1C6Fb08C1ef4E505a4Ae3Ffc3C99E443070Df64A",
	https_contract: new ethers.Contract("0x1C6Fb08C1ef4E505a4Ae3Ffc3C99E443070Df64A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DAI_WETH_POOL = {
	address: "0xE91022615bbD55C8140109FD75Ea18A573360917",
	https_contract: new ethers.Contract("0xE91022615bbD55C8140109FD75Ea18A573360917", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let NWG_WETH_POOL = {
	address: "0x7679b3b4C2f9930ABb54B4199F81105445f564b5",
	https_contract: new ethers.Contract("0x7679b3b4C2f9930ABb54B4199F81105445f564b5", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let STONE_WETH_POOL = {
	address: "0x4d776eb578196eE0725bdA3319B4fb615bBf0Ac5",
	https_contract: new ethers.Contract("0x4d776eb578196eE0725bdA3319B4fb615bBf0Ac5", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let INETH_WETH_POOL = {
	address: "0xd5Bef1E3Dae741172cbC7F01d0B9F9d97C3630dC",
	https_contract: new ethers.Contract("0xd5Bef1E3Dae741172cbC7F01d0B9F9d97C3630dC", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let OLYNX_WETH_POOL = {
	address: "0xe8f2288c21105D9cBA6355c8833026F01e0f1cC3",
	https_contract: new ethers.Contract("0xe8f2288c21105D9cBA6355c8833026F01e0f1cC3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ANKRETH_WETH_POOL = {
	address: "0x00c3f088726b18210dE2886d7c4b0501AcB15262",
	https_contract: new ethers.Contract("0x00c3f088726b18210dE2886d7c4b0501AcB15262", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let UNIETH_WETH_POOL = {
	address: "0xb456626eb905A7548869e2f82b0433A3C8431436",
	https_contract: new ethers.Contract("0xb456626eb905A7548869e2f82b0433A3C8431436", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DOGE_WETH_POOL = {
	address: "0xAf453A22C59BC4796f78a176fDcc443CFD9Ab3C3",
	https_contract: new ethers.Contract("0xAf453A22C59BC4796f78a176fDcc443CFD9Ab3C3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_BVELYNX_POOL = {
	address: "0x73c68023cAc6b8d98cDEFB97cd22ea20b9E862Bd",
	https_contract: new ethers.Contract("0x73c68023cAc6b8d98cDEFB97cd22ea20b9E862Bd", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let A3A_WETH_POOL = {
	address: "0x8CB615373F16a727F61457213866267B70051AE5",
	https_contract: new ethers.Contract("0x8CB615373F16a727F61457213866267B70051AE5", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ONEPUNCH_WETH_POOL = {
	address: "0x06324F8Abb83Fc0D161C7a8D67A1C05D524f255B",
	https_contract: new ethers.Contract("0x06324F8Abb83Fc0D161C7a8D67A1C05D524f255B", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_CROAK_POOL = {
	address: "0x087D32F6D6d95B63D418A151A45B6f8AE06Fb30F",
	https_contract: new ethers.Contract("0x087D32F6D6d95B63D418A151A45B6f8AE06Fb30F", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_USDT_POOL = {
	address: "0xC6c46Cd01403AC0B28Ef92C4880f2E4Be2D410E1",
	https_contract: new ethers.Contract("0xC6c46Cd01403AC0B28Ef92C4880f2E4Be2D410E1", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_EZETH_POOL = {
	address: "0xE27529456541Bdeb011a9F5f591095FDDF9E00f0",
	https_contract: new ethers.Contract("0xE27529456541Bdeb011a9F5f591095FDDF9E00f0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_FOXY_POOL = {
	address: "0x42544dA1a642Eb32F36841CdE92f2BEd85514Fb3",
	https_contract: new ethers.Contract("0x42544dA1a642Eb32F36841CdE92f2BEd85514Fb3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WSTETH_POOL = {
	address: "0x38400DA4F6562E93875ae161d790BCB6F36eB722",
	https_contract: new ethers.Contract("0x38400DA4F6562E93875ae161d790BCB6F36eB722", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_WBTC_POOL = {
	address: "0xD4630a296E33dfF7fdAcca2C6f192E9C78DCde13",
	https_contract: new ethers.Contract("0xD4630a296E33dfF7fdAcca2C6f192E9C78DCde13", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_ZERO_POOL = {
	address: "0x1EaAFfC13165df39A5FBa67409d623FaB4d90E5D",
	https_contract: new ethers.Contract("0x1EaAFfC13165df39A5FBa67409d623FaB4d90E5D", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_MENDI_POOL = {
	address: "0xE5e19bBF39c76A8c980B48F2Ec89d0dE877bF567",
	https_contract: new ethers.Contract("0xE5e19bBF39c76A8c980B48F2Ec89d0dE877bF567", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_LYNX_POOL = {
	address: "0x3E78c1F766D7FE2c3dceF6aFe6609966540B6391",
	https_contract: new ethers.Contract("0x3E78c1F766D7FE2c3dceF6aFe6609966540B6391", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_POOL = {
	address: "0xdB4eCdF24559fBAC12Eb4AB7574185409c09875f",
	https_contract: new ethers.Contract("0xdB4eCdF24559fBAC12Eb4AB7574185409c09875f", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_EURO3_POOL = {
	address: "0xfAE49AE339c053D7b639bd666e2b3b19De9E06E3",
	https_contract: new ethers.Contract("0xfAE49AE339c053D7b639bd666e2b3b19De9E06E3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_A3A_POOL = {
	address: "0xbDE12bdbEB92B0DCA3F3c37A749633a24717b24D",
	https_contract: new ethers.Contract("0xbDE12bdbEB92B0DCA3F3c37A749633a24717b24D", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_MAI_POOL = {
	address: "0x0CafBb18fFE4d91A858Bb05011818c5358D99095",
	https_contract: new ethers.Contract("0x0CafBb18fFE4d91A858Bb05011818c5358D99095", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_USDT_POOL = {
	address: "0xE3164204a93bcB833f09b3FC9552680547Bb3039",
	https_contract: new ethers.Contract("0xE3164204a93bcB833f09b3FC9552680547Bb3039", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MENDI_USDT_POOL = {
	address: "0x0aEF9098F45B6A85a3C33B5c48E47a7e91b9ba1a",
	https_contract: new ethers.Contract("0x0aEF9098F45B6A85a3C33B5c48E47a7e91b9ba1a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_USDT_POOL = {
	address: "0xbB9da18545F6705047b42523AAc1d558260B213c",
	https_contract: new ethers.Contract("0xbB9da18545F6705047b42523AAc1d558260B213c", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let DAI_USDT_POOL = {
	address: "0xF0E450aF028a37124417aBF7a0D6830C1300d9aa",
	https_contract: new ethers.Contract("0xF0E450aF028a37124417aBF7a0D6830C1300d9aa", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let AGEUR_USDT_POOL = {
	address: "0xbbD94Eef0109ec29433073E30c6ecE83Fd3C4C52",
	https_contract: new ethers.Contract("0xbbD94Eef0109ec29433073E30c6ecE83Fd3C4C52", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_FOXY_POOL = {
	address: "0xd4025fA2e6B8c1726B12eEcD0A8fd05A88b85FEA",
	https_contract: new ethers.Contract("0xd4025fA2e6B8c1726B12eEcD0A8fd05A88b85FEA", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EURO3_FOXY_POOL = {
	address: "0x7Cac0BD586FdD087FCB7635A62280a30ddB547aF",
	https_contract: new ethers.Contract("0x7Cac0BD586FdD087FCB7635A62280a30ddB547aF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_WSTETH_POOL = {
	address: "0xCa2BB0D69e78D9b64E7F3aC02A4F1Ff365e3b896",
	https_contract: new ethers.Contract("0xCa2BB0D69e78D9b64E7F3aC02A4F1Ff365e3b896", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let INETH_WSTETH_POOL = {
	address: "0xB0290cCF9fC890415C86ac208e3b78224dc1d12A",
	https_contract: new ethers.Contract("0xB0290cCF9fC890415C86ac208e3b78224dc1d12A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ANKRETH_WSTETH_POOL = {
	address: "0x20f9106f711d41081dbbF79fEe8De92cB7547e77",
	https_contract: new ethers.Contract("0x20f9106f711d41081dbbF79fEe8De92cB7547e77", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_WBTC_POOL = {
	address: "0x4E78173588F16Ee42B61Aa6b6BF7F02FC86a7d89",
	https_contract: new ethers.Contract("0x4E78173588F16Ee42B61Aa6b6BF7F02FC86a7d89", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_ZERO_POOL = {
	address: "0xeBdC263df047256D0D06c4cBc83D8Ba97aDeeE39",
	https_contract: new ethers.Contract("0xeBdC263df047256D0D06c4cBc83D8Ba97aDeeE39", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_MENDI_POOL = {
	address: "0x0C978a9529B01DFe1A0745b6F97e3A05A8F81023",
	https_contract: new ethers.Contract("0x0C978a9529B01DFe1A0745b6F97e3A05A8F81023", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MENDI_BVELYNX_POOL = {
	address: "0x1F6a27B3df88B96c2560cc296801599e7F057f73",
	https_contract: new ethers.Contract("0x1F6a27B3df88B96c2560cc296801599e7F057f73", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LINE_MENDI_POOL = {
	address: "0xFB636707412d580F5333635a0d61523bE5b09bDD",
	https_contract: new ethers.Contract("0xFB636707412d580F5333635a0d61523bE5b09bDD", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LUBE_LINE_POOL = {
	address: "0x6Fb413595E0949B85B0861233B39d8DDec872aFa",
	https_contract: new ethers.Contract("0x6Fb413595E0949B85B0861233B39d8DDec872aFa", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_MATIC_POOL = {
	address: "0xe400C1a76a26a4F02D5591a676fddBC66Ed07Baf",
	https_contract: new ethers.Contract("0xe400C1a76a26a4F02D5591a676fddBC66Ed07Baf", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_DAI_POOL = {
	address: "0x9B3Eaa1c305F32c9B651Ac8521563462705e2358",
	https_contract: new ethers.Contract("0x9B3Eaa1c305F32c9B651Ac8521563462705e2358", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_STONE_POOL = {
	address: "0xCeF24c763E79329F48756F5a76D08B650C6F2293",
	https_contract: new ethers.Contract("0xCeF24c763E79329F48756F5a76D08B650C6F2293", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_OLYNX_POOL = {
	address: "0xba4BeCDB0394d3db69BcA50f70caCB7d2BAB0Ea9",
	https_contract: new ethers.Contract("0xba4BeCDB0394d3db69BcA50f70caCB7d2BAB0Ea9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_BVELYNX_POOL = {
	address: "0x2ac5966684F33384163c0f924BE2c83817A88A23",
	https_contract: new ethers.Contract("0x2ac5966684F33384163c0f924BE2c83817A88A23", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let LYNX_LINE_POOL = {
	address: "0xC5c2f8beabD4D4553063f7359C38B4f1Aa0c3808",
	https_contract: new ethers.Contract("0xC5c2f8beabD4D4553063f7359C38B4f1Aa0c3808", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.reserve0 < 1000n || pool.reserve1 < 1000n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find((executionPool) => executionPool.pool_address == pool.address);

	let token0_Market_Price = null;
	let token1_Market_Price = null;
	let nativeToken_Market_Price = null;
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
				[token0_Market_Price, token1_Market_Price, nativeToken_Market_Price] = await GlobalLibrary.getMarketPriceBatch([token0_symbol, token1_symbol, "ETH"]);
			} catch (error) {
				getTokenMarketPrices();
			}

			if (token0_Market_Price == null || token1_Market_Price == null || token0_Market_Price == undefined || token1_Market_Price == undefined) return;
		}

		async function getFeeData() {
			try {
				FeeData = JSON.parse(await fs.promises.readFile("Scripts/FeeData/FeeData.json"));
			} catch (error) {
				getFeeData();
			}

			if (FeeData == null || FeeData == undefined) return;
		}

		await Promise.all([getTokenMarketPrices(), getFeeData()]);

		if (token0_Market_Price == null || token1_Market_Price == null || nativeToken_Market_Price == null || FeeData == null) {
			pool.processing = false;

			return;
		}

		const token0_Pool_Price = ((ethers.formatUnits(BigInt(pool.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(pool.reserve0), token0_decimal) * token0_Market_Price)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;

			reserveOut = BigInt(pool.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;

			reserveOut = BigInt(pool.reserve1);
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

		amountOutMin = await LibraryV2.getAmountOut(amountIn, reserveIn, reserveOut, project.fee);

		const amountOutMin_dollar = ethers.formatUnits(amountOutMin, tokenOut_decimal) * tokenOut_price;

		entranceProfit = amountOutMin_dollar - amountIn_dollar;

		if (project.comments) {
			console.log(
				` -- amountIn = ${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} === ${amountIn_dollar}$
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
		pool.processing = false;

		return;
	}

	await GlobalLibrary.saveProfitToJson(chain, entranceProfit, 0, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const vendablePools = await GlobalLibrary.getVendablePools(chain, "3", "0x", tokenIn_address, tokenOut_address);

	async function getSufficientVendablePools() {
		if (vendablePools.length == 0) return [];

		let tokenBalancePromises = [];
		let sufficientVendablePools = [];

		for (const pool of vendablePools) tokenBalancePromises.push(token.balanceOf(pool.pool_address));

		const tokenBalanceResult = await Promise.all(tokenBalancePromises);

		for (let index = 0; index < tokenBalanceResult.length; index++) {
			if (tokenBalanceResult[index] <= amountIn * 2n) continue;
			if (tokenBalanceResult[index] > amountIn * 2n) {
				sufficientVendablePools.push(vendablePools[index]);
				continue;
			}
		}

		return sufficientVendablePools;
	}

	const sufficientVendablePools = await getSufficientVendablePools();

	async function getOptimalInput() {
		if (sufficientVendablePools.length == 0) return [null, null, null, null];

		let zeroForOne;
		let sqrtPriceLimitX96;
		let promises = [];
		let flashPools = [];

		for (const pool of sufficientVendablePools) {
			const QuoterContract = QuotersV3[pool.project_name];
			const QutoerVersion = QuoterVersionsV3[pool.project_name];

			if (pool.token0_address == tokenIn_address && pool.token1_address == tokenOut_address) {
				zeroForOne = false;
				sqrtPriceLimitX96 = MAX_SQRT_RATIO - 1000n;
			}

			if (pool.token0_address == tokenOut_address && pool.token1_address == tokenIn_address) {
				zeroForOne = true;
				sqrtPriceLimitX96 = MIN_SQRT_RATIO + 1000n;
			}

			if (QutoerVersion == 1) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, pool.pool_fee, amountIn, sqrtPriceLimitX96);

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 2) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
					tokenIn: tokenOut_address,
					tokenOut: tokenIn_address,
					amount: amountIn,
					fee: pool.pool_fee,
					sqrtPriceLimitX96: sqrtPriceLimitX96,
				});

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 3) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult(tokenOut_address, tokenIn_address, amountIn, sqrtPriceLimitX96);

				promises.push(promise);
				flashPools.push(pool);
			}

			if (QutoerVersion == 4) {
				const promise = QuoterContract.quoteExactOutputSingle.staticCallResult({
					tokenIn: tokenOut_address,
					tokenOut: tokenIn_address,
					amount: amountIn,
					limitSqrtPrice: sqrtPriceLimitX96,
				});

				promises.push(promise);
				flashPools.push(pool);
			}

			if (zeroForOne == undefined || sqrtPriceLimitX96 == undefined) {
				console.log("undefined error occured zeroForOne !!!", zeroForOne);
				console.log("undefined error occured sqrtPriceLimitX96 !!!", sqrtPriceLimitX96);
				return;
			}
		}

		let result = [];

		try {
			result = await Promise.all(promises);
		} catch (error) {
			pool.processing = false;

			return;
		}

		if (result.length == 0) return [null, null, null, null];

		let optimalInput = Infinity;
		let flashPool;

		for (let index = 0; index < result.length; index++) {
			if (result[index].amountIn !== undefined && result[index].amountIn < optimalInput) {
				optimalInput = result[index].amountIn;
				flashPool = flashPools[index];
				continue;
			}

			if (result[index].amountIn == undefined && result[index][0].returnedAmount < optimalInput) {
				optimalInput = result[index][0].returnedAmount;
				flashPool = flashPools[index];
				continue;
			}
		}

		return [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96];
	}

	const [optimalInput, flashPool, zeroForOne, sqrtPriceLimitX96] = await getOptimalInput();

	if (optimalInput == null || flashPool == null || zeroForOne == null || sqrtPriceLimitX96 == null) {
		pool.processing = false;

		return;
	}

	const tokenRevenue = ethers.formatUnits(amountOutMin, tokenOut_decimal) - ethers.formatUnits(optimalInput, tokenOut_decimal);

	const vendableProfit = tokenRevenue * tokenOut_price;

	if (vendableProfit < minimumVendableProfit || Number(ethers.formatUnits(amountOutMin, tokenOut_decimal)) < Number(ethers.formatUnits(optimalInput, tokenOut_decimal))) {
		pool.processing = false;

		return;
	}

	if (project.comments) {
		console.log("flashPool", flashPool);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Borrow from flashPoolContract V3`);
		console.log(`${ethers.formatUnits(amountIn, tokenIn_decimal)} ${tokenIn_symbol} Send Input to arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(amountOutMin, tokenOut_decimal)} ${tokenOut_symbol} Take Output from arbitragePoolContract V2`);
		console.log(`${ethers.formatUnits(optimalInput, tokenOut_decimal)} ${tokenOut_symbol} Payback to flashPoolContract V3`);
		console.log(`tokenRevenue ${tokenRevenue} ${tokenOut_symbol}`);
		console.log("entranceProfit", entranceProfit);
		console.log("vendableProfit", vendableProfit);
	}

	await GlobalLibrary.saveProfitToJson(chain, entranceProfit, vendableProfit, projectName, pool_name, amountIn, tokenIn_decimal, tokenIn_symbol, tokenIn_address, amountOutMin, tokenOut_decimal, tokenOut_symbol, tokenOut_address);

	const swapData =
		ZeroToOne == true
			? project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [0, amountOutMin, flashSwapAddress, "0x"]).slice(2)
			: project.flashSwapFunctionSelector + encoder.encode(["uint256", "uint256", "address", "bytes"], [amountOutMin, 0, flashSwapAddress, "0x"]).slice(2);

	const callback = encoder.encode(["address", "address", "address", "bytes", "address", "uint256"], [pool.address, flashPool.token0_address, flashPool.token1_address, swapData, "0x0000000000000000000000000000000000000000", 0]);

	const flashPoolData = ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [pool.address, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

	const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);

	const tx = {
		from: WalletAddress,
		to: flashSwapAddress,
		data: flashSwap_data,
		chainId: chainID,
		value: 0,
		type: 2,
		gasLimit: flashSwap_gasLimit,
		maxFeePerGas: FeeData[chain].maxFeePerGas * maxFeePerGas_multiplier,
		maxPriorityFeePerGas: FeeData[chain].maxPriorityFeePerGas * maxPriorityFeePerGas_multiplier,
		// gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
		// nonce: await Owner_Account.getNonce(),
	};

	const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * gasPrice_multiplier) / 10 ** 18) * nativeToken_Market_Price;

	// getL1TransactionFee is Disabled

	const flashSwapProfit = vendableProfit - transactionFeeL2;

	if (isNaN(flashSwapProfit) || flashSwapProfit == undefined || transactionFeeL2 == undefined || flashSwapProfit < minimumFlashSwapProfit) {
		pool.processing = false;

		return;
	}

	if (project.comments) {
		console.log("transactionFeeL2", transactionFeeL2, "$");
		console.log("flashSwapProfit", flashSwapProfit, "$");
	}

	async function execute() {
		let isErrorOccured;

		try {
			await FLASHSWAP_PROVIDER.call(tx);

			isErrorOccured = false;
		} catch (error) {
			await GlobalLibrary.saveErrorToJson(
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

		if (isErrorOccured == false) {
			const transaction_body = await Owner_Account.sendTransaction(tx);

			const receipt = await FLASHSWAP_PROVIDER.waitForTransaction(transaction_body.hash, confirmation, blockTime);

			if (receipt.status == 1) {
				await GlobalLibrary.saveProfitToCsv(chain, startTime, projectName, pool_name, transactionFeeL2, entranceProfit, vendableProfit, flashSwapProfit, tokenRevenue, tokenOut_symbol);
			}
		}

		[pool.reserve0, pool.reserve1] = await pool.https_contract.getReserves();

		pool.processing = false;
	}

	await execute();
}

async function Initializer() {
	for (const pool of poolsData) {
		const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

		const pool_object = eval(object_name);

		pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

		const reserves = await pool_object.https_contract.getReserves();

		pool_object.reserve0 = BigInt(reserves[0]);
		pool_object.reserve1 = BigInt(reserves[1]);

		// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
		// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

		global[object_name] = pool_object;
	}
}

async function Listen() {
	async function re_initialize() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

			const pool_object = eval(object_name);

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.LINEA_V2_WSS_POOL_PROVIDER_URL);

			pool_object.wss_contract = new ethersV5.Contract(pool_object.address, poolABI, WSS_POOL_PROVIDER);

			global[object_name] = pool_object;
		}
	}

	async function addListeners() {
		for (const pool of poolsData) {
			const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

			const pool_object = eval(object_name);

			// console.log("Old Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));

			await pool_object.wss_contract.removeAllListeners("Sync");

			// console.log("New Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));

			pool_object.wss_contract.on("Sync", async (reserve0, reserve1) => {
				try {
					pool_object.reserve0 = BigInt(reserve0);
					pool_object.reserve1 = BigInt(reserve1);

					// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
					// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

					global[object_name] = pool_object;

					await Executor(pool_object);
				} catch (error) {
					console.error("Error fetching reserves or fee ratio:", error);
				}
			});

			// console.log("Added Listener Count of", pool_object.address, pool_object.wss_contract.listenerCount("Swap"));
		}
	}

	function setupHeartbeat() {
		clearInterval(heartbeatInterval);
		heartbeatInterval = setInterval(() => {
			WSS_POOL_PROVIDER._websocket.ping();
		}, 15000);
	}

	async function monitorPool() {
		await addListeners();

		WSS_POOL_PROVIDER._websocket.on("close", async () => {
			// console.log("WebSocket connection closed. Attempting to reconnect...");
			clearInterval(heartbeatInterval);
			await reconnect();
		});

		WSS_POOL_PROVIDER._websocket.on("error", async (error) => {
			// console.error("WebSocket error:", error);
			clearInterval(heartbeatInterval);
			await reconnect();
		});

		WSS_POOL_PROVIDER._websocket.on("open", async () => {
			// console.log("WebSocket connection opened.");
			setupHeartbeat();
		});
	}

	await monitorPool();

	function reconnect() {
		setTimeout(async () => {
			// console.log("Reconnecting to WebSocket...");
			await re_initialize(); // Re Initialize Websocket Provider and Pool Contract of each Pool
			monitorPool();
		}, 3000);
	}
}

async function Callee() {
	for (const pool of poolsData) {
		const object_name = pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";

		const pool_object = eval(object_name);

		Executor(pool_object);

		// await Executor(pool_object);
	}
}

Initializer().then(() => {
	Listen().then(() => {
		setInterval(Callee, Interval);
	});
});
