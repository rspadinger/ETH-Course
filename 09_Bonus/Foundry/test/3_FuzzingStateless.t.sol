// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import "../src/3_FuzzingStateless.sol";

contract SimpleDappTest is Test {
    SimpleDapp simpleDapp;
    address public user;

    function setUp() public {
        simpleDapp = new SimpleDapp();
        user = address(this);
    }

    function test_DepositAndWithdraw(uint256 depositAmount, uint256 withdrawAmount) public payable {
        // Ensure the user has enough Ether to cover the deposit
        uint256 initialBalance = 100 ether;
        vm.deal(user, initialBalance);
        vm.deal(address(simpleDapp), initialBalance);

        if (depositAmount <= initialBalance) {
            simpleDapp.deposit{value: depositAmount}();

            if (withdrawAmount <= depositAmount) {
                simpleDapp.withdraw(withdrawAmount);

                assertEq(
                    simpleDapp.balances(user),
                    depositAmount - withdrawAmount,
                    "Balance after withdrawal should match expected value"
                );
            } else {
                // Expect a revert due to insufficient balance
                vm.expectRevert("Insufficient balance");
                simpleDapp.withdraw(withdrawAmount);
            }
        }
    }

    receive() external payable {}
}

//forge test --match-contract SimpleDappTest
