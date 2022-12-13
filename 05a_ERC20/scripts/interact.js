const { CONTRACT_ADDRESS } = process.env

async function main() {
    let contract = null

    //### check balance of deployer account
    console.log("MT balance of deployer account: ")

    //### transfer 500 MT's to second Hardhat account

    //### display the MT balance of the second account
    console.log("MT balance of second account: ")

    //### allow the second account to spend up to 50 MT's from the deployer account

    //### display how many tokens the second account can spend on behalf of the deployer  account
    console.log("Allowance of second account on behalf of the deployer account: ")
}

main()
