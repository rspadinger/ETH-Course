// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ReferenceTypes {
    uint[] public myArray1 = [1, 2, 3];
    string public myString;

    struct Deposit {
        uint amount;
        uint timestamp;
    }

    mapping(address => uint) public balances;
    mapping(address => Deposit) public latestDeposit;

    function changeValues(string memory newString, uint index, uint newValue) external {
        myString = newString;

        uint[] storage myArray2 = myArray1;
        if (index >= myArray2.length) {
            myArray2.push(newValue);
        } else {
            myArray2[index] = newValue;
        }
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;

        latestDeposit[msg.sender] = Deposit(msg.value, block.timestamp);
    }

    //*******************************************************************************

    // Additional array features
    // Dynamic & Fixed State Variable (Storage)
    uint[] public arr1 = [1, 2, 3];
    uint[2] public arr2; // we can also assign values : [1,2];

    function testArray() public {
        // *** Modify State Variables
        arr1.push(4);
        //arr2.push(4); // ERROR!!!
        //delete arr1;
        //arr1[0] = 6; // ERROR!!! => use push()

        // *** Fixed Memory Array
        uint[3] memory arr3 = [21, 22, uint(23)]; // works only with memory
        //uint[] memory arr3 = new uint[](3); // works only with memory
        arr3[0] = 31;

        arr1 = arr3; // Memory to Storage
        //arr3 = arr1; // ERROR!!!

        uint[] memory arr4;
        arr4 = arr1; // this works
        arr4[0] = 7; // ERROR!!! if we don't use arr4=arr1 before
        //uint8[] memory arr5 = [21,22,23]; // ERROR!!!

        // *** Storage Array
        uint[] storage arr9 = arr1;
        arr9[0] = 5;

        //uint8[3] storage arr10 = [21,22,23]; // ERROR!!!
        //uint[] storage arr11 = new uint[](3); // ERROR!!!
        //uint[] storage arr12;
        //arr12[0] = 5; // ERROR!!!
    }
}
