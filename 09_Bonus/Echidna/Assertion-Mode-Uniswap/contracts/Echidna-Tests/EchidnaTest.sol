//solc-select install 0.6.0
//solc-select use 0.6.0
//echidna contracts/Echidna-Tests/EchidnaTest.sol --contract EchidnaTest --config contracts/Echidna-Tests/config.yaml

// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.6.0;

import "./Setup.sol"; // create a Pool (UniV2-Pair) with 2 UniV2-ERC20 tokens
import "../libraries/UniswapV2Library.sol";

//import "hardhat/console.sol";

contract EchidnaTest is Setup {
    event AmountsIn(uint amount0, uint amount1);
    event AmountsOut(uint amount0, uint amount1);
    event BalancesBefore(uint balance0, uint balance1);
    event BalancesAfter(uint balance0, uint balance1);
    event ReservesBefore(uint reserve0, uint reserve1);
    event ReservesAfter(uint reserve0, uint reserve1);
    event PairBalance(uint balance);

    //Invariant 1 : when we add liquidity to the pool, our stack of LP tokens needs to increase
    //Invariant 2 : when we add liquidity to the pool, k needs to increase
    function testProvideLiquidity(uint amount0, uint amount1) public {
        // Preconditions: add at least 1000 wei
        amount0 = _between(amount0, 1000, uint(-1));
        amount1 = _between(amount1, 1000, uint(-1));

        if (!completed) {
            //mint test tokens to user
            _init();
        }

        //// State before
        uint lpTokenBalanceBefore = pair.balanceOf(address(user));
        (uint reserve0Before, uint reserve1Before, ) = pair.getReserves();
        uint kBefore = reserve0Before * reserve1Before;

        //// Transfer tokens to UniswapV2Pair contract
        (bool success1, ) = user.proxy(
            address(testToken1),
            abi.encodeWithSelector(testToken1.transfer.selector, address(pair), amount0)
        );
        (bool success2, ) = user.proxy(
            address(testToken2),
            abi.encodeWithSelector(testToken2.transfer.selector, address(pair), amount1)
        );

        require(success1 && success2);

        // Action:
        //The mint() function calculates the amount of minted LP tokens from the difference of:
        //recorded reserves of the underlying tokens (_reserve0 and _reserve1)
        //and the actual underlying token balance owned by the pair contract (balance0 and balance1)
        //we need to specify the function selector for mint(...) ourself, because the pair contract
        //defines 2 different mint functions => we want to call the mint function with only 1 argument
        //if we would use something like: pair.mint.selector - the compiler would get confused, because there are 2 mint functions
        (bool success3, ) = user.proxy(
            address(pair),
            abi.encodeWithSelector(bytes4(keccak256("mint(address)")), address(user))
        );

        // Postconditions => check invariants
        if (success3) {
            uint lpTokenBalanceAfter = pair.balanceOf(address(user));
            (uint reserve0After, uint reserve1After, ) = pair.getReserves();
            uint kAfter = reserve0After * reserve1After;

            assert(lpTokenBalanceAfter > lpTokenBalanceBefore);
            assert(kAfter > kBefore);
        }
    }
}
