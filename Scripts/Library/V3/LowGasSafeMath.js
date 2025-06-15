const { ethers } = require("../../Common/Global/Global");

function add(x, y) {
	let z = x + y;
	if (z < x) {
		throw new Error("SafeMath: addition overflow");
	}
	return z;
}

function sub(x, y) {
	let z = x - y;
	if (z > x) {
		throw new Error("SafeMath: subtraction overflow");
	}
	return z;
}

function mul(x, y) {
	if (x === 0) {
		return 0;
	}
	let z = x * y;
	if (z / x !== y) {
		throw new Error("SafeMath: multiplication overflow");
	}
	return z;
}

function addInt(x, y) {
	let z = x + y;
	if (z >= x !== y >= 0) {
		throw new Error("SafeMath: addition overflow");
	}
	return z;
}

function subInt(x, y) {
	let z = x - y;
	if (z <= x !== y >= 0) {
		throw new Error("SafeMath: subtraction overflow");
	}
	return z;
}

module.exports = {
	add,
	sub,
	mul,
	addInt,
	subInt,
};
