const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x34bD06F195756635a10A7018568E033bC15F3FB5")
    challenge = await ethers.getContractAt("DoubleEntryPoint", challengeAddress)
})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
