// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Functions {
    uint public value;
    address public owner;
    uint public timeLimit;
    
    //TODO Create 2 modifiers: One that provides access only to the contract owner 
    // and one that allows the execution of a function only after a specific time in the future


    //TODO Add a constructor that initializes the contract owner and a timeLimit variable to 1 minute after the deployment of the contract
    

    //TODO Create a function (changeValue) that changes the value of a state variable (value) and 
    // that can only be executed by the contract owner and earliest 1 minute after deployment of the contract
    

    //TODO Create a function (multiplyValue) that takes a uint as argument and
    // returns the product of the argument and the "value" state variable
    

    //TODO Create a function (addAndMultiply) that takes 2 uint's as arguments and 
    // returns the product and the sum of those arguments


    //TODO add a simple fallback function that changes "value" to 10
    
}