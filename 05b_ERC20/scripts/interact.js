const { CONTRACT_ADDRESS } = process.env

async function main() {
    let contract = await ethers.getContractAt("MyToken", CONTRACT_ADDRESS)

    const [signer1, signer2] = await ethers.getSigners()

    //check balance of deployer account
    console.log("MT balance of deployer account: ", ethers.utils.formatEther(await contract.balanceOf(signer1.address)))

    //transfer 500 MT's to second Hardhat account
    await contract.transfer(signer2.address, ethers.utils.parseEther("500"))

    //display the MT balance of the second account
    console.log("MT balance of second account: ", ethers.utils.formatEther(await contract.balanceOf(signer2.address)))

    //allow the second account to spend up to 50 MT's from the deployer account
    await contract.approve(signer2.address, ethers.utils.parseEther("50"))

    //display how many tokens the second account can spend on behalf of the deployer  account
    console.log(
        "Allowance of second account on behalf of the deployer account: ",
        ethers.utils.formatEther(await contract.allowance(signer1.address, signer2.address))
    )

    contract = await contract.connect(signer2)

    console.log("Balance Signer2: ", ethers.utils.formatEther(await contract.balanceOf(signer2.address)))
    await contract.transferFrom(signer1.address, signer2.address, ethers.utils.parseEther("50"))
    console.log("Balance Signer2: ", ethers.utils.formatEther(await contract.balanceOf(signer2.address)))
}

main()
