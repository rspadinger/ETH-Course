const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, challenge, attacker, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge(
        "0x2a24869323C0B13Dff24E196Ba072dC790D52479",
        ethers.utils.parseEther("1")
    )
    challenge = await ethers.getContractAt("Reentrance", challengeAddress)

})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
