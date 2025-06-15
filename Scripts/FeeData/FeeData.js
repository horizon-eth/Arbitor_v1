const { fs, chains } = require("../Common/Global/Global");

async function getFeeData() {
	let promises = [];

	for (const chain of chains) {
		const { SCRIPT_PROVIDER } = require(`../Common/Common/${chain}`);

		promises.push(SCRIPT_PROVIDER.getFeeData());
	}

	let feeData = {};

	try {
		const results = await Promise.allSettled(promises);

		results.forEach((result, index) => {
			if (result.status == "fulfilled") {
				feeData[chains[index]] = {
					gasPrice: result.value.gasPrice.toString(),
					maxFeePerGas: result.value.maxFeePerGas ? result.value.maxFeePerGas.toString() : null,
					maxPriorityFeePerGas: result.value.maxPriorityFeePerGas ? result.value.maxPriorityFeePerGas.toString() : null,
				};
			} else {
			}
		});

		fs.writeFileSync("Scripts/FeeData/FeeData.json", JSON.stringify(feeData, null, 2));
	} catch (error) {
		setTimeout(getFeeData, 250);
	}
}

getFeeData().then(() => {
	setInterval(getFeeData, 5000);
});
