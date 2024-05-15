// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;

        //error => test will fail !!!
        number++;
    }
}

//Configure PK_SEPOLIA in .bash_profile (C:/User/USERNAME/) => export PK_SEPOLIA="0x77..."
//echo $PK_SEPOLIA

//for verification => delete cache & out directories !
//forge create --rpc-url sepolia --private-key $PK_SEPOLIA --etherscan-api-key sepolia --verify src/1_BasicTest.sol:Counter
