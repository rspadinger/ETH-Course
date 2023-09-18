import { useEffect, useState } from "react"
import {
    contract,
    getCurrentWalletConnected,
    connectWallet,
    loadCurrentMessage,
    updateMessage,
} from "./util/interact.jsx"

const HelloWorld = () => {
    const [walletAddress, setWallet] = useState("")
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("No connection to the network.")
    const [newMessage, setNewMessage] = useState("")

    useEffect(() => {
        async function init() {
            //TODO verify if a Metamask address is already connected with the app and retrieve the address and status => set wallet & status
            const { address, status } = null
            setWallet("")

            if (address) {
                //TODO load current message & set message
                const message = null

                addSmartContractListener()
                addWalletListener()
            }            
        }

        init()
    }, [])

    function addSmartContractListener() {
        //TODO listen to the UpdateMessage event => setMessage, setNewMessage & setStatus("🎉 Your message has been updated!")
    }

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0])
                    setStatus("👆🏽 Write a message in the text-field above.")
                } else {
                    setWallet("")
                    setStatus("🦊 Connect to Metamask using the top right button.")
                }
            })
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            )
        }
    }

    const connectWalletPressed = async () => {
        //TODO connect to Metamask and update the status & address
        const { address, status } = null
        
        setStatus(status)
        setWallet(address)
    }

    const onUpdatePressed = async () => {
        //TODO call updateMessage and update the state
        const { status } = null

        setStatus(status)
    }

    return (
        <div id="container">
            <h1>Hello World - React Metamask</h1>
            <button id="walletButton" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                    "Connected: " + String(walletAddress).substring(0, 6) + "..." + String(walletAddress).substring(38)
                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>

            <h2 style={{ paddingTop: "40px" }}>Current Message:</h2>
            <p>{message}</p>

            <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

            <div>
                <input
                    type="text"
                    placeholder="Update the message in your smart contract."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <p id="status">{status}</p>

                <button id="publish" onClick={onUpdatePressed}>
                    Update
                </button>
            </div>
        </div>
    )
}

export default HelloWorld
