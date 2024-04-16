// SPDX-License-Identifier: MIT
//https://solidity-by-example.org/app/crowd-fund/

// User creates a campaign.
// Users can pledge, transferring their token to a campaign.
// After the campaign ends, campaign creator can claim the funds if total amount pledged is more than the campaign goal.
// Otherwise, campaign did not reach it's goal, users can withdraw their pledge.

pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//TODO create an ERC20 token (CrowdFundToken) and mint 1000 tokens for the owner/deployer and 100 tokens for three differnt users 
contract CrowdFundToken...

contract CrowdFund {
    CrowdFundToken public immutable token; 

    //TODO crowd fund campaigns should have the following properties: 
    //creator of the campaign, a target amount for the campaign, total amount of the collected funds, 
    //start time and end time of the campaign and an indicator if the collected funds have been claimed by the owner

    //TODO state variables : 
    //total number of created campaigns, access to individual campaigns (by id)
    //access to the funds raised for each individual campaign and for each campaign sponsor => 
    //Hint: mapping of a mapping => mapping from campaign id => pledger => amount pledged

    //TODO create the following campaign events - each with appropriate args for various campaign properties
    // Launch , Cancel , Fund , UnFund , ClaimFunds , RefundInvestor 

    //TODO setup the token contract in the constructor    

    //TODO launch a new campaign with a specific target amount
    //the campaign should start immediately
    function launch... {        
    }

    //TODO cancel a specific campaign (by id) - only the campaign owner is allowed to cancel the campaign    
    function cancel... {        
    }

    //TODO investors can fund a specific campaign with a specific amaount (in CrowdFundToken tokens) as long as the campaign has not ended
    //the specified amount for the campaign funding will be transferred from the investor balance of the CrowdFundToken contract to the crowd funding contract
    function fund... {        
    }

    //TODO investors can undund a specific amount ( <= initially funded amount) from a specific campaign as long as the campaign has not ended
    //the specified amount (in CrowdFundToken) will be transferred from the CrowdFund contract to the investor  
    function unfund... {        
    }

    //TODO once a campaign has ended and the goal has been reached, the campaign creater can claim the collected funds
    //the funds (in CrowdFundToken) will be transferred from the CrowdFund contract to the campaign owner
    function claim(uint256 _id) external {        
    }

    //TODO once a specific campaign has ended and the campaign goal has not been reached, the investors can ask for a refund of their invested funds
    function refund(uint256 _id) external {        
    }
}

//Remix addresses
//A1 - deployer : 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//A2 : 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//A3 : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
//A4 : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
//CrowdFund (replace) : 0x58b9bDaA6E3464f703550722109877D600DE24EC
