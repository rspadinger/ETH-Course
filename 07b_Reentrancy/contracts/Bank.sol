//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//### import contract
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//### inherit from ReentrancyGuard
contract Bank is ReentrancyGuard {
    mapping(address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    //### attach nonReentrant to protect against reentracy and use the check-Effects-Inteeeraction pattern
    function withdraw() external {
        //nonReentrant
        // Check
        uint depositedAmount = balanceOf[msg.sender];
        require(depositedAmount > 0);

        // Effects
        // balanceOf[msg.sender] = 0;

        // Interaction
        (bool success, ) = msg.sender.call{value: depositedAmount}("");

        balanceOf[msg.sender] = 0;

        //transfer method limits gas consumption in fallback function to 2300 units of gas =>
        //it is no longer recommended to use transfer
        //payable(msg.sender).transfer(depositedAmount);

        require(success, "Failed to send Ether");
    }
}
