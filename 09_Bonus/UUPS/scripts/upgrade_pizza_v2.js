const { PROXY_CONTRACT_ADDRESS } = process.env

async function main() {
    const PizzaV2Factory = await ethers.getContractFactory("PizzaV2")

    console.log("Upgrading Pizza...")

    await upgrades.upgradeProxy(PROXY_CONTRACT_ADDRESS, PizzaV2Factory)

    console.log("Pizza upgraded successfully")
}

main()
