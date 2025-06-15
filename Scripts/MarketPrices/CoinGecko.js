// // *** User Defined Settings ***

// // https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0

// const cryptocurrencies = ["antfarm-token"];

// // *** User Defined Settings ***

// // ******* Code Side *******

// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");

// function writeToFile(data) {
// 	const filePath = path.join(__dirname, "./MarketPricesCoinGecko.json");
// 	fs.writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
// 		if (error) {
// 			// console.error("Error writing to file:", error);
// 		} else {
// 			// console.log("Data has been written to CoinPrices.json");
// 		}
// 	});
// }

// async function CoinGecko() {
// 	try {
// 		console.log("test");
// 		const [priceResponse, symbolResponse] = await Promise.all([
// 			axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrencies.join(",")}&vs_currencies=usd`),
// 			axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptocurrencies.join(",")}&order=market_cap_desc&per_page=${cryptocurrencies.length}&page=1&sparkline=false`),
// 		]);
// 		console.log("tes2");

// 		const prices = priceResponse.data;
// 		const symbols = symbolResponse.data.reduce((acc, cryptoData) => {
// 			acc[cryptoData.id] = cryptoData.symbol.toUpperCase();
// 			return acc;
// 		}, {});

// 		const Market_Prices = cryptocurrencies.reduce((acc, crypto) => {
// 			const price = prices[crypto]?.usd || "N/A";
// 			const symbol = symbols[crypto] || "N/A";
// 			acc[`${symbol}`] = price;
// 			return acc;
// 		}, {});

// 		console.log(Market_Prices);

// 		return Market_Prices;
// 	} catch (error) {}
// }

// async function fetchAndWritePrices() {
// 	try {
// 		const marketPrices = await CoinGecko();
// 		// console.log(marketPrices);
// 		writeToFile(marketPrices);
// 	} catch (error) {}
// }

// // fetchAndWritePrices();
// CoinGecko();

// setInterval(fetchAndWritePrices, 5000);
