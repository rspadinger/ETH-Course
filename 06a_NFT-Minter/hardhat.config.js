require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { VITE_ALCHEMY_API_URL, VITE_PRIVATE_KEY } = process.env

module.exports = {
    solidity: "0.8.20",
    defaultNetwork: "localhost",
    networks: {
        sepolia: {
            url: VITE_ALCHEMY_API_URL,
            accounts: [`0x${VITE_PRIVATE_KEY}`],
        },
    },
}
