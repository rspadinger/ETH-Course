const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, attacker, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0xb5858B8EDE0030e46C0Ac1aaAedea8Fb71EF423C")
    challenge = await ethers.getContractAt("GatekeeperOne", challengeAddress)

})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
