const { VITE_PRIVATE_KEY, VITE_PRIVATE_KEY2, VITE_CONTRACT_ADDRESS, VITE_CONTRACT_ADDRESS_LOCAL } =
    process.env

// nft-metadata.json uploaded to Pinata => contains 2 properties and an image url (also uploaded to Pinata)
const tokenURI = "https://gateway.pinata.cloud/ipfs/QmPzekhpuWN2j5yXome5dJYHy2KYHmPBdZ4qKiNbjgqRpz"

let provider, signer, signer2, contract, txn, txnReceipt

async function main() {
    //TODO get provider and network
    provider = null
    const currentNetwork = null

    //TODO configure contract and signers
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

    //TODO mint an NFT to signer2 and provide the metadata url (stored on IPFS)

    //TODO display how many NFT's (of type MNFT) are owned by the recipient
    console.log("Number of NFT's owned by the recipient: ")

    //TODO display the owner of NFT with Id = 0
    console.log("Owner of NFT with Id 0: ")

    //TODO transfer (safeTransferFrom) the NFT with Id = 0 to another account => swap signer and signer2 on the method call below
    //if we want to transfer it back, we also need to change the signer => safeTransfer requires :: from == owner && msg.sender == owner
    

    //TODO display the owner of NFT with Id = 0
    console.log("New owner of NFT with Id 0: ")
}

main()