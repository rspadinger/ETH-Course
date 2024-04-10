const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge("0xA62fE5344FE62AdC1F356447B669E9E6D10abaaF")
    challenge = await ethers.getContractAt("CoinFlip", challengeAddress)

})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
