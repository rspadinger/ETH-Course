async function main() {
    const helloWorld = await ethers.deployContract("HelloWorld", ["Initial message"])
    //const helloWorld = await ethers.deployContract("HelloWorld", ["Initial message"], {value: ethers.parseEther("0.001") });

    await helloWorld.waitForDeployment()

    console.log("HelloWorld deployed to:", helloWorld.target)
}

main()
