import { ethers } from "ethers"
import { pinJSONToIPFS } from "./pinata.jsx"
import contractJson from "../contract.json"

const { VITE_CONTRACT_ADDRESS, VITE_CONTRACT_ADDRESS_LOCAL } = import.meta.env

let provider, signer, contract, contractAddress, selectedAddress

;(async function setContractAddress() {
    if (window.ethereum) {
        //TODO get Browserprovider, network (and Signer)
        provider = null        
        const currentNetwork = null
        //signer = null

        if (currentNetwork.chainId.toString().includes(1337)) {
            contractAddress = VITE_CONTRACT_ADDRESS_LOCAL
        } else {
            contractAddress = VITE_CONTRACT_ADDRESS
        }

        //TODO create a contract instance
    }
})()

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            //TODO get already connected accounts
            const addressArray = null

            if (addressArray.length > 0) {
                selectedAddress = addressArray[0]
                return {
                    address: selectedAddress,
                    status: "👆🏽 Provide an image url, a name and a description for your NFT.",
                }
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                }
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            }
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            //TODO request all available accounts from MM and connect one or more of them with the DAPP
            const addressArray = null

            if (addressArray.length > 0) {
                selectedAddress = addressArray[0]
                return {
                    address: selectedAddress,
                    status: "👆🏽 Provide an image url, a name and a description for your NFT.",
                }
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                }
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            }
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
}

//image: https://gateway.pinata.cloud/ipfs/QmcSM8rxpnmknRu6HX9KWmqG4QJaBfijF3sZeuvSeDfNB7
export const mintNFT = async (name, description, imageUrl) => {
    if (name.trim() === "" || description.trim() === "" || imageUrl.trim() === "") {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }

    //https://docs.pinata.cloud/api-reference/endpoint/ipfs/pin-json-to-ipfs
    //https://docs.opensea.io/docs/metadata-standards
    const metadata = {
        pinataMetadata: {
            name: "Cat NFT",
            keyvalues: {
                "some key": "some value",
            },
        },
        pinataContent: {
            name,
            description,
            image: imageUrl,
            attributes: [
                {
                    trait_type: "Fur",
                    value: "White",
                },
                {
                    trait_type: "Eye color",
                    value: "Blue",
                },
            ],
        },
    }

    const pinataResponse = await pinJSONToIPFS(metadata)
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    }
    const tokenURI = pinataResponse.pinataUrl

    try {
        //TODO send the transaction using Metamask => eth_sendTransaction , return txHash
        //create transactionParameters with encoded function data
        const txHash = null

        //TODO alternative way (without using eth_sendTransaction) => call "updateMessage" directly on the contract instance
        //const txResponse = null
        //const txHash = txResponse.hash

        return {
            success: true,
            status: (
                <a target="_blank" rel="noreferrer" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
                    ✅ Check out your transaction on Etherscan
                </a>
            ),
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        }
    }
}
