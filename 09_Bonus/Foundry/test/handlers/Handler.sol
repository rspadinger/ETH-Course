// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../../src/5_FuzzingStatefulWithHandler.sol";

contract Handler is Test {
    BankWithHandler bank;
    bool canWithdraw;

    constructor(BankWithHandler _bank) {
        bank = _bank;
        vm.deal(address(this), 100 ether);
    }

    function deposit() external payable {
        uint256 amount = msg.value;
        vm.assume(amount > 10); //use assume only for narrow checks => amount > 10 wei
        amount = bound(amount, 1 ether, 100 ether); //use bound for broader checks

        bank.deposit{value: amount}();

        canWithdraw = true;
    }

    function withdraw() external {
        if (canWithdraw) bank.withdraw();
    }

    function retrieveBankBalance() public {
        bank.retrieveBankBalance();
    }

    receive() external payable {}
}
