// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ColorLand is ERC721, Ownable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private _price;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");

    constructor(uint256 initPrice) ERC721("ColorLand", "CLX") {
        _price = initPrice;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function getTokenIds() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getInitPrice() public view returns (uint256) {
        return _price;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getCurrentPrice() external view returns (uint256) {
        return _price;
    }

    function setApprove(address marketAddress) public returns (bool) {
        setApprovalForAll(marketAddress, true);
        return true;
    }

    function getOwner() external view returns (address) {
        address owner = Ownable.owner();
        return owner;
    }

    function getTotal() external view returns (uint256) {
        uint256 total = _tokenIds.current();
        return total;
    }

    function mintLand(address receiver) external returns (uint256) {
        _tokenIds.increment();

        uint256 currentId = _tokenIds.current();
        _mint(receiver, currentId);

        return currentId;
    }
}
