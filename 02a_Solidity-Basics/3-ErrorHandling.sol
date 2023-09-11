// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ErrorHandling { 

    uint private valueThatNeverChanges = 1;

    //TODO Create a custom error (WrongAmount) that returns the amount provided by the user
    /// the provided amount for the purchase is incorrect
    /// the product costs 1 ETH
    /// @param provided The amount provided by the user
    

    //TODO Create a function that reverts (using require) if the transferred value is different than 1 ETH
    function buySomethingFor1ETH_Require() public payable {       
                
        // code to perform the purchase...
    }

    //TODO Create a function that reverts (using the custom error) if the transferred value is different than 1 ETH
    function buySomethingFor1ETH_Revert() public payable {        
                        
        // code to perform the purchase...
    }

    //TODO Create a function that uses an assert statement to check the value of an invariant
    function checkInvariant() public  {        
        // bad code that needs to be fixed...
        valueThatNeverChanges = 2;
                
        // code continues...
    }
}