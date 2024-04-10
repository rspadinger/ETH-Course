const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, attacker, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x73379d8B82Fda494ee59555f333DF7D44483fD58")
    challenge = await ethers.getContractAt("Delegation", challengeAddress)
})

it("solves the challenge", async function () {
  
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
