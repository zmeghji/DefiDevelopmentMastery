const CompoundIntegration = artifacts.require('CompoundIntegration.sol');

const cBatAddress = '0xebf1a11532b93a529b5bc942b4baa98647913002';

module.exports = async done => {
  const compoundIntegration = await CompoundIntegration.deployed();
  await compoundIntegration.replayLoan(cBatAddress, web3.utils.toWei('5'));
  done();
}
