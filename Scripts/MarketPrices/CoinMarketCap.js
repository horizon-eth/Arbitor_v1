const { fs, axios, coins_coinmarketcap, coinmarketcap_apikeylist } = require("../Common/Global/Global");

let apiKeyIndex = 0;

async function CoinMarketCap() {
	const marketPricesCoinMarketCap = {};
	// console.log("Fetching data from CoinMarketCap...");

	try {
		const response = await axios.get("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest", {
			params: {
				slug: coins_coinmarketcap.join(),
				convert: "USD",
			},
			headers: {
				Accepts: "application/json",
				"X-CMC_PRO_API_KEY": coinmarketcap_apikeylist[apiKeyIndex],
			},
		});

		const cryptoData = response.data.data;

		for (const key in cryptoData) {
			if (cryptoData.hasOwnProperty(key)) {
				marketPricesCoinMarketCap[cryptoData[key].symbol.toUpperCase()] = cryptoData[key].quote.USD.price;
			}
		}

		fs.writeFileSync("Scripts/MarketPrices/MarketPricesCoinMarketCap.json", JSON.stringify(marketPricesCoinMarketCap, null, 2));
		// console.log("Market prices saved to MarketPricesCoinMarketCap.json");
	} catch (error) {
		if (error.response && error.response.status === 429) {
			apiKeyIndex = (apiKeyIndex + 1) % coinmarketcap_apikeylist.length;
			console.log(`Switching to API key index ${apiKeyIndex}`);
			return CoinMarketCap();
		} else {
			// console.error(`Error: ${error.message}`);
			// console.log("Retrying after 250ms...");
			setTimeout(CoinMarketCap, 250);
		}
	}
}

CoinMarketCap();

setInterval(CoinMarketCap, 5000);
