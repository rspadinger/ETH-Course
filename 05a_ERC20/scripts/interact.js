const { CONTRACT_ADDRESS } = process.env

async function main() {
    //TODO get contract and 2 signers
    let contract = null
    const [signer1, signer2] = null

    //TODO check balance of deployer account => properly format the result
    console.log("MT balance of deployer account: ")

    //TODO transfer 500 MT's to second Hardhat account

    //TODO display the MT balance of the second account
    console.log("MT balance of second account: ")

    //TODO allow the second account to spend up to 50 MT's from the deployer account

    //TODO display how many tokens the second account can spend on behalf of the deployer  account
    console.log("Allowance of second account on behalf of the deployer account: ")

    //TODO make signer2 transfer 50 MT's from signer1 to signer2

    console.log("Balance Signer2 before transfer: ")

    console.log("Balance Signer2 after transfer: ")
}

main()
