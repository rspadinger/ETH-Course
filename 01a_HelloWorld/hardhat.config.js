require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL_GOERLI, PRIVATE_KEY } = process.env

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: { enabled: true, runs: 200 },
        },
    },
    defaultNetwork: "localhost",
    networks: {
        goerli: {
            url: ALCHEMY_API_URL_GOERLI,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
}
