const hre = require("hardhat");

async function main() {
  console.log("Deploying EarthClickGame...");
  
  // Get signers
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers found. Check your PRIVATE_KEY in .env file.");
  }
  
  const deployer = signers[0];
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.warn("⚠️ Warning: Account balance is 0. You may need SOVA tokens for gas.");
  }
  
  // Try both contract names (case variations)
  let ContractFactory;
  try {
    ContractFactory = await hre.ethers.getContractFactory("EarthClickGame");
  } catch (e) {
    try {
      ContractFactory = await hre.ethers.getContractFactory("EARTH");
    } catch (e2) {
      throw new Error("Could not find contract. Make sure contract name matches.");
    }
  }
  
  console.log("Deploying contract...");
  const game = await ContractFactory.connect(deployer).deploy();
  await game.waitForDeployment();
  
  const address = await game.getAddress();
  console.log("✅ EarthClickGame deployed to:", address);
  console.log("\n📝 Update CONTRACT_ADDRESS in src/config/constants.ts with:");
  console.log(`export const CONTRACT_ADDRESS = '${address}' as const;`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

