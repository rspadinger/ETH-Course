const fs = require("fs")

async function createProposal() {
    //get the contract addresses
    const contracts = fs.readFileSync("contractAddresses.json")
    let contractAddresses = JSON.parse(contracts)

    const [executor, proposer, voter1, voter2, voter3, voter4, voter5, payee] = await ethers.getSigners()
    let isReleased, treasuryBalance, payeeBalance, blockNumber, proposalState, vote, txn, txnReceipt, txnParams

    //get a reference to the government token contract and self-delegate voting rights to 5 voters
    const govToken = await ethers.getContractAt("GovToken", contractAddresses.govTokenAddress)
    await govToken.connect(voter1).delegate(voter1.address)
    await govToken.connect(voter2).delegate(voter2.address)
    await govToken.connect(voter3).delegate(voter3.address)
    await govToken.connect(voter4).delegate(voter4.address)
    await govToken.connect(voter5).delegate(voter5.address)

    const treasury = await ethers.getContractAt("Treasury", contractAddresses.treasuryAddress)

    //display the balance of the treasury and the payee account
    treasuryBalance = await ethers.provider.getBalance(treasury.address)

    //at the beginning, the treasury still holds all the funds => haven't been released yet to the payee
    isReleased = await treasury.isReleased()
    console.log(`Funds released? ${isReleased}`)
    console.log(`Funds inside of treasury: ${ethers.utils.formatEther(treasuryBalance.toString())} ETH\n`)

    payeeBalance = await ethers.provider.getBalance(payee.address)
    console.log(`Payee balance: ${ethers.utils.formatEther(payeeBalance.toString())} ETH\n`)

    const governance = await ethers.getContractAt("Governance", contractAddresses.governanceAddress)

    //encode the releaseFunds function from the treasury contract => required for the proposal
    const iface = new ethers.utils.Interface(["function releaseFunds()"])
    const encodedReleaseFunds = iface.encodeFunctionData("releaseFunds")
    const description = getRandomNumberString() // "Release Funds from Treasury"

    //create a proposal (contains 1 action) => target: address of treasury, value: 0, calldata: encoded "releaseFunds" function
    txn = await governance.propose([treasury.address], [0], [encodedReleaseFunds], description)
    txnReceipt = await txn.wait()

    //display the proposal Id from the ProposalCreated event
    const id = txnReceipt.events[0].args["proposalId"]
    console.log(`Created Proposal: ${id.toString()}\n`)

    //display the current state of the proposal
    proposalState = await governance.state(id)
    console.log(`Current state of proposal: ${proposalState.toString()} (Pending) \n`)

    //display the block at which the proposal was created
    const snapshot = await governance.proposalSnapshot(id)
    console.log(`Proposal created on block ${snapshot.toString()}`)

    //display the proposal deadline
    const deadline = await governance.proposalDeadline(id)
    console.log(`Proposal deadline on block ${deadline.toString()}\n`)

    blockNumber = await ethers.provider.getBlockNumber()
    console.log(`Current blocknumber: ${blockNumber}\n`)

    //display the number of votes required for the proposal to pass => quorum
    // quorum = 5% of totalSupply (1000) => 50
    const quorum = await governance.quorum(blockNumber - 1)
    console.log(`Number of votes required to pass: ${ethers.utils.formatEther(quorum.toString())}\n`)

    //cast the votes
    console.log(`Casting votes...\n`)

    // 0 = Against, 1 = For, 2 = Abstain
    // 3 * For = 3 * 50 = 150 votes (each voter has 50 ETH)
    vote = await governance.connect(voter1).castVote(id, 1)
    vote = await governance.connect(voter2).castVote(id, 1)
    vote = await governance.connect(voter3).castVote(id, 1)
    vote = await governance.connect(voter4).castVote(id, 0)
    vote = await governance.connect(voter5).castVote(id, 2)

    // States: Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired, Executed
    proposalState = await governance.state(id)
    console.log(`Current state of proposal: ${proposalState.toString()} (Active) \n`)

    // NOTE: Transfer serves no purposes, it's just used to fast foward one block after the voting period ends
    await govToken.connect(executor).transfer(proposer.address, 1)

    //display the vote distribution
    const { againstVotes, forVotes, abstainVotes } = await governance.proposalVotes(id)
    console.log(`Votes For: ${ethers.utils.formatEther(forVotes.toString())}`)
    console.log(`Votes Against: ${ethers.utils.formatEther(againstVotes.toString())}`)
    console.log(`Votes Neutral: ${ethers.utils.formatEther(abstainVotes.toString())}\n`)

    blockNumber = await ethers.provider.getBlockNumber()
    console.log(`Current blocknumber: ${blockNumber}\n`)

    proposalState = await governance.state(id)
    console.log(`Current state of proposal: ${proposalState.toString()} (Succeeded) \n`)

    //queue the proposal => we need to provide the hash of the proposal description
    const hash = ethers.utils.id(description)
    await governance.queue([treasury.address], [0], [encodedReleaseFunds], hash)

    proposalState = await governance.state(id)
    console.log(`Current state of proposal: ${proposalState.toString()} (Queued) \n`)

    //we can execute the proposal immediately after queueing it => we set timelock minDelay = 0
    await governance.execute([treasury.address], [0], [encodedReleaseFunds], hash)

    proposalState = await governance.state(id)
    console.log(`Current state of proposal: ${proposalState.toString()} (Executed) \n`)

    //display the balance of the treasury and the payee account and if the funds have been released from the treasury
    isReleased = await treasury.isReleased()
    console.log(`Funds released? ${isReleased}`)

    treasuryBalance = await ethers.provider.getBalance(treasury.address)
    console.log(`Funds inside of treasury: ${ethers.utils.formatEther(treasuryBalance.toString())} ETH\n`)

    payeeBalance = await ethers.provider.getBalance(payee.address)
    console.log(`Payee balance: ${ethers.utils.formatEther(payeeBalance.toString())} ETH\n`)
}

createProposal()

function getRandomNumberString() {
    return Math.floor(Math.random() * 10000).toString()
}
