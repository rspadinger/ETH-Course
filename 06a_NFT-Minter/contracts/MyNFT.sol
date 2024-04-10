// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//TODO import ERC721URIStorage contract

import "@openzeppelin/contracts/utils/Counters.sol"; //provides increment() & current() methods
import "@openzeppelin/contracts/access/Ownable.sol"; //adds onlyOwner modifier

//TODO create an ownable ERC721URIStorage token
contract MyNFT {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //TODO token name and symbol: "MyNFT", "MNFT"
    constructor() {}

    //TODO can only be called by the token owner
    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        //TODO use the counter to increment the token Id
        //TODO mint a token with the correct (current) token Id => _mint
        //TODO set the tokenUri for the newly minted NFT and return the token Id => _setTokenURI
    }
}
