//### import ethers, contractJson

const { VITE_CONTRACT_ADDRESS } = import.meta.env

//### set the provider

//### export the contract

export const getCurrentWalletConnected = async () => {
    //### verify if MM is installed
    if (false) {
        try {
            //### get already connected Metamask accounts => eth_accounts
            const addressArray = null

            //### log a message whenever the network or an account changes => accountsChanged & chainChanged

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
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
}

export const connectWallet = async () => {
    //### verify if MM is installed
    if (false) {
        try {
            //### get all addresses from metamask => eth_requestAccounts
            const addressArray = null

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
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
}

//### loadCurrentMessage

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

    //### encode the function we want to call

    //### set up transaction parameters => transactionParameters : to, from, data
    const transactionParameters = null

    try {
        //### send the transaction using Metamask => eth_sendTransaction , return txHash

        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
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
