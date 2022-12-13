const { REACT_APP_PRIVATE_KEY, REACT_APP_PRIVATE_KEY2, REACT_APP_CONTRACT_ADDRESS, REACT_APP_CONTRACT_ADDRESS_LOCAL } =
    process.env

// nft-metadata.json uploaded to Pinata => contains 2 properties and an image url (also uploaded to Pinata)
const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeoRUqCTsPE1e2MePKgZhVzzSRUuZp2ADYt8M4mZhcMXu"

let provider, signer, signer2, contract, txn, txnReceipt

async function main() {
    //### get provider and network
    provider = null
    const currentNetwork = null

    //### configure contract and signers
    if (currentNetwork.chainId.toString().includes(1337)) {
        console.log("We are using a local network!")
        contract = null
        ;[signer, signer2] = null
    } else {
        console.log("We are using a remote network!")
        const contractJson = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
        signer = null
        signer2 = null
        contract = null
    }

    //### mint an NFT to signer2 and provide the metadata url (stored on IPFS)

    //### display how many NFT's (of type MNFT) are owned by the recipient
    console.log("Number of NFT's owned by the recipient: ")

    //### display the owner of NFT with Id = 1
    console.log("Owner of NFT with Id 1: ")

    //### transfer (safeTransferFrom) the NFT with Id = 1 to another account => swap signer and signer2 on the method call below
    //if we want to transfer it back, we also need to change the signer => safeTransfer requires :: from == owner && msg.sender == owner
    //the ERC721 contract provides 2 methods with the name: safeTransferFrom => therefore we can't use: contract.safeTransferFrom...
    //we must use: contract["safeTransferFrom(address,address,uint256)"](args...)

    //### display the owner of NFT with Id = 1
    console.log("New owner of NFT with Id 1: ")
}

main()

//opensea: https://testnets.opensea.io
