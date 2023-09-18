// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    bool public isReleased;

    constructor() payable {}

    function releaseFunds(address payee, uint amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient Funds!"); 
        
        isReleased = true;

        (bool success,) = payee.call{value: amount}("");
        require(success, "Transfer Failed!");
    }
}
