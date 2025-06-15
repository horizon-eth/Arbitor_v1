const { ethers, fs, flashSwapABI, QuoterV1ABI, QuoterV2ABI, QuoterV3ABI, QuoterV4ABI, minimumNativeBalanceTable, conversionNativeBalanceTable, SpecialProjectsCredentialsV2 } = require("../Global/Global");

class Common {
	constructor(_chain, _chainID, _conflictTokens, _nativeTokenSymbol, _nativeTokenAddress, _ProjectsV2, _blockedProjectListV2, _ProjectsV3, _blockedProjectListV3) {
		// chain
		this.chain = _chain;
		this.chainID = _chainID;
		// chain

		// Tokens
		this.tokens = require(`../../Tokens/${this.chain}.json`);
		// Tokens

		// Providers
		this.FLASHSWAP_PROVIDER = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_FLASHSWAP_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		this.SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_SCRIPT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		this.SECONDARY_SCRIPT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_SECONDARY_SCRIPT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		this.POOL_PROVIDER_V2 = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_V2_POOL_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		this.POOL_PROVIDER_V3 = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_V3_POOL_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		// Providers

		// Flash Swap Contract
		this.flashSwapAddress = JSON.parse(fs.readFileSync("Scripts/Resources/Deployments.json", "utf-8"))[this.chain];
		this.flashSwapContract = new ethers.Contract(this.flashSwapAddress, flashSwapABI.abi, this.FLASHSWAP_PROVIDER);
		// Flash Swap Contract

		// Signer
		this.Owner_Account = ethers.HDNodeWallet.fromPhrase(process.env.HOT_WALLET_PHRASE).connect(this.FLASHSWAP_PROVIDER);
		// Signer

		// ATF_address & callback_type
		if (SpecialProjectsCredentialsV2["AntfarmV2"][this.chain]) {
			this.ATF_address = SpecialProjectsCredentialsV2["AntfarmV2"][this.chain][0];
			this.callback_type = 0; // will be changed to 1
		} else if (SpecialProjectsCredentialsV2["DysonFinanceV2"].includes(this.chain)) {
			// DysonFinanceV2 Logic // will be changed to 2
		} else if (SpecialProjectsCredentialsV2["BalancerV2"].includes(this.chain)) {
			// DysonFinanceV2 Logic // will be changed to 3
		} else {
			this.ATF_address = "0x0000000000000000000000000000000000000000";
			this.callback_type = 1; // will be changed to 0
		}
		// ATF_address & callback_type

		// Transaction Waiting Process
		this.confirmation = 2;
		this.blockTime = 60000;
		// Transaction Waiting Process

		// Creator Settings
		this.module_type = 1;
		this.l2_fee_Type = -1;
		this.l1_fee_Type = -2;
		this.part10_type = 0;
		// Creator Settings

		// Transaction Settings
		this.tx_type = 0;
		// Transaction Settings

		// Conflict Tokens
		this.conflictTokens = _conflictTokens;
		// Conflict Tokens

		// EtherConverter
		this.native_token_symbol = _nativeTokenSymbol;
		this.native_token_address = _nativeTokenAddress;
		this.minimum_native_balance = ethers.parseEther(minimumNativeBalanceTable[this.native_token_symbol].toString());
		this.conversion_ether_amount = ethers.parseEther(conversionNativeBalanceTable[this.native_token_symbol].toString());
		// EtherConverter

		// Minimum Profit Limits
		this.minimumEntranceProfit = 0.15;
		this.minimumVendableProfit = 0.15;
		this.minimumFlashSwapProfit = 0.15;
		// Minimum Profit Limits

		// ProjectsV2
		this.ProjectsV2 = _ProjectsV2;
		this.blockedProjectListV2 = _blockedProjectListV2;
		// ProjectsV2

		// ProjectsV3
		this.ProjectsV3 = _ProjectsV3;
		this.blockedProjectListV3 = _blockedProjectListV3;
		// ProjectsV3

		// This Part Wil be Deleted After Exact V3 Formula
		this.CONTRACT_PROVIDER = new ethers.JsonRpcProvider(process.env[`${this.chain.toUpperCase()}_V3_CONTRACT_PROVIDER_URL`], undefined, { staticNetwork: ethers.Network.from(this.chainID) });
		// This Part Wil be Deleted After Exact V3 Formula
		//
		//
		//
		//
	}
}

const PolygonzkEVM = new Common("PolygonzkEVM", 1101, [], "ETH", "0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9", [], {}, [], {}, []);

console.log(PolygonzkEVM);

module.exports = {
	Common,
};
