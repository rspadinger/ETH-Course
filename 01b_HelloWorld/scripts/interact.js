// npx hardhat run scripts/interact.js --network goerli

const { PRIVATE_KEY, ALCHEMY_API_KEY, CONTRACT_ADDRESS, CONTRACT_ADDRESS_LOCAL } = process.env

let provider, signer, contract
let message, txn

async function main() {
    const currentNetwork = await ethers.provider.getNetwork()

    if (currentNetwork.chainId.toString().includes(1337)) {
        //we are on a local network: Ganache, Hardhat...
        console.log("We are using a local network!")
        contract = await ethers.getContractAt("HelloWorld", CONTRACT_ADDRESS_LOCAL)
    } else {
        //we are on a remote network
        console.log("We are using a remote network!")
        const contractJson = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json")
        provider = new ethers.providers.AlchemyProvider((network = "goerli"), ALCHEMY_API_KEY)
        //provider = ethers.getDefaultProvider((network = "goerli"))
        signer = new ethers.Wallet(PRIVATE_KEY, provider)
        contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer)
    }

    message = await contract.message()
    console.log("The message is: " + message)

    console.log("Updating the message...")
    txn = await contract.updateMessage("This is a new message")
    const txnReceipt = await txn.wait()
    //console.log("Txn receipt: ", txnReceipt)

    message = console.log("The new message is: ", await contract.message())
}

main()
