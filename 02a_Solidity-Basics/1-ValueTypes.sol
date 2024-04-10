// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ValueTypes {
    //TODO Create various state variables for different value types: integer, boolean, address...
    
    //TODO Create a constructor that can receive ETH and that initializes the state variable 
    // that holds the address of the contract owner and some other state vaariables

    //TODO Create a function that changes one of the state variables  
    function changeValue(uint8 newValue) external {
    }

    //TODO Create a function that returns the balance of the contract
    function getContractBalance() external view returns(uint) {        
    }

    //TODO Create a function that allows to send the entire contract balance using transfer or send
    function transferETHWithSendOrTransfer() ... {
    } 

    //TODO Create a function that allows to send the entire contract balance using call
    function transferETHWithCall() ... { 
    }      
}