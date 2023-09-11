// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 public totalFunds;
    bool public isReleased;

    constructor() payable {
        totalFunds = msg.value;
        isReleased = false;
    }

    function releaseFunds(address payee) public onlyOwner {
        isReleased = true;
        payable(payee).transfer(totalFunds);
    }
}
