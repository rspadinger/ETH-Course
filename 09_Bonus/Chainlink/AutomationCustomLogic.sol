// SPDX-License-Identifier: MIT

//Register Upkeep : https://automation.chain.link/

pragma solidity 0.8.20;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract Counter is AutomationCompatibleInterface {
    uint256 public counter;
    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    constructor(uint256 updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        counter = 0;
    }

    // checkData : provided during upkeep registration - not required
    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        //this function is executed off-chain => do some gas-intesive calculations here to save gas
        performData = abi.encodePacked(uint256(999)); // bytes("some gas intesive tasks here - if required...");
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata performData) external override {
        //if required, we can use the result of our off-chain calculations (from checkUpkeep) here
        uint256 result = uint256(bytes32(performData));

        if ((block.timestamp - lastTimeStamp) > interval && result == 999) {
            lastTimeStamp = block.timestamp;
            counter = counter + 1;
        }
    }
}
