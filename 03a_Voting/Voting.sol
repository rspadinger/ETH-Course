// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Voting {

    //TODO Each voter needs to be granted access to vote and can only vote once for a specific proposal => index of array: 0, 1, 2...
    // Each proposal has an Id and holds the number of votes received

   
    //TODO During contract creation, all proposals (uint[]) are created, the contract owner is initialized
    //  and the end of the election (electionEndTime) is defined
    constructor ... {
        
    }

    //TODO only the contract owner can grant a user the right to vote and only before the electionEndTime 
    // revert with a custom error if the user has already voted - specify the address of the user
    function giveRightToVote ... {
        
    }

    //TODO everyone who has been granted the right to vote and has not already voted is allowed to vote, but only before electionEndTime
    // emit an event (UserHasVoted) that logs the address and the vote of the voter
    function vote ... {
        
    }

    //TODO anyone is allowed to check the current result of the election 
    // return winningProposalId and winningVoteCount
    function winningProposal() ... {
        
    }
}
