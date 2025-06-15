// ************************************************************************************************
// ********************** WITHDRAWS SINGLE TOKEN BALANCE FOR SELECTED CHAIN ***********************
// ************************************************************************************************

const { ethers, ERC20, selectedChain } = require("../Common/Global/Global");

const { SCRIPT_PROVIDER, flashSwapContract, flashSwapAddress, Owner_Account } = require(`../Common/Common/${selectedChain}`);

async function withdrawSingleOnOneChain(address) {
	try {
		const token = new ethers.Contract(address, ERC20.abi, SCRIPT_PROVIDER);
		const balance = await token.balanceOf(flashSwapAddress);

		if (balance <= 0n) return;

		flashSwapContract.connect(Owner_Account).withdraw([address], [balance], {
			gasLimit: 500000,
		});

		console.log(`Has Been Withdrawn on ${selectedChain} !`);
	} catch (error) {
		console.log(error, "ERROR", selectedChain);
	}
}

withdrawSingleOnOneChain("0x40DF0C3BBAAE5Ea3A509d8F2aa9E086776C98E6c");
