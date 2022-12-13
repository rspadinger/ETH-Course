const { expect } = require("chai")
const { loadFixture, setBalance } = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

describe("MyToken contract", function () {
    async function deployContractFixture() {
        const [deployer, user] = await ethers.getSigners()

        const MyTokenFactory = await ethers.getContractFactory("MyToken", deployer)
        const myTokenContract = await MyTokenFactory.deploy()

        return { myTokenContract, deployer, user }
    }

    describe("Testing Hardhat Chai Matchers", function () {
        it("Should return correct token balance for user after transfer of 10 MT", async function () {
            const { myTokenContract, user } = await loadFixture(deployContractFixture)

            await myTokenContract.transfer(user.address, ethers.utils.parseEther("10"))
            expect(await myTokenContract.balanceOf(user.address)).to.eq(ethers.utils.parseEther("10"))
        })

        it("Should return correct ETH account balance for user after calling setBalance", async function () {
            const { user } = await loadFixture(deployContractFixture)

            //initial ETH account balance: 10000
            expect(await ethers.provider.getBalance(user.address)).to.eq(ethers.utils.parseEther("10000"))
            await setBalance(user.address, 1n * 10n ** 18n)
            expect(await ethers.provider.getBalance(user.address)).to.eq(ethers.utils.parseEther("1"))
        })

        it("Should revert when transferring tokens to zero address", async function () {
            const { myTokenContract } = await loadFixture(deployContractFixture)

            await expect(
                myTokenContract.transfer(ethers.constants.AddressZero, ethers.utils.parseEther("1"))
            ).to.be.revertedWith("ERC20: transfer to the zero address")
        })

        it("Should emit a Transfer event on token transfer", async function () {
            const { myTokenContract, user } = await loadFixture(deployContractFixture)

            await expect(myTokenContract.transfer(user.address, ethers.utils.parseEther("1")))
                .to.emit(myTokenContract, "Transfer")
                .withArgs(anyValue, user.address, ethers.utils.parseEther("1"))
        })

        it("Should change token balance after transfer", async function () {
            const { myTokenContract, deployer, user } = await loadFixture(deployContractFixture)

            await expect(myTokenContract.transfer(user.address, 1000)).to.changeTokenBalance(
                myTokenContract,
                deployer.address,
                -1000
            )

            await expect(myTokenContract.transfer(user.address, 1000)).to.changeTokenBalance(
                myTokenContract,
                user.address,
                1000
            )

            //or:
            await expect(myTokenContract.transfer(user.address, 1000)).to.changeTokenBalances(
                myTokenContract,
                [deployer.address, user.address],
                [-1000, 1000]
            )
        })
    })

    describe("Testing Hardhat Network Helpers", function () {
        it("Should return correct token supply", async function () {
            const { myTokenContract, deployer, user } = await loadFixture(deployContractFixture)

            const totalSupply = await myTokenContract.totalSupply()
            expect(totalSupply).to.eq(ethers.utils.parseEther("100000"))
            expect(totalSupply).to.eq(100000n * 10n ** 18n)
            expect(totalSupply).to.eq(1_000_000_000_000_000_000_000_00n)
        })

        it("Should attribute totalSupply to deployer account ", async function () {
            const { myTokenContract, deployer, user } = await loadFixture(deployContractFixture)

            const ownerBalance = await myTokenContract.balanceOf(deployer.address)
            expect(await myTokenContract.totalSupply()).to.equal(ownerBalance)
        })
    })
})
