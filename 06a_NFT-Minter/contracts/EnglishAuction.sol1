// SPDX-License-Identifier: MIT
//https://solidity-by-example.org/app/english-auction/

// Auction :
// Seller of NFT deploys this contract.
// Auction lasts for 7 days.
// Participants can bid by depositing ETH greater than the current highest bidder.
// All bidders can withdraw their bid if it is not the current highest bid.

// After the auction :
// Highest bidder becomes the new owner of NFT.
// The seller receives the highest bid of ETH.

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//TODO create NFT contract and mint 1 NFT (id = 1) for the owner/deployer of the contract
contract MyNFT...

contract EnglishAuction {    
    uint256 public constant nftId = 1; // we only have one NFT
    MyNFT public immutable nft;

    //TODO store the following information: end time of auction, has the auction ended, has the auction started, seller of the NFT
    // current highest bidder and current highest bid
    // list of all bids

    //TODO create event sfor: start of the auction, end of the auction (with winner and amount of the bid), 
    // when someone places a bid, when someone withdraws a bid

    //TODO initialize the NFT contract, the initial seller (owner of this contract)
    // initialize a start value for the highest bid
    constructor... {
    }

    //TODO start the auction - can only be called by the contract owner
    // transfer the NFT to this contract and set an end time for the auction
    function start... {
        
    }

    //TODO allow participants to bid (send ETH) - only once the auction has started and only before it has ended
    //the bid of the user must be higher than the current highest bid
    //if necessary, update the list of bids so that the previous highest bidder can withdraw his bid    
    function bid... {        
    }

    //TODO allow users to withdraw their bid if they are no longer the highest bidder
    function withdraw... {
    }

    //TODO end the auction - can be called by anyone, but only once the auction has ended
    //this function cannot be called a second time
    //transfer the NFT to the highest bidder and the highest bid (ETH) to the seller of the NFT
    //if there is no highest bidder (no one placed a bid), transfer the NFT back to the seller (owner of this contract)
    function end... {
        
    }
}
