// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OutstandingOwls is ERC721, ERC721Burnable, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs;

    address payable[] withdrawAddresses = [payable(0x31948632E8E8e575a5E3fcF94aa495057bb15008), payable(0x08756F75eeDE5789fA69bb153F27349FD0082ba0), payable(0xe339681FE408ffebE1B1207019FeA21491db0bDF),payable(0xD92AB1F520F1F858947964131B258341534bC28C), payable(0x1F094817A29374f093E4e5Db5e504237A7Bd0281), payable(0x999A6422CfF2b8142Bf84C7E835abFE6D090Ed39)];

    constructor() ERC721("OutstandingOwls", "OSO") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory metadataURI) public onlyOwner {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] =1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    function wildMint(
        address recipient, 
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require(msg.value >= 3 ether, 'Pay more money!');
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] =1;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function isNFTOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1; 
    }

    function count() public view returns (uint256){
        return _tokenIdCounter.current();   
    }

    function balanceSC() public view returns (uint256){
        return address(this).balance;   
    }    

    function withdrawFunds() public onlyOwner{
        uint256 balance = balanceSC();
        uint256 withdrawAmount = balance / withdrawAddresses.length;
        for (uint i = 0; i < withdrawAddresses.length; i++){
            withdrawAddresses[i].transfer(withdrawAmount);
        }
    }
}