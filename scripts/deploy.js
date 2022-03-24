async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const OutstandingOwls = await ethers.getContractFactory("OutstandingOwls");
    const owls = await OutstandingOwls.deploy();
    await owls.deployed();
  
    console.log("Contract address:", owls.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });