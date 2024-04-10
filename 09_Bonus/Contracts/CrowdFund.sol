// SPDX-License-Identifier: MIT
//https://solidity-by-example.org/app/crowd-fund/

// User creates a campaign.
// Users can pledge, transferring their token to a campaign.
// After the campaign ends, campaign creator can claim the funds if total amount pledged is more than the campaign goal.
// Otherwise, campaign did not reach it's goal, users can withdraw their pledge.

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MT") {
        uint256 userAmount = 50;
        _mint(msg.sender, 1000);
        _mint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, userAmount);
        _mint(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, userAmount);
        _mint(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB, userAmount);
    }
}

contract CrowdFund {
    MyToken public immutable token;

    struct Campaign {
        // Creator of campaign
        address creator;
        // Amount of tokens to raise
        uint256 goal;
        // Total amount pledged
        uint256 pledged;
        // Timestamp of start of campaign
        uint32 startAt;
        // Timestamp of end of campaign
        uint32 endAt;
        // True if goal was reached and creator has claimed the tokens.
        bool claimed;
    }

    // Total count of campaigns created.
    // It is also used to generate id for new campaigns.
    uint256 public count;
    // Mapping from id to Campaign
    mapping(uint256 => Campaign) public campaigns;
    // Mapping from campaign id => pledger => amount pledged
    mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

    event Launch(uint256 id, address indexed creator, uint256 goal, uint32 startAt, uint32 endAt);
    event Cancel(uint256 id);
    event Pledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Unpledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Claim(uint256 id);
    event Refund(uint256 id, address indexed caller, uint256 amount);

    constructor(address _token) {
        token = MyToken(_token);
    }

    function launch(uint256 _goal) external {
        uint32 _startAt = uint32(block.timestamp);
        uint32 _endAt = uint32(block.timestamp + 1 hours);

        require(_startAt >= block.timestamp, "start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 90 days, "end at > max duration");

        count += 1;

        campaigns[count] = Campaign({
            creator: msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false
        });

        emit Launch(count, msg.sender, _goal, _startAt, _endAt);
    }

    function cancel(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(block.timestamp < campaign.startAt, "started");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint256 _id, uint256 _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "not started");
        require(block.timestamp <= campaign.endAt, "ended");

        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;

        token.transferFrom(msg.sender, address(this), _amount);

        emit Pledge(_id, msg.sender, _amount);
    }

    function unpledge(uint256 _id, uint256 _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.endAt, "ended");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit Unpledge(_id, msg.sender, _amount);
    }

    function claim(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender, "not creator");
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged >= campaign.goal, "pledged < goal");
        require(!campaign.claimed, "claimed");

        campaign.claimed = true;
        token.transfer(campaign.creator, campaign.pledged);

        emit Claim(_id);
    }

    function refund(uint256 _id) external {
        Campaign memory campaign = campaigns[_id];
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged < campaign.goal, "pledged >= goal");

        uint256 bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, bal);

        emit Refund(_id, msg.sender, bal);
    }
}

//Remix London addresses
//A1 - deployer : 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//A2 : 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//A3 : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
//A4 : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
//CrowdFund (replace) : 0x58b9bDaA6E3464f703550722109877D600DE24EC
