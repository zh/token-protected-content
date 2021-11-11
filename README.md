# Token Protected Content

> make content available only for token holders

The application is deployed to:

* [Avalanche Fuji testnet](https://fuji-content.surge.sh/)
* [SmartBCH Amber testnet](https://token-protect.surge.sh/)

## Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork token-protected-content:

```bash
git clone https://github.com/zh/token-protected-content.git
```

> install and start your Hardhat chain:

```bash
cd token-protected-content
yarn install
yarn chain
```

> in a second terminal window, start your frontend:

```bash
cd token-protected-content
yarn start
```

> in a third terminal window, deploy your contract:

First **fix the vendor contract owner address** in `packages/hardhat/deploy/10_deploy_vendor.js`. This will be the user, who can withdraw the profits from tokens sell

```js
const OWNER_ADDR = '...';
```

```bash
cd token-protected-content
yarn deploy

// deploy contracts to another blockchains
yarn deploy --network testnetSmartBCH
yarn deploy --network testnetFantom
```

Edit your token smart contract `ContentViewToken.sol` in `packages/hardhat/contracts`

Edit your deployment scripts in `packages/hardhat/deploy`

Edit your frontend `App.jsx` in `packages/react-app/src`

For using with other blockchains change target network:

```js
const targetNetwork = NETWORKS.testnetSmartBCH;
const targetNetwork = NETWORKS.testnetFantom;
```

Open [http://localhost:3000](http://localhost:3000) to see the app. You need to buy the diplayed amount of tokens in order to see the protected content.

On localnet you will get a faucet for account funding. On deployed applications use the blockchain faucet to get some funds.

When you buy the specified amount of tokens, you will get a nice tokens wallet (have even QR code) to receive and send the tokens to another account or buy additional tokens, if needed.
