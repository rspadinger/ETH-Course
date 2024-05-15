// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract BankWithHandler is Ownable {
    uint256 public initialBankBalance;
    mapping(address => uint256) public balances;

    constructor() payable Ownable(msg.sender) {
        initialBankBalance = msg.value;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "no balance");

        balances[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "failed to send");
    }

    function retrieveBankBalance() public {
        //error => test will fail !!!
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "failed to send");
    }
}
