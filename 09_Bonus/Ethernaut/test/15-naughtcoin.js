const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1, s2] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x80934BE6B8B872B364b470Ca30EaAd8AEAC4f63F")
    challenge = await ethers.getContractAt("NaughtCoin", challengeAddress)
})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
