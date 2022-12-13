//npx hardhat run scripts/web3.js

const API_URL_GOERLI = process.env.API_URL_GOERLI
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const CONTRACT_ADDRESS_LOCAL = process.env.CONTRACT_ADDRESS_LOCAL

const contractJson = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json")

let web3, provider, contract

async function testWeb3Js() {
    //*********** PROVIDER ***************** */

    ////create a web3 instance connected to a local node like Ganache
    web3 = new Web3("http://localhost:8545")
    //console.log("Provider: ", await web3.eth.currentProvider)

    ////alternatively, create a provider
    //provider = new Web3.providers.HttpProvider("http://localhost:8545")
    //web3.setProvider(provider)

    ////create a web3 instance connected to a third party provider like Alchemy
    // web3 = new Web3(API_URL_GOERLI)

    //*********** web3.eth ***************** */

    //get all accounts provided by the node
    const [acc1, acc2, acc3] = await web3.eth.getAccounts()
    //console.log("Node accounts: ", await web3.eth.getAccounts())
    web3.eth.defaultAccount = "0x3b12597588FD65a32C68D57CfcF03aC0D80D4893"

    console.log("Account balance: ", await web3.eth.getBalance("0x3b12597588FD65a32C68D57CfcF03aC0D80D4893"))

    console.log("Gas price: ", await web3.eth.getGasPrice())
    console.log("Block number: ", await web3.eth.getBlockNumber())
    // console.log(
    //     "Txn receipt: ",
    //     await web3.eth.getTransactionReceipt("0xf818417364f795a19245b768ee37474d6811c024908e3b7a74830024454e5b6f")
    // )

    ////send a transtion - transfer Eth to another account
    web3.eth.sendTransaction({
        to: "0xF3C0E8e2b6F31Ab081a791625FaA0D3e0f04E217",
        value: web3.utils.toWei("1", "ether"),
    })

    //*********** web3.eth.contract ***************** */

    ////create a contract instance from the ABI and the SC address
    contract = new web3.eth.Contract(contractJson.abi, CONTRACT_ADDRESS_LOCAL)
    ////Read-only message call
    console.log("Result of call: ", await contract.methods.message().call())

    ////Write message call
    const response = await contract.methods
        .updateMessage("test")
        .send({ from: acc1 })
        .on("transactionHash", function (hash) {
            console.log("Txn Hash: ", hash)
        })
        .on("receipt", function (receipt) {
            //console.log("Txn Receipt: ", receipt)
            console.log("Event parameters - from, oldStr, newStr: ", receipt.events.UpdateMessage.returnValues)
        })

    ////subscribe to an event - not supported on HttpProvider
    // web3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8545"))
    // contract.events
    //     .UpdateMessage({
    //         //filter: { from: [acc1] },
    //         fromBlock: 0,
    //         topics: [web3.utils.sha3("UpdateMessage(address,string,string)")]
    //     })
    //     //Fires on each incoming event
    //     .on("data", function (event) {
    //         //console.log("Evant data: ", event)
    //     })

    ////encode the ABI for a method and perform a function call
    const encodedFunction = await contract.methods.message().encodeABI()
    const encodedFunction2 = await contract.methods.updateMessage("test").encodeABI()
    console.log("Encoded ABI: ", encodedFunction)
    console.log("Encoded ABI2: ", encodedFunction2)

    ////get the function signature - first 4 bytes of the sha3 hash
    console.log("Encoded Function Sig: ", web3.eth.abi.encodeFunctionSignature("message()"))
    console.log(
        "Encoded Function Sig2: ",
        web3.eth.abi.encodeFunctionSignature("updateMessage(string memory newMessage)")
    )

    const txn = {
        to: CONTRACT_ADDRESS_LOCAL,
        data: encodedFunction,
    }
    //console.log("Result of call: ", await web3.eth.call(txn))

    //*********** web3.eth.utils ***************** */
    console.log("1234 BN: ", new web3.utils.BN(1234).toString())
    console.log("1234 BN: ", new web3.utils.BN("1234").toString())
    console.log("SHA3: ", web3.utils.sha3("abc"))
    console.log("Is addrress: ", web3.utils.isAddress("0x123"))
    console.log("Checksum address: ", web3.utils.toChecksumAddress("0x3b12597588FD65a32C68D57CfcF03aC0D80D4893"))
    console.log("1234 To hex: ", web3.utils.toHex(1234))
    console.log("abc to hex: ", web3.utils.toHex("abc"))
    console.log("123 To BN: ", web3.utils.toBN(123))
    console.log("123 To BN: ", web3.utils.toBN(123).toString())
    console.log("0xea hex to number string: ", web3.utils.hexToNumberString("0xea"))
    console.log("0xea hex to number: ", web3.utils.hexToNumber("0xea"))
    console.log("234 number to hex: ", web3.utils.numberToHex("234"))
    console.log("0x48656c6c6f hex to UTF8: ", web3.utils.hexToUtf8("0x48656c6c6f"))
    console.log("Hello UTF8 to hex: ", web3.utils.utf8ToHex("Hello"))
    console.log("hex to bytes: ", web3.utils.hexToBytes("0x0000ea"))
    console.log("bytes to hex: ", web3.utils.bytesToHex([72, 101, 108, 108, 111, 33, 36]))
    console.log("1 ETH to wei: ", web3.utils.toWei("1", "ether"))
    console.log("10000000 wei to ETH: ", web3.utils.fromWei("10000000", "ether"))
}

testWeb3Js()
