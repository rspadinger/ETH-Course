// npx hardhat run scripts/interact.js --network goerli

const { PRIVATE_KEY, ALCHEMY_API_KEY, CONTRACT_ADDRESS, CONTRACT_ADDRESS_LOCAL } = process.env

let provider, signer, contract
let message, txn

async function main() {
    const currentNetwork = await ethers.provider.getNetwork()

    if (currentNetwork.chainId.toString().includes(1337)) {
        console.log("We are using a local network!")
    } else {
        console.log("We are using a remote network!")
    }

    //get message
    console.log("The message is: ")

    //update message, show txn receipt and display updated message
    console.log("Updating the message...")
}

main()
