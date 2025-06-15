// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IHorizon {
    function flashLoan(
        address recipient,
        address[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData
    ) external;

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract Arbitor is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}

    fallback() external payable {
        revert("You Are Horizoned, Follow Me On Twitter @horizon_eth");
    }

    receive() external payable {
        revert("You Are Horizoned, Follow Me On Twitter @horizon_eth");
    }

    // FlashSwap/FlashLoan/DebtSwap/CollateralSwap Callee
    function PrintLira(
        address flashPoolAddress,
        bytes calldata flashPoolData
    ) external onlyOwner nonReentrant {
        (bool res, ) = flashPoolAddress.call(flashPoolData);
        require(
            res,
            "PrintLira --> flashPoolAddress.call(flashPoolData) failed !"
        );
    }

    // FlashSwap/FlashLoan/DebtSwap/CollateralSwap Callee

    // flashSwapExecutorV3 --- Flash Swap on V3 Pools
    function flashSwapExecutorV3(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) private {
        (
            address arbitragePoolAddress,
            address token0Address,
            address token1Address,
            bytes memory swapData,
            address addressOfATF,
            uint256 paybackATF
        ) = abi.decode(
                data,
                (address, address, address, bytes, address, uint256)
            );

        bool ZeroForOne = amount0Delta > 0;

        address paybackTokenAddress = ZeroForOne == true
            ? token0Address
            : token1Address;

        uint256 beforeBalance = IHorizon(paybackTokenAddress).balanceOf(
            address(this)
        );

        if (paybackATF > 0) {
            IHorizon(addressOfATF).transfer(arbitragePoolAddress, paybackATF);
        }

        (bool res, ) = arbitragePoolAddress.call(swapData);
        require(
            res,
            "ExecutorV3 --> arbitragePoolAddress.call(swapData) failed !"
        );

        ZeroForOne == true
            ? IHorizon(paybackTokenAddress).transfer(
                msg.sender,
                uint256(amount0Delta)
            )
            : IHorizon(paybackTokenAddress).transfer(
                msg.sender,
                uint256(amount1Delta)
            );

        uint256 afterBalance = IHorizon(paybackTokenAddress).balanceOf(
            address(this)
        );

        require(
            afterBalance > beforeBalance,
            "ExecutorV3 / afterBalance <= beforeBalance !"
        );
    }

    // flashSwapExecutorV3 --- Flash Swap on V3 Pools

    // flashSwapExecutorV2 --- Flash Swap on V2 Pools
    function flashSwapExecutorV2(
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) private {
        (
            address arbitragePoolAddress,
            bytes memory swapData,
            address token0Address,
            address token1Address,
            uint256 paybackTokenAmount,
            address addressOfATF,
            uint256 paybackATF
        ) = abi.decode(
                data,
                (address, bytes, address, address, uint256, address, uint256)
            );

        bool ZeroToOne = amount1 > 0;

        uint256 inputTokenAmount = ZeroToOne ? amount1 : amount0;

        address inputTokenAddress = ZeroToOne ? token1Address : token0Address;

        address paybackTokenAddress = ZeroToOne ? token0Address : token1Address;

        if (paybackATF > 0) {
            IHorizon(addressOfATF).transfer(arbitragePoolAddress, paybackATF);
        }

        IHorizon(inputTokenAddress).transfer(
            arbitragePoolAddress,
            inputTokenAmount
        );

        uint256 beforeBalance = IHorizon(paybackTokenAddress).balanceOf(
            address(this)
        );

        (bool res, ) = arbitragePoolAddress.call(swapData);
        require(
            res,
            "ExecutorV2 --> arbitragePoolAddress.call(swapData) failed !"
        );

        IHorizon(paybackTokenAddress).transfer(msg.sender, paybackTokenAmount);

        uint256 afterBalance = IHorizon(paybackTokenAddress).balanceOf(
            address(this)
        );

        require(
            afterBalance > beforeBalance,
            "ExecutorV2 / afterBalance <= beforeBalance !"
        );
    }

    // flashSwapExecutorV2 --- Flash Swap on V2 Pools

    // flashLoanExecutor --- Flash Loan on V2+V3 Pools
    function flashLoanExecutor(
        IHorizon[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) private {
        // (
        //     uint256 test,
        //     uint256 test,
        //     uint256 test,
        //     uint256 test,
        //     uint256 test,
        //     uint256 test
        // ) = abi.decode(userData, (uint256, uint256, uint256, uint256, uint256, uint256));
        // Execute Arbitrage
    }

    // flashLoanExecutor --- Flash Loan on V2+V3 Pools

    // Balancer Flash Loan -----------------
    // Make Flash Loan Request
    function flashLoan(
        bytes calldata calldata1,
        bytes calldata calldata2,
        address routerAddress1,
        address routerAddress2,
        address[] calldata tokens,
        uint256[] calldata amounts
    ) external onlyOwner nonReentrant {
        bytes memory userData = abi.encode(
            calldata1,
            calldata2,
            routerAddress1,
            routerAddress2
        );

        IHorizon(0xBA12222222228d8Ba445958a75a0704d566BF2C8).flashLoan(
            address(this),
            tokens,
            amounts,
            userData
        );
    }

    // Execute Flash Loan With Arbitrage Logic
    function receiveFlashLoan(
        IHorizon[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external returns (uint256 preLoanBalance, uint256 afterLoanBalance) {
        require(
            msg.sender == 0xBA12222222228d8Ba445958a75a0704d566BF2C8,
            "You Are Horizoned"
        );

        (
            bytes memory calldata1,
            bytes memory calldata2,
            address routerAddress1,
            address routerAddress2
        ) = abi.decode(userData, (bytes, bytes, address, address));

        preLoanBalance = tokens[0].balanceOf(address(this));

        (bool call1 /* bytes memory data1 */, ) = routerAddress1.call(
            calldata1
        );
        require(call1, "1. Call Failed!");

        (bool call2 /* bytes memory data2 */, ) = routerAddress2.call(
            calldata2
        );
        require(call2, "2. Call Failed!");

        afterLoanBalance = tokens[0].balanceOf(address(this));
        require(afterLoanBalance > preLoanBalance, "It's Not Profiterol !");

        // Payback Tokens to Vault - As Token0
        tokens[0].transfer(
            0xBA12222222228d8Ba445958a75a0704d566BF2C8,
            amounts[0]
        );
    }

    // Balancer Flash Loan -----------------

    // Capitalized Arbitrage Bot Pool Swapper
    function CreateOneSecularPerson(
        address pool,
        address token,
        uint256 input,
        bytes calldata data
    ) external onlyOwner nonReentrant {
        require(
            IHorizon(token).transfer(pool, input),
            "CreateOneSecularPerson --> IHorizon(token).transfer(pool, input) is failed !"
        );

        (bool status, ) = pool.call(data);
        require(
            status,
            "CreateOneSecularPerson --> pool.call(data) is failed !"
        );
    }

    // Capitalized Arbitrage Bot Pool Swapper

    // Contract Functions
    function withdraw(
        address[] calldata tokens,
        uint256[] calldata amounts
    ) external onlyOwner nonReentrant {
        for (uint256 index = 0; index < tokens.length; index++) {
            IHorizon(tokens[index]).transfer(msg.sender, amounts[index]);
        }
    }

    function approver(
        address[] calldata tokens,
        address[] calldata pools
    ) public onlyOwner nonReentrant {
        for (uint256 index = 0; index < tokens.length; index++) {
            for (uint256 i = 0; i < pools.length; i++) {
                IHorizon(tokens[index]).approve(pools[i], type(uint256).max);
            }
        }
    }

    function getSelectorID(
        string calldata func
    ) public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes(func)));
    }

    // Contract Functions

    // ****
    // ********
    // ****************
    // *** V3 Callbacks ***

    // UniswapV3, QuickSwapUNIV3, DoveSwapV3, BlasterDexV3, MonoSwapV3, SushiSwapV3, Thruster03V3, CyberBlastV3
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {
        flashSwapExecutorV3(amount0Delta, amount1Delta, data);
    }

    // PancakeSwapV3, DackieSwapV3
    function pancakeV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {
        flashSwapExecutorV3(amount0Delta, amount1Delta, data);
    }

    // function pancakeV3SwapCallback(int256 amount0Delta, int256 amount1Delta, bytes calldata data) external {
    //     if (data.length > 0) {
    //         flashSwapExecutorV3(amount0Delta, amount1Delta, data);
    //     }
    // }

    // QuickSwapAlgebraV3
    function algebraSwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {
        flashSwapExecutorV3(amount0Delta, amount1Delta, data);
    }

    // RogueXV3
    function swapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {
        flashSwapExecutorV3(amount0Delta, amount1Delta, data);
    }

    // *** V3 Callbacks ***
    // ****************
    // ********
    // ****

    // ----------------------------------------------------------
    // ----------------------- Seperation -----------------------
    // ----------------------------------------------------------

    // ----
    // --------
    // ----------------
    // --- V2 Callbacks ---

    // UniswapV2
    function uniswapV2Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external {
        flashSwapExecutorV2(amount0, amount1, data);
    }

    // PancakeSwapV2
    function pancakeCall(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external {
        flashSwapExecutorV2(amount0, amount1, data);
    }

    // FlashLiquidityV2
    function flashLiquidityCall(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external {
        flashSwapExecutorV2(amount0, amount1, data);
    }

    // --- V2 Callbacks ---
    // ----------------
    // --------
    // ----

    // <<<<<<
    // <<<<<<<<<<<<
    // <<<<<<<<<<<<<<<<<<<<<<<<
    // <<< Flash Loan Callbacks <<<

    // function receiveFlashLoan(IHorizon[] memory tokens, uint256[] memory amounts, uint256[] memory feeAmounts, bytes memory userData) external { flashLoanExecutor(tokens, amounts, feeAmounts, userData); }

    // <<< Flash Loan Callbacks <<<
    // <<<<<<<<<<<<<<<<<<<<<<<<
    // <<<<<<<<<<<<
    // <<<<<<
}
