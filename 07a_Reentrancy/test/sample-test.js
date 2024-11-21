const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("Deploy contracts", function () {
    async function deployContractsFixture() {
        const [bankOwner, customer] = await ethers.getSigners()

        const bankContract = await ethers.deployContract("Bank")
        await bankContract.waitForDeployment()

        await bankContract.deposit({ value: ethers.parseEther("100") })
        await bankContract.connect(customer).deposit({ value: ethers.parseEther("50") })

        const attackerContract = await ethers.deployContract("Attacker", [bankContract.target])
        await attackerContract.waitForDeployment()

        return { bankContract, attackerContract, bankOwner, customer }
    }

    describe("Test deposit and withdraw of Bank contract", function () {
        it("Should accept deposits", async function () {
            const { bankContract, bankOwner, customer } = await loadFixture(deployContractsFixture)

            const bankOwnerBalance = await bankContract.balances(bankOwner.address)
            expect(bankOwnerBalance).to.eq(ethers.parseEther("100"))

            const customerBalance = await bankContract.balances(customer.address)
            expect(customerBalance).to.eq(ethers.parseEther("50"))
        })

        it("Should accept withdrawals", async function () {
            const { bankContract, bankOwner, customer } = await loadFixture(deployContractsFixture)

            await bankContract.connect(customer).withdraw()

            const bankOwnerBalance = await bankContract.balances(bankOwner.address)
            const customerBalance = await bankContract.balances(customer.address)

            expect(bankOwnerBalance).to.eq(ethers.parseEther("100"))
            expect(customerBalance).to.eq(0)
        })

        it("Perform Attack", async function () {
            const { bankContract, attackerContract } = await loadFixture(deployContractsFixture)

            console.log("")
            console.log("*** Before ***")
            console.log(
                `Bank's balance: ${ethers
                    .formatEther(await ethers.provider.getBalance(bankContract.target))
                    .toString()}`
            )
            console.log(
                `Attacker's balance: ${ethers
                    .formatEther(await ethers.provider.getBalance(attackerContract.target))
                    .toString()}`
            )

            await attackerContract.attack({ value: ethers.parseEther("10") })

            console.log("")
            console.log("*** After ***")
            console.log(
                `Bank's balance: ${ethers
                    .formatEther(await ethers.provider.getBalance(bankContract.target))
                    .toString()}`
            )
            console.log(
                `Attackers's balance: ${ethers
                    .formatEther(await ethers.provider.getBalance(attackerContract.target))
                    .toString()}`
            )
            console.log("")

            expect(await ethers.provider.getBalance(bankContract.target)).to.eq(0)
            expect(await ethers.provider.getBalance(attackerContract.target)).to.eq(ethers.parseEther("160"))
        })
    })
})
