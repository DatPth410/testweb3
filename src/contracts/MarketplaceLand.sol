// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ColorLand.sol";

contract MarketplaceLand {
    ColorLand private _land;
    uint256[] public nftListOfUser;
    address[] public addressListOfNft;
    uint256[] public lastSellPriceList;
    uint256[] public forSellPriceList;

    struct LandInfo {
        uint256 lastSellPrice;
        uint256 forSalePrice; // 0 means: not for sale.
    }

    mapping(uint256 => LandInfo) private _landInfo;

    constructor(ColorLand landContractAddress) {
        _land = landContractAddress;
    }

    function setSaleNfts(uint256 index, uint256 price)
        public
        returns (uint256)
    {
        _landInfo[index].forSalePrice = price;
        return index;
    }

    function buyNftFromMarket(uint256 index) public returns (uint256) {
        _land.safeTransferFrom(_land.ownerOf(index), msg.sender, index);
        return index;
    }

    function buyLand() public payable returns (uint256) {
        require(
            msg.value >= _land.getCurrentPrice() * 10**18,
            "Error, Token costs more"
        );
        uint256 landId = _land.mintLand(msg.sender);
        _landInfo[_land.getTokenIds()] = LandInfo({
            lastSellPrice: _land.getInitPrice(),
            forSalePrice: 0
        });

        return landId;
    }

    function getAddressOfNfts() public returns (address[] memory) {
        for (uint256 i = 1; i <= _land.getTotal(); i++) {
            addressListOfNft.push(_land.ownerOf(i));
        }
        return addressListOfNft;
    }

    function getLastSellPrice() public returns (uint256[] memory) {
        for (uint256 i = 1; i <= _land.getTotal(); i++) {
            lastSellPriceList.push(_landInfo[i].lastSellPrice);
        }
        return lastSellPriceList;
    }

    function getForSellPrice() public returns (uint256[] memory) {
        for (uint256 i = 1; i <= _land.getTotal(); i++) {
            forSellPriceList.push(_landInfo[i].forSalePrice);
        }
        return forSellPriceList;
    }

    function getNftOfUser(address user) public returns (uint256[] memory) {
        for (uint256 i = 1; i <= _land.getTotal(); i++) {
            if (_land.ownerOf(i) == user) {
                nftListOfUser.push(i);
            }
        }
        return nftListOfUser;
    }
}
