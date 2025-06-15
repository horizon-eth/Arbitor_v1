const { ethers, ethersV5 } = require("../Common/Global/Global");

// const WSS_POOL_PROVIDER = new ethers.WebSocketProvider("wss://ethereum.callstaticrpc.com");

// const WSS_POOL_PROVIDER = new ethers.WebSocketProvider("wss://polygon-bor-rpc.publicnode.com");
const WSS_POOL_PROVIDER = new ethers.WebSocketProvider("wss://polygon-mainnet.core.chainstack.com/2c4641ae8b841d52b8bc49e4711d2d9f");

const HTTPS_POOL_PROVIDER = new ethers.JsonRpcProvider("https://polygon-mainnet.core.chainstack.com/2c4641ae8b841d52b8bc49e4711d2d9f");

const PoolList = [
	"0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
	// "0xPoolAddresssssssssssssssss",
];

async function swap() {
	// make swap
}

const ABIV2 = require("../Dex/PoolABIsV2/UniswapV2PoolABI.json");

const contractInterface = new ethers.Interface(ABIV2);

async function Mempool() {
	WSS_POOL_PROVIDER.on("pending", async (txHash) => {
		// console.log(txHash);

		try {
			const tx = await HTTPS_POOL_PROVIDER.getTransaction(txHash);

			// console.log("tx", tx);

			if (!tx) return;

			const receipt = await tx.wait(2, 60000);

			// console.log("receipt", receipt);

			receipt.logs.map(async (log) => {
				console.log(PoolList.includes(log.address));

				const decodedEvent = contractInterface.parseLog(log);

				function splitHexData(hex, chunkSize = 64) {
					hex = ethersV5.utils.hexStripZeros(hex);

					const chunks = [];

					for (let i = 0; i < hex.length; i += chunkSize) {
						chunks.push(hex.slice(i, i + chunkSize));
					}

					return chunks;
				}

				const chunks = splitHexData(log.data);

				chunks.forEach((chunk, index) => {
					console.log(`Chunk ${index + 1}:`, chunk);
				});

				// console.log("log.", log.topics);
			});
		} catch (error) {
			console.error("Error", error);
		}
	});
}

Mempool();
