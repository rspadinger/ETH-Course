const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, attacker, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge(
        "0x3049C00639E6dfC269ED1451764a046f7aE500c6",
        ethers.utils.parseEther("0.001")
    )
    challenge = await ethers.getContractAt("King", challengeAddress)

})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
