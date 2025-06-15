const { hardhat, fs, selectedChain } = require("../Common/Global/Global");
const { Owner_Account } = require(`../Common/Common/${selectedChain}`);

// ----------------------------------------------------------------------------------------------------
// ---------------------------------- Check Nonce Before Deployment -----------------------------------
// ----------------------------------------------------------------------------------------------------

async function deploy() {
	const FeeData = JSON.parse(await fs.promises.readFile(`Scripts/FeeData/FeeData.json`));

	const flashSwap = await hardhat.ethers.deployContract("Arbitor", {
		signer: Owner_Account,
		gasPrice: FeeData[selectedChain].gasPrice * 2,
	});

	await flashSwap.waitForDeployment();

	return flashSwap.target;
}

deploy()
	.then(async (deployedAddress) => {
		const deployments = JSON.parse(await fs.promises.readFile(`Scripts/Resources/Deployments.json`));

		deployments[selectedChain] = deployedAddress;

		fs.writeFileSync(`Scripts/Resources/Deployments.json`, JSON.stringify(deployments, null, 2));

		console.log(`Deployed to ${deployedAddress} on ${selectedChain}`);
	})
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
