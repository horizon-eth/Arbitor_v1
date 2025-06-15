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

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.BLAST_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

let WETH_BLAST_POOL = {
	address: "0xF7f283c2bD0572F824A38eaa079AB31074068D31",
	https_contract: new ethers.Contract("0xF7f283c2bD0572F824A38eaa079AB31074068D31", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_PAC_POOL = {
	address: "0x35CfFD490Fa1f20C7FADB669067E4cF289BD61a2",
	https_contract: new ethers.Contract("0x35CfFD490Fa1f20C7FADB669067E4cF289BD61a2", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_WETH_POOL = {
	address: "0x3b5d3f610Cc3505f4701E9FB7D0F0C93b7713adD",
	https_contract: new ethers.Contract("0x3b5d3f610Cc3505f4701E9FB7D0F0C93b7713adD", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_WETH_POOL = {
	address: "0xC6ffE8373b79374B6697CeFDf646F623f6D9d23d",
	https_contract: new ethers.Contract("0xC6ffE8373b79374B6697CeFDf646F623f6D9d23d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WEETH_WETH_POOL = {
	address: "0x57fdFD19516A031f3648224c0657353021112534",
	https_contract: new ethers.Contract("0x57fdFD19516A031f3648224c0657353021112534", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ORBIT_WETH_POOL = {
	address: "0x1c63c0839108eC7B9F3f7b76C45A4A6745ae009B",
	https_contract: new ethers.Contract("0x1c63c0839108eC7B9F3f7b76C45A4A6745ae009B", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WRSETH_POOL = {
	address: "0xb15911aea7e22e0F43AADa43B387a84f2b56A1aa",
	https_contract: new ethers.Contract("0xb15911aea7e22e0F43AADa43B387a84f2b56A1aa", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_ESE_POOL = {
	address: "0x63dDf94107e1C3aB6536b6Cbc9c12693deb3C74A",
	https_contract: new ethers.Contract("0x63dDf94107e1C3aB6536b6Cbc9c12693deb3C74A", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PEW_WETH_POOL = {
	address: "0x17bCdE725110e3c77eb209ED3F0433724E3807EC",
	https_contract: new ethers.Contract("0x17bCdE725110e3c77eb209ED3F0433724E3807EC", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_PUDGE_POOL = {
	address: "0x877979A61D797296710e5c576E291a898a157a34",
	https_contract: new ethers.Contract("0x877979A61D797296710e5c576E291a898a157a34", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let RBX_WETH_POOL = {
	address: "0x63F51fbEAbFfBe63812E1B9CaC689458d409b7d9",
	https_contract: new ethers.Contract("0x63F51fbEAbFfBe63812E1B9CaC689458d409b7d9", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_OLE_POOL = {
	address: "0x21fE567e9763e7d3b0F294BB7951e6082F26c4ca",
	https_contract: new ethers.Contract("0x21fE567e9763e7d3b0F294BB7951e6082F26c4ca", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_NWO_POOL = {
	address: "0xF0f062555C88764eE7d5E040D2272fF0C9E2b812",
	https_contract: new ethers.Contract("0xF0f062555C88764eE7d5E040D2272fF0C9E2b812", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KAP_WETH_POOL = {
	address: "0x41950F0e69A5d0B6bAfEFD1e3D9a0B57d336DB32",
	https_contract: new ethers.Contract("0x41950F0e69A5d0B6bAfEFD1e3D9a0B57d336DB32", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PEACE_WETH_POOL = {
	address: "0x403A25473d5f8D67E5349DcC6dF8b05b751c710B",
	https_contract: new ethers.Contract("0x403A25473d5f8D67E5349DcC6dF8b05b751c710B", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_BAJA_POOL = {
	address: "0x2910713F92cdC986b18c618d16774fb3eC49EE7c",
	https_contract: new ethers.Contract("0x2910713F92cdC986b18c618d16774fb3eC49EE7c", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_$HOGE_POOL = {
	address: "0xbFCd1E44E086244C5D2856aB1E9db4B6530D7B3D",
	https_contract: new ethers.Contract("0xbFCd1E44E086244C5D2856aB1E9db4B6530D7B3D", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let OHNO_WETH_POOL = {
	address: "0x7176DB3a4553B15AfF3Dc0210d27C909A22e4587",
	https_contract: new ethers.Contract("0x7176DB3a4553B15AfF3Dc0210d27C909A22e4587", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_OMNI_POOL = {
	address: "0x9f2484a41182d782Ef8bBA0DE7E90A4e65E8B06D",
	https_contract: new ethers.Contract("0x9f2484a41182d782Ef8bBA0DE7E90A4e65E8B06D", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_BEPE_POOL = {
	address: "0x2dE0de7886fB8cCd6418cD181a29B0Db09371364",
	https_contract: new ethers.Contract("0x2dE0de7886fB8cCd6418cD181a29B0Db09371364", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_VLT_POOL = {
	address: "0xE8778fF4e509dbbCEB17c25Df2817A9bfE048F78",
	https_contract: new ethers.Contract("0xE8778fF4e509dbbCEB17c25Df2817A9bfE048F78", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_BEAST_POOL = {
	address: "0x970984B7fD3f6775E36bf13861c21C9D329412FF",
	https_contract: new ethers.Contract("0x970984B7fD3f6775E36bf13861c21C9D329412FF", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let FBRO_WETH_POOL = {
	address: "0x504aC76Ba8ea0978c655c5C516901Efc047a8540",
	https_contract: new ethers.Contract("0x504aC76Ba8ea0978c655c5C516901Efc047a8540", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_DONE_POOL = {
	address: "0x22CD28DfAC1B8B098f078f4BF2D5871e360A842a",
	https_contract: new ethers.Contract("0x22CD28DfAC1B8B098f078f4BF2D5871e360A842a", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_FARM_POOL = {
	address: "0x1502CeEC5A85112aE9bc864D6D9c821886209D92",
	https_contract: new ethers.Contract("0x1502CeEC5A85112aE9bc864D6D9c821886209D92", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ILMEAALIMV2_WETH_POOL = {
	address: "0x21A2AC970724caF9B58f18E43eAe7ed64775E3F7",
	https_contract: new ethers.Contract("0x21A2AC970724caF9B58f18E43eAe7ed64775E3F7", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_NICE_POOL = {
	address: "0x9e2DF0e7df0881f503b6bEa78de311F8D5a17C96",
	https_contract: new ethers.Contract("0x9e2DF0e7df0881f503b6bEa78de311F8D5a17C96", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MUI_POOL = {
	address: "0x5E421CbE23d167AcCd2F29e4142884c946270E52",
	https_contract: new ethers.Contract("0x5E421CbE23d167AcCd2F29e4142884c946270E52", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let HACKER_WETH_POOL = {
	address: "0x9b53685Eed60897025A6FdbD6DBd5cB8830fAdDd",
	https_contract: new ethers.Contract("0x9b53685Eed60897025A6FdbD6DBd5cB8830fAdDd", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_BEATER_POOL = {
	address: "0x9F654C59539b9635b72818cd686746F4625A8174",
	https_contract: new ethers.Contract("0x9F654C59539b9635b72818cd686746F4625A8174", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_VROOM_POOL = {
	address: "0x2079bd2A49DCc0FD21B022E4937A4F0bEaE82Da7",
	https_contract: new ethers.Contract("0x2079bd2A49DCc0FD21B022E4937A4F0bEaE82Da7", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WOB_POOL = {
	address: "0xa7Fe9f5a84Be2398324be91f845DC9f95e6208E4",
	https_contract: new ethers.Contract("0xa7Fe9f5a84Be2398324be91f845DC9f95e6208E4", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BINU_WETH_POOL = {
	address: "0xbBfa2E67473FE2d108a86c320e2334A1c7C7bdA0",
	https_contract: new ethers.Contract("0xbBfa2E67473FE2d108a86c320e2334A1c7C7bdA0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_FINGER_POOL = {
	address: "0x6380cD21c866f44D9ea91c1eB294A0a1A8A7A4Bb",
	https_contract: new ethers.Contract("0x6380cD21c866f44D9ea91c1eB294A0a1A8A7A4Bb", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_ZKDX_POOL = {
	address: "0x2713aa34839379A88467629Bd3012f4774b09449",
	https_contract: new ethers.Contract("0x2713aa34839379A88467629Bd3012f4774b09449", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_HYPE_POOL = {
	address: "0x2c0C7D146ec09d1a0b32B1bb115D6cEacAF4C610",
	https_contract: new ethers.Contract("0x2c0C7D146ec09d1a0b32B1bb115D6cEacAF4C610", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_BLAST_POOL = {
	address: "0x56e1CDFBa23D11A9CFA61Dc9EaA91829A3757171",
	https_contract: new ethers.Contract("0x56e1CDFBa23D11A9CFA61Dc9EaA91829A3757171", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_PAC_POOL = {
	address: "0xf8b1EE004C9b133064011BC6cc50fc6648FDa05D",
	https_contract: new ethers.Contract("0xf8b1EE004C9b133064011BC6cc50fc6648FDa05D", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_PAC_POOL = {
	address: "0x48793255b11bd60Fd41e376BDEBD82d9e7cD5eFB",
	https_contract: new ethers.Contract("0x48793255b11bd60Fd41e376BDEBD82d9e7cD5eFB", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PAC_WRSETH_POOL = {
	address: "0xE2049d084168B2B663C6F6aD05C394C740fD5Cf4",
	https_contract: new ethers.Contract("0xE2049d084168B2B663C6F6aD05C394C740fD5Cf4", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PEW_PAC_POOL = {
	address: "0x0fB1957626875888e2B1206EE9AE4c61C993f378",
	https_contract: new ethers.Contract("0x0fB1957626875888e2B1206EE9AE4c61C993f378", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let RBX_PAC_POOL = {
	address: "0x5e97c898c0536B118bEdd6b28ae4A33041488537",
	https_contract: new ethers.Contract("0x5e97c898c0536B118bEdd6b28ae4A33041488537", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PAC_OLE_POOL = {
	address: "0x70b9408D7fDbF9418eCB35553B9242f1D3B19890",
	https_contract: new ethers.Contract("0x70b9408D7fDbF9418eCB35553B9242f1D3B19890", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KAP_PAC_POOL = {
	address: "0x900c9ff5D2C0aC6051766330557A020B636D45b8",
	https_contract: new ethers.Contract("0x900c9ff5D2C0aC6051766330557A020B636D45b8", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let $HOGE_PAC_POOL = {
	address: "0x50Bb4D58483EdFc662a625F6685fDBE7431aD604",
	https_contract: new ethers.Contract("0x50Bb4D58483EdFc662a625F6685fDBE7431aD604", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_USDB_POOL = {
	address: "0x86437A9464513F7A9295eB6428662Ee9C8D657bC",
	https_contract: new ethers.Contract("0x86437A9464513F7A9295eB6428662Ee9C8D657bC", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let ORBIT_USDB_POOL = {
	address: "0xBcfA81bAfd6F6A038dA8989fe64A28DFb54EDb1F",
	https_contract: new ethers.Contract("0xBcfA81bAfd6F6A038dA8989fe64A28DFb54EDb1F", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_WRSETH_POOL = {
	address: "0xa0FFe4f5cBE3A4B4cCaFC35039afE69bB78813e0",
	https_contract: new ethers.Contract("0xa0FFe4f5cBE3A4B4cCaFC35039afE69bB78813e0", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PEW_USDB_POOL = {
	address: "0x0268502fD36696b1434F38B7F3D1542c85b140f1",
	https_contract: new ethers.Contract("0x0268502fD36696b1434F38B7F3D1542c85b140f1", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_PUDGE_POOL = {
	address: "0x52F45D67A226ff39FFD73578C11aeCA0697b0c13",
	https_contract: new ethers.Contract("0x52F45D67A226ff39FFD73578C11aeCA0697b0c13", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let RBX_USDB_POOL = {
	address: "0x9409e04623f9F733e61Ba6af957aC79376d94583",
	https_contract: new ethers.Contract("0x9409e04623f9F733e61Ba6af957aC79376d94583", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_OLE_POOL = {
	address: "0xe22067c3201e068b28F1F361AEd53ea003B2bab5",
	https_contract: new ethers.Contract("0xe22067c3201e068b28F1F361AEd53ea003B2bab5", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KAP_USDB_POOL = {
	address: "0x74C0835091a6D934043B85a5540A9c2bAc339FaC",
	https_contract: new ethers.Contract("0x74C0835091a6D934043B85a5540A9c2bAc339FaC", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_$HOGE_POOL = {
	address: "0x7a92473cc98422668F55219715CF30AC1292D02E",
	https_contract: new ethers.Contract("0x7a92473cc98422668F55219715CF30AC1292D02E", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDB_ZKDX_POOL = {
	address: "0x72a729c7f20812106723c7A4d8628e14c88848Bb",
	https_contract: new ethers.Contract("0x72a729c7f20812106723c7A4d8628e14c88848Bb", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let EZETH_OLE_POOL = {
	address: "0x36a494D7dF832BF41A4C5fEAD3CbDb642bBe0f9d",
	https_contract: new ethers.Contract("0x36a494D7dF832BF41A4C5fEAD3CbDb642bBe0f9d", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KAP_EZETH_POOL = {
	address: "0x4e694537945d8F122890725B3aF53482902c5Ba3",
	https_contract: new ethers.Contract("0x4e694537945d8F122890725B3aF53482902c5Ba3", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let PEW_OLE_POOL = {
	address: "0xEa10DeEF1936e5b94F4720df325BBFb2c2331cB7",
	https_contract: new ethers.Contract("0xEa10DeEF1936e5b94F4720df325BBFb2c2331cB7", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let $HOGE_PUDGE_POOL = {
	address: "0xBCB0A335066BaFD4977Ffa606eb7e20544Fe2095",
	https_contract: new ethers.Contract("0xBCB0A335066BaFD4977Ffa606eb7e20544Fe2095", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let RBX_OLE_POOL = {
	address: "0xd7884BB15fA9b4cc9fe735Ca8198e9516cf1d5Fc",
	https_contract: new ethers.Contract("0xd7884BB15fA9b4cc9fe735Ca8198e9516cf1d5Fc", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let RBX_ZKDX_POOL = {
	address: "0xa40c3bEF9a9F70Ed36000518c44023f49f6C60BA",
	https_contract: new ethers.Contract("0xa40c3bEF9a9F70Ed36000518c44023f49f6C60BA", poolABI, POOL_PROVIDER_V2),
	wss_contract: null,
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let KAP_OLE_POOL = {
	address: "0x27F297Bb162B396dEB94FF3711d30059CB18Ba5F",
	https_contract: new ethers.Contract("0x27F297Bb162B396dEB94FF3711d30059CB18Ba5F", poolABI, POOL_PROVIDER_V2),
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

			WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.BLAST_V2_WSS_POOL_PROVIDER_URL);

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
