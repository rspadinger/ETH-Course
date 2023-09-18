// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Voting {
    address public owner;
    uint public electionEndTime;
    bool public electionHasEnded;

    struct Voter {
        bool isAllowedToVote;
        bool hasAlreadyVoted;
        uint vote;
    }

    struct Proposal {
        uint proposalIndex;
        uint voteCount;
    }

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    event UserHasVoted(address indexed voter, uint proposalIndex);
    event ElectionEnded(uint winningProposalIndex, uint winningVoteCount);

    ///The user has already voted
    error UserHasAlreadyVoted(address voter);
    ///The end of the election has already been callled
    error EndElectionAlreadyCalled();

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized to perform this action");
        _;
    }

    modifier onlyBefore(uint time) {
        require(block.timestamp < time, "Too late!");
        _;
    }

    modifier onlyAfter(uint time) {
        require(block.timestamp > time, "Too early!");
        _;
    }

    constructor(uint numberOfProposals, uint votingTime) {
        owner = msg.sender;
        voters[owner].isAllowedToVote = true;
        electionEndTime = block.timestamp + votingTime;

        for (uint i = 0; i < numberOfProposals; i++) {
            proposals.push(Proposal(i, 0));
        }
    }

    function giveRightToVote(address voter) external onlyOwner onlyBefore(electionEndTime) {
        if (voters[voter].hasAlreadyVoted) revert UserHasAlreadyVoted(voter);
        voters[voter].isAllowedToVote = true;
    }

    function vote(uint proposalIndex) external onlyBefore(electionEndTime) {
        require(proposalIndex < proposals.length, "The specified proposal does not exist");

        Voter storage currentVoter = voters[msg.sender];
        require(currentVoter.isAllowedToVote, "Has no right to vote");
        if (currentVoter.hasAlreadyVoted) revert UserHasAlreadyVoted(msg.sender);

        currentVoter.hasAlreadyVoted = true;
        currentVoter.vote = proposalIndex;
        proposals[proposalIndex].voteCount += 1;

        emit UserHasVoted(msg.sender, proposalIndex);
    }

    function winningProposal() public view returns (uint winningProposalIndex, uint winningVoteCount) {
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalIndex = proposals[p].proposalIndex;
            }
        }
    }

    function endElection() external onlyOwner onlyAfter(electionEndTime) {
        if (electionHasEnded) revert EndElectionAlreadyCalled();

        electionHasEnded = true;
        (uint winningProposalIndex, uint winningVoteCount) = winningProposal();
        emit ElectionEnded(winningProposalIndex, winningVoteCount);
    }
}
