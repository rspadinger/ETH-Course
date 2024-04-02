// npx hardhat run scripts/interact.js --network goerli
const { ALCHEMY_API_KEY, PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ADDRESS_LOCAL, GOERLI_ACCOUNT2 } = process.env

 const contractJson = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json")

let provider, signer, signerAddress, account2Address, contract, contractAddress, currentNetwork, isLocalNetwork
let txnParams, txn, txnReceipt
let newMessage, iface, encodedFunction

async function testEthersJs() {
    //########################## SETUP #################################################

    provider = ethers.provider
    currentNetwork = await provider.getNetwork()

    if (currentNetwork.chainId.toString().includes(1337)) {
        //we are on a local network: Ganache, Hardhat...
        contractAddress = CONTRACT_ADDRESS_LOCAL
        isLocalNetwork = true

        const [signer1, signer2] = await ethers.getSigners()
        //signer = await provider.getSigner()
        signerAddress = signer1.address
        account2Address = signer2.address
        //;[signerAddress, account2Address] = await provider.listAccounts()

        contract = await ethers.getContractAt("HelloWorld", CONTRACT_ADDRESS_LOCAL)
    } else {
        //we are on a remote network
        contractAddress = CONTRACT_ADDRESS
        isLocalNetwork = false

        signer = new ethers.Wallet(PRIVATE_KEY, provider)
        //;[signer] = await ethers.getSigners()
        signerAddress = await signer.getAddress()
        account2Address = GOERLI_ACCOUNT2

        contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer)
        //contract = await ethers.getContractAt("HelloWorld", CONTRACT_ADDRESS)
    }

    //########################## PROVIDER ##############################################

    console.log("\n ************* Provider ******************* \n")

    //### if we want to connect to a remote blockchain, it is recommended
    //to use a third party provider with an API-key
    //provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY)

    //### if no third party provider is available, a defaultProvider can be used
    //however, the number of network requests will be limited
    //provider = await ethers.getDefaultProvider("goerli")
    //we can also use the defaultProvider if we want to connect to a local blockchain =>
    //this will use a JsonRpcProvider
    //provider = await ethers.getDefaultProvider("http://localhost:8545")

    //### if we use a local blockchain like Ganache or Hardhat, we can also directly use a JsonRpcProvider
    //if no connectionInfo is provided, "http://localhost:8545" is used
    //provider = new ethers.providers.JsonRpcProvider()

    //### for web apps that use MM (uses Infura internally), use a web3Provider
    //provider = new ethers.providers.Web3Provider(window.ethereum)
    //if we are using a web3Provider, we can send Json-RPC requests: https://docs.metamask.io/guide/rpc-api.html
    //await provider.send("eth_requestAccounts", [])

    //console.log("Provider: ", provider)

    //### Provider methods
    console.log("Get the network the provider is connected to: ", await provider.getNetwork())
    console.log("Get balance of any account: ", await provider.getBalance(signerAddress))
    console.log("Balance in ETH: ", ethers.utils.formatEther(await provider.getBalance(signerAddress)))
    console.log("Txn count for any account: ", await provider.getTransactionCount(signerAddress))
    console.log("Block Number of most recently mined block: ", await provider.getBlockNumber())
    console.log("Get current fee data: ", await provider.getFeeData())
    console.log("List of accounts managed by this provider: ", await provider.listAccounts())

    //########################## SIGNER ##############################################

    console.log("\n ************* Signer ******************* \n")

    //### get the Signer
    if (isLocalNetwork) {
        //if we are using a JsonRpcProvider, this will be a simple signer that is connected to our JsonRpcProvider
        //we can use it to send txn's on a local node (eg: Ganache, Geth, Parity), but this won't work on a remote node
        signer = provider.getSigner()
        //;[signer] = await ethers.getSigners()
    } else {
        //this is a wallet signer - it has access to the PK and can sign txn
        //the provider needs to be a defaultProvider or APIProvider (eg: AlchemyProvider)
        signer = new ethers.Wallet(PRIVATE_KEY, provider)
        //;[signer] = await ethers.getSigners()
    }
    //console.log("Signer: ", signer)

    //### Signer methods
    console.log("Signer address: ", await signer.getAddress())
    console.log("Balance: ", await signer.getBalance())
    console.log("Txn count: ", await signer.getTransactionCount())

    //### send ETH by calling sendTransaction on the Signer
    txnParams = {
        to: account2Address,
        value: ethers.utils.parseEther("0.1"),
    }
    console.log(
        "Balance before send 0.1 ETH transfer: ",
        ethers.utils.formatEther(await provider.getBalance(account2Address))
    )

    txn = await signer.sendTransaction(txnParams)
    txnReceipt = await txn.wait()

    console.log(
        "Balance after send 0.1 ETH transfer: ",
        ethers.utils.formatEther(await provider.getBalance(account2Address))
    )
    // console.log("Transaction receipt 0.1 ETH transfer: ", txnReceipt)

    //### execute a write function by calling sendTransaction on the signer
    newMessage = getRandomNumberString()
    iface = new ethers.utils.Interface(["function updateMessage(string newMessage)"])
    encodedFunction = iface.encodeFunctionData("updateMessage", [newMessage])

    //set up transaction parameters
    txnParams = {
        to: contractAddress,
        data: encodedFunction,
    }

    console.log("Message before send txn: ", await contract.message())
    txn = await signer.sendTransaction(txnParams)
    txnReceipt = await txn.wait()
    console.log("Message after send txn: ", await contract.message())
    //console.log("Transaction receipt calling updateMessage: ", txnReceipt)

    // get the raw data
    //console.log("Txn Response Data: ", txn.data)
    //console.log("Txn Receipt Log Data: ", txnReceipt.logs[0].data)

    //########################## CONTRACT ##############################################

    console.log("\n ************* Contract ******************* \n")

    //### get a contract instance
    if (isLocalNetwork) {
        contract = await ethers.getContractAt("HelloWorld", CONTRACT_ADDRESS_LOCAL)
    } else {
        contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, signer)
    }
    //console.log("Contract: ", contract)

    //### call a read-only function with overrides
    try {
        const message = await contract.message({ gasLimit: 200000 })
        console.log("The message is: " + message)
    } catch (err) {
        console.log("Error: ", err.reason, err.error)
    }

    //### call a write function
    console.log("Message before send txn: ", await contract.message())
    newMessage = getRandomNumberString()
    txn = await contract.updateMessage(newMessage)
    txnReceipt = await txn.wait()
    console.log("Message after send txn: " + (await contract.message()))
    //console.log("Txn receipt: ", txnReceipt)

    //########################## LOGS AND EVENTS FROM PROVIDER & CONTRACT #######################################

    console.log("\n ************* Logs & Events ******************* \n")

    //### getting logs from the provider by specifying a filter
    //https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378
    //on Goerli, fromBlock: "latest" won't return any logs => provide a specific block number
    let filter = {
        fromBlock: "latest", //fromBlock & toBlock have no effect on provider.on(...) 5
        toBlock: "latest",
        address: contractAddress,
        topics: [ethers.utils.id("UpdateMessage(address,string,string)")],
    }
    //returns an array of logs (fromBlock - toBlock) : data, topics, blockNumber, txnHash...
    console.log("Logs (Provider): ", await provider.getLogs(filter))

    //### listen to events - Provider
    // provider.on(filter, (log) => {
    //     //returns data, topics, blockNumber, txnHash... => fromBlock & toBlock are not used
    //     console.log("New event emitted (Provider): ", log)
    // })

    //### returns a list of topics for the specified event (from Contract.filters object) - null means: any match
    filter = contract.filters.UpdateMessage(signerAddress, null, null)
    console.log("Event topics: ", filter)

    //### return Events that match the specified event (list of topics)
    //returns an array of logs (fromBlock - toBlock) : data, topics, args, blockNumber, txnHash...
    let logs = await contract.queryFilter(filter, "latest", "latest") // Or: await contract.queryFilter("UpdateMessage",...
    console.log("Logs (Contract): ", logs)
    console.log("Log (Contract) arguments: ", logs[0].args)

    //### listen to events - Contract => independant of blockNumber - we only get the latest event
    // contract.on(filter, (from, oldMessage, newMessage, event) => {
    //     console.log("New event emitted (Contract): ", event)
    // console.log(
    //     "Emitted event arguments (Contract): ",
    //     from,
    //     oldMessage,
    //     newMessage,
    //     " --- Access via event.args[i]: ",
    //     event.args[0]
    // )
    // })

    //########################## UTILS ##############################################

    //### Interface and Fragments
    console.log("\n ************* Interface and Fragments ******************* \n")
    let ifaceUpdate = new ethers.utils.Interface(["function updateMessage(string newMessage)"])
    let ifaceCompleteABI = new ethers.utils.Interface(contractJson.abi)

    //get the function fragments: type, name, inputs, outputs...
    //console.log("All functions: ", ifaceCompleteABI.functions)
    console.log("Update function: ", ifaceCompleteABI.getFunction("updateMessage"))

    //### Encoding & Decoding
    console.log("\n ************* Encoding & Decoding ******************* \n")
    encodedFunction = ifaceUpdate.encodeFunctionData("updateMessage", ["test message"])
    //Or:
    encodedFunction = ifaceCompleteABI.encodeFunctionData("updateMessage", ["test"])
    console.log("Encoded function data: ", encodedFunction)

    //get the sigHash or function selector (4 bytes) => allows to perform dynamic invocation of a function
    let sigHash = ifaceCompleteABI.getSighash("updateMessage(string)")
    console.log("Function sig hash: ", sigHash)

    //decode provided argument values from tx.data => returns: [ '7099', newMessage: '7099' ]
    let argValues = ifaceCompleteABI.decodeFunctionData("updateMessage", txn.data)
    console.log("Decoded argument values: ", argValues)

    //### Parsing
    console.log("\n ************* Parsing ******************* \n")
    //returns txn data: name, sigHash, args, FunctionFragment...
    let parsedTxn = ifaceCompleteABI.parseTransaction({ data: txn.data })
    console.log("Parsed txn: ", parsedTxn)

    //topics: event Id and the "from" address => returns event fragment: name, args...
    const topics = [
        "0x393bbe2c5115b2370579ad2f520ee8319935cff3b04145a3246b8c8c7730dc73",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    ]
    parsedTxn = ifaceCompleteABI.parseLog({ data: txnReceipt.logs[0].data, topics })
    console.log("Parsed log: ", parsedTxn)

    //### Address
    console.log("\n ************* Address Functions ******************* \n")
    console.log(
        "Address from 0x8ba1f109551bd432803012645ac136ddd64dba72: ",
        ethers.utils.getAddress("0x8ba1f109551bd432803012645ac136ddd64dba72")
    )
    //get address from PK: add 0x in front of PK
    console.log("Get address from PK: ", ethers.utils.computeAddress("0x" + PRIVATE_KEY))

    //### BigNumber
    console.log("\n ************* Big Number ******************* \n")
    let n1 = ethers.BigNumber.from("30")
    let n2 = ethers.BigNumber.from("0x32") //50
    console.log("Add 2 BN's: ", n1.add(n2))
    console.log("Is BN1 smaller than BN2: ", n1.lt(n2))
    console.log("Get hex string from BN1: ", n1.toHexString()) //0x1e
    console.log("Get the number from BN2: ", n2.toNumber())
    console.log("Add a standard number to a BN - toNumber() method must be used: ", 10 + n1.toNumber()) //40
    console.log("Add a standard number to a BN using the add method: ", n1.add(10)) //BigNumber { value: "40" }

    //### Bytes
    console.log("\n ************* Byte Manipulation ******************* \n")
    console.log("Get a uint8 array from a hex string: ", ethers.utils.arrayify("0x1234")) // Uint8Array [ 18, 52 ]
    //Converts a number or array to a HexString
    console.log("Convert the number 1 to a data hex string: ", ethers.utils.hexlify(1)) // '0x01'
    console.log("Convert the array [1, 2] to hex: ", ethers.utils.hexlify([1, 2])) // '0x0102'
    console.log("Convert the BigNumber n1 to hex: ", ethers.utils.hexlify(n1)) // '0x01'

    //### Constants
    console.log("\n ************* Constants ******************* \n")
    console.log("Zero address: ", ethers.constants.AddressZero) //0x0000000000000000000000000000000000000000
    console.log("1: ", ethers.constants.One) //BigNumber { value: "1" }
    console.log("Wei per Ether: ", ethers.constants.WeiPerEther) //BigNumber { value: "1000000000000000000" }

    //### Display Logic and Input
    console.log("\n ************* Display Logic & Input ******************* \n")
    const oneGwei = ethers.BigNumber.from("1000000000")
    console.log("Get number of ETH from 1 Gwei: ", ethers.utils.formatEther(oneGwei)) // '0.000000001'
    console.log("Get number of Wei (=0) from 1 Gwei: ", ethers.utils.formatUnits(oneGwei, 0)) // '1000000000'
    console.log("Get number of Gwei (=9) from 1 Gwei: ", ethers.utils.formatUnits(oneGwei, 9)) // '1.0'
    console.log("Get number of Gwei (='gwei') from 1 Gwei: ", ethers.utils.formatUnits(oneGwei, "gwei")) // '1.0'

    console.log("Get number of ETH as BN from a string: ", ethers.utils.parseEther("121")) // BigNumber { value: "121000000000000000000" }
    console.log("Get number of Gwei (=9) as BN from a string: ", ethers.utils.parseUnits("121", 9)) // { BigNumber: "121000000000" }
    console.log("Get number of Gwei (='gwei') as BN from a string: ", ethers.utils.parseUnits("121", "gwei"))

    //### Hashing Algorithms - return DtaHexString32
    console.log("\n ************* Hashing ******************* \n")
    console.log(
        "Id (KECCAK256 of text) of Event with args = Event Topic): ",
        ethers.utils.id("UpdateMessage(address,string,string)")
    )
    console.log("Keccak256 of hex array (aBytesLike): ", ethers.utils.keccak256([0x12, 0x34])) // '0x56570de...'
    console.log("Keccak256 of hex string: ", ethers.utils.keccak256("0x1234")) // '0x56570de...'
    console.log("Use the id function to get the keccak256 of a string: ", ethers.utils.id("hello"))
    //The following provides the same result:
    console.log("Get keccak258 of UTF8 byte array: ", ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hello")))

    //### Strings
    console.log("\n ************* String Manipulation ******************* \n")
    //If needed, convert strings to bytes first:
    console.log("Convert string to UTF8 byte array: ", ethers.utils.toUtf8Bytes("hello"))
    console.log("Convert UTF8 byte array to string: ", ethers.utils.toUtf8String([104, 101, 108, 108, 111]))

    //User provides string data in frontend => convert to bytes32 => send to smart contract -
    //this is much cheaper than working with strings in smart contracts
    //If the length of the text below exceeds 31 bytes, it will throw an error.
    console.log("Convert a string to a bytes32 hex string", ethers.utils.formatBytes32String("hello"))
    console.log(
        "Convert a bytes32 hex string to a string: ",
        ethers.utils.parseBytes32String("0x68656c6c6f000000000000000000000000000000000000000000000000000000")
    )

    //### Transctions
    console.log("\n ************* Transactions ******************* \n")
    txnParams = {
        to: account2Address,
        value: ethers.utils.parseEther("1.0"),
        gasPrice: ethers.utils.parseUnits("50", "gwei"),
        nonce: 10,
        data: encodedFunction,
    }

    let txnSerialized = ethers.utils.serializeTransaction(txnParams)
    console.log("Serialized txn (hex string): ", txnSerialized)

    //Parses the transaction properties from a serialized transaction.
    console.log("Parsed txn (txn object): ", ethers.utils.parseTransaction(txnSerialized))
}

testEthersJs()

function getRandomNumberString() {
    return Math.floor(Math.random() * 10000).toString()
}
