const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1, s2] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x7ae0655F0Ee1e7752D7C62493CEa1E69A810e2ed")
    challenge = await ethers.getContractAt("Preservation", challengeAddress)
    
})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
