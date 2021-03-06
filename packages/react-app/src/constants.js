require("dotenv").config();

export const AUTH_SERVER = "http://localhost:49832";
export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export const INFURA_ID = process.env.REACT_APP_INFURA_KEY;
export const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY;
// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";
export const FIAT_PRICE = process.env.REACT_APP_FIAT_PRICE === "NO";
export const GAS_PRICE = 1000000000; // fix this for your network

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    coin: "ETH",
    blockExplorer: "",
    rpcUrl: "http://" + window.location.hostname + ":8545",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    coin: "ETH",
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    coin: "XDAI",
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    coin: "MATIC",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://explorer-mainnet.maticvigil.com/",
  },
  testnetSmartBCH: {
    name: "SmartBCH-T",
    color: "#7003DD",
    chainId: 10001,
    coin: "BCH",
    rpcUrl: "https://moeing.tech:9545", // "http://35.220.203.194:8545",
    blockExplorer: "https://smartscan.cash/",
    gasPrice: 1050000000,
  },
  mainnetSmartBCH: {
    name: "SmartBCH",
    color: "#ff8b9e",
    chainId: 10000,
    coin: "BCH",
    rpcUrl: "https://global.uat.cash", // https://smartbch.greyh.at
    blockExplorer: "https://smartscan.cash/",
    gasPrice: 1050000000,
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    blockExplorer: "",
    coin: "AVAX",
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "Fuji",
    color: "#7003DD",
    chainId: 43113,
    coin: "AVAX",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorer: "https://testnet.showtrace.io",
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "Mainnet",
    color: "#ff8b9e",
    chainId: 43114,
    coin: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://showtrace.io",
    gasPrice: 225000000000,
  },
  testnetFantom: {
    name: "Fantom Testnet",
    color: "#7003DD",
    chainId: 4002,
    coin: "FTM",
    rpcUrl: "https://rpc.testnet.fantom.network/",
    blockExplorer: "https://testnet.ftmscan.com/",
    gasPrice: 1800000000,
  },
  fantomOpera: {
    name: "Fantom Opera",
    color: "#ff8b9e",
    chainId: 250,
    coin: "FTM",
    rpcUrl: "https://rpc.fmt.tools/",
    blockExplorer: "https://ftmscan.com/",
    gasPrice: 1600000000,
  },
  testnetHarmony: {
    name: "Harmony Testnet",
    color: "#00b0ef",
    chainId: 1666700000,
    coin: "ONE",
    blockExplorer: "https://explorer.pops.one/",
    rpcUrl: "https://api.s0.b.hmny.io",
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "Harmony Mainnet",
    color: "#00b0ef",
    chainId: 1666600000,
    coin: "ONE",
    blockExplorer: "https://explorer.harmony.one/",
    rpcUrl: "https://api.harmony.one",
    gasPrice: 1000000000,
  },
  moondev: {
    name: "Local Moonbase",
    color: "#ff8b9e",
    chainId: 1281,
    coin: "DEV",
    rpcUrl: "http://127.0.0.1:9933",
  },
  moonbase: {
    name: "Moonbase Alpha",
    color: "#ff8b9e",
    chainId: 1287,
    coin: "DEV",
    blockExplorer: "https://moonbase-blockscout.testnet.moonbeam.network/",
    rpcUrl: "https://rpc.testnet.moonbeam.network",
    gasPrice: 1000000000,
  },
  moonriver: {
    name: "Moonriver",
    color: "#ff8b9e",
    chainId: 1285,
    coin: "MOVR",
    blockExplorer: "https://blockscout.moonriver.moonbeam.network/",
    rpcUrl: "https://rpc.moonriver.moonbeam.network",
    gasPrice: 1000000000,
  },
  testnetTomo: {
    name: "TomoChain Testnet",
    color: "#00b0ef",
    chainId: 89,
    coin: "TOMO",
    blockExplorer: "https://scan.testnet.tomochain.com/",
    rpcUrl: "https://rpc.testnet.tomochain.com",
    gasPrice: 1000000000,
  },
  mainnetTomo: {
    name: "TomoChain Mainnet",
    color: "#00b0ef",
    chainId: 88,
    coin: "TOMO",
    blockExplorer: "https://scan.tomochain.com/",
    rpcUrl: "https://rpc.tomochain.com",
    gasPrice: 1000000000,
  },
  kaleido: {
    name: "Kaleido",
    color: "#7003DD",
    chainId: parseInt(process.env.REACT_APP_KALEIDO_CHAINID, 10),
    rpcUrl: `https://${process.env.REACT_APP_KALEIDO_URL}.kaleido.io`,
    user: process.env.REACT_APP_KALEIDO_USER,
    pass: process.env.REACT_APP_KALEIDO_PASS,
    coin: "STO",
    gasPrice: 1000000000,
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};
