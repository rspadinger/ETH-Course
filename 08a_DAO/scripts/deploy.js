const fs = require("fs")

async function main() {
    const [executor, proposer, voter1, voter2, voter3, voter4, voter5, payee] = await ethers.getSigners()

    const name = "Governance Token"
    const symbol = "GT"
    const supply = ethers.utils.parseEther("1000") // 1000 Tokens

    // Deploy GovToken
    const GovToken = await ethers.getContractFactory("GovToken")
    const govToken = await GovToken.deploy(name, symbol, supply)
    await govToken.deployed()
    const govTokenAddress = govToken.address

    const amount = ethers.utils.parseEther("50")

    await govToken.transfer(voter1.address, amount)
    await govToken.transfer(voter2.address, amount)
    await govToken.transfer(voter3.address, amount)
    await govToken.transfer(voter4.address, amount)
    await govToken.transfer(voter5.address, amount)

    // Deploy timelock
    const minDelay = 0 // How long do we have to wait until we can execute after a proposal has been  queued

    // In addition to passing minDelay, we also need to pass 2 arrays.
    // The 1st array contains addresses of those who are allowed to make a proposal.
    // The 2nd array contains addresses of those who are allowed to make executions.

    // Deploy TimeLock
    const TimeLock = await ethers.getContractFactory("TimeLock")
    const timeLock = await TimeLock.deploy(minDelay, [proposer.address], [executor.address])
    await timeLock.deployed()
    const timeLockAddress = timeLock.address

    // Deploy Governance
    const quorum = 5 // Percentage of total supply of tokens needed to aprove proposals (5%)
    const votingDelay = 0 // How many blocks after proposal until voting becomes active
    const votingPeriod = 5 // How many blocks to allow voters to vote

    const Governance = await ethers.getContractFactory("Governance")
    const governance = await Governance.deploy(govToken.address, timeLock.address, quorum, votingDelay, votingPeriod)
    await governance.deployed()
    const governanceAddress = governance.address

    // Deploy Treasury
    const funds = ethers.utils.parseEther("50")
    const Treasury = await ethers.getContractFactory("Treasury")
    const treasury = await Treasury.deploy(payee.address, { value: funds })
    await treasury.deployed()
    const treasuryAddress = treasury.address

    // Assign proposer and executor roles to the governance contract
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    await timeLock.grantRole(proposerRole, governance.address)
    await timeLock.grantRole(executorRole, governance.address)

    // Timelock contract will be the owner of the treasury contract.
    await treasury.transferOwnership(timeLock.address)

    const contractAddresses = {
        govTokenAddress,
        timeLockAddress,
        governanceAddress,
        treasuryAddress,
    }
    fs.writeFileSync("contractAddresses.json", JSON.stringify(contractAddresses, undefined, 2))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
