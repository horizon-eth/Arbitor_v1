const { ethers, fs, ERC20, chains } = require("../Common/Global/Global");

const GlobalLibrary = require("../Library/GlobalLibrary");

async function finder() {
	const undefinedList = {};

	for (const chain of chains) {
		undefinedList[chain] = {};

		const { SCRIPT_PROVIDER, tokens } = require(`../Common/Common/${chain}`);

		for (let index = 0; index < tokens.length; index++) {
			const token = new ethers.Contract(tokens[index], ERC20.abi, SCRIPT_PROVIDER);

			let symbol;

			try {
				symbol = await token.symbol();
			} catch (error) {
				if (tokens[index] == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") symbol = "MKR";

				if (symbol == undefined) console.log("Error Occured For", symbol, chain, tokens[index]);
			}

			let price = await GlobalLibrary.getMarketPriceBatch([symbol]);

			if (price[0] == undefined || price[0] == null) {
				undefinedList[chain][symbol] = tokens[index];

				console.log("Price Not Found For", symbol, price, chain, tokens[index]);
			}
		}
	}

	fs.writeFileSync("Scripts/PriceFinder/UndefinedList.json", JSON.stringify(undefinedList, null, 2));
}

finder();
