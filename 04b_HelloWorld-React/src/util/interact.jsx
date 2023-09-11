import { ethers } from "ethers"
import contractJson from "../contract.json"
//debugger

const { VITE_CONTRACT_ADDRESS } = import.meta.env
const provider = new ethers.BrowserProvider(window.ethereum)

export const contract = new ethers.Contract(VITE_CONTRACT_ADDRESS, contractJson.abi, provider)

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            })

            window.ethereum.on("accountsChanged", (newAddress) => {
                console.log("New account address: ", newAddress)
            })
            window.ethereum.on("chainChanged", (networkId) => {
                console.log("New network Id: ", networkId)
            })

            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
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
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
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

export const loadCurrentMessage = async () => {
    return await contract.message()
}

export const updateMessage = async (address, message) => {
    if (!window.ethereum || address === null) {
        return {
            status: "💡 Connect your Metamask wallet to update the message on the blockchain.",
        }
    }

    if (message.trim() === "") {
        return {
            status: "❌ Your message cannot be an empty string.",
        }
    }

    //encode the function we want to call
    let iface = new ethers.Interface(contractJson.abi)
    const myData = iface.encodeFunctionData("updateMessage", [message])

    //set up transaction parameters
    const transactionParameters = {
        to: VITE_CONTRACT_ADDRESS,
        from: address,
        data: myData,
    }

    try {
        //sign the transaction using Metamask
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        })
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" rel="noreferrer" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will be updated automatically.
                </span>
            ),
        }
    } catch (error) {
        return {
            status: "😥 " + error.message,
        }
    }
}
