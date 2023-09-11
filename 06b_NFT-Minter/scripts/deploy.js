async function main() {
    const myNFT = await ethers.deployContract("MyNFT")
    await myNFT.waitForDeployment()

    console.log("myNFT deployed to:", myNFT.target)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
