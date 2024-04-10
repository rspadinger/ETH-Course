const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0x36E92B2751F260D6a4749d7CA58247E7f8198284")
    challenge = await ethers.getContractAt("GoodSamaritan", challengeAddress)

})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
