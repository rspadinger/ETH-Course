const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()

    //TODO don't specify blockNumber in hardhat.config.js => //blockNumber: 2500000,
    // https://sepolia.etherscan.io/tx/0xc7fce9f44e76c0cd7beb54f00426bd98ae6513d2ab6c85d30ce2bb1d7012ffd5
    const challengeAddress = await createChallenge("0xb2aBa0e156C905a9FAEc24805a009d99193E3E53")
    challenge = await ethers.getContractAt("Switch", challengeAddress)
})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
