const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()
    const challengeAddress = await createChallenge(
        "0x725595BA16E76ED1F6cC1e1b65A88365cC494824",
        ethers.utils.parseEther("0.001")
    )
    challenge = await ethers.getContractAt("PuzzleProxy", challengeAddress)

})

it("solves the challenge", async function () {
   
})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
    //expect(1).to.eq(1)
})
