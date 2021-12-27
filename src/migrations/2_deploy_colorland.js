const ColorLand = artifacts.require("ColorLand");
const MarketplaceLand = artifacts.require("MarketplaceLand");
const InitialLandPrice = 2;

module.exports = async function (deployer) {
  await deployer.deploy(ColorLand, InitialLandPrice);
  colorLandInstance = await ColorLand.deployed();
  await deployer.deploy(MarketplaceLand, colorLandInstance.address);
  marketplaceLandInstance = await MarketplaceLand.deployed();

  console.log(marketplaceLandInstance.address);
  await colorLandInstance.setApprovalForAll(
    marketplaceLandInstance.address,
    true
  );

  console.log(
    await colorLandInstance.isApprovedForAll(
      colorLandInstance.address,
      marketplaceLandInstance.address
    )
  );

  let minter_role = await colorLandInstance.MINTER_ROLE();
  await colorLandInstance.grantRole(
    minter_role,
    marketplaceLandInstance.address
  );

  let transfer_role = await colorLandInstance.TRANSFER_ROLE();
  await colorLandInstance.grantRole(
    transfer_role,
    marketplaceLandInstance.address
  );
};
