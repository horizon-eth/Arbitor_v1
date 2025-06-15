const { fs, path, chains } = require("../Common/Global/Global");

async function QuoterVersionFinder() {
	const quotersFilePath = path.join("Scripts/Quoter/Quoters.json");

	if (!fs.existsSync(quotersFilePath)) fs.writeFileSync(quotersFilePath, JSON.stringify({}, null, 2), "utf8");

	const data = JSON.parse(fs.readFileSync(quotersFilePath, "utf-8"));

	for (const chain of chains) {
		if (data[chain] == undefined) data[chain] = {};

		const { ProjectsV3 } = require(`../Common/Common/${chain}`);

		for (const projectName in ProjectsV3) {
			if (data[chain][projectName] == undefined) {
				data[chain][projectName] = {
					quoterAddress: "0xQuoterAddress",
					quoterVersion: 1234,
				};
			}
		}
	}

	fs.writeFileSync(quotersFilePath, JSON.stringify(data, null, 2));
}

QuoterVersionFinder();
