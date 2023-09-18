// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Events {
    mapping (address => uint) private balances; 

    event Deposit(address indexed from, uint amount); 

    event Received(address indexed from, uint amount);  

    function deposit() payable public {
        require(msg.value > 0, "No ETH was transferred");

        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}