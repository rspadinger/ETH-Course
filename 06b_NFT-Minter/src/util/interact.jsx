import { ethers } from "ethers"
import { pinJSONToIPFS } from "./pinata.jsx"
import contractJson from "../contract.json"

const { VITE_CONTRACT_ADDRESS, VITE_CONTRACT_ADDRESS_LOCAL } = import.meta.env

let provider, signer, contract, contractAddress, selectedAddress
;(async function setContractAddress() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner()
        const currentNetwork = await provider.getNetwork()

        if (currentNetwork.chainId.toString().includes(1337)) {
            contractAddress = VITE_CONTRACT_ADDRESS_LOCAL
        } else {
            contractAddress = VITE_CONTRACT_ADDRESS
        }

        contract = new ethers.Contract(contractAddress, contractJson.abi, signer)
    }
})()

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            })

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
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            })

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

    //https://docs.pinata.cloud/pinata-api/pinning/pin-json
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
    console.log(tokenURI)

    //alternative way of sending a transaction
    let iface = new ethers.Interface(["function mintNFT(address recipient, string memory tokenURI)"])
    const myData = iface.encodeFunctionData("mintNFT", [selectedAddress, tokenURI])

    const transactionParameters = {
        to: contractAddress,
        from: selectedAddress,
        data: myData,
    }

    try {
        // const txHash = await window.ethereum.request({
        //     method: "eth_sendTransaction",
        //     params: [transactionParameters],
        // })

        const txResponse = await contract.mintNFT(selectedAddress, tokenURI)
        const txHash = txResponse.hash

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
