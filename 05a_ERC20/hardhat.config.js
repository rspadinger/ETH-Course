require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env

module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "localhost",
    networks: {
        sepolia: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
}
