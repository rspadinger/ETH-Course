const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x691eeA9286124c043B82997201E805646b76351a")
    challenge = await ethers.getContractAt("Shop", challengeAddress)
})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
