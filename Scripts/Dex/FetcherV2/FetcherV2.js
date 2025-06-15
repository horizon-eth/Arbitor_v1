const { ethers, fs, path, ERC20, chains, selectedChain } = require("../../Common/Global/Global");

const factoryABI = require("./UniversalABIsV2/UniversalFactoryABIV2.json");
const poolABI = require("./UniversalABIsV2/UniversalPoolABIV2.json");
const balancer_pool_abi = require("../PoolABIsV2/BalancerV2WeightedPoolABI.json");
const vault_abi = require("./UniversalABIsV2/VaultABI.json");

let lastRequestTime = 0;
let tokens123 = 1;
const requestInterval = 50;

async function checkPoolDataFolderExistance(chain) {
	try {
		await fs.promises.access(path.join("Scripts/Dex/PoolDatasV2", chain));
	} catch (error) {
		if (error.code === "ENOENT") await fs.promises.mkdir(path.join("Scripts/Dex/PoolDatasV2", chain), { recursive: true });
	}
}

async function checkStateChainFileExistance(chain) {
	const filePathV2 = path.join(`Scripts/StateV2/${chain}.json`);

	try {
		await fs.promises.access(filePathV2);
	} catch (error) {
		if (error.code === "ENOENT") {
			await fs.promises.writeFile(filePathV2, "{}");
		}
	}
}

async function initializeStateV2ChainFile(chain, projectName) {
	const StateV2 = JSON.parse(fs.readFileSync(`Scripts/StateV2/${chain}.json`, "utf8"));

	const poolsData = JSON.parse(fs.readFileSync(`Scripts/Dex/PoolDatasV2/${chain}/${projectName}.json`, "utf8"));

	StateV2[projectName] = {};

	for (const pool of poolsData) {
		let pool_object_name = `${pool.token0_symbol}_${pool.token1_symbol}_POOL`;

		if (projectName == "BalancerV2") pool_object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_POOL`;

		if (projectName == "AntfarmV2") pool_object_name = `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.toString().replace(".", "_")}_POOL`;

		StateV2[projectName][pool_object_name] = {};

		StateV2[projectName][pool_object_name].address = pool.pool_address;
		StateV2[projectName][pool_object_name].reserve0 = "777";
		StateV2[projectName][pool_object_name].reserve1 = "777";

		if (projectName == "DysonFinanceV2") StateV2[projectName][pool_object_name].feeRatio = ["777", "777"];

		if (projectName == "BalancerV2") StateV2[projectName][pool_object_name].poolId = pool.pool_id;
	}

	fs.writeFileSync(`Scripts/StateV2/${chain}.json`, JSON.stringify(StateV2, null, 2));
}

async function getPools(chain) {
	await checkPoolDataFolderExistance(chain);
	await checkStateChainFileExistance(chain);

	const { SECONDARY_SCRIPT_PROVIDER, SCRIPT_PROVIDER, tokens, conflictTokens, ProjectsV2 } = require(`../../Common/Common/${chain}`);

	let vault_address;
	let vault_contract;

	for (const projectName in ProjectsV2) {
		// if (projectName !== "BalancerV2") continue;

		if (ProjectsV2.hasOwnProperty(projectName)) {
			if (ProjectsV2[projectName].factoryAddress !== "") {
				const factoryAddress = ProjectsV2[projectName].factoryAddress[0];

				if (projectName == "BalancerV2") {
					vault_address = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
					vault_contract = new ethers.Contract(vault_address, vault_abi, SCRIPT_PROVIDER);
				}

				if (projectName == "ChimpExchangeV2") {
					vault_address = "0xVAULT";
					vault_contract = new ethers.Contract(vault_address, vault_abi, SCRIPT_PROVIDER);
				}

				await runner(projectName, factoryAddress);
			}
		}
	}

	async function runner(projectName, factoryAddress) {
		const poolDataPath = path.join(__dirname, `../PoolDatasV2/${chain}/${projectName}.json`);
		const factoryContract = new ethers.Contract(factoryAddress, factoryABI, SCRIPT_PROVIDER);

		let pools = [];

		if (projectName == "DysonFinanceV2" || projectName == "AntfarmV2" || projectName == "Abstradex(XLayer)V2" || projectName == "ArthSwapV2") {
			async function getPools() {
				const poolsLength = await factoryContract.allPairsLength();

				for (let index = 0; index < poolsLength; index++) {
					await waitAndMakeRequest();
					const pool = await factoryContract.allPairs(index);
					pools.push(pool);
					console.log("pool", pool);
				}
			}

			await getPools();
		} else if (projectName == "ChimpExchangeV2") {
			if (chain == "Linea") {
				pools = ["0xe38DF7880EF9408e9933Fd0e96abcC3CebF76006", "0xB4Ff092d031C7Fd7EB988AAc8BD9feB248AD4DE4", "0x1a2978168B7E64ebDC6b1FcB77CFc10123Ac2df2"];
			}
		} else if (projectName == "BalancerV2") {
			const abi = ["event PoolCreated(address indexed pool)"];

			const factoryContractEvents = new ethers.Contract(factoryAddress, abi, SECONDARY_SCRIPT_PROVIDER);

			const latest = await SECONDARY_SCRIPT_PROVIDER.getBlockNumber();

			async function getPools() {
				for (let index = 0; index < latest; index += 5000) {
					const events = await factoryContractEvents.queryFilter("PoolCreated", index, index + 5000);

					for (eventObject of events) {
						const pool = "0x" + eventObject.topics[1].slice(-40);

						pools.push(pool);

						console.log("pool", pool, index, index + 5000, latest);
					}
				}
			}

			if (chain == "PolygonzkEVM") await getPools();

			if (chain == "Avalanche") {
				pools = [
					"0xA39d8651689c8b6e5a9e0AA4362629aeF2c58F55",
					"0xd109E874E2fC4708205227a96e9CE4E6dA2fE75E",
					"0xb8A049353e647f29Cf94F32B609baD6F67Aff080",
					"0xEfC4B97cB57e8a09Cba82d20261E78475CefFAAc",
					"0xda479115800B16a271388f35Cc3eAC67fe4608ce",
					"0x516db57BAc67FCb68f26c885EaCc4E842BD4Cf5B",
					"0xb06FdBD2941d2f42d60accEe85086198Ac729236",
					"0x3bDe1563903EbB564cA37D5736afbB850929Cfd7",
					"0xB10968b6CA2Ea1c25D392a9A990559ed3F686861",
					"0xAb567C27450E3Fa1b4eE4E67Ca7D1003C49E7ea8",
				];
			}

			if (chain == "Arbitrum") {
				pools = [
					"0x32dF62dc3aEd2cD6224193052Ce665DC18165841",
					"0x3a4c6D2404b5eb14915041e01F63200a82f4a343",
					"0x64541216bAFFFEec8ea535BB71Fbc927831d0595",
					"0xb3028Ca124B80CFE6E9CA57B70eF2F0CCC41eBd4",
					"0xEB3E64Ad9314D20bf943ac72Fb69F272603f9cce",
					"0x569061E2D807881F4A33E1cbE1063bc614cB75a4",
					"0x88E2c969e2a1C69c16d1dcd9f8ACdE4c6Ab3838a",
					"0xAF8912a3C4f55a8584B67DF30ee0dDf0e60e01f8",
					"0xc7FA3A3527435720f0e2a4c1378335324dd4F9b3",
					"0x835772Bab114563746da80806930A9E37aa85344",
					"0x9F8ed1Acfe0C863381b9081AFF2144fC867AA773",
					"0xc757F12694F550d0985ad6E1019C4db4A803f160",
					"0x05f0a172608853d5431C69888A0a559886a3319f",
					"0xcC65A812ce382aB909a11E434dbf75B34f1cc59D",
					"0x395aaD0582Cd035C6C75ae32043bb83423DdD6f8",
					"0x64ABEAe398961c10cBB50eF359f1dB41fc3129ff",
					"0xd2B6E489ce64691cb46967Df6963a49f92764Ba9",
					"0xfeD111077E0905eF2B2fbf3060cFa9a34BaB4383",
					"0xc2F082d33b5B8eF3A7E3de30da54EFd3114512aC",
					"0xC61ff48f94D801c1ceFaCE0289085197B5ec44F0",
					"0xc9f52540976385A84BF416903e1Ca3983c539E34",
					"0x9bFCD4189Cf9062697746CE292350f42fDEE457C",
					"0x934d3c04f0603332d6e182Bf33289bc4c905Fc22",
					"0xA83B8D30F61D7554aD425D8067D8bA6EaeB6b042",
					"0x260Dbd54D87A10A0Fc9D08622Ebc969A3Bf4E6bb",
					"0x178E029173417b1F9C8bC16DCeC6f697bC323746",
					"0x2D42910D826e5500579D121596E98A6eb33C0a1b",
					"0x920Ce9EC4c52e740Ab4C3D36Fb5454c274907aE5",
					"0x0adeb25cb5920d4f7447af4a0428072EdC2cEE22",
					"0x651e00FfD5eCfA7F3d4F33d62eDe0a97Cf62EdE2",
					"0x4f14D06CB1661cE1DC2A2f26A10A7Cd94393b29C",
					"0x0052688295413b32626D226a205b95cDB337DE86",
					"0xF93579002DBE8046c43FEfE86ec78b1112247BB8",
					"0x214980d2cb5E4322E3D02570AAdFC975E0d09499",
					"0x5cEd962AfbFb7E13Fb215DeFc2b027678237AA3A",
					"0x5582b457bEbc3Cd3f88035f7F54B65fec27b3f44",
					"0x7436422bE6A633f804f70a0Fd2C92876fEf83735",
					"0xA6625F741400f90D31e39a17B0D429a92e347A60",
					"0xb08B2921963c73521B536Fe33072ce5BF75e7d33",
					"0xf13DF9563dc9268A773ad852fFF80f5e913EBAF6",
					"0xb286b923A4Ed32eF1Eae425e2b2753F07A517708",
				];
			}

			if (chain == "Fraxtal") {
				pools = ["0x1570315476480fA80ceC1FFF07A20c1df1aDfD53", "0xAf125dc597aeAc3d3f9f467584275bFAa8B9c08d"];
			}

			if (chain == "Ethereum") {
				pools = [
					"0x3de27EFa2F1AA663Ae5D458857e731c129069F29",
					"0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56",
					"0x3ff3a210e57cFe679D9AD1e9bA6453A716C56a2e",
					"0xF4C0DD9B82DA36C07605df83c8a416F11724d88b",
					"0x36Be1E97eA98AB43b4dEBf92742517266F5731a3",
					"0xf16aEe6a71aF1A9Bc8F56975A4c2705ca7A782Bc",
					"0xCB0e14e96f2cEFA8550ad8e4aeA344F211E5061d",
					"0xcF7b51ce5755513d4bE016b0e28D6EDEffa1d52a",
					"0x9F9d900462492D4C21e9523ca95A7CD86142F298",
					"0x9232a548DD9E81BaC65500b5e0d918F8Ba93675C",
					"0xde8C195Aa41C11a0c4787372deFBbDdAa31306D2",
					"0xFD1Cf6FD41F229Ca86ada0584c63C49C3d66BbC9",
					"0xCfCA23cA9CA720B6E98E3Eb9B6aa0fFC4a5C08B9",
					"0x92762B42A06dCDDDc5B7362Cfb01E631c4D44B40",
					"0xA6F548DF93de924d73be7D25dC02554c6bD66dB5",
					"0xb986Fd52697f16bE888bFAD2c5bF12cd67Ce834B",
					"0x39eB558131E5eBeb9f76a6cbf6898f6E6DCe5e4E",
					"0x8Bd4A1E74A27182D23B98c10Fd21D4FbB0eD4BA0",
					"0x98b76Fb35387142f97d601A297276bB152Ae8ab0",
					"0xa8210885430aaA333c9F0D66AB5d0c312beD5E43",
					"0x7D98f308Db99FDD04BbF4217a4be8809F38fAa64",
					"0xc29562b045D80fD77c69Bec09541F5c16fe20d9d",
					"0x6228f64D5BA8376652Bfe7E36569D595347cF6Fb",
					"0x5122E01D819E58BB2E22528c0D68D310f0AA6FD7",
					"0x577A7f7EE659Aa14Dc16FD384B3F8078E23F1920",
					"0xe8cc7E765647625B95F59C15848379D10B9AB4af",
					"0x87Cf784Ee055d0260AD3AB7EE40888D4a0A5d364",
					"0x798b112420AD6391A4129Ac25eF59663a44C88bB",
					"0x771fBbfcBD8BA252f7f1ee47c1A486BDB0b5bC62",
					"0x072f14B85ADd63488DDaD88f855Fda4A99d6aC9B",
					"0x42FBD9F666AaCC0026ca1B88C94259519e03dd67",
					"0x4f883B5C0C01Fe13CeDd05c684f00266b0626e23",
					"0x96646936b91d6B9D7D0c47C496AfBF3D6ec7B6f8",
					"0xE99481DC77691d8E2456E5f3F61C1810adFC1503",
					"0x0b09deA16768f0799065C475bE02919503cB2a35",
					"0x9137F3A026Fa419a7a9a0bA8DF6601D4B0aBfd26",
					"0xF506984C16737B1A9577cadeDa02a49fD612Aff8",
					"0x093254005743b7Af89e24F645730Ba2dD8441333",
					"0x57766212638c425e9CB0C6D6e1683dda369C0FFF",
					"0xb460DAa847c45f1C4a41cb05BFB3b51c92e41B36",
					"0xDbC4F138528B6B893cBCc3fd9c15D8B34D0554aE",
					"0x5f1f4E50ba51D723F12385a8a9606afc3A0555f5",
					"0x350196326AEAA9b98f1903fb5e8fc2686f85318C",
					"0x6418E83944a40a254b3f2859b00224eB454D95cE",
					"0x3F7C10701b14197E2695dEC6428a2Ca4Cf7FC3B8",
					"0x9145bcfF3fb05C873B35a78e466c9E7Ba1e90Ef8",
					"0x27C9f71cC31464B906E0006d4FcBC8900F48f15f",
					"0xa02E4b3d18D4E6B8d18Ac421fBc3dfFF8933c40a",
					"0xe96a45f66bdDA121B24F0a861372A72E8889523d",
					"0xDf2c03c12442c7A0895455A48569B889079cA52A",
					"0xfF083f57A556bfB3BBe46Ea1B4Fa154b2b1FBe88",
					"0x3e5FA9518eA95c3E533EB377C001702A9AaCAA32",
					"0x29d7a7E0d781C957696697B94D4Bc18C651e358E",
					"0x9F2a5E84abf5AA0771f4027c726B5697d9D2010a",
					"0x7e3F8BE87B5fc9b3b28b20D10608C54b4b870dAA",
					"0xC6A5032dC4bF638e15b4a66BC718ba7bA474FF73",
					"0x3ebf48cd7586d7A4521cE59E53D9a907EBf1480F",
					"0x5f7FA48d765053F8dD85E052843e12D23e3D7BC5",
					"0xBF96189Eee9357a95C7719f4F5047F76bdE804E5",
					"0x1ee442b5326009Bb18F2F472d3e0061513d1A0fF",
					"0x87a867f5D240a782d43D90b6B06DEa470F3f8F22",
					"0x5d6e3d7632D6719e04cA162be652164Bec1EaA6b",
					// "0xPoolAddresssss",
					// "0xPoolAddresssss",
					// "0xPoolAddresssss",
					// "0xPoolAddresssss",
					// "0xPoolAddresssss",
				];
			}

			//
			//
			//
		} else if (projectName == "NILEV2" || projectName == "LynexV2" || projectName == "ArchlyV2" || projectName == "RaExchangeV2") {
			const newABI = [
				{
					inputs: [
						{
							internalType: "address",
							name: "",
							type: "address",
						},
						{
							internalType: "address",
							name: "",
							type: "address",
						},
						{
							internalType: "bool",
							name: "",
							type: "bool",
						},
					],
					name: "getPair",
					outputs: [
						{
							internalType: "address",
							name: "",
							type: "address",
						},
					],
					stateMutability: "view",
					type: "function",
				},
			];

			const newFactoryContract = new ethers.Contract(factoryAddress, newABI, SCRIPT_PROVIDER);

			async function getPools() {
				for (let index = 0; index < tokens.length; index++) {
					for (let i = 0; i < tokens.length; i++) {
						if (index == i) continue;
						const pool = await newFactoryContract.getPair(tokens[index], tokens[i], false);
						if (pool == "0x0000000000000000000000000000000000000000") continue;
						if (pools.includes(pool)) continue;
						pools.push(pool);
						console.log("pool", pool);
					}
				}
			}

			await getPools();
		} else {
			async function getPools() {
				for (let index = 0; index < tokens.length; index++) {
					for (let i = 0; i < tokens.length; i++) {
						if (index == i) continue;
						const pool = await factoryContract.getPair(tokens[index], tokens[i]);
						if (pool == "0x0000000000000000000000000000000000000000") continue;
						if (pools.includes(pool)) continue;
						pools.push(pool);
						console.log("pool", pool);
					}
				}
			}

			await getPools();
		}

		try {
			const poolsData = [];

			for (const pool of pools) {
				try {
					await waitAndMakeRequest();
					poolsData.push(await getPoolInfo(pool));
				} catch (error) {
					setTimeout(async () => {
						try {
							poolsData.push(await getPoolInfo(pool));
						} catch (innerError) {
							console.error("Failed to get pool info after retry", innerError);
						}
					}, 3000);
				}
			}

			const filteredPoolsData = poolsData.filter((pool) => pool !== null);
			const jsonData = JSON.stringify(filteredPoolsData, null, 2);
			fs.writeFileSync(poolDataPath, jsonData, "utf-8");
		} catch (error) {
			console.error("Error:", error.message);
			throw error;
		}

		async function getPoolInfo(poolAddress) {
			let poolContract;
			let token0_address;
			let token1_address;
			let pool_id;
			let balancer_pool_fee;
			let weight0;
			let weight1;

			if (projectName == "BalancerV2") {
				poolContract = new ethers.Contract(poolAddress, balancer_pool_abi, SCRIPT_PROVIDER);

				pool_id = await poolContract.getPoolId();

				balancer_pool_fee = ethers.formatEther(await poolContract.getSwapFeePercentage());

				let token_address_empty;

				[[token0_address, token1_address, token_address_empty]] = await vault_contract.getPoolTokens(pool_id);

				if (token_address_empty !== undefined) return null;

				[weight0, weight1] = await poolContract.getNormalizedWeights();
			} else {
				poolContract = new ethers.Contract(poolAddress, poolABI, SCRIPT_PROVIDER);

				token0_address = await poolContract.token0();
				token1_address = await poolContract.token1();
			}

			const token0_Contract = new ethers.Contract(token0_address, ERC20.abi, SCRIPT_PROVIDER);
			const token1_Contract = new ethers.Contract(token1_address, ERC20.abi, SCRIPT_PROVIDER);

			let token0_symbol;
			let token1_symbol;

			let token0_decimal;
			let token1_decimal;

			try {
				[token0_symbol, token1_symbol, token0_decimal, token1_decimal] = await Promise.all([token0_Contract.symbol(), token1_Contract.symbol(), token0_Contract.decimals(), token1_Contract.decimals()]);
			} catch (error) {
				if (token0_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token0_symbol = "MKR";
				if (token1_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token1_symbol = "MKR";
				if (token0_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token0_symbol = 18;
				if (token1_address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") token1_symbol = 18;
			}

			console.log(token0_symbol, token1_symbol, token0_decimal, token1_decimal);

			if (token0_symbol == undefined || token1_symbol == undefined) return null;

			if (token0_symbol.includes(".e")) token0_symbol = token0_symbol.replace(/\.e/g, "");
			if (token0_symbol.includes(".E")) token0_symbol = token0_symbol.replace(/\.E/g, "");
			if (token0_symbol.includes(".b")) token0_symbol = token0_symbol.replace(/\.b/g, "");
			if (token0_symbol.includes(".B")) token0_symbol = token0_symbol.replace(/\.B/g, "");

			if (token1_symbol.includes(".e")) token1_symbol = token1_symbol.replace(/\.e/g, "");
			if (token1_symbol.includes(".E")) token1_symbol = token1_symbol.replace(/\.E/g, "");
			if (token1_symbol.includes(".b")) token1_symbol = token1_symbol.replace(/\.b/g, "");
			if (token1_symbol.includes(".B")) token1_symbol = token1_symbol.replace(/\.B/g, "");

			if (conflictTokens.map((token) => token.toLowerCase()).includes(token0_address.toLowerCase()) || conflictTokens.map((token) => token.toUpperCase()).includes(token0_address.toUpperCase())) token0_symbol = `${token0_symbol}_CFT`;
			if (conflictTokens.map((token) => token.toLowerCase()).includes(token1_address.toLowerCase()) || conflictTokens.map((token) => token.toUpperCase()).includes(token1_address.toUpperCase())) token1_symbol = `${token1_symbol}_CFT`;

			const token0_base = tokens.map((token) => token.toLowerCase()).includes(token0_address.toLowerCase()) || tokens.map((token) => token.toUpperCase()).includes(token0_address.toUpperCase());
			const token1_base = tokens.map((token) => token.toLowerCase()).includes(token1_address.toLowerCase()) || tokens.map((token) => token.toUpperCase()).includes(token1_address.toUpperCase());

			if (token0_base == false || token1_base == false) {
				return null;
			}

			let data;

			if (projectName == "AntfarmV2") {
				const fee = await poolContract.fee();
				const pool_fee = Number(fee) / 10;
				const param_fee = [Number(fee)];
				const pool_name = token0_symbol + " / " + token1_symbol + " - fee: " + pool_fee;
				data = {
					pool_address: poolAddress,
					pool_name: pool_name,
					project_name: projectName,
					pool_fee: pool_fee,
					param_fee: param_fee,
					token0_symbol: token0_symbol.toUpperCase(),
					token0_address: token0_address,
					token0_decimal: Number(token0_decimal),
					token1_symbol: token1_symbol.toUpperCase(),
					token1_address: token1_address,
					token1_decimal: Number(token1_decimal),
				};
			} else if (projectName == "BalancerV2") {
				const pool_name = token0_symbol + " / " + token1_symbol + " - fee: " + balancer_pool_fee;
				data = {
					pool_address: poolAddress,
					pool_id: pool_id,
					pool_fee: balancer_pool_fee,
					pool_name: pool_name,
					project_name: projectName,
					weight0: weight0.toString(),
					token0_symbol: token0_symbol.toUpperCase(),
					token0_address: token0_address,
					token0_decimal: Number(token0_decimal),
					weight1: weight1.toString(),
					token1_symbol: token1_symbol.toUpperCase(),
					token1_address: token1_address,
					token1_decimal: Number(token1_decimal),
				};
			} else {
				const pool_name = token0_symbol + " / " + token1_symbol;
				data = {
					pool_address: poolAddress,
					pool_name: pool_name,
					project_name: projectName,
					token0_symbol: token0_symbol.toUpperCase(),
					token0_address: token0_address,
					token0_decimal: Number(token0_decimal),
					token1_symbol: token1_symbol.toUpperCase(),
					token1_address: token1_address,
					token1_decimal: Number(token1_decimal),
				};
			}

			return data;
		}

		async function waitAndMakeRequest() {
			const currentTime = Date.now();
			const timeSinceLastRequest = currentTime - lastRequestTime;

			if (timeSinceLastRequest < requestInterval && tokens === 0) {
				// Wait until the next request can be made
				const waitTime = requestInterval - timeSinceLastRequest;
				await sleep(waitTime);
			}

			// Make the request
			lastRequestTime = Date.now();
			tokens123 = Math.max(0, tokens123 - 1);
		}

		async function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}

		await initializeStateV2ChainFile(chain, projectName);
	}
}

getPools(selectedChain);

// for (const chain of chains) getPools(chain);
