//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//### import contract
//import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//### inherit from ReentrancyGuard
contract Bank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    //### attach nonReentrant to protect against reentracy and use the check-Effects-Interaction pattern
    function withdraw() external {
        // Check
        uint depositedAmount = balances[msg.sender];
        require(depositedAmount > 0, "Sorry, no funds available!");

        // Effects
        // balances[msg.sender] = 0;

        // Interaction
        (bool success, ) = msg.sender.call{value: depositedAmount}("");
        require(success, "Failed to send Ether");

        balances[msg.sender] = 0;

        //transfer method limits gas consumption in fallback function to 2300 units of gas =>
        //it is no longer recommended to use transfer
        //payable(msg.sender).transfer(depositedAmount);
    }
}
