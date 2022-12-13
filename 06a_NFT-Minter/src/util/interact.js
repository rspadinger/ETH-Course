import { ethers } from "ethers"
import { pinJSONToIPFS } from "./pinata.js"

const { REACT_APP_CONTRACT_ADDRESS, REACT_APP_CONTRACT_ADDRESS_LOCAL } = process.env

let provider, contractAddress, selectedAddress
;(async function setContractAddress() {
    if (window.ethereum) {
        //### get web3provider and network
        provider = null
        const currentNetwork = null

        if (currentNetwork.chainId.toString().includes(1337)) {
            contractAddress = REACT_APP_CONTRACT_ADDRESS_LOCAL
        } else {
            contractAddress = REACT_APP_CONTRACT_ADDRESS
        }
    }
})()

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            //### get already connected accounts
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
            //### request all available accounts from MM and connect one or more of them with the DAPP
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

//image: https://gateway.pinata.cloud/ipfs/Qmd17pF2uHL1ZocvZi6yH4651ka6wNRUcMsDBW9mc14J1H
export const mintNFT = async (name, description, imageUrl) => {
    if (name.trim() === "" || description.trim() === "" || imageUrl.trim() === "") {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }

    //https://docs.pinata.cloud/pinata-api/pinning/pin-json
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

    //### encode the function data for the "mintNFT" smart contract function

    //### create the txn parameters (from, to and encoded function data)
    const transactionParameters = {}

    try {
        //### send the transaction using Metamask => eth_sendTransaction
        const txHash = null

        return {
            success: true,
            status: (
                <a target="_blank" rel="noreferrer" href={`https://goerli.etherscan.io/tx/${txHash}`}>
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
