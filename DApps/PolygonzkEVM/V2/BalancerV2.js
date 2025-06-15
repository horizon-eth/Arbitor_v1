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

let WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V2_WSS_POOL_PROVIDER_URL);

let heartbeatInterval;

const VAULT_ABI = require("../../../Scripts/Dex/FetcherV2/UniversalABIsV2/VaultABI.json");

let VAULT = {
	address: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
	https_contract: new ethers.Contract("0xBA12222222228d8Ba445958a75a0704d566BF2C8", VAULT_ABI, POOL_PROVIDER_V2),
	wss_contract: null,
};

let BAL_WETH_0_000001_0x7838_POOL = {
	address: "0x78385153d2f356c87001f09bb5424137c618d38b",
	poolId: "0x78385153d2f356c87001f09bb5424137c618d38b000200000000000000000001",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BAL_DAI_0_01_0x5480_POOL = {
	address: "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf",
	poolId: "0x5480b5f610fa0e11e66b42b977e06703c07bc5cf000200000000000000000008",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_DAI_0_01_0xa7f6_POOL = {
	address: "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53",
	poolId: "0xa7f602cfaf75a566cb0ed110993ee81c27fa3f53000200000000000000000009",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_001_0x53dd_POOL = {
	address: "0x53ddc1f1ef585b426c03674f278f8107f1524ade",
	poolId: "0x53ddc1f1ef585b426c03674f278f8107f1524ade000200000000000000000012",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_0_01_0x7da2_POOL = {
	address: "0x7da2bb31cb168be60025f9122a95cbb3949e7e9e",
	poolId: "0x7da2bb31cb168be60025f9122a95cbb3949e7e9e000200000000000000000016",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_DAI_0_003_0x5b12_POOL = {
	address: "0x5b125477cd532b892c3a6b206014c6c9518a0afe",
	poolId: "0x5b125477cd532b892c3a6b206014c6c9518a0afe000200000000000000000018",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0xff9b_POOL = {
	address: "0xff9b1278eba8046007bf9c30b3d93f68f9323451",
	poolId: "0xff9b1278eba8046007bf9c30b3d93f68f932345100020000000000000000001a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_003_0xca4d_POOL = {
	address: "0xca4d6fff7e481a22273b02b6df5563dc36846cdc",
	poolId: "0xca4d6fff7e481a22273b02b6df5563dc36846cdc00020000000000000000001b",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_01_0xc272_POOL = {
	address: "0xc27260ee43394bd134007ee9ec078071b04cee25",
	poolId: "0xc27260ee43394bd134007ee9ec078071b04cee2500020000000000000000001c",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_DAI_0_04_0xa77a_POOL = {
	address: "0xa77a369bdc3ad638881feae97e0679e3b428f5a1",
	poolId: "0xa77a369bdc3ad638881feae97e0679e3b428f5a100020000000000000000001d",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_01_0x47ee_POOL = {
	address: "0x47eeb5e07b8db37f75f29422d90a2b729c8f3955",
	poolId: "0x47eeb5e07b8db37f75f29422d90a2b729c8f395500020000000000000000001e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0x9796_POOL = {
	address: "0x9796631591ba3bc77f972db22b4fca9cece57f32",
	poolId: "0x9796631591ba3bc77f972db22b4fca9cece57f3200020000000000000000001f",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0x01e4_POOL = {
	address: "0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef",
	poolId: "0x01e4464604ad0167d9dccda63ecd471b0ca0f0ef000200000000000000000020",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_003_0x91e3_POOL = {
	address: "0x91e320de69e66de95a467ca2b7240bd64a02f5ad",
	poolId: "0x91e320de69e66de95a467ca2b7240bd64a02f5ad000200000000000000000021",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_003_0x246e_POOL = {
	address: "0x246e3d0ae7664854e4dcb0d8c85220e714a5f033",
	poolId: "0x246e3d0ae7664854e4dcb0d8c85220e714a5f033000200000000000000000022",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_003_0xa1c3_POOL = {
	address: "0xa1c3ca20558665214abacc9be6c281b04165e5bd",
	poolId: "0xa1c3ca20558665214abacc9be6c281b04165e5bd000200000000000000000025",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_0_003_0x32b5_POOL = {
	address: "0x32b5d76f76dd68c676190ee98a9877587f9b3b22",
	poolId: "0x32b5d76f76dd68c676190ee98a9877587f9b3b22000200000000000000000026",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0x4819_POOL = {
	address: "0x48194f969522bcc131256a92bc4895ea04809b41",
	poolId: "0x48194f969522bcc131256a92bc4895ea04809b41000200000000000000000027",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0x910d_POOL = {
	address: "0x910d889a6ccd1b731c8cec2acdf78c6b81e1e3c0",
	poolId: "0x910d889a6ccd1b731c8cec2acdf78c6b81e1e3c0000200000000000000000028",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BAL_WETH_0_003_0xa447_POOL = {
	address: "0xa4475aa0a6971e3cc82de08e9ce432ecc8a562ad",
	poolId: "0xa4475aa0a6971e3cc82de08e9ce432ecc8a562ad000200000000000000000029",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_STMATIC_0_003_0x3087_POOL = {
	address: "0x308752968330a04de70ca472bf1f15c9889c55aa",
	poolId: "0x308752968330a04de70ca472bf1f15c9889c55aa00020000000000000000002a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let STMATIC_USDC_0_003_0xe7dc_POOL = {
	address: "0xe7dc705ee3e98cdabc9d1a9cae25af992e0ed778",
	poolId: "0xe7dc705ee3e98cdabc9d1a9cae25af992e0ed77800020000000000000000002b",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0xfa2a_POOL = {
	address: "0xfa2ab0d6d2e1cfaea03d4967d07adbd0200f156b",
	poolId: "0xfa2ab0d6d2e1cfaea03d4967d07adbd0200f156b00020000000000000000002c",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0xe261_POOL = {
	address: "0xe261a80e811db76785734fb724db05d8157d5968",
	poolId: "0xe261a80e811db76785734fb724db05d8157d596800020000000000000000002d",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_DAI_0_003_0x1198_POOL = {
	address: "0x1198b4cc6c9ac22ce9de370efd67e2d27bb70084",
	poolId: "0x1198b4cc6c9ac22ce9de370efd67e2d27bb7008400020000000000000000002e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_0_003_0x231d_POOL = {
	address: "0x231dce3f4055cd5f2c415535db22fb35a1e876b1",
	poolId: "0x231dce3f4055cd5f2c415535db22fb35a1e876b100020000000000000000002f",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_001_0x4297_POOL = {
	address: "0x42972cde4adaad1227f1ceb14faf85c2d9e53eb9",
	poolId: "0x42972cde4adaad1227f1ceb14faf85c2d9e53eb9000200000000000000000030",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0x7385_POOL = {
	address: "0x7385feb96fa203e35527322ca233271834306d60",
	poolId: "0x7385feb96fa203e35527322ca233271834306d60000200000000000000000031",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_STMATIC_0_003_0x66a2_POOL = {
	address: "0x66a25b6c454ff0c23c676a458f451f05590236e8",
	poolId: "0x66a25b6c454ff0c23c676a458f451f05590236e8000200000000000000000032",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0xb956_POOL = {
	address: "0xb956e7737ebcdabdfe4b2b8de7156026916f6e0b",
	poolId: "0xb956e7737ebcdabdfe4b2b8de7156026916f6e0b000200000000000000000033",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_001_0x2c31_POOL = {
	address: "0x2c3166b010c4578185977d4fff029d6255a27ccb",
	poolId: "0x2c3166b010c4578185977d4fff029d6255a27ccb000200000000000000000034",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0x4edd_POOL = {
	address: "0x4edd641193f3cb21e2df66227d5050db69cc741f",
	poolId: "0x4edd641193f3cb21e2df66227d5050db69cc741f000200000000000000000035",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_01_0xe767_POOL = {
	address: "0xe767a4553730ceddddd5184588da93298424396d",
	poolId: "0xe767a4553730ceddddd5184588da93298424396d000200000000000000000036",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0x506d_POOL = {
	address: "0x506d973009a9ba37329d963adfb4845797fd3995",
	poolId: "0x506d973009a9ba37329d963adfb4845797fd3995000200000000000000000037",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WBTC_0_003_0xf74d_POOL = {
	address: "0xf74d0c533012e372a465712b49a26199a1b0714c",
	poolId: "0xf74d0c533012e372a465712b49a26199a1b0714c000200000000000000000038",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_003_0xf922_POOL = {
	address: "0xf92264b0965d32058b099cdf93e8b3f15d8a6e63",
	poolId: "0xf92264b0965d32058b099cdf93e8b3f15d8a6e63000200000000000000000039",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_001_0x3391_POOL = {
	address: "0x33911f5ce1c5504b68f90b1a5850ca2e2df71b94",
	poolId: "0x33911f5ce1c5504b68f90b1a5850ca2e2df71b9400020000000000000000003a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_004_0xe5e1_POOL = {
	address: "0xe5e1c6768f0cfd69468b3a45b6e29ac3406c5272",
	poolId: "0xe5e1c6768f0cfd69468b3a45b6e29ac3406c527200020000000000000000003b",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let QUICK_DAI_0_003_0x79aa_POOL = {
	address: "0x79aa8935118b0c187ac17344c13a12b58dd90306",
	poolId: "0x79aa8935118b0c187ac17344c13a12b58dd9030600020000000000000000003c",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_QUICK_0_003_0xd1fc_POOL = {
	address: "0xd1fc6968ea55d9441bfefbec7edfda0f27f8447c",
	poolId: "0xd1fc6968ea55d9441bfefbec7edfda0f27f8447c00020000000000000000003d",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_DAI_0_003_0x1eff_POOL = {
	address: "0x1eff97f8c47d3c60c11aeadd46764164732c8113",
	poolId: "0x1eff97f8c47d3c60c11aeadd46764164732c811300020000000000000000003e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_003_0x8526_POOL = {
	address: "0x85268d35de399b7ad30904eba9e75ae5fc12c4ab",
	poolId: "0x85268d35de399b7ad30904eba9e75ae5fc12c4ab00020000000000000000003f",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_DAI_0_003_0xcc42_POOL = {
	address: "0xcc4227c263f1c77c4b94068257deebf355da23a0",
	poolId: "0xcc4227c263f1c77c4b94068257deebf355da23a0000200000000000000000040",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_MATIC_0_003_0x6772_POOL = {
	address: "0x6772d3aefe8304dbea9c4e606aec76157d5947e8",
	poolId: "0x6772d3aefe8304dbea9c4e606aec76157d5947e8000200000000000000000041",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_0_001_0x9bed_POOL = {
	address: "0x9beddc42719c25d7dfc38017b3685044f83225cf",
	poolId: "0x9beddc42719c25d7dfc38017b3685044f83225cf000200000000000000000042",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let QUICK_USDC_0_003_0x5ace_POOL = {
	address: "0x5ace7c1549a21e5376145a52057bc6808381a902",
	poolId: "0x5ace7c1549a21e5376145a52057bc6808381a902000200000000000000000043",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_0001_0xe429_POOL = {
	address: "0xe4293dbd32e54421304e4f0d040fc06c7dc6c0b5",
	poolId: "0xe4293dbd32e54421304e4f0d040fc06c7dc6c0b5000200000000000000000044",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_003_0x5472_POOL = {
	address: "0x54725dc4fed400f12b43ca9bc24cc8b828e83f04",
	poolId: "0x54725dc4fed400f12b43ca9bc24cc8b828e83f04000200000000000000000045",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_DAI_0_003_0xa702_POOL = {
	address: "0xa702c2945a4fb45e3685c8e47234316457fcf2c9",
	poolId: "0xa702c2945a4fb45e3685c8e47234316457fcf2c9000200000000000000000046",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_003_0x45ab_POOL = {
	address: "0x45ab9bd7f8eaf58723e6d0f698e07c92e7dde3f0",
	poolId: "0x45ab9bd7f8eaf58723e6d0f698e07c92e7dde3f0000200000000000000000047",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_003_0xfdf0_POOL = {
	address: "0xfdf0cd40380ff5b667152893db259802235cc07e",
	poolId: "0xfdf0cd40380ff5b667152893db259802235cc07e000200000000000000000048",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WSTETH_CFT_0_003_0x54bb_POOL = {
	address: "0x54bb71bcd1c3d38eea3ca2a460bc3cb4244595b6",
	poolId: "0x54bb71bcd1c3d38eea3ca2a460bc3cb4244595b6000200000000000000000049",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_WSTETH_CFT_0_001_0x3cec_POOL = {
	address: "0x3cec7e4ce7d149735efd49773ecccb80cdff758e",
	poolId: "0x3cec7e4ce7d149735efd49773ecccb80cdff758e00020000000000000000004a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_0_003_0xb286_POOL = {
	address: "0xb286ad9701155b234da0abf320d1f98902959a5f",
	poolId: "0xb286ad9701155b234da0abf320d1f98902959a5f00020000000000000000004b",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_01_0xaea5_POOL = {
	address: "0xaea5071c1ca459f27c126c1aa304e280f764de37",
	poolId: "0xaea5071c1ca459f27c126c1aa304e280f764de3700020000000000000000004d",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_001_0xf42a_POOL = {
	address: "0xf42a793b2694522904e708a435f72e949a1ebc10",
	poolId: "0xf42a793b2694522904e708a435f72e949a1ebc1000020000000000000000004e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_WETH_0_01_0x14b7_POOL = {
	address: "0x14b70ac21e8ea4a9d95227cb18d74e2eba3a60c6",
	poolId: "0x14b70ac21e8ea4a9d95227cb18d74e2eba3a60c600020000000000000000004f",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_002_0xc1ae_POOL = {
	address: "0xc1ae92e34bf8752a6dc08fede8f45c9eaab4c97f",
	poolId: "0xc1ae92e34bf8752a6dc08fede8f45c9eaab4c97f000200000000000000000051",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0x6cf9_POOL = {
	address: "0x6cf997fdb9e08f8ae7814a729cf894b0a24a7dbf",
	poolId: "0x6cf997fdb9e08f8ae7814a729cf894b0a24a7dbf000200000000000000000053",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_DAI_0_005_0x852d_POOL = {
	address: "0x852df7d05f441e231a060b5e1983fc3a65bdd8f8",
	poolId: "0x852df7d05f441e231a060b5e1983fc3a65bdd8f8000200000000000000000054",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_003_0x62b0_POOL = {
	address: "0x62b08e7e8027b0db823336da8d4e94b76fb70e42",
	poolId: "0x62b08e7e8027b0db823336da8d4e94b76fb70e42000200000000000000000055",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_001_0xd935_POOL = {
	address: "0xd9353a8f0eeae9f6fa454b2c7e144ec0875fc302",
	poolId: "0xd9353a8f0eeae9f6fa454b2c7e144ec0875fc302000200000000000000000056",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_USDC_0_001_0x8206_POOL = {
	address: "0x8206f32ab18666e45185eecf8456135aaa1d52df",
	poolId: "0x8206f32ab18666e45185eecf8456135aaa1d52df000200000000000000000057",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDT_DAI_0_003_0xf207_POOL = {
	address: "0xf20771418c02643224ae3f88019949b9cabcc572",
	poolId: "0xf20771418c02643224ae3f88019949b9cabcc572000200000000000000000058",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_RETH_0_003_0x0e0d_POOL = {
	address: "0x0e0d3981497603eed2481344844ef8c6583762f1",
	poolId: "0x0e0d3981497603eed2481344844ef8c6583762f100020000000000000000005e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_CFT_DAI_CFT_0_001_0xffb8_POOL = {
	address: "0xffb847598207ec5d3f0c8d256c061e1d664db2d3",
	poolId: "0xffb847598207ec5d3f0c8d256c061e1d664db2d3000200000000000000000061",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let AURA_WETH_0_003_0x4ced_POOL = {
	address: "0x4ced3133e70f6ed17f085170806e68cd12447b09",
	poolId: "0x4ced3133e70f6ed17f085170806e68cd12447b09000200000000000000000065",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_CFT_WETH_0_003_0xcd76_POOL = {
	address: "0xcd7652b96c855de38b492f5efada001b6d01760a",
	poolId: "0xcd7652b96c855de38b492f5efada001b6d01760a00020000000000000000006a",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let AURA_USDC_0_003_0xd5f9_POOL = {
	address: "0xd5f95e3e36f3be5d91a8eaab3256925258f56f61",
	poolId: "0xd5f95e3e36f3be5d91a8eaab3256925258f56f6100020000000000000000006c",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_MATIC_0_003_0x5bf7_POOL = {
	address: "0x5bf702e33ce112486c544dbbe2ff99664cc8857d",
	poolId: "0x5bf702e33ce112486c544dbbe2ff99664cc8857d00020000000000000000006d",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BAL_USDC_0_003_0x971e_POOL = {
	address: "0x971efa3b5c075f3e77479682b990c4ead39cfae5",
	poolId: "0x971efa3b5c075f3e77479682b990c4ead39cfae500020000000000000000006e",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WSTETH_CFT_RETH_0_003_0xa993_POOL = {
	address: "0xa9931c8ab752064cf146f8a60bcebacf05ea93c8",
	poolId: "0xa9931c8ab752064cf146f8a60bcebacf05ea93c800020000000000000000006f",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let USDC_CFT_USDC_0_001_0xa578_POOL = {
	address: "0xa578fbeaccee4e06e9ba5b2931f43013c01fa5c4",
	poolId: "0xa578fbeaccee4e06e9ba5b2931f43013c01fa5c4000200000000000000000070",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let MATIC_USDC_0_001_0x15bb_POOL = {
	address: "0x15bb3fe739c14b91e20af10bc96c0af9e7eddae8",
	poolId: "0x15bb3fe739c14b91e20af10bc96c0af9e7eddae8000200000000000000000071",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let WETH_USDC_0_003_0xc3db_POOL = {
	address: "0xc3db9dfac9939459080ee3e897d934ba151f3851",
	poolId: "0xc3db9dfac9939459080ee3e897d934ba151f3851000200000000000000000072",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

let BAL_USDC_0_003_0xda4e_POOL = {
	address: "0xda4ecea07d224278aa4bb3bacc23331e51627c58",
	poolId: "0xda4ecea07d224278aa4bb3bacc23331e51627c58000200000000000000000074",
	reserve0: undefined,
	reserve1: undefined,
	processing: false,
};

async function Executor(pool) {
	if (pool.processing == true || pool.reserve0 == undefined || pool.reserve1 == undefined || pool.reserve0 < 1000n || pool.reserve1 < 1000n) return;

	pool.processing = true;

	const startTime = performance.now();

	const { pool_name, pool_fee, weight0, weight1, token0_symbol, token0_address, token0_decimal, token1_symbol, token1_address, token1_decimal } = poolsData.find(
		(executionPool) => executionPool.pool_address == pool.address
	);

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
	let weightIn;

	let reserveOut;
	let reserveOut_dollar;
	let tokenOut_address;
	let tokenOut_symbol;
	let tokenOut_decimal;
	let tokenOut_price;
	let weightOut;

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

		const diff = ethers.formatEther(weight1) / ethers.formatEther(weight0);

		const token0_Pool_Price =
			((ethers.formatUnits(BigInt(pool.reserve1), token1_decimal) * token1_Market_Price) / (ethers.formatUnits(BigInt(pool.reserve0), token0_decimal) * token0_Market_Price * diff)) * token0_Market_Price;

		if (token0_Market_Price > token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve1);
			tokenIn_address = token1_address;
			tokenIn_symbol = token1_symbol;
			tokenIn_decimal = token1_decimal;
			tokenIn_price = token1_Market_Price;
			weightIn = weight1;

			reserveOut = BigInt(pool.reserve0);
			tokenOut_address = token0_address;
			tokenOut_symbol = token0_symbol;
			tokenOut_decimal = token0_decimal;
			tokenOut_price = token0_Market_Price;
			weightOut = weight0;

			ZeroToOne = false;
		}

		if (token0_Market_Price <= token0_Pool_Price) {
			reserveIn = BigInt(pool.reserve0);
			tokenIn_address = token0_address;
			tokenIn_symbol = token0_symbol;
			tokenIn_decimal = token0_decimal;
			tokenIn_price = token0_Market_Price;
			weightIn = weight0;

			reserveOut = BigInt(pool.reserve1);
			tokenOut_address = token1_address;
			tokenOut_symbol = token1_symbol;
			tokenOut_decimal = token1_decimal;
			tokenOut_price = token1_Market_Price;
			weightOut = weight1;

			ZeroToOne = true;
		}

		reserveIn_dollar = ethers.formatUnits(reserveIn, tokenIn_decimal) * tokenIn_price;
		reserveOut_dollar = ethers.formatUnits(reserveOut, tokenOut_decimal) * tokenOut_price;

		pool_constant_number = reserveIn_dollar * reserveOut_dollar;

		token = new ethers.Contract(tokenIn_address, ERC20.abi, CONTRACT_PROVIDER);
	}

	await initialize();

	async function formula() {
		const Bi = reserveIn; // input
		const Bo = reserveOut; // output
		const Wi = weightIn; // input
		const Wo = weightOut; // output
		const exponentiate = Wi / Wo; // input / output

		const isWeightsEqual = Wi == Wo ? 2 : exponentiate;

		const mutualReserveTarget_dollar = Wi == Wo ? reserveOut_dollar - (reserveOut_dollar - reserveIn_dollar) / isWeightsEqual : reserveOut_dollar * exponentiate;

		const amountIn_dollar = (mutualReserveTarget_dollar - reserveIn_dollar) / isWeightsEqual;

		amountIn = ethers.parseUnits((amountIn_dollar / tokenIn_price).toFixed(tokenIn_decimal), tokenIn_decimal);

		const amountInLessFee = amountIn - (amountIn * BigInt(pool_fee * 10000)) / 10000n;

		const Ai = amountInLessFee; // input

		amountOutMin = BigInt(Number(Bo) * (1 - (Number(Bi) / (Number(Bi) + Number(Ai))) ** exponentiate));

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

	await GlobalLibrary.saveProfitToJson(
		chain,
		entranceProfit,
		vendableProfit,
		projectName,
		pool_name,
		amountIn,
		tokenIn_decimal,
		tokenIn_symbol,
		tokenIn_address,
		amountOutMin,
		tokenOut_decimal,
		tokenOut_symbol,
		tokenOut_address
	);

	const singleSwap = {
		poolId: pool.poolId,
		kind: 0, // GIVEN_IN // EXACT_INPUT
		assetIn: tokenIn_address,
		assetOut: tokenOut_address,
		amount: amountIn,
		userData: "0x",
	};

	const funds = {
		sender: flashSwapAddress,
		fromInternalBalance: false,
		recipient: flashSwapAddress,
		toInternalBalance: false,
	};

	const deadline = Date.now() + 1000 * 60 * 1;

	const swapData = VAULT.https_contract.interface.encodeFunctionData("0x52bbbe29", [singleSwap, funds, amountOutMin, deadline]);

	const callback = encoder.encode(["address", "address", "address", "bytes", "uint256"], [VAULT.address, flashPool.token0_address, flashPool.token1_address, swapData, 0]);

	const flashPoolData =
		ProjectsV3[flashPool.project_name].flashSwapFunctionSelector + encoder.encode(["address", "bool", "int256", "uint160", "bytes"], [flashSwapAddress, zeroForOne, -amountIn, sqrtPriceLimitX96, callback]).slice(2);

	const flashSwap_data = flashSwapContract.interface.encodeFunctionData(flashSwapFunctionSelector["PrintLira"], [flashPool.pool_address, flashPoolData]);

	const tx = {
		from: WalletAddress,
		to: flashSwapAddress,
		data: flashSwap_data,
		chainId: chainID,
		value: 0,
		type: 0,
		gasLimit: flashSwap_gasLimit,
		gasPrice: FeeData[chain].gasPrice * gasPrice_multiplier,
		// nonce: await Owner_Account.getNonce(),
	};

	const transactionFeeL2 = Number((Number(gasLimit) * Number(FeeData[chain].gasPrice) * 2) / 10 ** 18) * nativeToken_Market_Price;

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

			[, [pool.reserve0, pool.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.poolId);

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

		[, [pool.reserve0, pool.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.poolId);

		pool.processing = false;
	}

	await execute();
}

async function Initializer() {
	const object_name = `VAULT`;

	const pool_object = eval(object_name);

	pool_object.wss_contract = new ethersV5.Contract(pool_object.address, VAULT_ABI, WSS_POOL_PROVIDER);

	for (const pool of poolsData) {
		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

		const pool_object = eval(object_name);

		[, [pool_object.reserve0, pool_object.reserve1]] = await VAULT.https_contract.getPoolTokens(pool.pool_id);

		// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
		// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

		global[object_name] = pool_object;
	}
}

async function Listen() {
	async function re_initialize() {
		const object_name = `VAULT`;

		const vault_object = eval(object_name);

		WSS_POOL_PROVIDER = new ethersV5.providers.WebSocketProvider(process.env.POLYGONZKEVM_V2_WSS_POOL_PROVIDER_URL);

		vault_object.wss_contract = new ethersV5.Contract(vault_object.address, VAULT_ABI, WSS_POOL_PROVIDER);

		global[object_name] = vault_object;
	}

	async function addListeners() {
		const object_name = `VAULT`;

		const vault_object = eval(object_name);

		// console.log("Old Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));

		await vault_object.wss_contract.removeAllListeners("Swap");

		// console.log("New Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));

		vault_object.wss_contract.on("Swap", async (poolId, tokenIn, tokenOut, amountIn, amountOut) => {
			try {
				for (const pool of poolsData) {
					if (pool.pool_id !== poolId) continue;

					const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

					const pool_object = eval(object_name);

					[, [pool_object.reserve0, pool_object.reserve1]] = await VAULT.https_contract.getPoolTokens(poolId);

					// console.log("reserve0 of", pool_object.address, pool_object.reserve0);
					// console.log("reserve1 of", pool_object.address, pool_object.reserve1);

					global[object_name] = pool_object;

					await Executor(pool_object);
				}
			} catch (error) {
				console.error("Error fetching reserves or fee ratio:", error);
			}
		});

		// console.log("Added Listener Count of", vault_object.address, vault_object.wss_contract.listenerCount("Swap"));
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
		const object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_${pool.pool_id.slice(0, 6)}_POOL`;

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
