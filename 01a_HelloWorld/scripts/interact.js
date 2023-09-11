const { PRIVATE_KEY, ALCHEMY_API_KEY, CONTRACT_ADDRESS, CONTRACT_ADDRESS_LOCAL } = process.env

let provider, signer, contract
let message, txn

async function main() {
    const currentNetwork = await ethers.provider.getNetwork()

    if (currentNetwork.chainId.toString().includes(1337)) {
        console.log("We are using a local network!")

        //TODO get a contract instance

    } else {
        console.log("We are using a remote network!")

        //TODO get a contract instance

    }

    //TODO get the value of message
    console.log("The message is: ")

    //TODO update message, show txn receipt and display updated message
    console.log("Updating the message...")

    //TODO log the txn receipt 
    console.log("Txn receipt: ")

    //TODO display updated message
    console.log("The updatd message is: ")
}

main()
