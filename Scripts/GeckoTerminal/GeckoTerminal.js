// ****************************************************************************************************************************
// ******** Fetching Dex Factories And Tokens From GeckoTerminal Then Creates & Updates To Chain Common And Token Files *******
// ****************************************************************************************************************************

const { ethers, fs, path, axios } = require("../Common/Global/Global");

const GeckoTerminalApiKey = "4jBzGRaShFhZurYcABjSk";

const WillBeRemovedDexNameList = ["SyncSwap", "SyncSwapV2.1", "TraderJoe", "iZiSwap", "HorizonDEX", "KyberswapElastic"];

// Mapping(XChainList.json ChainID to ChainList.json Actual Chain Name Will Be Used As Chain Name in the Future)
// Both Usage -- Also Indicates WillBeUpdatedChains if Existing Chain Already Included and Initialized With Providers in the .env With Common.js file
const WillBeAddedChains = [
	"Polygon zkEVM",
	"Linea",
	"Blast",
	"x Layer",
	"Fraxtal",
	"Avalanche",
	"Arbitrum",
	"Ethereum",
	"Fantom",
	"ZKFair",
	"Arbitrum Nova",
	"Aurora",
	"Klaytn",
	"Astar",
	"Astar zkEVM",
	"opBNB",
	"Metis",
	"Optimism",
	"Scroll",
	"Polygon POS",
	"CELO",
	"BNB Chain",
	"Base",
	"Evmos",
	"Kava",
];

async function GeckoTerminal() {
	try {
		let ChainList = JSON.parse(fs.readFileSync("Scripts/GeckoTerminal/ChainList.json", "utf-8"));

		// getChainNamesAndIdentifiers
		async function getChainNamesAndIdentifiers() {
			const urlChainList = "https://app.geckoterminal.com/api/p1/networks?fields%5Bnetwork%5D=name%2Cidentifier%2Cimage_url%2Cis_new&show_for_sidebar=1";

			const responseChainList = await fetch(urlChainList, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const resultChainList = await responseChainList.json();

			const chainNames = [];
			const chainIdentifiers = [];
			const chainNameToIdentifier = {};
			const chainIdentifierToName = {};

			for (let index = 0; index < resultChainList.data.length; index++) {
				const chainDataObject = resultChainList.data[index];

				chainNames.push(chainDataObject.attributes.name);
				chainIdentifiers.push(chainDataObject.attributes.identifier);

				chainNameToIdentifier[chainDataObject.attributes.name] = chainDataObject.attributes.identifier;
				chainIdentifierToName[chainDataObject.attributes.identifier] = chainDataObject.attributes.name;
			}

			return [chainNames, chainIdentifiers, chainNameToIdentifier, chainIdentifierToName];
		}

		const [chainNames, chainIdentifiers, chainNameToIdentifier, chainIdentifierToName] = await getChainNamesAndIdentifiers();
		// getChainNamesAndIdentifiers

		// saveChainsToChainListJson
		async function saveChainsToChainListJson() {
			const chainList = [];
			const chainIdentifierList = [];

			for (let index = 0; index < chainNames.length; index++) {
				let chain = chainNames[index];

				if (chain.includes("(Testnet)") || chain.includes("(testnet)")) continue;

				if (!WillBeAddedChains.includes(chain)) continue;

				chain = chain.replace(/\s+/g, "");

				chain = chain.charAt(0).toUpperCase() + chain.slice(1);

				chainList.push(chain);

				chainIdentifierList.push(chainNameToIdentifier[chainNames[index]]);
			}

			fs.writeFileSync(path.join("Scripts/GeckoTerminal/ChainList.json"), JSON.stringify(chainList, null, 2));
			fs.writeFileSync(path.join("Scripts/GeckoTerminal/XChainList.json"), JSON.stringify(chainNames, null, 2));

			return [chainList, chainIdentifierList];
		}

		const [chainList, chainIdentifierList] = await saveChainsToChainListJson();
		// saveChainsToChainListJson

		// createrProviderVariablesForEachChainToDotENV
		async function createrProviderVariablesForEachChainToDotENV() {
			const XXChainList = [];

			// let dataENV = fs.readFileSync(".env", "utf-8");

			let dataENV = ``;

			dataENV += `# Global\nHOT_WALLET_PHRASE="YOUR_HOT_WALLET_SEED_PHRASE"\n# Global\n\n`;

			for (let chain of ChainList) {
				XXChainList.push(chain);

				const flashSwapProviderValue = process.env[chain.toUpperCase() + "_FLASHSWAP_PROVIDER_URL"];

				const scriptProviderValue = process.env[chain.toUpperCase() + "_SCRIPT_PROVIDER_URL"];
				const secondarySriptProviderValue = process.env[chain.toUpperCase() + "_SECONDARY_SCRIPT_PROVIDER_URL"];

				const V2_poolProviderValue = process.env[chain.toUpperCase() + "_V2_POOL_PROVIDER_URL"];
				const V3_poolProviderValue = process.env[chain.toUpperCase() + "_V3_POOL_PROVIDER_URL"];

				const V2_contractProviderValue = process.env[chain.toUpperCase() + "_V2_CONTRACT_PROVIDER_URL"];
				const V3_contractProviderValue = process.env[chain.toUpperCase() + "_V3_CONTRACT_PROVIDER_URL"];

				const V2_wssPoolProviderProviderValue = process.env[chain.toUpperCase() + "_V2_WSS_POOL_PROVIDER_URL"];
				const V3_wssPoolProviderProviderValue = process.env[chain.toUpperCase() + "_V3_WSS_POOL_PROVIDER_URL"];

				dataENV += `# ${chain}\n`;
				dataENV += `${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL="${flashSwapProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_SCRIPT_PROVIDER_URL="${scriptProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL="${secondarySriptProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_POOL_PROVIDER_URL="${V2_poolProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_POOL_PROVIDER_URL="${V3_poolProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_CONTRACT_PROVIDER_URL="${V2_contractProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL="${V3_contractProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_WSS_POOL_PROVIDER_URL="${V2_wssPoolProviderProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL="${V3_wssPoolProviderProviderValue}"\n`;

				dataENV += `# ${chain}\n\n`;
			}

			// --------------------
			// Seperation
			// --------------------

			for (let chain of chainList) {
				if (ChainList.includes(chain)) continue;

				XXChainList.push(chain);

				const flashSwapProviderValue = process.env[chain.toUpperCase() + "_FLASHSWAP_PROVIDER_URL"];

				const scriptProviderValue = process.env[chain.toUpperCase() + "_SCRIPT_PROVIDER_URL"];
				const secondarySriptProviderValue = process.env[chain.toUpperCase() + "_SECONDARY_SCRIPT_PROVIDER_URL"];

				const V2_poolProviderValue = process.env[chain.toUpperCase() + "_V2_POOL_PROVIDER_URL"];
				const V3_poolProviderValue = process.env[chain.toUpperCase() + "_V3_POOL_PROVIDER_URL"];

				const V2_contractProviderValue = process.env[chain.toUpperCase() + "_V2_CONTRACT_PROVIDER_URL"];
				const V3_contractProviderValue = process.env[chain.toUpperCase() + "_V3_CONTRACT_PROVIDER_URL"];

				const V2_wssPoolProviderProviderValue = process.env[chain.toUpperCase() + "_V2_WSS_POOL_PROVIDER_URL"];
				const V3_wssPoolProviderProviderValue = process.env[chain.toUpperCase() + "_V3_WSS_POOL_PROVIDER_URL"];

				dataENV += `# ${chain}\n`;
				dataENV += `${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL="${flashSwapProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_SCRIPT_PROVIDER_URL="${scriptProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL="${secondarySriptProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_POOL_PROVIDER_URL="${V2_poolProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_POOL_PROVIDER_URL="${V3_poolProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_CONTRACT_PROVIDER_URL="${V2_contractProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL="${V3_contractProviderValue}"\n`;

				dataENV += `${chain.toUpperCase()}_V2_WSS_POOL_PROVIDER_URL="${V2_wssPoolProviderProviderValue}"\n`;
				dataENV += `${chain.toUpperCase()}_V3_WSS_POOL_PROVIDER_URL="${V3_wssPoolProviderProviderValue}"\n`;

				dataENV += `# ${chain}\n\n`;
			}

			fs.writeFileSync(path.join("Scripts/GeckoTerminal/ChainList.json"), JSON.stringify(XXChainList, null, 2));
			fs.writeFileSync(".env", dataENV);
		}

		await createrProviderVariablesForEachChainToDotENV();
		// createrProviderVariablesForEachChainToDotENV

		// return; // Enable or Disable When You Adding a New Chain

		// createChainTokenJsonFile
		async function createChainTokenJsonFile(chain, tokenList) {
			const chainTokenJsonFilePath = path.join("Scripts/Tokens", `${chain}.json`);

			if (!fs.existsSync(chainTokenJsonFilePath)) fs.writeFileSync(chainTokenJsonFilePath, JSON.stringify([], null, 2), "utf8");

			const existingChainTokenJsonFileData = JSON.parse(fs.readFileSync(chainTokenJsonFilePath, "utf-8"));

			console.log(existingChainTokenJsonFileData, "existingChainTokenJsonFileData");

			for (const tokenAddress of tokenList) {
				if (!existingChainTokenJsonFileData.includes(tokenAddress)) {
					existingChainTokenJsonFileData.push(tokenAddress);
				}
			}

			fs.writeFileSync(chainTokenJsonFilePath, JSON.stringify(existingChainTokenJsonFileData, null, 2), "utf8");
		}
		// createChainTokenJsonFile

		// updateDeploymentsJsonFile
		async function updateDeploymentsJsonFile(chain) {
			const deploymentsJsonFilePath = path.join("Scripts/Resources/Deployments.json");

			const existingDeploymentsJsonFileData = JSON.parse(fs.readFileSync(deploymentsJsonFilePath, "utf-8"));

			if (existingDeploymentsJsonFileData[chain] == undefined) existingDeploymentsJsonFileData[chain] = "0x0000000000000000000000000000000000000000";

			fs.writeFileSync(deploymentsJsonFilePath, JSON.stringify(existingDeploymentsJsonFileData, null, 2), "utf8");
		}
		// updateDeploymentsJsonFile

		// createChainCommonFile
		async function createChainCommonFile(chain, IProjectsV2, IProjectsV3, chainID, native_currency_symbol, native_currency_address) {
			const { minimumNativeBalanceTable, conversionNativeBalanceTable } = require("../Common/Global/Global");

			const commonPath = path.join("Scripts/Common/Common", `${chain}.js`);

			async function initializeCommonChainFile() {
				const XProjectsV2 = `const ProjectsV2 = ${JSON.stringify(IProjectsV2, null, 2)}`;
				const XProjectsV3 = `const ProjectsV3 = ${JSON.stringify(IProjectsV3, null, 2)}`;

				let XQuoterContractsV3 = ``;

				let XQuotersV3 = `{ \n`;

				const XQuoterVersionsV3 = {};

				for (const projectName in IProjectsV3) {
					XQuoterVersionsV3[projectName] = 0;

					XQuotersV3 += `${projectName}: ${projectName}_QuoterV4_Contract,`;

					XQuoterContractsV3 += `const ${projectName}_QuoterV4_Contract = new ethers.Contract(ProjectsV3["${projectName}"].quoterAddress, QuoterV4ABI, CONTRACT_PROVIDER)\n`;
				}

				XQuotersV3 += `\n }`;

				const commonData = `
					const { ethers, fs, path, flashSwapABI } = require("../Global/Global");
				
					const chain = path.basename(__filename, ".js");

					// Tokens
					const tokens = require(\`../../Tokens/\${chain}.json\`);
					// Tokens
				
					// Providers
					const chainID = ${chainID}
					const FLASHSWAP_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_SCRIPT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const SECONDARY_SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const POOL_PROVIDER_V2 = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V2_POOL_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const POOL_PROVIDER_V3 = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V3_POOL_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
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
					const native_token_symbol = "${native_currency_symbol}";
					const native_token_address = "${native_currency_address}";
					const minimum_native_balance = ethers.parseEther("${minimumNativeBalanceTable[native_currency_symbol.toUpperCase()]}");
					const conversion_ether_amount = ethers.parseEther("${conversionNativeBalanceTable[native_currency_symbol.toUpperCase()]}");
					// EtherConverter

					// Minimum Profit Limits
					const minimumEntranceProfit = 0.25;
					const minimumVendableProfit = 0.25;
					const minimumFlashSwapProfit = 0.25;
					// Minimum Profit Limits


					// *********
					// ******************
					// ****************** ProjectsV2 ******************
					${XProjectsV2}

					const blockedProjectListV2 = [];
					// ****************** ProjectsV2 ******************
					// ******************
					// *********
					
					// +++++++++
					// +++++++++++++++++
					// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
					${XProjectsV3}

					const blockedProjectListV3 = [];
					// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
					// +++++++++++++++++
					// +++++++++

					// DELETED !!!!!
					// DELETED !!!!!
					// DELETED !!!!!
					const { QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI } = require("../Global/Global");

					const CONTRACT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });

					${XQuoterContractsV3}

					const QuotersV3 = ${XQuotersV3}

					const QuoterVersionsV3 = ${JSON.stringify(XQuoterVersionsV3, null, 2)};
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
		
				`;

				if (!fs.existsSync(commonPath)) fs.writeFileSync(commonPath, "", "utf8");

				fs.writeFileSync(commonPath, commonData, "utf8");
			}

			async function saveUpdatedCommonFileDataToCommonChainFile() {
				const {
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
					minimum_native_balance,
					conversion_ether_amount,
					minimumEntranceProfit,
					minimumVendableProfit,
					minimumFlashSwapProfit,
					ProjectsV2,
					ProjectsV3,
					blockedProjectListV2,
					blockedProjectListV3,
					QuoterVersionsV3,
				} = require(`../Common/Common/${chain}.js`);

				const conflictTokenList = [];

				for (let index = 0; index < conflictTokens.length; index++) conflictTokenList.push(conflictTokens[index]);

				Object.keys(IProjectsV2).forEach(async (projectName) => {
					if (!ProjectsV2[projectName] && !blockedProjectListV2.includes(projectName)) {
						ProjectsV2[projectName] = {
							factoryAddress: IProjectsV2[projectName].factoryAddress,
							flashSwapFunctionSelector: "0x022c0d9f",
							comments: false,
							slippage: 0,
							fee: 0.003,
						};
					}

					if (blockedProjectListV2.includes(projectName)) delete ProjectsV2[projectName];
				});

				Object.keys(IProjectsV3).forEach(async (projectName) => {
					if (!ProjectsV3[projectName] && !blockedProjectListV3.includes(projectName)) {
						ProjectsV3[projectName] = {
							factoryAddress: IProjectsV3[projectName].factoryAddress,
							quoterAddress: IProjectsV3[projectName].quoterAddress,
							flashSwapFunctionSelector: "0x128acb08",
							comments: false,
							slippage: 0,
						};
					}

					if (blockedProjectListV3.includes(projectName)) delete ProjectsV3[projectName];
				});

				const Xconfirmation = `const confirmation = ${JSON.stringify(confirmation, null, 2)}`;
				const XblockTime = `const blockTime = ${JSON.stringify(blockTime, null, 2)}`;
				const Xmodule_type = `const module_type = ${JSON.stringify(module_type, null, 2)}`;
				const Xl2_fee_type = `const l2_fee_type = ${JSON.stringify(l2_fee_type, null, 2)}`;
				const Xl1_fee_type = `const l1_fee_type = ${JSON.stringify(l1_fee_type, null, 2)}`;
				const Xpart10_type = `const part10_type = ${JSON.stringify(part10_type, null, 2)}`;
				const Xcallback_type = `const callback_type = ${JSON.stringify(callback_type, null, 2)}`;
				const Xtx_type = `const tx_type = ${JSON.stringify(tx_type, null, 2)}`;
				const XconflictTokenList = `const conflictTokens = ${JSON.stringify(conflictTokenList, null, 2)}`;
				const Xminimum_native_balance = `const minimum_native_balance = ${minimum_native_balance}n`;
				const Xconversion_ether_amount = `const conversion_ether_amount = ${conversion_ether_amount}n`;
				const XminimumEntranceProfit = `const minimumEntranceProfit = ${JSON.stringify(minimumEntranceProfit, null, 2)}`;
				const XminimumVendableProfit = `const minimumVendableProfit = ${JSON.stringify(minimumVendableProfit, null, 2)}`;
				const XminimumFlashSwapProfit = `const minimumFlashSwapProfit = ${JSON.stringify(minimumFlashSwapProfit, null, 2)}`;
				const XProjectsV2 = `const ProjectsV2 = ${JSON.stringify(ProjectsV2, null, 2)}`;
				const XProjectsV3 = `const ProjectsV3 = ${JSON.stringify(ProjectsV3, null, 2)}`;

				const XQuoterVersionsV3 = `const QuoterVersionsV3 = ${JSON.stringify(QuoterVersionsV3, null, 2)}`;

				let XQuoterContractsV3 = ``;

				let XQuotersV3 = `{ \n`;

				for (const projectName in ProjectsV3) {
					if (QuoterVersionsV3[projectName] !== undefined) {
						XQuotersV3 += `${projectName}: ${projectName}_QuoterV${QuoterVersionsV3[projectName]}_Contract,`;

						XQuoterContractsV3 += `const ${projectName}_QuoterV${QuoterVersionsV3[projectName]}_Contract = new ethers.Contract(ProjectsV3["${projectName}"].quoterAddress, QuoterV${QuoterVersionsV3[projectName]}ABI, CONTRACT_PROVIDER)\n`;
					}
				}

				XQuotersV3 += `\n }`;

				const commonData = `
					const { ethers, fs, path, flashSwapABI } = require("../Global/Global");
				
					const chain = path.basename(__filename, ".js");

					// Tokens
					const tokens = require(\`../../Tokens/\${chain}.json\`);
					// Tokens
				
					// Providers
					const chainID = ${chainID}
					const FLASHSWAP_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_SCRIPT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const SECONDARY_SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const POOL_PROVIDER_V2 = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V2_POOL_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					const POOL_PROVIDER_V3 = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V3_POOL_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });
					// Providers
				
					// Flash Swap Contract
					const flashSwapAddress = JSON.parse(fs.readFileSync("Scripts/Resources/Deployments.json", "utf-8"))[chain];
					const flashSwapContract = new ethers.Contract(flashSwapAddress, flashSwapABI.abi, FLASHSWAP_PROVIDER);
					// Flash Swap Contract
				
					// Signer
					const Owner_Account = ethers.HDNodeWallet.fromPhrase(process.env.HOT_WALLET_PHRASE).connect(FLASHSWAP_PROVIDER);
					// Signer

					// ATF Address
					const ATF_address = "${ATF_address}";
					// ATF Address

					// Transaction Waiting Process
					${Xconfirmation}
					${XblockTime}
					// Transaction Waiting Process
					
					// Creator Settings
					${Xmodule_type} // standart structure
					${Xl2_fee_type} // transactionFeeL2 is enabled
					${Xl1_fee_type} // getL1TransactionFee is disabled
					${Xpart10_type} // transactionFeeL1 is disabled
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
					${Xcallback_type}
					${Xtx_type}
					// Creator Settings

					// Conflict Tokens
					${XconflictTokenList}
					// Conflict Tokens
					
					// EtherConverter
					const native_token_symbol = "${native_currency_symbol}";
					const native_token_address = "${native_currency_address}";
					${Xminimum_native_balance}
					${Xconversion_ether_amount}
					// EtherConverter
					
					// Minimum Profit Limits
					${XminimumEntranceProfit}
					${XminimumVendableProfit}
					${XminimumFlashSwapProfit}
					// Minimum Profit Limits


					// *********
					// ******************
					// ****************** ProjectsV2 ******************
					${XProjectsV2}
					
					const blockedProjectListV2 = ${JSON.stringify(blockedProjectListV2, null, 2)}
					// ****************** ProjectsV2 ******************
					// ******************
					// *********
					
					// +++++++++
					// +++++++++++++++++
					// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
					${XProjectsV3}

					const blockedProjectListV3 = ${JSON.stringify(blockedProjectListV3, null, 2)}
					// +++++++++++++++++ ProjectsV3 +++++++++++++++++++
					// +++++++++++++++++
					// +++++++++

					// DELETED !!!!!
					// DELETED !!!!!
					// DELETED !!!!!
					const { QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI } = require("../Global/Global");

					const CONTRACT_PROVIDER = new ethers.JsonRpcProvider(process.env[\`\${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL\`], undefined, { staticNetwork: ethers.Network.from(chainID) });

					${XQuoterContractsV3}

					const QuotersV3 = ${XQuotersV3}

					${XQuoterVersionsV3}
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

				`;

				fs.writeFileSync(commonPath, commonData, "utf8");
			}

			if (fs.existsSync(commonPath)) {
				await saveUpdatedCommonFileDataToCommonChainFile();
			} else {
				await initializeCommonChainFile();
			}
		}
		// createChainCommonFile

		// getProjects
		async function getProjects() {
			const chainIdList = JSON.parse(fs.readFileSync("Scripts/GeckoTerminal/ChainIdList.json", "utf-8"));
			const factories = JSON.parse(fs.readFileSync("Scripts/GeckoTerminal/Factories.json", "utf-8"));

			for (let index = 0; index < chainList.length; index++) {
				const chainName = chainList[index];
				const chainIdentifier = chainIdentifierList[index];

				async function fetchDexes() {
					const urlDexes = `https://www.geckoterminal.com/_next/data/${GeckoTerminalApiKey}/en/${chainIdentifier}/pools.json?network=${chainIdentifier}`;

					const responseDexes = await fetch(urlDexes, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					});

					return [await responseDexes.json()];
				}

				const [resultDexes] = await fetchDexes();

				// getChainIDAndNativeCurrencySymbolAndAddress
				async function getChainIDAndNativeCurrencySymbolAndAddress() {
					const included = resultDexes.pageProps.fallback[`@"/api/p1/${chainIdentifier}/pools","1",`].included;

					for (const object of included) {
						if (object.type == "network") {
							const chainID = object.attributes.chain_id;
							const native_currency_symbol = object.attributes.native_currency_symbol;
							const native_currency_address = object.attributes.native_currency_address;

							return [chainID, native_currency_symbol, native_currency_address];
						}
					}
				}

				const [chainID, native_currency_symbol, native_currency_address] = await getChainIDAndNativeCurrencySymbolAndAddress();
				// getChainIDAndNativeCurrencySymbolAndAddress

				const dexIDList = [];
				const dexIdentifierList = [];
				const dexNameList = [];
				const dexNameToIDList = {};
				const dexIDToNameList = {};

				for (let index = 0; index < resultDexes.pageProps.dexes.length; index++) {
					const dexDataObject = resultDexes.pageProps.dexes[index];

					const id = dexDataObject.id;
					const type = dexDataObject.type;
					const attributes = dexDataObject.attributes;
					const relationships = dexDataObject.relationships;

					const dexName = attributes.name;
					const dexIdentifier = attributes.identifier;

					dexIDList.push(id);
					dexIdentifierList.push(dexIdentifier);
					dexNameList.push(dexName);
					dexNameToIDList[dexName] = id;
					dexIDToNameList[id] = dexName;
				}

				// console.log(dexIDList);
				// console.log(dexIdentifierList);
				// console.log(dexNameList);
				// console.log(dexNameToIDList);
				// console.log(dexIDToNameList);
				// break;

				const dexNameToFactoryAddressList = {};
				const dexNameToDexVersionList = {};
				const dexListV2 = [];
				const dexListV3 = [];
				const tokenList = [];
				const ProjectsV2 = {};
				const ProjectsV3 = {};

				const poolProvider = new ethers.JsonRpcProvider(process.env[chainName.toUpperCase() + "_SCRIPT_PROVIDER_URL"]);

				for (let index = 0; index < dexIdentifierList.length; index++) {
					let dexName = dexNameList[index];
					const dexIdentifier = dexIdentifierList[index];

					async function fetchPools() {
						const urlPools = `https://www.geckoterminal.com/_next/data/${GeckoTerminalApiKey}/en/${chainIdentifier}/${dexIdentifier}/pools.json?network=${chainIdentifier}&dex=${dexIdentifier}`;

						const responsePools = await fetch(urlPools, {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						});

						return [await responsePools.json()];
					}

					const [resultPools] = await fetchPools();

					const poolList = resultPools.pageProps.fallback[`@\"/api/p1/${chainIdentifier}/pools\",\"${dexIdentifier}\",\"1\",`].data;

					for (let index = 0; index < poolList.length; index++) {
						const poolDataObject = poolList[index];

						const id = poolDataObject.id;
						const type = poolDataObject.type;
						const attributes = poolDataObject.attributes;
						const relationships = poolDataObject.relationships;

						const poolAddress = attributes.address;
						const poolName = attributes.name;
						const poolFee = attributes.pool_fee;

						const dexID = relationships.dex.data.id;
						const tokenAID = relationships.tokens.data[0].id;
						const tokenBID = relationships.tokens.data[1].id;

						// console.log(poolAddress);
						// console.log(poolName);
						// console.log(poolFee);

						// console.log(dexID);
						// console.log(tokenAID);
						// console.log(tokenBID);

						async function formatDexName() {
							let dexName = dexIDToNameList[dexID];

							const IchainName = chainIdentifierToName[chainIdentifier];

							if (dexName.includes(`(${IchainName})`)) dexName = dexName.replace(` (${IchainName})`, "");

							const regex = /( v[23])| (V[23])/g;

							dexName = dexName.replace(regex, (match) => {
								return match.trim().toUpperCase();
							});

							dexName = dexName.replace(/\s+/g, "");

							return dexName;
						}

						dexName = await formatDexName();

						if (dexName.match(/V[14]$/i)) dexName = dexName.slice(0, -2);

						if (WillBeRemovedDexNameList.includes(dexName)) continue; // Blocked Dex Name Conflict List

						const poolABIV2 = require("../Dex/PoolABIsV2/UniswapV2PoolABI.json");
						const poolABIV2BalancerWeightedPool = require("../Dex/PoolABIsV2/BalancerV2WeightedPoolABI.json");
						const poolABIV3 = require("../Dex/PoolABIsV3/UniswapV3PoolABI.json");

						const poolContractV2 = new ethers.Contract(poolAddress, poolABIV2, poolProvider);
						const poolContractV2BalancerWeightedPool = new ethers.Contract(poolAddress, poolABIV2BalancerWeightedPool, poolProvider);
						const poolContractV3 = new ethers.Contract(poolAddress, poolABIV3, poolProvider);

						console.log(chainName, dexName, poolAddress);

						try {
							await poolContractV2.getReserves();
							if (!(dexName.endsWith("V2") || dexName.endsWith("v2"))) dexName += "V2";
							if (!dexListV2.includes(dexName)) dexListV2.push(dexName);
							dexNameToDexVersionList[dexName] = 2;
							dexNameToFactoryAddressList[dexName] = [];

							try {
								const factoryAddress = await poolContractV2.factory();
								if (dexNameToFactoryAddressList[dexName] !== factoryAddress) dexNameToFactoryAddressList[dexName].push(factoryAddress);
								// continue;
							} catch (error) {
								dexNameToFactoryAddressList[dexName] = ["ERRORV2"];
								continue;
							}

							try {
								const [token0, token1] = await Promise.all([poolContractV2.token0(), poolContractV2.token1()]);

								if (!tokenList.includes(token0)) tokenList.push(token0);
								if (!tokenList.includes(token1)) tokenList.push(token1);
							} catch (error) {}
						} catch (error) {
							try {
								const factoryAddress = await poolContractV2BalancerWeightedPool.getVault();
								if (!(dexName.endsWith("V2") || dexName.endsWith("v2"))) dexName += "V2";
								if (!dexListV2.includes(dexName)) dexListV2.push(dexName);
								dexNameToDexVersionList[dexName] = 2;
								dexNameToFactoryAddressList[dexName] = [];
								if (dexNameToFactoryAddressList[dexName] !== factoryAddress) dexNameToFactoryAddressList[dexName].push(factoryAddress);

								// continue;
							} catch (error) {
								try {
									await poolContractV3.liquidity();
									if (!(dexName.endsWith("V3") || dexName.endsWith("v3"))) dexName += "V3";
									if (!dexListV3.includes(dexName)) dexListV3.push(dexName);
									dexNameToDexVersionList[dexName] = 3;
									dexNameToFactoryAddressList[dexName] = [];
								} catch (error) {
									continue;
								}

								try {
									const factoryAddress = await poolContractV3.factory();
									if (dexNameToFactoryAddressList[dexName] !== factoryAddress) dexNameToFactoryAddressList[dexName].push(factoryAddress);
									// continue;
								} catch (error) {
									dexNameToFactoryAddressList[dexName] = ["ERRORV3"];
									continue;
								}

								try {
									const [token0, token1] = await Promise.all([poolContractV2.token0(), poolContractV2.token1()]);

									if (!tokenList.includes(token0)) tokenList.push(token0);
									if (!tokenList.includes(token1)) tokenList.push(token1);
								} catch (error) {}
							}
						}
					}

					if (dexNameToDexVersionList[dexName] == 2) {
						ProjectsV2[dexName] = {
							factoryAddress: dexNameToFactoryAddressList[dexName],
							flashSwapFunctionSelector: "0x022c0d9f",
							comments: false,
							slippage: 0,
							fee: 0.003,
						};
					}

					if (dexNameToDexVersionList[dexName] == 3) {
						ProjectsV3[dexName] = {
							factoryAddress: dexNameToFactoryAddressList[dexName],
							quoterAddress: "0x0000000000000000000000000000000000000000",
							flashSwapFunctionSelector: "0x128acb08",
							comments: false,
							slippage: 0,
						};
					}

					// break;
				}

				console.log("dexNameToFactoryAddressList", dexNameToFactoryAddressList);
				console.log("dexNameToDexVersionList", dexNameToDexVersionList);
				console.log("dexListV2", dexListV2);
				console.log("dexListV3", dexListV3);
				console.log("ProjectsV2", ProjectsV2);
				console.log("ProjectsV3", ProjectsV3);

				chainIdList[chainName] = chainID;

				const factoryProjectsV2 = {};
				const factoryProjectsV3 = {};

				for (const ProjectName in ProjectsV2) factoryProjectsV2[ProjectName] = ProjectsV2[ProjectName].factoryAddress;
				for (const ProjectName in ProjectsV3) factoryProjectsV3[ProjectName] = ProjectsV3[ProjectName].factoryAddress;

				factories[chainName] = {};
				factories[chainName]["ProjectsV2"] = factoryProjectsV2;
				factories[chainName]["ProjectsV3"] = factoryProjectsV3;

				await createChainTokenJsonFile(chainName, tokenList);
				await updateDeploymentsJsonFile(chainName);

				try {
					await createChainCommonFile(chainName, ProjectsV2, ProjectsV3, chainID, native_currency_symbol, native_currency_address);
					console.log("apssss");
				} catch (error) {
					console.log("tttttttttttttttt", error);
				}
			}

			fs.writeFileSync(path.join("Scripts/GeckoTerminal/ChainIdList.json"), JSON.stringify(chainIdList, null, 2));
			fs.writeFileSync(path.join("Scripts/GeckoTerminal/Factories.json"), JSON.stringify(factories, null, 2), "utf8");
		}

		await getProjects();
		// getProjects
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

GeckoTerminal();
