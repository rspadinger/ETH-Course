const {
    REACT_APP_ALCHEMY_API_KEY_GOERLI,
    REACT_APP_PRIVATE_KEY,
    REACT_APP_PRIVATE_KEY2,
    REACT_APP_CONTRACT_ADDRESS,
    REACT_APP_CONTRACT_ADDRESS_LOCAL,
} = process.env

// nft-metadata.json uploaded to Pinata => contains 2 properties and an image url (also uploaded to Pinata)
const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeoRUqCTsPE1e2MePKgZhVzzSRUuZp2ADYt8M4mZhcMXu"

let provider, signer, signer2, contract, txn, txnReceipt

async function main() {
    provider = ethers.provider
    const currentNetwork = await provider.getNetwork()

    if (currentNetwork.chainId.toString().includes(1337)) {
        console.log("We are using a local network!")
        contract = await ethers.getContractAt("MyNFT", REACT_APP_CONTRACT_ADDRESS_LOCAL)
        ;[signer, signer2] = await ethers.getSigners()
    } else {
        console.log("We are using a remote network!")
        const contractJson = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
        //provider = new ethers.providers.AlchemyProvider((network = "goerli"), REACT_APP_ALCHEMY_API_KEY_GOERLI)
        //provider = ethers.getDefaultProvider((network = "goerli"))
        signer = new ethers.Wallet(REACT_APP_PRIVATE_KEY, provider)
        signer2 = new ethers.Wallet(REACT_APP_PRIVATE_KEY2, provider)
        //contract = new ethers.Contract(REACT_APP_CONTRACT_ADDRESS, contractJson.abi, signer)
        contract = await ethers.getContractAt("MyNFT", REACT_APP_CONTRACT_ADDRESS)
    }

    // mint an NFT to signer2
    txn = await contract.mintNFT(signer2.address, tokenURI)
    txnReceipt = await txn.wait()

    // //can also be done by sending a txn with the encoded function data =>
    // //that's typically used for a web app when we want Metamask to sign thhe txn
    // const iface = new ethers.utils.Interface(["function mintNFT(address recipient, string memory tokenURI)"])
    // const txData = iface.encodeFunctionData("mintNFT", [signer2.address, tokenURI])
    // const txnParams = {
    //     from: signer.address,
    //     to: contract.address,
    //     data: txData,
    // }
    // txn = await signer.sendTransaction(txnParams)
    // txnReceipt = await txn.wait()
    // console.log(`NFT Minted on Goerli! Check it out at: https://goerli.etherscan.io/tx/${txn.hash}`)

    // display how many NFT's (of this specific contract) are owned by the recipient
    console.log("Number of NFT's owned by the recipient: ", await contract.balanceOf(signer2.address))

    // display the owner of NFT with Id = 1
    console.log("Owner of NFT with Id 1: ", await contract.ownerOf(1))

    // transfer NFT with Id = 1 to another account => swap signer and signer2 on the method call below
    //if we want to transfer it back, we also need to change the signer => safeTransfer requires :: from == owner && msg.sender == owner
    contract = await contract.connect(signer)

    //https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
    //use this on methods with the same name
    //console.log("Contract: ", contract)
    txn = await contract["safeTransferFrom(address,address,uint256)"](signer.address, signer2.address, 1)
    txnReceipt = await txn.wait()

    console.log("New owner of NFT with Id 1: ", await contract.ownerOf(1))
}

main()

//opensea: https://testnets.opensea.io/
