// SPDX-License-Identifier: MIT

//Deploy contract => specify 100 as constructor argument
//Call withdraw with: 10,[10,15,30,35,50,60,67,70,90]
//Register Upkeep : https://automation.chain.link/ =>
//checkdata: 0x0000000000000000000000000000000000000000000000000000000000000064

pragma solidity 0.8.20;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract BalancerOffChain is AutomationCompatibleInterface {
    uint256 public constant LIMIT = 100;
    uint256 public size;
    uint256[] public balances;
    uint256 public liquidity = 100000000;

    // test with a value of 100
    constructor(uint256 _size) {
        // On the initialization of the contract, all the elements have a balance equal to the limit
        size = _size;
        for (uint256 i = 0; i < size; i++) {
            balances.push(LIMIT);
        }
    }

    /// @dev called to increase the liquidity of the contract
    function addLiquidity(uint256 liq) public {
        liquidity += liq;
    }

    /// @dev withdraw an `amount`from multiple elements of the `balances` array. The elements are provided in `indexes`
    /// 10,[10,15,30,35,50,60,67,70,90] => to unbalance the contract & to trigger the upkeep
    function withdraw(uint256 amount, uint256[] memory indexes) public {
        for (uint256 i = 0; i < indexes.length; i++) {
            require(indexes[i] < balances.length, "Provided index out of bound");
            balances[indexes[i]] -= amount;
        }
    }

    /* @dev `checkData` is encoded binary data which contains the size of the balances array on which to perform the computation
     * if we specify 100 elements in th econstructot => abi.encode(100)
     * 0x0000000000000000000000000000000000000000000000000000000000000064
     *  @dev `performData` contains an array of indexes that require rebalancing and their increments. This will be used in `performUpkeep`
     */
    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        // perform the computation on the `balances` array.
        uint256 arrayElements = abi.decode(checkData, (uint256));

        require(arrayElements == balances.length, "Number of arrayElements is incorrect");

        // first get number of elements requiring updates
        uint256 counter;
        for (uint256 i = 0; i < arrayElements; i++) {
            if (balances[i] < LIMIT) {
                // if one element has a balance < LIMIT then rebalancing is needed
                upkeepNeeded = true;
                counter++;
            }
        }

        // initialize array of elements requiring increments as long as the increments
        uint256[] memory indexes = new uint256[](counter);
        uint256[] memory increments = new uint256[](counter);

        uint256 indexCounter;

        for (uint256 i = 0; i < arrayElements; i++) {
            if (balances[i] < LIMIT) {
                // store the index which needs increment as long as the increment
                indexes[indexCounter] = i;
                increments[indexCounter] = LIMIT - balances[i];
                indexCounter++;
            }
        }

        performData = abi.encode(indexes, increments);

        return (upkeepNeeded, performData);
    }

    /* @dev increase all elements whose balances are lower than the LIMIT.
     * @dev `performData` is encoded binary data which contains the array size
     * on which to perform the computation. It also contains the increments
     */
    function performUpkeep(bytes calldata performData) external override {
        (uint256[] memory indexes, uint256[] memory increments) = abi.decode(performData, (uint256[], uint256[]));

        uint256 _balance;
        uint256 _liquidity = liquidity;

        for (uint256 i = 0; i < indexes.length; i++) {
            _balance = balances[indexes[i]] + increments[i];
            _liquidity -= increments[i];
            balances[indexes[i]] = _balance;
        }

        liquidity = _liquidity;
    }
}
