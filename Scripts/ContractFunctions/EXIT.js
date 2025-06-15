// ************************************************************************************************
// ********************* URGENTLY WITHDRAWS ALL THE FUNDS FROM ALL THE CHAINS *********************
// ************************************************************************************************

const { ethers, ERC20, chains } = require("../Common/Global/Global");

async function EXIT() {
	for (const chain of chains) {
		const { tokens, SCRIPT_PROVIDER, flashSwapContract, flashSwapAddress, Owner_Account } = require(`../Common/Common/${chain}`);

		const addresses = [];
		const amounts = [];

		for (let index = 0; index < tokens.length; index++) {
			const token = new ethers.Contract(tokens[index], ERC20.abi, SCRIPT_PROVIDER);
			const balance = await token.balanceOf(flashSwapAddress);

			if (balance > 0n) {
				addresses.push(tokens[index]);
				amounts.push(balance);
			}
		}

		flashSwapContract.connect(Owner_Account).withdraw(addresses, amounts);

		console.log(`Has Been Withdrawn on ${chain} !`);
	}
}

EXIT();
