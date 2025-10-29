require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sovaTestnet: {
      url: "https://rpc.testnet.sova.io",
      chainId: 120893,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      sovaTestnet: "your-api-key-here" // Sova testnet might not need API key or use different verification
    },
    customChains: [
      {
        network: "sovaTestnet",
        chainId: 120893,
        urls: {
          apiURL: "https://explorer.testnet.sova.io/api",
          browserURL: "https://explorer.testnet.sova.io"
        }
      }
    ]
  }
};
