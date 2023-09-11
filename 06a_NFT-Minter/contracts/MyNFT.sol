// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//create an ownable ERC721URIStorage token
contract MyNFT {
    //use the Counter tool from OZ to keep track of the NFT Id's

    //token name and symbol: "MyNFT", "MNFT"
    constructor() {}

    //can only be called by the token owner
    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        //use the counter to increment the token Id
        //mint a token with the correct (incremented) token Id => _mint
        //set the tokenUrl for the newly minted NFT and return the token Id => _setTokenURI
    }
}
