import { ethers } from "ethers";

// type 0
export const calculateTxGasLegacy = async () => {};

// type 1
export const calculateTxGasEIP2930 = async () => {};

// type 2
export const calculateTxGasEIP1559 = async () => {
	const provider = new ethers.JsonRpcProvider();

	const baseFeePerGas = 72n;
	const maxPriorityFeePerGas = 1n;

	const { gasPrice } = await provider.getFeeData();

	if (gasPrice === null) throw new Error("Failed to fetch gas price or max priority fee per gas");

	const totalFee = (baseFeePerGas + maxPriorityFeePerGas) * gasPrice;
};

// type 3
export const calculateTxGasEIP4844 = async () => {};

// type 4
export const calculateTxGasEIP7702 = async () => {};
