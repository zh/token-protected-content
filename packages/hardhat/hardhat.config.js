const { utils } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");

require("hardhat-deploy");

require("@eth-optimism/hardhat-ovm");
require("@nomiclabs/hardhat-ethers");

require("dotenv").config();

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

const defaultNetwork = process.env.NETWORK || "localhost";
const infuraKey = process.env.INFURA_KEY;
const deployerAddress = process.env.DEPLOYER;
const walletURL = process.env.WALLET_URL || "http://localhost:3000";
const tokensContract = "ContentViewToken";

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//

function mnemonic(network = "mainnet") {
  try {
    const fileName = network === "mainnet" ? "mnemonic" : `mnemonic_${network}`;
    return fs.readFileSync(`./${fileName}.txt`).toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `npm run generate` and th  en `npm run account`."
      );
    }
  }
  return "";
}

module.exports = {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    kovan: {
      url: "https://kovan.infura.io/v3/" + infuraKey,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetSmartBCH: {
      url: "http://35.220.203.194:8545", // "https://moeing.tech:9545",
      chainId: 10001,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetSmartBCH: {
      url: "https://smartbch.greyh.at", // "https://global.uat.cash",
      chainId: 10000,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    localAvalanche: {
      url: "http://localhost:9650/ext/bc/C/rpc",
      gasPrice: 250000000000,
      chainId: 43112,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    fujiAvalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 250000000000,
      chainId: 43113,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetAvalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 250000000000,
      chainId: 43114,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetFantom: {
      url: "https://rpc.testnet.fantom.network/",
      chainId: 4002,
      gasPrice: 1800000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    fantomOpera: {
      url: "https://rpc.ftm.tools/",
      chainId: 250,
      gasPrice: 1600000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetHarmony: {
      url: "https://api.s0.b.hmny.io",
      gasPrice: 1000000000,
      chainId: 1666700000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetHarmony: {
      url: "https://api.harmony.one",
      gasPrice: 1000000000,
      chainId: 1666600000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    moondev: {
      url: "http://127.0.0.1:9933",
      chainId: 1281,
      accounts: {
        mnemonic: mnemonic("moon"),
      },
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      gasPrice: 1000000000,
      chainId: 1287,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    moonriver: {
      url: "https://rpc.moonriver.moonbeam.network",
      chainId: 1285,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetTomo: {
      url: "https://rpc.testnet.tomochain.com",
      chainId: 89,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetTomo: {
      url: "https://rpc.tomochain.com",
      chainId: 88,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    kaleido: {
      url: `https://${process.env.KALEIDO_USER}:${process.env.KALEIDO_PASS}@${process.env.KALEIDO_URL}.kaleido.io/`,
      chainId: parseInt(process.env.KALEIDO_CHAINID, 10),
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: "0.7.6",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    mainnetSmartBCH: deployerAddress,
    testnetSmartBCH: deployerAddress,
    fujiAva: deployerAddress,
    mainnetAva: deployerAddress,
    testnetFantom: deployerAddress,
    fantomOpera: deployerAddress,
  },
};

const DEBUG = false;
const qrcode = require("qrcode-terminal");

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task("wallet", "Create a wallet (pk) link")
  .addOptionalParam("url", "URL to add pk to")
  .setAction(async (taskArgs, { network, ethers }) => {
    const url = taskArgs.url ? taskArgs.url : walletURL;
    const randomWallet = ethers.Wallet.createRandom();
    const privateKey = randomWallet._signingKey().privateKey;
    const address = `${url}/#/${privateKey}`;
    qrcode.generate(address, { small: true });
    console.log("🔐 WALLET Generated as " + randomWallet.address + "");
    console.log(`🔗 ${address}`);
  });

task(
  "generate",
  "Create a mnemonic for builder deploys",
  async (_, { ethers }) => {
    const bip39 = require("bip39");
    const hdkey = require("ethereumjs-wallet/hdkey");
    const mnemonic = bip39.generateMnemonic();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
    console.log(
      "🔐 Account Generated as " +
        address +
        " and set as mnemonic in packages/hardhat"
    );
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    );

    fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
  }
);

task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const hdkey = require("ethereumjs-wallet/hdkey");
    const bip39 = require("bip39");
    let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

    qrcode.generate(address);
    console.log("📬 Deployer Account is " + address);
    for (let n in config.networks) {
      //console.log(config.networks[n],n)
      try {
        let provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        let balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);

async function addr(ethers, addr) {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account) => console.log(account));
});

task("blockNumber", "Prints the block number", async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await addr(ethers, taskArgs.account)
    );
    console.log(formatUnits(balance, "ether"), "ETH");
  });

task("mint", "Send ERC-20 tokens")
  .addParam("account", "The account's address")
  .addOptionalParam("amount", "Amount of tokens to send")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("\n\n 🎫 Minting to " + taskArgs.account + "...\n");

    const { deployer } = await getNamedAccounts();
    const contract = await ethers.getContract(tokensContract, deployer);
    const amount = taskArgs.amount ? parseInt(taskArgs.amount, 10) : 10;
    await contract.transfer(
      taskArgs.account,
      ethers.utils.parseEther("" + amount)
    );
  });

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("fund", "Fund account")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await addr(ethers, taskArgs.from);
    debug(`Normalized from address: ${from}`);
    const fromSigner = await ethers.provider.getSigner(from);

    let to;
    if (taskArgs.to) {
      to = await addr(ethers, taskArgs.to);
      debug(`Normalized to address: ${to}`);
    }

    const txRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(
        taskArgs.amount ? taskArgs.amount : "0",
        "ether"
      ).toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(
        taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
        "gwei"
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }
    debug(txRequest.gasPrice / 1000000000 + " gwei");
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner, txRequest);
  });
