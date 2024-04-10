const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge(
        "0x3A78EE8462BD2e31133de2B8f1f9CBD973D6eDd6",
        ethers.utils.parseEther("0.001")
    )
    challenge = await ethers.getContractAt("Motorbike", challengeAddress)
})

it("solves the challenge", async function () {
    
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
