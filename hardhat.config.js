require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 1,
			forking: {
				url: "https://eth.llamarpc.com",
			},
		},

		localhost: {
			url: "http://127.0.0.1:8545",
		},
	},

	solidity: {
		version: "0.8.20",
		settings: {
			viaIR: true,
			optimizer: {
				enabled: true,
				details: {
					yulDetails: {
						optimizerSteps: "u",
					},
				},
			},
		},
	},

	paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./cache",
		artifacts: "./artifacts",
	},

	mocha: {
		timeout: 40000,
	},
};
