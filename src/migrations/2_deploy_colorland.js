const ColorLand = artifacts.require("ColorLand");
const MarketplaceLand = artifacts.require("MarketplaceLand");
const InitialLandPrice = 5;

module.exports = async function (deployer) {
  await deployer.deploy(ColorLand, InitialLandPrice);
  colorLandInstance = await ColorLand.deployed();
  await deployer.deploy(MarketplaceLand, colorLandInstance.address);
  marketplaceLandInstance = await MarketplaceLand.deployed();

  let minter_role = await colorLandInstance.MINTER_ROLE();
  console.log("minter_role:" + minter_role);
  console.log("market:" + marketplaceLandInstance.address);
  await colorLandInstance.grantRole(
    minter_role,
    marketplaceLandInstance.address
  );
};
