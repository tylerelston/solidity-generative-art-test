const contractName = "Auction";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying conctracts with:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory(contractName);
    const token = await Token.deploy({ value: hre.ethers.utils.parseEther("0.01") });

    console.log("Auction contract address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })