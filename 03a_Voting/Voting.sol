// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Voting {
    address public owner;
    uint public electionEndTime;

    struct Voter {
        bool allowedToVote;
        bool voted;
        uint vote;
    }

    struct Proposal {
        uint id;
        uint voteCount;
    }

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    event UserHasVoted(address indexed voter, uint proposal);

    ///The user has already voted
    error UserHasAlreadyVoted(address voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized to perform this action");
        _;
    }

    modifier onlyBefore(uint time) {
        require(block.timestamp < time, "Too late!");
        _;
    }

    constructor(uint[] memory proposalIds, uint electionDuration) {
        owner = msg.sender;
        electionEndTime = block.timestamp + electionDuration;
        voters[owner].allowedToVote = true;

        for (uint i = 0; i < proposalIds.length; i++) {
            proposals.push(Proposal(proposalIds[i], 0));
        }
    }

    function giveRightToVote(address voter) external onlyOwner {
        if (voters[voter].voted) revert UserHasAlreadyVoted(voter);
        voters[voter].allowedToVote = true;
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.allowedToVote == true, "Has no right to vote");
        if (sender.voted) revert UserHasAlreadyVoted(msg.sender);

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += 1;

        emit UserHasVoted(msg.sender, proposal);
    }

    function winningProposal() public view returns (uint winningProposalId, uint winningVoteCount) {
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalId = proposals[p].id;
            }
        }
    }
}
