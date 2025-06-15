const { ethers } = require("../../Common/Global/Global");

// Import dependencies
const { BigNumber } = require("@ethersproject/bignumber");
const { keccak256 } = require("@ethersproject/keccak256");
const FullMath = require("./FullMath");
const FixedPoint128 = require("./FixedPoint128");
const LiquidityMath = require("./LiquidityMath");

// Define Position library
const Position = {
	// Struct for position information
	Info: class {
		constructor(liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed0, tokensOwed1) {
			this.liquidity = liquidity;
			this.feeGrowthInside0LastX128 = feeGrowthInside0LastX128;
			this.feeGrowthInside1LastX128 = feeGrowthInside1LastX128;
			this.tokensOwed0 = tokensOwed0;
			this.tokensOwed1 = tokensOwed1;
		}
	},

	// Function to get position info given owner and tick boundaries
	get: function (self, owner, tickLower, tickUpper) {
		const key = keccak256(new Uint8Array([...owner, tickLower, tickUpper]));
		return self[key];
	},

	// Function to update position with accumulated fees
	update: function (self, liquidityDelta, feeGrowthInside0X128, feeGrowthInside1X128) {
		const _self = new Position.Info(self.liquidity, self.feeGrowthInside0LastX128, self.feeGrowthInside1LastX128, self.tokensOwed0, self.tokensOwed1);

		let liquidityNext;
		if (liquidityDelta.eq(0)) {
			if (_self.liquidity.eq(0)) throw new Error("NP"); // disallow pokes for 0 liquidity positions
			liquidityNext = _self.liquidity;
		} else {
			liquidityNext = LiquidityMath.addDelta(_self.liquidity, liquidityDelta);
		}

		// Calculate accumulated fees
		const tokensOwed0 = FullMath.mulDiv(BigNumber.from(feeGrowthInside0X128).sub(_self.feeGrowthInside0LastX128), _self.liquidity, FixedPoint128.Q128).toBigInt();

		const tokensOwed1 = FullMath.mulDiv(BigNumber.from(feeGrowthInside1X128).sub(_self.feeGrowthInside1LastX128), _self.liquidity, FixedPoint128.Q128).toBigInt();

		// Update the position
		if (!liquidityDelta.eq(0)) self.liquidity = liquidityNext;
		self.feeGrowthInside0LastX128 = feeGrowthInside0X128;
		self.feeGrowthInside1LastX128 = feeGrowthInside1X128;
		if (tokensOwed0 > 0n || tokensOwed1 > 0n) {
			// Overflow is acceptable, have to withdraw before you hit type(uint128).max fees
			self.tokensOwed0 += tokensOwed0;
			self.tokensOwed1 += tokensOwed1;
		}
	},
};

// Export Position library
module.exports = { Position };
