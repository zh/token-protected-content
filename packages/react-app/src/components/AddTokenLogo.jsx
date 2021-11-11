import React from "react";

export default function AddTokenLogo(props) {
  const addLogo = async () => {
    const { contract } = props;
    const methodParams = {
      type: "ERC20",
      options: {
        address: contract.address,
        symbol: await contract.symbol(),
        decimals: await contract.decimals(),
        image: "https://zh.thedev.id/sep20tokens/assets/eye.png",
      },
    };
    web3.currentProvider.sendAsync(
      {
        method: "metamask_watchAsset",
        params: methodParams,
      },
      console.log,
    );
  };

  return (
    <div>
      <a href="#" onClick={() => addLogo()}>
        Add to metamask 🦊
      </a>
    </div>
  );
}
