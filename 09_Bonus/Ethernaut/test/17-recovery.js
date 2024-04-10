const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1, s2] = await ethers.getSigners()
    const challengeAddress = await createChallenge(
        "0xAF98ab8F2e2B24F42C661ed023237f5B7acAB048",
        ethers.utils.parseEther("0.001")
    )
    challenge = await ethers.getContractAt("Recovery", challengeAddress)
})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
