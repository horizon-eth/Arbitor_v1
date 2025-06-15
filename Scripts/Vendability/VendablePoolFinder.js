const { ethers, fs, path, chains } = require("../Common/Global/Global");

const { getVendableV3Pools, getVendableV2Pools } = require("../Library/LibraryV2");

async function getV2Pools() {
	let V2Pools = [];

	for (const chain of chains) {
		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const project in ProjectsV2) {
			const pools = require(`../Dex/PoolDatasV2/${chain}/${project}`);

			for (const pool of pools) {
				if (pool.pool_address !== undefined || pool.pool_address !== null) V2Pools.push(pool.pool_address);
			}
		}
	}

	return V2Pools;
}

async function getV3Pools() {
	let V3Pools = [];

	for (const chain of chains) {
		const { ProjectsV3 } = require(`../Common/Common/${chain}`);

		for (const project in ProjectsV3) {
			const pools = require(`../Dex/PoolDatasV3/${chain}/${project}`);

			for (const pool of pools) {
				if (pool.pool_address !== undefined || pool.pool_address !== null) V3Pools.push(pool.pool_address);
			}
		}
	}

	return V3Pools;
}

async function getVendabilityV2toV3() {
	let VendableV2PoolsToV3 = [];
	let NonVendableV2PoolsToV3 = [];

	for (const chain of chains) {
		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const project in ProjectsV2) {
			const pools = require(`../Dex/PoolDatasV2/${chain}/${project}`);

			for (const pool of pools) {
				const vendablePools = await getVendableV3Pools(chain, pool.token0_address, pool.token1_address);

				if (vendablePools.length !== 0) VendableV2PoolsToV3.push(pool.pool_address);
				if (vendablePools.length == 0) NonVendableV2PoolsToV3.push(pool.pool_address);
			}
		}
	}

	return [VendableV2PoolsToV3, NonVendableV2PoolsToV3];
}

async function getVendabilityV2toV2() {
	let VendableV2PoolsToV2 = [];
	let NonVendableV2PoolsToV2 = [];

	for (const chain of chains) {
		const { ProjectsV2 } = require(`../Common/Common/${chain}`);

		for (const project in ProjectsV2) {
			const pools = require(`../Dex/PoolDatasV2/${chain}/${project}`);

			for (const pool of pools) {
				const vendablePools = await getVendableV2Pools(chain, pool.pool_address, pool.token0_address, pool.token1_address);

				if (vendablePools.length !== 0) VendableV2PoolsToV2.push(pool.pool_address);
				if (vendablePools.length == 0) NonVendableV2PoolsToV2.push(pool.pool_address);
			}
		}
	}

	return [VendableV2PoolsToV2, NonVendableV2PoolsToV2];
}

async function VendablePoolFinder() {
	const V2Pools = await getV2Pools();
	const V3Pools = await getV3Pools();
	const [VendableV2PoolsToV3, NonVendableV2PoolsToV3] = await getVendabilityV2toV3();
	const [VendableV2PoolsToV2, NonVendableV2PoolsToV2] = await getVendabilityV2toV2();

	console.log("Total V2Pools", V2Pools.length);
	console.log("Total V3Pools", V3Pools.length);

	console.log("Total VendableV2PoolsToV3", VendableV2PoolsToV3.length);
	console.log("Total NonVendableV2PoolsToV3", NonVendableV2PoolsToV3.length);

	console.log("Total VendableV2PoolsToV2", VendableV2PoolsToV2.length);
	console.log("Total NonVendableV2PoolsToV2", NonVendableV2PoolsToV2.length);

	await save(NonVendableV2PoolsToV3, "NonVendableV2PoolsToV3");
}

async function save(data, location) {
	fs.writeFileSync(`Scripts/Vendability/${location}.json`, JSON.stringify(data, null, 2));
}

VendablePoolFinder();
