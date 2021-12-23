// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ColorLand.sol";

contract MarketplaceLand {
    ColorLand private _land;
    uint256[] public nftListOfUser;

    constructor(ColorLand landContractAddress) {
        _land = landContractAddress;
    }

    function getNftOfUser(address user) public returns (uint256[] memory) {
        for (uint256 i = 1; i <= _land.getTotal(); i++) {
            if (_land.ownerOf(i) == user) {
                nftListOfUser.push(i);
            }
        }
        return nftListOfUser;
    }

    function buyLand() public payable returns (uint256) {
        require(
            msg.value >= _land.getCurrentPrice() * 10**18,
            "Error, Token costs more"
        );
        uint256 landId = _land.mintLand(msg.sender);
        return landId;
    }
}
