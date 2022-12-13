const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("Deploy contracts", function () {
    async function deployContractsFixture() {
        const [bankOwner, customer, attacker] = await ethers.getSigners()

        const BankFactory = await ethers.getContractFactory("Bank", bankOwner)
        const bankContract = await BankFactory.deploy()

        await bankContract.deposit({ value: ethers.utils.parseEther("100") })
        await bankContract.connect(customer).deposit({ value: ethers.utils.parseEther("50") })

        const AttackerFactory = await ethers.getContractFactory("Attacker", attacker)
        const attackerContract = await AttackerFactory.deploy(bankContract.address)

        return { bankContract, attackerContract, bankOwner, customer }
    }

    describe("Test deposit and withdraw of Bank contract", function () {
        it("Should accept deposits", async function () {
            const { bankContract, bankOwner, customer } = await loadFixture(deployContractsFixture)

            const bankOwnerBalance = await bankContract.balanceOf(bankOwner.address)
            expect(bankOwnerBalance).to.eq(ethers.utils.parseEther("100"))

            const customerBalance = await bankContract.balanceOf(customer.address)
            expect(customerBalance).to.eq(ethers.utils.parseEther("50"))
        })

        it("Should accept withdrawals", async function () {
            const { bankContract, bankOwner, customer } = await loadFixture(deployContractsFixture)

            await bankContract.withdraw()

            const bankOwnerBalance = await bankContract.balanceOf(bankOwner.address)
            const customerBalance = await bankContract.balanceOf(customer.address)

            expect(bankOwnerBalance).to.eq(0)
            expect(customerBalance).to.eq(ethers.utils.parseEther("50"))
        })

        it("Perform Attack", async function () {
            const { bankContract, attackerContract } = await loadFixture(deployContractsFixture)

            console.log("")
            console.log("*** Before ***")
            console.log(
                `Bank's balance: ${ethers.utils
                    .formatEther(await ethers.provider.getBalance(bankContract.address))
                    .toString()}`
            )
            console.log(
                `Attacker's balance: ${ethers.utils
                    .formatEther(await ethers.provider.getBalance(attackerContract.address))
                    .toString()}`
            )

            await attackerContract.attack({ value: ethers.utils.parseEther("10") })

            console.log("")
            console.log("*** After ***")
            console.log(
                `Bank's balance: ${ethers.utils
                    .formatEther(await ethers.provider.getBalance(bankContract.address))
                    .toString()}`
            )
            console.log(
                `Attackers's balance: ${ethers.utils
                    .formatEther(await ethers.provider.getBalance(attackerContract.address))
                    .toString()}`
            )
            console.log("")

            expect(await ethers.provider.getBalance(bankContract.address)).to.eq(0)
            expect(await ethers.provider.getBalance(attackerContract.address)).to.eq(ethers.utils.parseEther("160"))
        })
    })
})
