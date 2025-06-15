const { fs, csv } = require("../Common/Global/Global");

async function getStatistics() {
	const transactions = [];

	await new Promise((resolve, reject) => {
		fs.createReadStream("Revenues.csv")
			.pipe(csv())
			.on("data", (data) => transactions.push(data))
			.on("end", () => resolve())
			.on("error", (error) => reject(error));
	});

	const dailyProfits = {};

	dailyProfits["All Time Profit"] = 0;
	dailyProfits["All Time Flash Swap Profit"] = 0;
	dailyProfits["All Time Transaction Fee"] = 0;
	dailyProfits["All Time Transaction Count"] = 0;
	dailyProfits[""] = {};

	for (const transaction of transactions) {
		const fullDate = transaction["Date"];
		const date = fullDate.split(" ")[0] + " " + fullDate.split(" ")[1] + " " + fullDate.split(" ")[2]; // e.g., "27 Mayıs 2024"

		const transactionFee = Number(transaction["Transaction Fee"].replace("$", ""));
		// const entranceProfit = Number(transaction["Entrance Profit"].replace("$", ""));
		// const vendableProfit = Number(transaction["Vendable Profit"].replace("$", ""));
		const flashSwapProfit = Number(transaction["Flash Swap Profit"].replace("$", ""));
		const totalNetProfit = flashSwapProfit - transactionFee;

		if (!dailyProfits[date]) {
			dailyProfits[date] = {
				"Total Net Profit": 0,
				"Total Flash Swap Profit": 0,
				// "Total Vendable Profit": 0,
				// "Total Entrance Profit": 0,
				"Transaction Fee": 0,
				"Transaction Count": 0,
			};
		}

		dailyProfits[date]["Total Net Profit"] += totalNetProfit;
		dailyProfits[date]["Total Flash Swap Profit"] += flashSwapProfit;
		// dailyProfits[date]["Total Vendable Profit"] += vendableProfit;
		// dailyProfits[date]["Total Entrance Profit"] += entranceProfit;
		dailyProfits[date]["Transaction Fee"] += transactionFee;
		dailyProfits[date]["Transaction Count"] += 1;

		dailyProfits["All Time Profit"] += totalNetProfit;
		dailyProfits["All Time Flash Swap Profit"] += flashSwapProfit;
		dailyProfits["All Time Transaction Fee"] += transactionFee;
		dailyProfits["All Time Transaction Count"] += 1;
	}

	fs.writeFileSync("scripts/Statistics/Statistics.json", JSON.stringify(dailyProfits, null, 2));
}

getStatistics();
