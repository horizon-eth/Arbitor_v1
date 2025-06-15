require("dotenv").config();
const hre = require("hardhat");
const ethers = require("ethers");
const { expect } = require("chai");
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

// All Tests Are Done on Polygon zkEVM with Mainnet Forking

// const provider = new ethers.JsonRpcProvider(process.env.GOERLI_PROVIDER); // You Can Choose Any Network You Want
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_PROVIDER); // You Can Choose Any Network You Want

// const flashLoanAddress = "0x1284F2Fb950Aa2b202f04B70d40281c050d6F848"; // Goerli
const flashLoanAddress = "0xE61391d689E505C9e745E6221E2C2E97fC981A96"; // Sepolia
const flashLoanABI = require("../artifacts/contracts/FlashLoan.sol/FlashLoan.json");
const flashLoanContract = new ethers.Contract(flashLoanAddress, flashLoanABI.abi, provider);

const owner_account = ethers.HDNodeWallet.fromPhrase(process.env.HOT_WALLET_PHRASE).connect(provider);
const owner_address = owner_account.address;

const tokens = [
	"0x4e2C3e7574f7aD08F347A98F2c203011016A3566", //
	"0x779877A7B0D9E8603169DdbD7836e478b4624789", //
	"0x68194a729C2450ad26072b3D33ADaCbcef39D574", //
	"0xeDC2B3Bebbb4351a391363578c4248D672Ba7F9B", //
	"0xAAfC730ef2bD47d9a49519BB8aeC7110b8D96Add", //
	"0x3F4B6664338F23d2397c953f2AB4Ce8031663f80", //
	"0xFA0bd2B4d6D629AdF683e4DCA310c562bCD98E4E", //
	"0xDAF37f12240C46933A73F7bb1d4F61AD1d1559DE", //
	"0xE47dE7c2c4d24198Ff8f3bC3a1d3C529c67925BD", //
	"0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", //
];

const routers = [
	"0xBA12222222228d8Ba445958a75a0704d566BF2C8", // Balancer v2 Vault Router
	"0x0E802CAbD4C20d8A24a2c98a4DA176337690cc0d", // SushiSwap v2 Router
];

describe("-- ATTACKER --", function () {
	let attacker_account;

	before(async function () {
		[attacker_account] = await hre.ethers.getSigners();
		attacker_account.connect(provider);
	});

	describe("-- ATTACKER -- withdrawAllTokens() Tests", function () {
		it("MUST REVERT!!! - Call withdrawAllTokens() With 1 Token & Empty", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens([tokens[0]], [""])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With Empty & 1 Router", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens([""], [routers[0]])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & With 0 Wei", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens, ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & Real Token Balances", async function () {
			let tokenBalances = [];

			for (let index = 0; index < tokens.length; index++) {
				const tokenContract = new ethers.Contract(tokens[index], IERC20.abi, provider);
				const tokenBalance = await tokenContract.balanceOf(flashLoanAddress);

				tokenBalances.push(tokenBalance);
			}

			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens, tokenBalances)).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & With All Negative Values", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens, ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With 1 Token & With MinInt256", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens[0], [hre.ethers.MinInt256])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & With MinInt256", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens, [hre.ethers.MinInt256])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With 1 Token & With MaxUint256", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens[0], [hre.ethers.MaxUint256])).to.be.rejected;
		});

		it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & With MaxUint256", async function () {
			await expect(flashLoanContract.connect(attacker_account).withdrawAllTokens(tokens, [hre.ethers.MaxUint256])).to.be.rejected;
		});
	});
});

describe("approveAllTokensForAllRouters() Test", function () {
	it("MUST PASS - Call approveAllTokensForAllRouters() With 1 Token & 1 Router", async function () {
		expect(await flashLoanContract.connect(owner_account).approveAllTokensForAllRouters([tokens[0]], [routers[0]])).not.to.be.reverted;
	});

	it("MUST REVERT!!! - Call approveAllTokensForAllRouters() With 1 Token & Empty", async function () {
		await expect(flashLoanContract.connect(owner_account).approveAllTokensForAllRouters([tokens[0]], [""])).to.be.rejected;
	});

	it("MUST REVERT!!! - Call approveAllTokensForAllRouters() With Empty & 1 Router", async function () {
		await expect(flashLoanContract.connect(owner_account).approveAllTokensForAllRouters([""], [routers[0]])).to.be.rejected;
	});

	it("MUST PASS - Call approveAllTokensForAllRouters() With All Tokens & Routers", async function () {
		expect(await flashLoanContract.connect(owner_account).approveAllTokensForAllRouters(tokens, routers)).not.to.be.reverted;
	});

	it("MUST REVERT!!! - Call approveAllTokensForAllRouters() With All Tokens & Empty", async function () {
		await expect(flashLoanContract.connect(owner_account).approveAllTokensForAllRouters(tokens, ["TEST"])).to.be.rejected;
	});

	it("MUST REVERT!!! - Call approveAllTokensForAllRouters() With All Empty & Routers", async function () {
		await expect(flashLoanContract.connect(owner_account).approveAllTokensForAllRouters(["TEST"], routers)).to.be.rejected;
	});
});

describe("withdrawAllTokens() Tests", function () {
	it("MUST PASS - Call withdrawAllTokens() With 1 Token & With 0 Wei", async function () {
		expect(await flashLoanContract.connect(owner_account).withdrawAllTokens([tokens[0]], ["0"])).not.to.be.reverted;
	});

	it("MUST PASS - Call withdrawAllTokens() With 1 Token & With Real Token Balance", async function () {
		const tokenContract = new ethers.Contract(tokens[0], IERC20.abi, provider);

		expect(await flashLoanContract.connect(owner_account).withdrawAllTokens([tokens[0]], [tokenContract.balanceOf(flashLoanAddress)])).not.to.be.reverted;
	});

	it("MUST REVERT!!! - Call withdrawAllTokens() With 1 Token & With Max Uint256", async function () {
		await expect(flashLoanContract.connect(owner_account).withdrawAllTokens([tokens[0]], [hre.ethers.MaxUint256])).to.be.rejected;
	});

	it("MUST PASS - Call withdrawAllTokens() With All Tokens & With 0 Wei", async function () {
		expect(await flashLoanContract.connect(owner_account).withdrawAllTokens(tokens, ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"])).not.to.be.reverted;
	});

	it("MUST PASS - Call withdrawAllTokens() With All Tokens & With Real Token Balances", async function () {
		let tokenBalances = [];

		for (let index = 0; index < tokens.length; index++) {
			const tokenContract = new ethers.Contract(tokens[index], IERC20.abi, provider);
			const tokenBalance = await tokenContract.balanceOf(flashLoanAddress);

			tokenBalances.push(tokenBalance);
		}

		expect(await flashLoanContract.connect(owner_account).withdrawAllTokens(tokens, tokenBalances)).not.to.be.reverted;
	});

	it("MUST REVERT!!! - Call withdrawAllTokens() With All Tokens & With Max Uint256", async function () {
		let maxTokenBalances = [];

		for (let index = 0; index < tokens.length; index++) {
			maxTokenBalances.push(hre.ethers.MaxUint256);
		}

		await expect(flashLoanContract.connect(owner_account).withdrawAllTokens(tokens, maxTokenBalances)).to.be.reverted;
		await expect(flashLoanContract.connect(owner_account).withdrawAllTokens(tokens, maxTokenBalances)).to.be.rejected;
	});
});

describe("Library Tests", function () {
	it("is flashLoanContract.owner() Equal to owner_address", async function () {
		expect(await flashLoanContract.connect(owner_account).owner()).to.be.equal(owner_address);
	});
});

const hardhatprovider = hardhat.ethers.provider;
const impersonatedAccount = await hardhat.ethers.getImpersonatedSigner("0x0000000000000000000000000000000000000000");

const forking_flashLoanAddress = "0x4cb57f0D99B9504A0DDe08C7e32461A9E09f9551";
const forking_flashLoanABI = require("../../../../artifacts/contracts/FlashLoan.sol/FlashLoan.json");
const forking_flashLoanContract = new ethers.Contract(forking_flashLoanAddress, forking_flashLoanABI.abi, hardhatprovider);

const loanToken_contract = new ethers.Contract(token0_address, ERC20.abi, hardhatprovider);
const outputToken_contract = new ethers.Contract(token1_address, ERC20.abi, hardhatprovider);

async function TEST_flashLoan() {
	// await hardhat.network.provider.send("evm_setAutomine", [false]);
	// await hardhat.network.provider.send("evm_setIntervalMining", [5000]);

	const logBalances = async () => {
		const loanTokenBalance = await loanToken_contract.balanceOf("0x0000000000000000000000000000000000000000");
		const outputTokenBalance = await outputToken_contract.balanceOf("0x0000000000000000000000000000000000000000");
		console.log("Token 0 Balance", hardhat.ethers.formatUnits(loanTokenBalance, token0_decimal), token0_symbol);
		console.log("Token 1 Balance", hardhat.ethers.formatUnits(outputTokenBalance, token1_decimal), token1_symbol);
	};

	console.log("------------ Time 0");
	await logBalances();

	console.log(`
      calldata1 = ${calldata1} \n
      calldata2 = ${calldata2} \n
      routerAddress1 = ${Dyson_v2_router_address}
      routerAddress2 = ${routerAddress2}
      [tokens] = ${token0_address}
      [amounts] = ${input}
   `);

	// return;

	const flashLoan_data = forking_flashLoanContract.interface.encodeFunctionData("0x133eecc5", [calldata1, calldata2, Dyson_v2_router_address, routerAddress2, [token0_address], [input]]);

	let gas = await HttpsProvider.estimateGas({
		from: WalletAddress,
		to: flashLoanAddress,
		data: flashLoan_data,
	});

	console.log("estimated gas for tx", gas);

	// const transactionFee = await TEST_estimateTransactionFee(flashLoan_data);

	// const flashLoan_tx = await forking_flashLoanContract.connect(Owner_Account).flashLoan(
	const flashLoan_tx = await forking_flashLoanContract.connect(impersonatedAccount).flashLoan(calldata1, calldata2, Dyson_v2_router_address, routerAddress2, [token0_address], [input], {
		gasLimit: 800000,
	});

	await flashLoan_tx;

	console.log("------------ Time 1");
	await logBalances();

	console.log("estimated gas for tx", gas);
	console.log("estimated gas as dollar", Number(gas) * Market_Prices["ETH"]);

	// await hardhat.network.provider.send("evm_mine");
}
await TEST_flashLoan();
