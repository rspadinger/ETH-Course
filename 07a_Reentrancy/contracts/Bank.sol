//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Bank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint depositedAmount = balances[msg.sender];

        require(depositedAmount > 0, "Sorry, no funds available!");

        (bool success, ) = msg.sender.call{value: depositedAmount}("");
        require(success, "Failed to send Ether");

        balances[msg.sender] = 0;
    }
}
