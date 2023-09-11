// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract C1 {
    function f1() private pure returns(uint) {
        return 11;
    }

    function f2() public pure virtual returns(uint) {
        return f1() + 1;
    }

    function f3() public pure virtual returns(uint) {
        return 13;
    }
}

//TODO Create a contract C2 that inherits from the existing contract C1 and overrides the function f3


//TODO Create a contract C3 that defines a function f2 with the same signature as the one defined in C1


//TODO Create a contract C4 that inherits from C2 and C3 (in that order)
contract C4 is C2, C3 {   
    

    //TODO Add a function (callF3) to C4 that returns the result of f3 – what is the return value and why?
    

    //TODO Add a function (callSuperF3) to C4 that returns the result of the call to: 
    // super.f3() – what is the return value and why?
    
}