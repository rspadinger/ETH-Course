// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Solution_ReferenceTypes {
    int[] public arr1 = [-1, 0, 1];

    struct Voter {
        bool hasAlreadyVoted;
        uint vote;
    }

    mapping(address => Voter) public voters;

    function changeValues(uint index, int newValue) external {
        int[] storage arr2 = arr1;
        if (index >= arr2.length) {
            arr2.push(newValue);
        } else {
            arr2[index] = newValue;
        }
    }

    function vote(uint userVote) external {
        //cheap
        Voter storage myVote = voters[msg.sender];
        myVote.hasAlreadyVoted = true;
        myVote.vote = userVote;

        //expensive
        // Voter memory myVote;
        // myVote.hasAlreadyVoted = true;
        // myVote.vote = userVote;
        // voters[msg.sender] = myVote;
    }
}
