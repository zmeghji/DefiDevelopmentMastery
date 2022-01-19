const CompoundIntegration = artifacts.require('CompoundIntegration.sol');

const cDaiAddress = '0x6d7f0754ffeb405d23c51ce938289d4835be3b14';

module.exports = async done => {
  console.log("running script");
  const compoundIntegration = await CompoundIntegration.deployed();
  console.log("lending dye")
  await compoundIntegration.lend(cDaiAddress, web3.utils.toWei('10'));
  done();
}
