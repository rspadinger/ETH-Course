// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ReferenceTypes {   
    uint[] public myArray1 = [1,2,3];
    string public myString;

    struct Deposit {
        uint amount;
        uint timestamp;
    }

    mapping(address => uint) public balances;
    mapping(address => Deposit) public latestDeposit;    
    
    function changeValues(string memory newString, uint index, int newValue) external {  
        myString = newString;

        uint[] storage myArray2 = myArray1;
        if(index >= arr2.length) {
            myArray2.push(newValue);
        } else {
            myArray2[index] = newValue; 
        }                
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;

        latestDeposit[msg.sender] = Deposit(msg.value, block.timestamp);
    }
}