const hre = require("hardhat");

async function main() {
  const contractAddress = "0xD749D9Aff970082dd0910dF5af09b588a07F7ddd";
  
  console.log("Verifying contract at:", contractAddress);
  console.log("Network: Sova Testnet");
  
  try {
    // Try to verify
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor arguments for this contract
      network: "sovaTestnet"
    });
    
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n📝 If auto-verify doesn't work, you can verify manually:");
      console.log(`1. Go to: https://explorer.testnet.sova.io/address/${contractAddress}`);
      console.log("2. Click 'Contract' tab");
      console.log("3. Click 'Verify and Publish'");
      console.log("4. Paste the contract code from contracts/EARTH.sol");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

