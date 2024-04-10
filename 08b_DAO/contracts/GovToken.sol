// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovToken is ERC20Votes {
    constructor() ERC20("GovToken", "GT") ERC20Permit("GovToken") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
