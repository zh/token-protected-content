// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContentViewToken.sol";

contract Vendor is Ownable {
    using SafeMath for uint256;
    ContentViewToken _viewToken;

    uint256 public _tokensPerETH = 1000;

    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
    event SellTokens(
        address seller,
        uint256 amountOfTokens,
        uint256 amountOfETH
    );

    constructor(address tokenAddress) {
        _viewToken = ContentViewToken(tokenAddress);
    }

    function tokensPerETH() public view virtual returns (uint256) {
        return _tokensPerETH;
    }

    function buyTokens() external payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "Sent ETH to buy tokens");

        uint256 amountToBuy = msg.value.mul(_tokensPerETH);
        // does the Vendor have enough tokens
        uint256 vendorBalance = _viewToken.balanceOf(address(this));
        require(
            vendorBalance >= amountToBuy,
            "Vendor does not own enough tokens"
        );
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        bool sent = _viewToken.transfer(payable(msg.sender), amountToBuy);
        require(sent, "tokens transfer failed");
        return amountToBuy;
    }

    function sellTokens(uint256 tokensAmount) external {
        require(tokensAmount > 0, "amount of tokens must be > 0");
        uint256 userBalance = _viewToken.balanceOf(msg.sender);
        require(userBalance >= tokensAmount, "user does not own enough tokens");
        uint256 ethToTransfer = tokensAmount.div(_tokensPerETH);
        uint256 vendorBalance = address(this).balance;
        require(
            vendorBalance >= ethToTransfer,
            "vendor does not own enough ETH"
        );
        emit SellTokens(msg.sender, tokensAmount, ethToTransfer);
        bool sent = _viewToken.transferFrom(
            msg.sender,
            address(this),
            tokensAmount
        );
        require(sent, "tokens transfer failed");
        (bool sentEth, ) = payable(msg.sender).call{value: ethToTransfer}("");
        require(sentEth, "ETH transfer failed");
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "amount of ETH must be > 0");
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance >= amount, "Vendor does not own enough ETH");
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "ETH transfer failed");
    }

    function setPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "price must be > 0");
        _tokensPerETH = newPrice;
    }
}
