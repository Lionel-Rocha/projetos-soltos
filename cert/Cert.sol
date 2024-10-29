// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Cert is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner;
    mapping(uint256 => bool) private _transferable;
    mapping(string => uint256) private _tokenURIs;

    constructor() ERC721("Cert", "CER") {
        owner = msg.sender;
    }

    function awardCertificate(address student, string memory tokenURI) public returns (uint256) {
        require(student != address(0), "Invalid student address");

        uint256 newCertificateId = _tokenIds.current();
        _mint(student, newCertificateId); // Isso chamará automaticamente _beforeTokenTransfer
        _setTokenURI(newCertificateId, tokenURI);
        _transferable[newCertificateId] = false; // Marca o certificado como não transferível
        _tokenIds.increment();
        _tokenURIs[tokenURI] = newCertificateId;
        return newCertificateId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal  {
        require(!_transferable[tokenId], "Certificate is not transferable");
    }

    function getTokenId(string memory tokenURI) public view returns (uint256) {
        return _tokenURIs[tokenURI]; // Retorna o tokenId associado ao tokenURI
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        string memory uri = super.tokenURI(tokenId);
        require(bytes(uri).length > 0, "Token does not have an associated URI");
        return uri;
    }
}
