const CompoundIntegration = artifacts.require('CompoundIntegration.sol');
const Token = artifacts.require('Token.sol');

const daiAddress = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea ';

module.exports = async done => {
  const accounts = await web3.eth.getAccounts();
  const Dai = await Token.at(daiAddress);
  const compoundIntegration = await CompoundIntegration.deployed();
  const balance = await dai.balanceOf(compoundIntegration.address);
  console.log(`Dai Balance: ${web3.utils.fromWei(balance)}`);
  done();
}
