require("@nomicfoundation/hardhat-toolbox");

const constants = require("./Utils/constants.js");

// npx hardhat run --network sepolia scripts/Deploy.js

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: constants.SEPOLIA_RPC,
      chainId: constants.SEPOLIA_CHAIN_ID,
      accounts: {
        mnemonic: constants.MNEMONIC,
      }
    }
  }
};