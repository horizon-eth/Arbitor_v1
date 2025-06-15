const { ethers, fs, path, chains } = require("../Common/Global/Global");

function addresser() {
	for (const chain of chains) {
		const { tokens } = require(`../Common/Common/${chain}`);

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const isAddress = ethers.isAddress(token);

			if (!isAddress) {
				const address = ethers.getAddress(token.toLowerCase());

				const tokensPath = path.resolve(__dirname, `../Tokens/${chain}.json`);
				let tokensData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../Tokens/${chain}.json`)));

				const index = tokensData.indexOf(token);

				if (index !== -1) {
					tokensData.splice(index, 1);

					tokensData.push(address);

					fs.writeFileSync(tokensPath, JSON.stringify(tokensData, null, 2));
				} else {
					console.error(`Token ${token} not found in ${chain}.json`);
				}
			}
		}

		const tokensData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../Tokens/${chain}.json`)));

		for (const token of tokensData) {
			const isAddress = ethers.isAddress(token);

			if (!isAddress) {
				console.log("Address Not Found For This Address --> ", token);
			}
		}
	}
}

addresser();
