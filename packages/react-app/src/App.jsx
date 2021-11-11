import WalletConnectProvider from "@walletconnect/web3-provider";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Alert, Button, Card, Col, Divider, Input, Menu, Row } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import Vimeo from "@u-wave/react-vimeo";
import "./App.css";
import {
  Account,
  Balance,
  Contract,
  EtherInput,
  Faucet,
  Header,
  NetworkSelect,
  ThemeSwitch,
  TokenBalance,
  TokenWallet,
} from "./components";
import { GAS_PRICE, INFURA_ID, NETWORKS } from "./constants";
import { useBalance, useContractLoader, useContractReader, useUserSigner } from "./hooks";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-multi !

    Code: https://github.com/zh/scaffold-eth , Branch: multi-evm
*/

// 📡 What chain are your contracts deployed to?
// const targetNetwork = NETWORKS.localhost;
const targetNetwork = NETWORKS.testnetSmartBCH;
// const targetNetwork = NETWORKS.mainnetSmartBCH;
// const targetNetwork = NETWORKS.fujiAvalanche;
// const targetNetwork = NETWORKS.mainnetAvalanche;
// const targetNetwork = NETWORKS.testnetFantom;
// const targetNetwork = NETWORKS.fantomOpera;
// const targetNetwork = NETWORKS.moondev;
// const targetNetwork = NETWORKS.moonbase;
// const targetNetwork = NETWORKS.moonriver;
// const targetNetwork = NETWORKS.testnetTomo;
// const targetNetwork = NETWORKS.mainnetTomo;
// const targetNetwork = NETWORKS.kaleido;

// 😬 Sorry for all the console logging
const DEBUG = false;

const tokenName = "ContentViewToken";
const coinName = targetNetwork.coin || "BCH";
const ownerAddress = "0x81585790aA977b64e0c452DB84FC69eaCE951d4F";
const viewThreshold = 100; // how many tokens you need to see the content

// 🛰 providers
// 🏠 Your local provider is usually pointed at your local blockchain
let localProviderUrl = targetNetwork.rpcUrl;
if (targetNetwork.user && targetNetwork.pass) {
  localProviderUrl = {
    url: targetNetwork.rpcUrl,
    user: targetNetwork.user,
    password: targetNetwork.pass,
  };
}
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrl);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrl);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai
        },
      },
    },
  },
});

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* Do not show price in fiat */
  const price = 0;

  const gasPrice = targetNetwork.gasPrice || GAS_PRICE;
  // if (DEBUG) console.log("⛽️ Gas price:", gasPrice);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });

  const vendorAddress = readContracts && readContracts.Vendor && readContracts.Vendor.address;

  const vendorETHBalance = useBalance(localProvider, vendorAddress);
  if (DEBUG) console.log("💵 vendorETHBalance", vendorETHBalance ? formatEther(vendorETHBalance) : "...");

  const vendorTokenBalance = useContractReader(readContracts, tokenName, "balanceOf", [vendorAddress]);
  if (DEBUG) console.log("🏵 vendorTokenBalance:", vendorTokenBalance ? formatEther(vendorTokenBalance) : "...");

  const yourTokenBalance = useContractReader(readContracts, tokenName, "balanceOf", [address]);
  if (DEBUG) console.log("🏵 yourTokenBalance:", yourTokenBalance ? formatEther(yourTokenBalance) : "...");

  const tokensPerEth = useContractReader(readContracts, "Vendor", "tokensPerETH");
  if (DEBUG) console.log("🏦 tokensPerEth:", tokensPerEth ? tokensPerEth.toString() : "...");

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG && address && selectedChainId && yourLocalBalance && readContracts && writeContracts) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [address, selectedChainId, yourLocalBalance, readContracts, writeContracts]);

  const loadWeb3Modal = useCallback(async () => {
    try {
      const provider = await web3Modal.connect();
      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      provider.on("chainChanged", chainId => {
        console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      provider.on("accountsChanged", () => {
        console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        logoutOfWeb3Modal();
      });
    } catch (e) {
      console.log(`Wev3Modal error: ${e}`);
    }
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  useThemeSwitcher();

  const [buying, setBuying] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [tokenBuyAmount, setTokenBuyAmount] = useState();
  const [ethWithdrawAmount, setEthWithdrawAmount] = useState();

  const ethCostToPurchaseTokens =
    tokenBuyAmount && tokensPerEth && parseEther("" + tokenBuyAmount / parseFloat(tokensPerEth));
  if (DEBUG) console.log("ethCostToPurchaseTokens:", ethCostToPurchaseTokens);

  const ownerDisplay = (
    <>
      <div style={{ padding: 8, marginTop: 32 }}>
        <div>Vendor 👁️ Tokens Balance:</div>
        <Balance balance={vendorTokenBalance} fontSize={64} />
      </div>
      <div style={{ padding: 8 }}>
        <div>Vendor {coinName} Balance:</div>
        <Balance balance={vendorETHBalance} fontSize={64} /> {coinName}
      </div>
      <Divider />
      <div style={{ padding: 8, marginTop: 32, width: 480, margin: "auto" }}>
        <Card title={`Withdraw ${coinName}`}>
          <div style={{ padding: 8 }}>
            <EtherInput
              style={{ textAlign: "center" }}
              placeholder={`amount of ${coinName} to withdraw`}
              value={ethWithdrawAmount}
              onChange={value => {
                setEthWithdrawAmount(value);
              }}
            />
          </div>
          <div style={{ padding: 8 }}>
            <Button
              type={"primary"}
              loading={withdrawing}
              onClick={async () => {
                setWithdrawing(true);
                await tx(writeContracts.Vendor.withdraw(parseEther("" + ethWithdrawAmount), { gasPrice: gasPrice }));
                setWithdrawing(false);
              }}
            >
              Withdraw {coinName}
            </Button>
          </div>
        </Card>
      </div>
      <Divider />
      <div style={{ padding: 8, marginTop: 32, width: 480, margin: "auto" }}>
        <TokenWallet
          name={tokenName}
          address={address}
          signer={userSigner}
          provider={localProvider}
          readContracts={readContracts}
          gasPrice={gasPrice}
          chainId={localChainId}
        />
      </div>
    </>
  );

  const privateContent = (
    <>
      <div style={{ padding: 4, marginTop: 24, width: 480, margin: "auto" }}>
        Balance:
        <TokenBalance
          name={tokenName}
          img={"👁️"}
          suffix={"CVT"}
          fontSize={16}
          address={address}
          contracts={readContracts}
        />
      </div>
      {yourTokenBalance && yourTokenBalance.gt(viewThreshold) ? (
        <div style={{ marginTop: 60 }}>
          <Vimeo video="610454670" showTitle={false} />
        </div>
      ) : (
        <div style={{ padding: 4, marginTop: 24, width: 480, margin: "auto" }}>
          <Alert
            message="Content unavailable"
            description={
              <div>
                You need <b>{viewThreshold} CVT</b> to see the private content.
              </div>
            }
            type="error"
            closable={false}
          />
          <Card>
            <div style={{ padding: 4 }}>
              {tokensPerEth && tokensPerEth.toNumber()} tokens per {coinName}
            </div>
            <div style={{ padding: 4 }}>
              <Input
                style={{ textAlign: "center" }}
                placeholder={"amount of tokens to buy"}
                value={tokenBuyAmount}
                onChange={e => {
                  setTokenBuyAmount(e.target.value);
                }}
              />
              <Balance balance={ethCostToPurchaseTokens} dollarMultiplier={price} size={16} />
            </div>

            <div style={{ padding: 8 }}>
              <Button
                type={"primary"}
                loading={buying}
                onClick={async () => {
                  setBuying(true);
                  await tx(
                    writeContracts.Vendor.buyTokens({
                      value: ethCostToPurchaseTokens,
                      gasPrice: gasPrice,
                    }),
                  );
                  setBuying(false);
                }}
              >
                Buy Tokens
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkSelect targetNetwork={targetNetwork} localChainId={localChainId} selectedChainId={selectedChainId} />
      <HashRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Content
            </Link>
          </Menu.Item>
          {yourTokenBalance && yourTokenBalance.gt(viewThreshold) && (
            <Menu.Item key="/token">
              <Link
                onClick={() => {
                  setRoute("/token");
                }}
                to="/token"
              >
                Tokens
              </Link>
            </Menu.Item>
          )}
          {address && address === ownerAddress && (
            <>
              <Menu.Item key="/owner">
                <Link
                  onClick={() => {
                    setRoute("/owner");
                  }}
                  to="/owner"
                >
                  Owner
                </Link>
              </Menu.Item>
              <Menu.Item key="/debug">
                <Link
                  onClick={() => {
                    setRoute("/debug");
                  }}
                  to="/debug"
                >
                  Debug Contracts
                </Link>
              </Menu.Item>
            </>
          )}
        </Menu>
        <Switch>
          <Route exact path="/">
            {privateContent}
          </Route>
          {yourTokenBalance && yourTokenBalance.gt(viewThreshold) && (
            <Route exact path="/token">
              <div style={{ padding: 4, marginTop: 24, width: 480, margin: "auto" }}>
                <TokenWallet
                  name={tokenName}
                  address={address}
                  showQR={true}
                  signer={userSigner}
                  provider={localProvider}
                  readContracts={readContracts}
                  gasPrice={gasPrice}
                  chainId={localChainId}
                />
              </div>
              <div style={{ padding: 4, marginTop: 24, width: 480, margin: "auto" }}>
                <Card>
                  <div style={{ padding: 4 }}>
                    {tokensPerEth && tokensPerEth.toNumber()} tokens per {coinName}
                  </div>
                  <div style={{ padding: 4 }}>
                    <Input
                      style={{ textAlign: "center" }}
                      placeholder={"amount of tokens to buy"}
                      value={tokenBuyAmount}
                      onChange={e => {
                        setTokenBuyAmount(e.target.value);
                      }}
                    />
                    <Balance balance={ethCostToPurchaseTokens} dollarMultiplier={price} />
                  </div>
                  <div style={{ padding: 4 }}>
                    <Button
                      type={"primary"}
                      loading={buying}
                      onClick={async () => {
                        setBuying(true);
                        await tx(
                          writeContracts.Vendor.buyTokens({
                            value: ethCostToPurchaseTokens,
                            gasPrice: gasPrice,
                          }),
                        );
                        setBuying(false);
                      }}
                    >
                      Buy Tokens
                    </Button>
                  </div>
                </Card>
              </div>
            </Route>
          )}
          {address && address === ownerAddress && (
            <>
              <Route path="/owner">{ownerDisplay}</Route>
              <Route path="/debug">
                <Contract
                  name={"Vendor"}
                  address={address}
                  signer={userSigner}
                  provider={localProvider}
                  blockExplorer={blockExplorer}
                  gasPrice={gasPrice}
                  chainId={localChainId}
                />
                <Contract
                  name={tokenName}
                  address={address}
                  signer={userSigner}
                  provider={localProvider}
                  blockExplorer={blockExplorer}
                  gasPrice={gasPrice}
                  chainId={localChainId}
                />
              </Route>
            </>
          )}
        </Switch>
      </HashRouter>

      <ThemeSwitch />

      {/* Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          price={price}
          coin={coinName}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet signer={userSigner} localProvider={localProvider} price={price} coin={coinName} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
