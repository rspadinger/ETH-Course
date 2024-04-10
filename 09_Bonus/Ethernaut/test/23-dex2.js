const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx, bt1, bt2

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0xf59112032D54862E199626F55cFad4F8a3b0Fce9")
    challenge = await ethers.getContractAt("DexTwo", challengeAddress)

})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
    //expect(1).to.eq(1)
})
