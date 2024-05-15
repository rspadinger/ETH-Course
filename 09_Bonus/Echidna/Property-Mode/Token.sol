//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Token {
    mapping(address => uint256) public balances;

    function airdrop() public {
        balances[msg.sender] = 1000;
    }

    function consume() public {
        require(balances[msg.sender] > 0);
        balances[msg.sender] -= 1;
    }

    function addToken() public {
        // error: missing require !!!
        //require(balances[msg.sender] < 1000);
        balances[msg.sender] += 1;
    }
}
