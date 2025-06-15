const { fs, EvmPriceServiceConnection, coins_pyth } = require("../../Common/Global/Global");

const connection = new EvmPriceServiceConnection("https://hermes.pyth.network");

const Pyth = async () => {
	try {
		const marketPricesPyth = {};

		const prices = await connection.getLatestPriceFeeds(Object.values(coins_pyth));

		for (const symbol in coins_pyth) {
			const index = Object.keys(coins_pyth).indexOf(symbol);

			const price = prices[index].price.price * 10 ** prices[index].price.expo;

			marketPricesPyth[symbol] = price;

			// console.log(`Symbol: ${symbol} -- ID: ${coins_pyth[symbol]} -- Price: ${marketPricesPyth[symbol]}$`);
		}

		fs.writeFileSync("Scripts/MarketPrices/MarketPricesPyth.json", JSON.stringify(marketPricesPyth, null, 2));
	} catch (error) {
		throw error;
	}
};

Pyth();

setInterval(Pyth, 1000);
