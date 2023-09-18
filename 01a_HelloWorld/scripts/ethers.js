// npx hardhat run scripts/interact.js --network sepolia
const { PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ADDRESS_LOCAL } = process.env

const contractJson = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json")

let provider, signer, signerAddress, account2Address, contract, contractAddress, isLocalNetwork
let txnParams, txn, txnReceipt
let newMessage, iface, encodedFunction

async function testEthersJs() {
    //########################## SETUP #################################################

    isLocalNetwork = true
    contractAddress = CONTRACT_ADDRESS_LOCAL

    provider = ethers.provider

    const [signer1, signer2] = await ethers.getSigners()
    signerAddress = signer1.address
    account2Address = signer2.address

    contract = await ethers.getContractAt("HelloWorld", CONTRACT_ADDRESS_LOCAL)

    //########################## PROVIDER ##############################################

    //return
    console.log("\n ************* Provider ******************* \n")

    //### if we want to connect to a remote blockchain, it is recommended
    //to use a third party provider with an API-key

    //### if no third party provider is available, a defaultProvider can be used
    //however, the number of network requests will be limited

    //### if we use a local blockchain like Ganache or Hardhat, we can also directly use a JsonRpcProvider
    //if no connectionInfo is provided, "http://localhost:8545" is used

    //### for web apps that use MM, use a BrowserProvider

    //console.log("Provider: ", provider)

    //### Provider methods
    console.log("Get the network chainId the provider is connected to: ")
    console.log("Get balance of any account: ")
    console.log("Balance in ETH: ")
    console.log("Txn count for any account: ")
    console.log("Block Number of latest block: ")
    console.log("Get current fee data: ")

    //########################## SIGNER ##############################################

    console.log("\n ************* Signer ******************* \n")

    //### get the Signer
    if (isLocalNetwork) {
        //if we are using a JsonRpcProvider, this will be a simple signer that is connected to our JsonRpcProvider
        //we can use it to send txn's on a local node (eg: Ganache, Geth, Parity), but this won't work on a remote node
        signer = null
    } else {
        //this is a wallet signer - it has access to the PK and can sign txn
        //the provider needs to be a defaultProvider or APIProvider (eg: AlchemyProvider)
        signer = null
    }
    //console.log("Signer: ", signer)

    //### Signer methods
    console.log("Signer address: ")
    console.log("Txn count: ")

    //### send ETH by calling sendTransaction on the Signer
    txnParams = {
        to: account2Address,
        value: ethers.parseEther("0.1"),
    }

    console.log(
        "Balance before send 0.1 ETH transfer: ",
        ethers.formatEther(await provider.getBalance(account2Address))
    )

    txn = null
    txnReceipt = null

    console.log("Balance after send 0.1 ETH transfer: ", ethers.formatEther(await provider.getBalance(account2Address)))
    // console.log("Transaction receipt 0.1 ETH transfer: ", txnReceipt)

    //### execute a write function by calling sendTransaction on the signer
    newMessage = getRandomNumberString()
    iface = null
    encodedFunction = null

    //set up transaction parameters
    txnParams = null

    console.log("Message before send txn: ")
    txn = null
    txnReceipt = null
    console.log("Message after send txn: ")
    // console.log("Transaction receipt calling updateMessage: ", txnReceipt)

    // get the raw data
    //console.log("Txn Response Data: ", txn.data)
    //console.log("Txn Receipt Log Data: ", txnReceipt.logs[0])

    //########################## CONTRACT ##############################################

    console.log("\n ************* Contract ******************* \n")

    //### get a contract instance
    if (isLocalNetwork) {
        contract = null
    } else {
        contract = null
    }
    //console.log("Contract: ", contract)

    //### call a read-only function with overrides
    try {
        const message = null
        console.log("The message is: " + message)
    } catch (err) {
        console.log("Error: ", err.reason, err.error)
    }

    //### call a write function
    console.log("Message before send txn: ", await contract.message())
    newMessage = getRandomNumberString()
    txn = null
    txnReceipt = await txn.wait()
    console.log("Message after send txn: " + (await contract.message()))
    //console.log("Txn receipt: ", txnReceipt)

    //########################## LOGS AND EVENTS FROM PROVIDER & CONTRACT #######################################

    console.log("\n ************* Logs & Events ******************* \n")

    //### getting logs from the provider by specifying a filter
    //https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378
    //fromBlock: "latest" won't return any logs => provide a specific block number
    let filter = {
        fromBlock: "latest", //fromBlock & toBlock have no effect on provider.on(...) 5
        toBlock: "latest",
        address: contractAddress,
        topics: [ethers.id("UpdateMessage(address,string,string)")],
    }
    //returns an array of logs (fromBlock - toBlock) : data, topics, blockNumber, txnHash...
    console.log("Logs (Provider): ")

    //### listen to events - Provider

    //### returns a list of topics for the specified event (from Contract.filters object) - null means: any match
    filter = contract.filters.UpdateMessage(signerAddress, null, null)
    console.log("Event topics: ", filter)

    //### return Events that match the specified event (list of topics)
    //returns an array of logs (fromBlock - toBlock) : data, topics, args, blockNumber, txnHash...
    let logs = null
    console.log("Logs (Contract): ", logs)
    console.log("Log (Contract) arguments: ", logs[0].args)

    //### listen to events - Contract => independant of blockNumber - we only get the latest event

    //########################## UTILS ##############################################

    //### Interface and Fragments
    console.log("\n ************* Interface and Fragments ******************* \n")
    let ifaceUpdate = null
    let ifaceCompleteABI = null

    //get the function fragments: type, name, inputs, outputs...
    //console.log("All functions: ", ifaceCompleteABI.functions)
    console.log("Update function: ")

    //### Encoding & Decoding
    console.log("\n ************* Encoding & Decoding ******************* \n")
    encodedFunction = null
    console.log("Encoded function data: ", encodedFunction)

    //get the sigHash or function selector (4 bytes) => allows to perform dynamic invocation of a function
    let sigHash = null
    console.log("Function sig hash: ", sigHash)

    //decode provided argument values from txn.data => returns provided arguments
    let argValues = null
    console.log("Decoded argument values: ", argValues)

    //### Parsing
    console.log("\n ************* Parsing ******************* \n")
    //returns txn data: name, sigHash, args, FunctionFragment...
    let parsedTxn = null
    console.log("Parsed txn: ", parsedTxn)

    //topics: event Id and the "from" address => returns event fragment: name, args...
    const topics = [
        "0x393bbe2c5115b2370579ad2f520ee8319935cff3b04145a3246b8c8c7730dc73",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    ]

    //specify txnReceipt.logs[0].data
    let parsedLog = null
    //console.log("Parsed log: ", parsedLog)

    //### Address
    console.log("\n ************* Address Functions ******************* \n")
    console.log("Address from 0x8ba1f109551bd432803012645ac136ddd64dba72: ")
    //get address from PK: add 0x in front of PK
    console.log("Get address from PK: ")

    //### BigInt
    console.log("\n ************* BigInt ******************* \n")
    let n1 = 30n // or: n1 = BigInt("30")
    let n2 = BigInt("0x32") //50
    console.log("Add 2 BigInt's: ", n1 + n2)
    console.log("Get hex string from n1: ", n1.toString(16)) //1e
    console.log("Get the number from n2: ", Number(n2))
    console.log("Add a standard number to a BigInt - result should be int: ") //40
    console.log("Add a standard number to a BigInt - result should be BigInt: ") //40n

    //### Bytes
    console.log("\n ************* Byte Manipulation ******************* \n")
    console.log("Get a uint8 array from a hexstring - 0x1234: ") // Uint8Array [ 18, 52 ]
    console.log("Convert the number 1 to a hex: ") // 0x01
    console.log("Convert the BigInt n1 to hex: ") // 0x1e

    //### Constants
    console.log("\n ************* Constants ******************* \n")
    console.log("Zero address: ") //0x0000000000000000000000000000000000000000
    console.log("Wei per Ether: ") //BigInt: 1000000000000000000n

    //### Display Logic and Input
    console.log("\n ************* Display Logic & Input ******************* \n")
    const oneGwei = 1000000000n
    console.log("Get number of ETH from 1 Gwei: ") // 0.000000001
    console.log("Get number of Wei (=0) from 1 Gwei: ") // 1000000000
    console.log("Get number of Gwei (=9) from 1 Gwei: ") // 1.0
    console.log("Get number of Gwei (='gwei') from 1 Gwei: ") // 1.0

    console.log("Get number of wei from ETH (as string): ") // 121000000000000000000n
    console.log("Get number of wei from specified Gwei (=9) amount (as string): ") // 121000000000n
    console.log("Get number of wei from specified Gwei (='gwei') amount: ") // 121000000000n

    //### Hashing Algorithms
    console.log("\n ************* Hashing ******************* \n")
    console.log("Id of Event with args (= Event Topic): ")
    console.log("Keccak256 of hex string 0x1234: ") // '0x56570de...'
    console.log("Use the id function to get the keccak256 of a string (hello): ")
    //The following provides the same result:
    console.log("Get keccak258 of UTF8 byte array: ", ethers.keccak256(ethers.toUtf8Bytes("hello")))

    //### Strings
    //User provides string data in frontend => convert to bytes32 => send to smart contract -
    //this is much cheaper than working with strings in smart contracts
    //If the length of the text below exceeds 31 bytes, it will throw an error.
    console.log("Convert (encode) a string (hello) to a bytes32 hex string") //0x68656c6c6f000000000000000000000000000000000000000000000000000000
    console.log("Convert (decode) a bytes32 hex string to a string: ")

    console.log("\n ************* String Manipulation ******************* \n")
    //If needed, convert strings to bytes first:
    console.log("Convert string (hello) to UTF8 byte array: ") // 104, 101, 108, 108, 111
    console.log("Convert UTF8 byte array to string: ")

    //### Transctions
    console.log("\n ************* Transactions ******************* \n")
    txnParams = {
        to: account2Address,
        value: ethers.parseEther("1.0"),
        gasPrice: ethers.parseUnits("50", "gwei"),
        nonce: 10,
        data: encodedFunction,
    }

    let txnSerialized = null
    console.log("Serialized txn (hex string): ", txnSerialized)

    //Get the transaction properties from a serialized transaction.
    txn = null
    console.log("Txn properties: ", txn.to, txn.value)
}

testEthersJs()

function getRandomNumberString() {
    return Math.floor(Math.random() * 10000).toString()
}
