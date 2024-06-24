// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import "../src/4_FuzzingStateful.sol";

contract BankTest is Test {
    Bank bank;

    function setUp() external {
        bank = new Bank{value: 25 ether}();
        targetContract(address(bank));
    }

    function invariant_alwaysWithdrawable() external payable {
        vm.startPrank(address(0xaa));
        vm.deal(address(0xaa), 10 ether);

        bank.deposit{value: 1 ether}();
        uint256 balanceBefore = bank.balances(address(0xaa));
        assertEq(balanceBefore, 1 ether);

        bank.withdraw();
        uint256 balanceAfter = bank.balances(address(0xaa));
        assertEq(balanceAfter, 0);
        vm.stopPrank();
    }

    receive() external payable {}
}

//forge test --match-contract BankTest --mt invariant_alwaysWithdrawable
