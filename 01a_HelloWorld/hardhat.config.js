require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env

module.exports = {
    solidity: {
        version: "0.8.20",
    },
    defaultNetwork: "localhost",      
}
