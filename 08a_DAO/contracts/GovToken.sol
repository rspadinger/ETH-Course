// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract GovToken {
    //provide name, symbol and initial token supply in the constructor
    //mint the initial supply to the owner
    //we also need to call the ERC20Permit constructor with the token name argument
    //otherwise we get a missing implementation error (abstract contract)
    constructor() {}
}
