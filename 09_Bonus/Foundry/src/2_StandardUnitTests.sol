// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error MintPriceNotPaid();
error MaxSupplyReached();
error NonExistentTokenURI();
error NoFundsAvailable();

contract NFT is ERC721, Ownable {
    using Strings for uint256;
    string public baseURI;
    uint256 public currentTokenId;
    uint256 public constant TOTAL_SUPPLY = 10_000;
    uint256 public constant MINT_PRICE = 0.08 ether;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    function mintTo(address recipient) public payable returns (uint256) {
        if (msg.value != MINT_PRICE) {
            revert MintPriceNotPaid();
        }

        uint256 newTokenId = currentTokenId + 1;
        if (newTokenId > TOTAL_SUPPLY) {
            revert MaxSupplyReached();
        }

        currentTokenId = newTokenId;
        _safeMint(recipient, newTokenId);

        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert NonExistentTokenURI();
        }

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function withdrawPayments(address payable payee) external onlyOwner {
        if (address(this).balance == 0) {
            revert NoFundsAvailable();
        }

        payee.transfer(address(this).balance);
    }
}

//for verification => delete cache & out directories !
//forge create --rpc-url sepolia --private-key $PK_SEPOLIA --constructor-args "My NFT" "MNFT" "baseUri" --etherscan-api-key sepolia --verify src/2_StandardUnitTests.sol:NFT

//cast send --rpc-url=sepolia --private-key=$PK_SEPOLIA "0xB41555e4b40c7041726d323B443e6b6670Ab623f" "mintTo(address)" "0xB1b504848e1a5e90aEAA1D03A06ECEee55562803"
//cast call --rpc-url=sepolia "0xB41555e4b40c7041726d323B443e6b6670Ab623f" "ownerOf(uint256)" 1
