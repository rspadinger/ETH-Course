const { expect } = require("chai")
const { loadFixture, setBalance } = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

describe("MyToken contract", function () {
    async function deployContractFixture() {
        //### return 2 accounts and contract
    }

    describe("Testing Hardhat Chai Matchers", function () {
        it("Should return correct token balance for user after transfer of 10 MT", async function () {})

        it("Should return correct ETH account balance for user after calling setBalance", async function () {
            //initial ETH account balance: 10000
        })

        it("Should revert when transferring tokens to zero address", async function () {
            //revert message: "ERC20: transfer to the zero address"
        })

        it("Should emit a Transfer event on token transfer", async function () {})

        it("Should change token balance after transfer", async function () {})
    })

    describe("Testing Hardhat Network Helpers", function () {
        it("Should return correct token supply", async function () {})

        it("Should attribute totalSupply to deployer account ", async function () {})
    })
})
