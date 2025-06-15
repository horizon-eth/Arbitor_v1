const { ethers, fs, path, chains, ERC20, WalletAddress } = require("../Common/Global/Global");

const GlobalLibrary = require("../Library/GlobalLibrary");

async function getNativeBalance(chain) {
	const { SCRIPT_PROVIDER } = require(`../Common/Common/${chain}`);

	return await SCRIPT_PROVIDER.getBalance(WalletAddress);
}

async function getTokenBalanceList(chain, tokens) {
	const { SCRIPT_PROVIDER, flashSwapAddress } = require(`../Common/Common/${chain}`);

	const tokenBalanceList = [];
	const tokenDecimalList = [];
	const tokenSymbolList = [];

	for (let index = 0; index < tokens.length; index++) {
		const contract = new ethers.Contract(tokens[index], ERC20.abi, SCRIPT_PROVIDER);

		[tokenBalanceList[index], tokenDecimalList[index], tokenSymbolList[index]] = await Promise.all([contract.balanceOf(flashSwapAddress), contract.decimals(), contract.symbol()]);
	}

	return [tokenBalanceList, tokenDecimalList, tokenSymbolList];
}

async function run() {
	const data = {};

	data["All Chains Total Worth"] = 0;
	data["Last Updated Data"] = `${String(new Date().getDate()).padStart(2, "0")}.${String(new Date().getMonth() + 1).padStart(2, "0")}.${new Date().getFullYear()}`;

	for (const chain of chains) {
		const { tokens, native_token_symbol } = require(`../Common/Common/${chain}`);

		const nativeBalance = await getNativeBalance(chain);

		const [tokenBalanceList, tokenDecimalList, tokenSymbolList] = await getTokenBalanceList(chain, tokens);

		const tokenBalances = [];
		const balances = [];
		const decimals = [];
		const symbols = [];

		for (let index = 0; index < tokenBalanceList.length; index++) {
			const balance = tokenBalanceList[index];
			const decimal = tokenDecimalList[index];
			const symbol = tokenSymbolList[index];

			if (balance == "0n" || balance == 0n) continue;

			tokenBalances.push(ethers.formatUnits(balance, decimal) + " " + symbol);
			balances.push(ethers.formatUnits(balance, decimal));
			decimals.push(decimal);
			symbols.push(symbol);
		}

		const prices = await GlobalLibrary.getMarketPriceBatch(symbols);

		let tokenBalancesWorth = 0;

		for (let index = 0; index < balances.length; index++) {
			tokenBalancesWorth += Number(balances[index]) * prices[index];
		}

		const nativeBalanceWorth = Number(ethers.formatEther(nativeBalance)) * (await GlobalLibrary.getMarketPriceBatch([native_token_symbol]));

		data[chain] = {};
		data[chain]["Total Worth"] = nativeBalanceWorth + tokenBalancesWorth;
		data[chain]["Native Balance Worth"] = nativeBalanceWorth;
		data[chain]["Token Balances Worth"] = tokenBalancesWorth;
		data[chain]["Native Balance"] = ethers.formatEther(nativeBalance) + " " + native_token_symbol;
		data[chain]["Token Balances"] = tokenBalances;
		data["All Chains Total Worth"] += nativeBalanceWorth + tokenBalancesWorth;
	}

	fs.writeFileSync(path.join("Scripts/Statistics/Balances.json"), JSON.stringify(data, null, 2));
}

run();
