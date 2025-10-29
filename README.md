# 🌍 Earth Click Game

A fun click/tap game on Sova Testnet where users represent countries, earn EARTH tokens by clicking, and compete on leaderboards!

## ✨ Features

- 🎮 **Click to Earn**: Tap to earn 1 EARTH token per click
- 🌍 **Country Selection**: Choose your country and compete globally
- 👤 **Username Registration**: Register with username (Discord recommended)
- 📊 **Leaderboards**: 
  - Country leaderboard (top countries by total points)
  - Individual leaderboard (top players in each country)
- 💰 **Submit System**: Accumulate points, then submit with 0.0666 ETH fee
- 🏆 **Competition**: See which country is winning!

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Update contract address:**
   Edit `src/config/constants.ts` and set `CONTRACT_ADDRESS` after deploying the contract.

3. **Run development server:**
```bash
npm run dev
```

4. **Deploy Smart Contract:**
```bash
# Using Hardhat or other deployment tool
# Update CONTRACT_ADDRESS in constants.ts after deployment
```

## 📝 Smart Contract

The contract (`contracts/EarthClickGame.sol`) includes:
- User registration with username and country
- Click point accumulation (off-chain, submitted on-chain)
- Submit function with 0.0666 ETH fee
- Country and individual leaderboards
- Owner withdraw function

## 🎯 How to Play

1. Connect your wallet (MetaMask)
2. Register with username and select country
3. Click the button to earn EARTH tokens (points accumulate)
4. When ready, submit your points (requires 0.0666 ETH fee)
5. Check leaderboards to see your ranking!

## 🌐 Network

Sova Testnet (Chain ID: 120893)
- RPC: https://rpc.testnet.sova.io
- Explorer: https://explorer.testnet.sova.io

## 📄 License

MIT

