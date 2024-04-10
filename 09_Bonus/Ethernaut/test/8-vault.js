const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, attacker, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0xB7257D8Ba61BD1b3Fb7249DCd9330a023a5F3670")
    challenge = await ethers.getContractAt("Vault", challengeAddress)
})

it("solves the challenge", async function () {
  
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
