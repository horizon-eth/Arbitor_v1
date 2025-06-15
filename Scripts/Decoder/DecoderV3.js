const { encoder, flashSwapContract, flashSwapFunctionSelector } = require("../../Chains/Linea/scripts/Common/Common");

async function encode(Calldata) {
	const [flashPoolAddress, flashPoolData] = flashSwapContract.interface.decodeFunctionData(flashSwapFunctionSelector["PrintLira"], Calldata);

	console.log("flashPoolAddress", flashPoolAddress);
	// console.log("flashPoolData", flashPoolData);

	function removeFirst4Bytes(inputData) {
		let data = inputData.startsWith("0x") ? inputData.slice(2) : inputData;

		if (data.length % 2 !== 0) {
			throw new Error("Hex string length must be even.");
		}

		const byteArray = data.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));

		const modifiedByteArray = byteArray.slice(4);

		const modifiedData = modifiedByteArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

		return "0x" + modifiedData;
	}

	const modifiedFlashPoolData = removeFirst4Bytes(flashPoolData);

	const [recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, callback] = encoder.decode(["address", "bool", "int256", "uint160", "bytes"], modifiedFlashPoolData);

	console.log(`flashPoolData	\n	recipient == arbitragePoolAddress = ${recipient}	\n	zeroForOne = ${zeroForOne}	\n	amountSpecified == amountIn = ${amountSpecified}	\n	sqrtPriceLimitX96 = ${sqrtPriceLimitX96}`);
	// console.log(`flashPoolData	\n	recipient == arbitragePoolAddress = ${recipient}	\n	zeroForOne = ${zeroForOne}	\n	amountSpecified == amountIn = ${amountSpecified}	\n	sqrtPriceLimitX96 = ${sqrtPriceLimitX96}	\n	callback ${callback}`);

	const [arbitragePoolAddress, token0Address, token1Address, swapData] = encoder.decode(["address", "address", "address", "bytes"], callback);

	console.log(`callback	\n	arbitragePoolAddress = ${arbitragePoolAddress}	\n	token0Address = ${token0Address}	\n	token1Address = ${token1Address}`);
	// console.log(`callback	\n	arbitragePoolAddress = ${arbitragePoolAddress}	\n	token0Address = ${token0Address}	\n	token1Address = ${token1Address}	\n	swapData = ${swapData}`);

	const modifiedSwapData = removeFirst4Bytes(swapData);

	if (arbitragePoolAddress == "0xCeC911f803D984ae2e5A134b2D15218466993869") {
		const [to, input, minOutput] = encoder.decode(["address", "uint256", "uint256"], modifiedSwapData);

		console.log(`swapData		\n	to == flashSwapAddress = ${to}	\n	input == amountIn = ${input}	\n	minOutput == amountOutMin = ${minOutput}`);
	} else {
		const [amount0Out, amount1Out, to, data] = encoder.decode(["uint256", "uint256", "address", "bytes"], modifiedSwapData);

		console.log(`swapData	\n	amount0Out == amountOutMin - Token0 = ${amount0Out}	\n	amount1Out == amountOutMin - Token1 = ${amount1Out}	\n	to == flashSwapAddress = ${to}`);
		// console.log(`swapData	\n	amount0Out == amountOutMin - Token0 = ${amount0Out}	\n	amount1Out == amountOutMin - Token1 = ${amount1Out}	\n	to == flashSwapAddress = ${to}	\n	data = 0x = ${data}`);
	}
}

encode(
	"0x835786c0000000000000000000000000586733678b9ac9da43dd7cb83bbb41d23677dfc3000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e4128acb0800000000000000000000000028e604a6644f30f366231d007f501484dee4a8e30000000000000000000000000000000000000000000000000000000000000000fffffffffffffffffffffffffffffffffffffffffffffffffffffffff73469c0000000000000000000000000fffd8963efd1fc6a506488495d951d526398893e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000cec911f803d984ae2e5a134b2d15218466993869000000000000000000000000176211869ca2b568f2a7d4ee941e073a821ee1ff000000000000000000000000e5d7c2a44ffddf6b295a15c148167daaaf5cf34f00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000064a9d9db4d00000000000000000000000028e604a6644f30f366231d007f501484dee4a8e30000000000000000000000000000000000000000000000000000000008cb964000000000000000000000000000000000000000000000000000a72a43fafef10a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
);
