// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ValueTypes {
    enum Direction {Left, Right}

    uint private myUint256;
    uint8 public myUint8 = 1;
    int public myInt256 = -1;
    bool public myBoolean;
    address public myAddress;
    bytes1 public b1;
    Direction public dir;

    constructor() payable {
        myAddress = msg.sender;
        myBoolean = true;
        b1 = 0x05;
        dir = Direction.Left;
    }
    
    function changeValue(uint8 newValue) external {
        myUint8 = newValue + 1;

        // unchecked {
        //     myUint8 = newValue + 1;
        // }
    }

    function getContractBalance() external view returns(uint) {
        return address(this).balance;
    }

    function transferETHWithSendOrTransfer() external {    
        payable(myAddress).transfer(address(this).balance);
    } 

    function transferETHWithCall() external { 
        //recommended way to transfer funds
        (bool success,) = myAddress.call{value: address(this).balance}("");
        require(success, "Transfer Failed!");
    }      
}