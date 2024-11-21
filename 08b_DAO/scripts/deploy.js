const fs = require("fs")

async function main() {
    const [executor, proposer, voter1, voter2, voter3, voter4, voter5] = await ethers.getSigners()

    // Deploy GovToken
    const govToken = await ethers.deployContract("GovToken")
    await govToken.waitForDeployment()
    const govTokenAddress = govToken.target

    const amount = ethers.parseEther("50")

    await govToken.transfer(voter1.address, amount)
    await govToken.transfer(voter2.address, amount)
    await govToken.transfer(voter3.address, amount)
    await govToken.transfer(voter4.address, amount)
    await govToken.transfer(voter5.address, amount)

    // Deploy timelock
    const minDelay = 0 // How long do we have to wait until we can execute the proposal

    // In addition to passing minDelay, we also need to pass 2 arrays.
    // The 1st array contains addresses of those who are allowed to make a proposal.
    // The 2nd array contains addresses of those who are allowed to make executions.

    // Deploy TimeLock
    const timeLock = await ethers.deployContract("TimeLock", [
        minDelay,
        [proposer.address],
        [executor.address],
        executor.address,
    ])
    await timeLock.waitForDeployment()
    const timeLockAddress = timeLock.target

    // Deploy Governance
    const governance = await ethers.deployContract("Governance", [govToken.target, timeLock.target])
    await governance.waitForDeployment()
    const governanceAddress = governance.target

    // Deploy Treasury
    const funds = ethers.parseEther("50")

    const treasury = await ethers.deployContract("Treasury", { value: funds })
    await treasury.waitForDeployment()
    const treasuryAddress = treasury.target

    // Assign proposer and executor roles to the governance contract
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    await timeLock.grantRole(proposerRole, governance.target)
    await timeLock.grantRole(executorRole, governance.target)

    // Timelock contract will be the owner of the treasury contract.
    await treasury.transferOwnership(timeLock.target)

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
