// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TheRedLedgerNFT is ERC721, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 6666;
    uint256 public constant PRICE = 0.0001 ether;

    uint256 public totalMinted;
    string private sharedTokenURI;

    mapping(address => uint256) public mintedPerWallet;

    constructor(string memory initialTokenURI) ERC721("The Red Ledger", "LEDGER") Ownable(msg.sender) {
        sharedTokenURI = initialTokenURI;
    }

    function mint(uint256 quantity) external payable nonReentrant {
        require(quantity > 0, "Quantity must be greater than 0");
        require(totalMinted + quantity <= MAX_SUPPLY, "Max supply exceeded");

        uint256 paidQuantity = quantity;
        if (mintedPerWallet[msg.sender] == 0) {
            paidQuantity = quantity - 1;
        }

        require(msg.value == paidQuantity * PRICE, "Incorrect ETH amount");

        mintedPerWallet[msg.sender] += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            totalMinted++;
            _safeMint(msg.sender, totalMinted);
        }
    }

    function setTokenURI(string calldata newTokenURI) external onlyOwner {
        sharedTokenURI = newTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return sharedTokenURI;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }
}
