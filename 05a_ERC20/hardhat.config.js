require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const { ALCHEMY_API_URL_GOERLI, PRIVATE_KEY } = process.env

module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "localhost",
    networks: {
        goerli: {
            url: ALCHEMY_API_URL_GOERLI,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
}
