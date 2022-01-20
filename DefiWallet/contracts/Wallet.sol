pragma solidity 0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Compound.sol";

contract Wallet is Compound
{
    address public  admin;
    constructor(address _comptrollerAddress, address _cEthAddress) 
        Compound(_comptrollerAddress, _cEthAddress)
    {
        admin = msg.sender;
    }

    function deposit(address cToken, uint underlyingAmount)
        external
    {
        address underlyingAddress =getUnderlyingAddress(cToken);
        IERC20(underlyingAddress).transferFrom(
            msg.sender, address(this), underlyingAmount);
        supply(cToken, underlyingAmount);
    }

    receive() external payable{
        supplyEth(msg.value);
    }

    modifier onlyAdmin(){
        require(msg.sender==admin, 'only admin');
        _;
    }
    function withdraw(
        address cTokenAddress, uint underlyingAmount, address recipient)
        onlyAdmin() external
    {
        require(getUnderlyingBalance(cTokenAddress)>= underlyingAmount,
            'balance too low');
        claimComp();
        redeem(cTokenAddress, underlyingAmount);

        address underlyingAddress =
            getUnderlyingAddress(cTokenAddress);

        IERC20(underlyingAddress).transfer(recipient, underlyingAmount);

        address compAddress = getCompAddress();
        IERC20 compToken = IERC20(compAddress);
        compToken.transfer(
            recipient, compToken.balanceOf(address(this)));
    }

    function withdrawEth(uint underlyingAmount, address payable recipient) 
        external onlyAdmin()
    {
        require(
            getUnderlyingEthBalance() >= underlyingAmount,
            "balance too low"
        );
        claimComp();
        redeemEth(underlyingAmount);

        recipient.transfer(underlyingAmount);

        address compAddress = getCompAddress();
        IERC20 compToken = IERC20(compAddress);
        compToken.transfer(
            recipient, compToken.balanceOf(address(this)));
    }
}