require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.4',
  networks: {
    ropsten: {
      url: process.env.INFURA_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.INFURA_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};