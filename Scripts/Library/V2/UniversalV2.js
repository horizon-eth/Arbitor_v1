const { ethers, fs, path, chains } = require("../../Common/Global/Global");

async function poolNameSelectorV2(projectName, pool) {
	if (projectName == "BalancerV2") {
		return `${pool.token0_symbol}_${pool.token1_symbol}_${pool.pool_fee.replace(".", "_")}_POOL`;
	} else if (projectName == "AntfarmFinanceV2") {
		const pool_fee_CFT = pool.pool_fee.toString().includes(".") ? pool.pool_fee.toString().replace(".", "_") : pool.pool_fee;

		return `${pool.token0_symbol}_${pool.token1_symbol}_${pool_fee_CFT}_POOL`;
	} else {
		return pool.token0_symbol + "_" + pool.token1_symbol + "_POOL";
	}
}

module.exports = {
	poolNameSelectorV2,
};
