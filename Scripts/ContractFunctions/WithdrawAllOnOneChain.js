// ************************************************************************************************
// ********************** WITHDRAWS SINGLE TOKEN BALANCE FOR SELECTED CHAIN ***********************
// ************************************************************************************************

const { ethers, ERC20, selectedChain } = require("../Common/Global/Global");

const { tokens, SCRIPT_PROVIDER, flashSwapContract, flashSwapAddress, Owner_Account } = require(`../Common/Common/${selectedChain}`);

const excludedTokens = ["0x40DF0C3BBAAE5Ea3A509d8F2aa9E086776C98E6c", "0xFB9fbcB328317123f5275CDA30b6589d5841216B", "0x8aF94528FBE3c4C148523E7aAD48BcEbcC0A71d7", "0x518b63Da813D46556FEa041A88b52e3CAa8C16a8"];
// const excludedTokens = [];

async function withdrawAllOnOneChain() {
	try {
		const addresses = [];
		const amounts = [];

		for (let index = 0; index < tokens.length; index++) {
			const token = new ethers.Contract(tokens[index], ERC20.abi, SCRIPT_PROVIDER);
			const balance = await token.balanceOf(flashSwapAddress);

			if (balance > 0n) {
				if (excludedTokens.includes(tokens[index])) continue;
				addresses.push(tokens[index]);
				amounts.push(balance);
			}
		}

		flashSwapContract.connect(Owner_Account).withdraw(addresses, amounts, {
			gasLimit: 400000,
		});

		console.log(`Has Been Withdrawn on ${selectedChain} !`);
	} catch (error) {
		console.log(error, "ERROR", selectedChain);
	}
}

withdrawAllOnOneChain();
