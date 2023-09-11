//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract HelloWorld {
    string public message;

    event UpdateMessage(address indexed from, string oldStr, string newStr);

    constructor(string memory initMessage) {
        message = initMessage;
    }

    function updateMessage(string memory newMessage) public {
        string memory oldMsg = message;
        message = newMessage;
        emit UpdateMessage(msg.sender, oldMsg, newMessage);
    }
}
