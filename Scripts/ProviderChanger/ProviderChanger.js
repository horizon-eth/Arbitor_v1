const { ethers, fs, path, chains, providerNames } = require("../Common/Global/Global");

const [
	POLYGONZKEVM_FLASHSWAP_PROVIDER_URL_LIST,
	POLYGONZKEVM_SCRIPT_PROVIDER_URL_LIST,
	POLYGONZKEVM_V2_POOL_PROVIDER_URL_LIST,
	POLYGONZKEVM_V3_POOL_PROVIDER_URL_LIST,
	POLYGONZKEVM_V2_CONTRACT_PROVIDER_URL_LIST,
	POLYGONZKEVM_V3_CONTRACT_PROVIDER_URL_LIST,
] = require("./ProviderLists/PolygonzkEVM");
let POLYGONZKEVM_FLASHSWAP_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_SCRIPT_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_SECONDARY_SCRIPT_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_V2_POOL_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_V3_POOL_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_V2_CONTRACT_PROVIDER_URL_INDEX = 0;
let POLYGONZKEVM_V3_CONTRACT_PROVIDER_URL_INDEX = 0;

const [
	LINEA_FLASHSWAP_PROVIDER_URL_LIST,
	LINEA_SCRIPT_PROVIDER_URL_LIST,
	LINEA_V2_POOL_PROVIDER_URL_LIST,
	LINEA_V3_POOL_PROVIDER_URL_LIST,
	LINEA_V2_CONTRACT_PROVIDER_URL_LIST,
	LINEA_V3_CONTRACT_PROVIDER_URL_LIST,
] = require("./ProviderLists/Linea");
let LINEA_FLASHSWAP_PROVIDER_URL_INDEX = 0;
let LINEA_SCRIPT_PROVIDER_URL_INDEX = 0;
let LINEA_SECONDARY_SCRIPT_PROVIDER_URL_INDEX = 0;
let LINEA_V2_POOL_PROVIDER_URL_INDEX = 0;
let LINEA_V3_POOL_PROVIDER_URL_INDEX = 0;
let LINEA_V2_CONTRACT_PROVIDER_URL_INDEX = 0;
let LINEA_V3_CONTRACT_PROVIDER_URL_INDEX = 0;

const [
	BLAST_FLASHSWAP_PROVIDER_URL_LIST,
	BLAST_SCRIPT_PROVIDER_URL_LIST,
	BLAST_V2_POOL_PROVIDER_URL_LIST,
	BLAST_V3_POOL_PROVIDER_URL_LIST,
	BLAST_V2_CONTRACT_PROVIDER_URL_LIST,
	BLAST_V3_CONTRACT_PROVIDER_URL_LIST,
] = require("./ProviderLists/Blast");
let BLAST_FLASHSWAP_PROVIDER_URL_INDEX = 0;
let BLAST_SCRIPT_PROVIDER_URL_INDEX = 0;
let BLAST_SECONDARY_SCRIPT_PROVIDER_URL_INDEX = 0;
let BLAST_V2_POOL_PROVIDER_URL_INDEX = 0;
let BLAST_V3_POOL_PROVIDER_URL_INDEX = 0;
let BLAST_V2_CONTRACT_PROVIDER_URL_INDEX = 0;
let BLAST_V3_CONTRACT_PROVIDER_URL_INDEX = 0;

const [
	XLAYER_FLASHSWAP_PROVIDER_URL_LIST,
	XLAYER_SCRIPT_PROVIDER_URL_LIST,
	XLAYER_V2_POOL_PROVIDER_URL_LIST,
	XLAYER_V3_POOL_PROVIDER_URL_LIST,
	XLAYER_V2_CONTRACT_PROVIDER_URL_LIST,
	XLAYER_V3_CONTRACT_PROVIDER_URL_LIST,
] = require("./ProviderLists/XLayer");
let XLAYER_FLASHSWAP_PROVIDER_URL_INDEX = 0;
let XLAYER_SCRIPT_PROVIDER_URL_INDEX = 0;
let XLAYER_SECONDARY_SCRIPT_PROVIDER_URL_INDEX = 0;
let XLAYER_V2_POOL_PROVIDER_URL_INDEX = 0;
let XLAYER_V3_POOL_PROVIDER_URL_INDEX = 0;
let XLAYER_V2_CONTRACT_PROVIDER_URL_INDEX = 0;
let XLAYER_V3_CONTRACT_PROVIDER_URL_INDEX = 0;

function getProviderNameToProviderIndex() {
	let ProviderNameToProviderIndex = {};

	for (const chain of chains) {
		for (const providerName of providerNames) {
			ProviderNameToProviderIndex[`${chain.toUpperCase()}_${providerName}_URL`] = eval(`${chain.toUpperCase()}_${providerName}_URL_INDEX`);
		}
	}

	return ProviderNameToProviderIndex;
}

const ProviderNameToProviderIndex = getProviderNameToProviderIndex();

function getProviderListByName(providerName, chain) {
	switch (providerName) {
		case `${chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_SCRIPT_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_V2_POOL_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_V3_POOL_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_V2_CONTRACT_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		case `${chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL`:
			return eval(`${providerName}_LIST`);
		default:
			return [];
	}
}

async function providerChanger() {
	let envContent = fs.readFileSync(".env", "utf8");
	const envVariables = {};
	envContent.split("\n").forEach((line) => {
		const trimmedLine = line.trim();
		if (trimmedLine && !trimmedLine.startsWith("#")) {
			const [key, value] = trimmedLine.split("=");
			envVariables[key.trim()] = value.trim().replace(/"/g, ""); // Remove surrounding quotes
		}
	});

	for (const providerName in ProviderNameToProviderIndex) {
		async function getChain() {
			for (let index = 0; index < chains.length; index++) {
				if (providerName.includes(chains[index].toUpperCase())) {
					return chains[index].toUpperCase();
				}
			}
		}

		const chain = await getChain();

		try {
			const providerURL = envVariables[providerName];
			const currentProvider = new ethers.JsonRpcProvider(providerURL);

			try {
				const test = await currentProvider.send("eth_chainId");

				// const test = await currentProvider.getBlockNumber();

				// console.log(test, chain, providerName);
			} catch (error) {
				// console.log(error);
				// console.log(chain, providerURL, providerName);
				ProviderNameToProviderIndex[providerName] += 1;
				const index = ProviderNameToProviderIndex[providerName];
				const providerList = getProviderListByName(providerName, chain);
				if (index < providerList.length) {
					const newProviderURL = providerList[index];
					let envContent = fs.readFileSync(".env", "utf8");
					const startIndex = envContent.indexOf(`${providerName}=`);
					if (startIndex !== -1) {
						let endIndex = envContent.indexOf("\n", startIndex);
						if (endIndex === -1) {
							endIndex = envContent.length;
						}
						envContent = envContent.substring(0, startIndex + `${providerName}=`.length) + `"${newProviderURL}"` + envContent.substring(endIndex);
					}
					fs.writeFileSync(".env", envContent);
				}
			}
		} catch (error) {
			ProviderNameToProviderIndex[providerName] += 1;
			const index = ProviderNameToProviderIndex[providerName] + 1;
			const providerList = getProviderListByName(providerName, chain);

			if (index < providerList.length) {
				const newProviderURL = providerList[index];
				let envContent = fs.readFileSync(".env", "utf8");

				const startIndex = envContent.indexOf(`${providerName}=`);
				if (startIndex !== -1) {
					let endIndex = envContent.indexOf("\n", startIndex);
					if (endIndex === -1) {
						endIndex = envContent.length;
					}

					envContent = envContent.substring(0, startIndex + `${providerName}=`.length) + `"${newProviderURL}"` + envContent.substring(endIndex);
				}

				fs.writeFileSync(".env", envContent);
			}
		}
	}
	// }
}

async function runner() {
	await providerChanger();
}

runner();

setInterval(runner, 10000);
