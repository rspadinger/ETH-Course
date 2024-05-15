const SLICES = 8

async function main() {
    const PizzaFactory = await ethers.getContractFactory("Pizza")

    console.log("Deploying Pizza...")

    const pizza = await upgrades.deployProxy(PizzaFactory, [SLICES], {
        initializer: "initialize",
        kind: "uups",
    })
    await pizza.waitForDeployment()

    console.log("Pizza deployed to:", pizza.target)
}

main()
