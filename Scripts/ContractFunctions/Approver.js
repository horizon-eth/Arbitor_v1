// ************************************************************************************************
// ******** GIVES APPROVALS FOR ARBITRAGE CONTRACT TO POOLS/ROUTERS/VAULTS/AGGREGATORS/ETC ********
// ************************************************************************************************

const { ethers, ERC20, selectedChain } = require("../Common/Global/Global");
const { SCRIPT_PROVIDER, flashSwapContract, flashSwapAddress, Owner_Account } = require(`../Common/Common/${selectedChain}`);

async function approver(tokens, pools) {
	let toApproveTokens = [];
	let toApprovePools = [];

	for (let index = 0; index < tokens.length; index++) {
		const token = new ethers.Contract(tokens[index], ERC20.abi, SCRIPT_PROVIDER);

		for (let i = 0; i < pools.length; i++) {
			const allowance = await token.allowance(flashSwapAddress, pools[i]);

			if (allowance >= BigInt(2 ** 128)) continue;

			toApproveTokens.push(tokens[index]);
			toApprovePools.push(pools[i]);
		}
	}

	if (toApproveTokens == [] || toApprovePools == []) return;

	const approve_tx = await flashSwapContract.connect(Owner_Account).approver(toApproveTokens, toApprovePools);

	await SCRIPT_PROVIDER.waitForTransaction(approve_tx.hash, 2);
}

approver(["0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9", "0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035", "0x9CBD81b43ba263ca894178366Cfb89A246D1159C"], ["0xEce7244a0e861C841651401fC22cEE577fEE90AF"]);
