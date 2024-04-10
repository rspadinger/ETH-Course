const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, s2, challenge, tx

before(async () => {
    ;[s1, s2] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x478f3476358Eb166Cb7adE4666d04fbdDB56C407")
    challenge = await ethers.getContractAt("Token", challengeAddress)
})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
