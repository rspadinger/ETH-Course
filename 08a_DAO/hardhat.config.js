require("@nomicfoundation/hardhat-toolbox")

//use optimizer to avoid warning: Contract code size exceeds 24576 bytes (a limit introduced in Spurious Dragon)
module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: { enabled: true, runs: 200 },
        },
    },
    defaultNetwork: "localhost",
}
