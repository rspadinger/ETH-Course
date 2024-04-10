// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Solution_ValueTypes {
    uint256 public myValue;
    address private myAddress;

    constructor() payable {
        myAddress = msg.sender;
        myValue = 5;
    }

    function changeValue(uint newValue) external {
        myValue = newValue;
    }

    function withdraw(address withdrawAddress) external {
        (bool success, ) = withdrawAddress.call{value: address(this).balance}("");
        require(success, "Transfer Failed!");
    }
}
