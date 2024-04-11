//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}

//Remix London Accounts:

//1 : 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//2 : 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//3 : 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
