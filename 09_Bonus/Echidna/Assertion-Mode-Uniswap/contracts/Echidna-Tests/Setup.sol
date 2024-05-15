// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.6.0;

import "../uni-v2/UniswapV2ERC20.sol";
import "../uni-v2/UniswapV2Pair.sol";
import "../uni-v2/UniswapV2Factory.sol";
import "../libraries/UniswapV2Library.sol";

// external testing => this is our middleman
contract Users {
    function proxy(address target, bytes memory data) public returns (bool success, bytes memory retData) {
        return target.call(data);
    }
}

contract Setup {
    UniswapV2Factory factory;
    UniswapV2Pair pair;
    UniswapV2ERC20 testToken1;
    UniswapV2ERC20 testToken2;
    Users user;
    bool completed;

    //create a UniV2 Pair (Pool) and approve both pair tokens for the LP
    constructor() public {
        //required to create a pair token for a new LP
        testToken1 = new UniswapV2ERC20();
        testToken2 = new UniswapV2ERC20();
        factory = new UniswapV2Factory(address(this));
        pair = UniswapV2Pair(factory.createPair(address(testToken1), address(testToken2)));

        // Sort the test tokens we just created, used to handle return values from pairs sorted in this order
        (address testTokenA, address testTokenB) = UniswapV2Library.sortTokens(
            address(testToken1),
            address(testToken2)
        );
        testToken1 = UniswapV2ERC20(testTokenA);
        testToken2 = UniswapV2ERC20(testTokenB);

        //a simple proxy to call a specific function on the specified contract => approve max amount of tokens for Pair
        user = new Users();
        user.proxy(address(testToken1), abi.encodeWithSelector(testToken1.approve.selector, address(pair), uint(-1)));
        user.proxy(address(testToken2), abi.encodeWithSelector(testToken2.approve.selector, address(pair), uint(-1)));
    }

    function _init() internal {
        testToken1.mint(address(user), uint(-1));
        testToken2.mint(address(user), uint(-1));
        completed = true;
    }

    // set input value to a specific range
    function _between(uint val, uint low, uint high) internal pure returns (uint) {
        return low + (val % (high - low + 1));
    }
}
