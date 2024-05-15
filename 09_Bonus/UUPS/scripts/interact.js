//Proxy: 0xa549C74805eE5908Cb1DA2F01d51f719Be441889
//Pizza: 0xE8d2260Cb5D9B2E5211259fB8e7355fC1a127320
//PizzaV2: 0xd04fd80f7812AF6b42B7F956F8ed0d213d2ce57D

const PizzaABI = require("../artifacts/contracts/Pizza.sol/Pizza.json")
const PizzaABI2 = require("../artifacts/contracts/PizzaV2.sol/PizzaV2.json")

const { PROXY_CONTRACT_ADDRESS } = process.env

async function main() {
    const [signer] = await ethers.getSigners()
    const provider = await ethers.provider

    let contract = await ethers.getContractAt("PizzaV2", PROXY_CONTRACT_ADDRESS)

    //outside Hardhat => update ABI after contract upgrade
    //let contract = new ethers.Contract(PROXY_CONTRACT_ADDRESS, PizzaABI2.abi, signer)

    console.log("Pizza slices: ", await contract.slices())

    // only available on upgraded contract
    console.log("Pizza version: ", await contract.pizzaVersion())

    //Slot number => see: ERC1967Utils.sol => "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v5.0/contracts/proxy/ERC1967/ERC1967Utils.sol
    console.log(
        "Address of implementation contract: ",
        await provider.getStorage(
            PROXY_CONTRACT_ADDRESS,
            "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        )
    )
}

main()
