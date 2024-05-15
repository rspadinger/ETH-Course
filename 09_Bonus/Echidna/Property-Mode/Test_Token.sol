//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "token.sol";

contract Test_Token is Token {
    address echidna_caller = msg.sender;

    constructor() public {
        balances[echidna_caller] = 0;
    }

    function echidna_test_balance() public view returns (bool) {
        return balances[echidna_caller] <= 1000;
    }
}

// echidna Test_Token.sol --config config.yaml
