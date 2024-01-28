require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Default network selected to Sepolia
  defaultNetwork: "ganache",
  networks: {
    // Default hardhat network
    hardhat: {
    },
    // Sepolia test network setup
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    // Ganache CLI network setup
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      from: `0x844ecD4FC2CfeFE592a672DeaE62e7b1857887cF`,
      gas: 3000000
    }
  },
  // Solidity version 0.7.0 used for contract deployment
  solidity: {
    version: "0.7.0",
  
  }
}
