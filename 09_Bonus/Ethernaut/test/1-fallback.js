const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x3c34A342b2aF5e885FcaA3800dB5B205fEfa3ffB")
    challenge = await ethers.getContractAt("Fallback", challengeAddress)
})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
