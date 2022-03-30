require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/1vDEUZnf1mSeJll62xCcOj8B24Wq2Mij`,
      accounts: [`${POLYGON_PRIVATE_KEY}`],
    },
  },
};
