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

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "NFT") {
        _mint(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 1);
    }
}

contract EnglishAuction {
    MyNFT public immutable nft;
    uint256 public nftId;

    address payable public seller;
    uint256 public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint256 public highestBid;

    mapping(address => uint256) public bids;

    event Start();
    event Bid(address indexed sender, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);
    event End(address winner, uint256 amount);

    constructor(address _nft) {
        nft = MyNFT(_nft);
        nftId = 1;

        seller = payable(msg.sender);
        highestBid = 5;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 10 minutes;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        //previous highest bidder can withdraw
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint256 bal = bids[msg.sender];
        require(bal < highestBid, "Highest bidder cannot withdraw");

        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;

        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
