const CompoundIntegration = artifacts.require('CompoundIntegration.sol');

const cDaiAddress = '0x6d7f0754ffeb405d23c51ce938289d4835be3b14';

module.exports = async done => {
  const compoundIntegration = await CompoundIntegration.deployed();
  await compoundIntegration.redeem(cDaiAddress, 100 * Math.pow(10, 8)); //cToken have 8 decimals
  done();
}
