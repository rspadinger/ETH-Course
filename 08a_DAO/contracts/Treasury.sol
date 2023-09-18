// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//TODO make this contract Ownable
contract Treasury {
    //TODO define public state variable: isReleased

    //TODO contract receives funds during deployment 

    //TODO only the owner can call this => 
    // make sure "amount is available, modify isReleased flag & send funds
    function releaseFunds(address payee, uint amount) public {}
}
