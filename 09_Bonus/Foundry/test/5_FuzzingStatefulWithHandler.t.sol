// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";

import "../src/5_FuzzingStatefulWithHandler.sol";
import "./handlers/Handler.sol";

contract BankTestWithHandler is Test {
    BankWithHandler bank;
    Handler handler;

    function setUp() external {
        bank = new BankWithHandler{value: 25 ether}();
        handler = new Handler(bank);

        // set the handler contract as the target for our test
        targetContract(address(handler));
    }

    function invariant_bankBalanceAlwaysGreaterEqualThanInitialBalance() external view {
        assert(address(bank).balance >= bank.initialBankBalance());
    }

    receive() external payable {}
}

//forge test --match-contract BankTestWithHandler --mt invariant_bankBalanceAlwaysGreaterEqualThanInitialBalance -vvvv
