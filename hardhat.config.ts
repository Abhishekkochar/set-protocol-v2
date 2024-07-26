require("dotenv").config();
require("hardhat-contract-sizer");

import chalk from "chalk";
import { HardhatUserConfig } from "hardhat/config";
import { privateKeys } from "./utils/wallets";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import "./tasks";

const forkingConfig = {
  url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_TOKEN}`,
  blockNumber: 6378120,
};

checkForkedProviderEnvironment();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.10",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      forking: (process.env.FORK) ? forkingConfig : undefined,
      accounts: getHardhatPrivateKeys(),
      gas: 12000000,
      blockGasLimit: 12000000
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      forking: (process.env.FORK) ? forkingConfig : undefined,
      timeout: 200000,
      gas: 12000000,
      blockGasLimit: 12000000
    },
    // sepolia: {
    //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_TOKEN}`,
    //   // @ts-ignore
    //   accounts: [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    // },
  },
  // @ts-ignore
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
    externalArtifacts: ["external/**/*.json"],
  },
  // @ts-ignore
  contractSizer: {
    runOnCompile: false,
  },

  // These are external artifacts we don't compile but would like to improve
  // test performance for by hardcoding the gas into the abi at runtime
  // @ts-ignore
  externalGasMods: [
    "external/abi/perp",
  ],
};

function getHardhatPrivateKeys() {
  return privateKeys.map(key => {
    const ONE_MILLION_ETH = "1000000000000000000000000";
    return {
      privateKey: key,
      balance: ONE_MILLION_ETH,
    };
  });
}

function checkForkedProviderEnvironment() {
  if (process.env.FORK &&
      (!process.env.ALCHEMY_TOKEN || process.env.ALCHEMY_TOKEN === "fake_alchemy_token")
     ) {
    console.log(chalk.red(
      "You are running forked provider tests with invalid Alchemy credentials.\n" +
      "Update your ALCHEMY_TOKEN settings in the `.env` file."
    ));
    process.exit(1);
  }
}

export default config;
