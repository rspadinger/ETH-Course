const { expect } = require("chai")
const { createChallenge, submitLevel } = require("./utils")

let s1, attacker, challenge, tx

before(async () => {
    ;[s1] = await ethers.getSigners()

    //TODO don't specify blockNumber in hardhat.config.js => //blockNumber: 2500000,
    // https://sepolia.etherscan.io/tx/0x8e7f6c79daaaef28b96bf701be5313d185d0c09cbcd40d8b06b4e3d83bc6bbd2
    const challengeAddress = await createChallenge("0x653239b3b3E67BC0ec1Df7835DA2d38761FfD882")
    challenge = await ethers.getContractAt("GatekeeperThree", challengeAddress)

})

it("solves the challenge", async function () {  

})

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true
})
