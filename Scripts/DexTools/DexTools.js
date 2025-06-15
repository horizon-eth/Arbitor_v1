// *******************************************************************************************************
// ************ Fetching Dex Factories From DexTools Then Creates & Updates To Factories.json ************
// *******************************************************************************************************

const { ethers, fs, path, axios } = require("../Common/Global/Global");

async function DexTools() {
	const url = "https://www.dextools.io/shared/exchanges?allowUnknowns=true";
	// const url = "https://www.dextools.io/shared/exchanges?allowUnknowns=false";

	try {
		const response = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				Accept: "application/json, text/plain, */*",
				"Accept-Language": "en-US,en;q=0.9",
				Connection: "keep-alive",
				Referer: "https://www.dextools.io/",
			},
		});

		async function getAndSaveChainList() {
			const chainList = [];

			for (const chainObject of response.data) chainList.push(chainObject.chain);

			const diirectory = path.join("Scripts/DexTools/ChainList.json");

			if (!fs.existsSync(diirectory)) fs.writeFileSync(diirectory, "", "utf8");

			fs.writeFileSync(diirectory, JSON.stringify(chainList, null, 2), "utf8");

			return [chainList];
		}

		const [chainList] = await getAndSaveChainList();

		async function getProjectsV2V3(chainData) {
			const IProjectsV2 = {};
			const IProjectsV3 = {};
			const IProjectsUnknown = {};

			for (const dex of chainData.data) {
				async function formatDexName(IDexName) {
					const regex = /( v[23])| (V[23])/g;

					IDexName = IDexName.replace(regex, (match) => {
						return match.trim().toUpperCase();
					});

					IDexName = dex.name.replace(/\s+/g, "");

					return IDexName;
				}

				const dexName = await formatDexName(dex.name);

				if (dex.version == "v2" || dex.alike == "univ2") IProjectsV2[dexName + "FactoryAddress"] = dex.factory;
				if (dex.version == "v3" || dex.alike == "univ3") IProjectsV3[dexName + "FactoryAddress"] = dex.factory;
				if (dex.version !== "v2" && dex.alike !== "univ2" && dex.version !== "v3" && dex.alike !== "univ3" && dex.version == "") if (!(IProjectsV2[dexName] || IProjectsV3[dexName])) IProjectsUnknown[dexName + "FactoryAddress"] = dex.factory;
			}

			return [IProjectsV2, IProjectsV3, IProjectsUnknown];
		}

		async function saveProjectsToChainJsonFile() {
			const data = {};

			const diirectory = path.join("Scripts/DexTools/Factories.json");

			if (!fs.existsSync(diirectory)) fs.writeFileSync(diirectory, "", "utf8");

			for (const chainData of response.data) {
				chainData.chain = chainData.chain.charAt(0).toUpperCase() + chainData.chain.slice(1);

				const [IProjectsV2, IProjectsV3, IProjectsUnknown] = await getProjectsV2V3(chainData);

				data[chainData.chain] = {};
				data[chainData.chain]["ProjectsV2"] = IProjectsV2;
				data[chainData.chain]["ProjectsV3"] = IProjectsV3;
				data[chainData.chain]["ProjectsUnknown"] = IProjectsUnknown;

				fs.writeFileSync(diirectory, JSON.stringify(data, null, 2), "utf8");
			}
		}

		await saveProjectsToChainJsonFile();
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

DexTools();
