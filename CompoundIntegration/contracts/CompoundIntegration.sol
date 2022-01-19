pragma solidity 0.8.9;

import "./CTokenInterface.sol";
import "./ComptrollerInterface.sol";
import "./PriceOracleInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompoundIntegration is Ownable
{
    ComptrollerInterface public comptroller;
    PriceOracleInterface public oracle;

    constructor (address _comptroller, address _oracle) public {
        comptroller = ComptrollerInterface(_comptroller);  
        oracle = PriceOracleInterface(_oracle);
    }
    //lend 
    function lend(address _cTokenAddress, uint _underlyingAmount) external onlyOwner
    {
        CTokenInterface ctoken = CTokenInterface(_cTokenAddress);
        IERC20(ctoken.underlying()).approve(_cTokenAddress, _underlyingAmount);
        uint result = ctoken.mint(_underlyingAmount);
        require (result ==0, "ctoken.Mint Failed");
    }

    //redeem tokens lended 
    function redeem(address _cTokenAddress, uint _cTokenAmount) external onlyOwner
    {
        CTokenInterface ctoken = CTokenInterface(_cTokenAddress);
        uint result = ctoken.redeem(_cTokenAmount);
        require (result ==0, "ctoken.redeem Failed");
    }

    //enable token as collateral
    function enableCollateral(address _cTokenAddress) external onlyOwner{
        address[] memory tokenAddresses= new address[](1);
        tokenAddresses[0] = _cTokenAddress;

        CTokenInterface ctoken = CTokenInterface(_cTokenAddress);
        uint[] memory results = comptroller.enterMarkets(tokenAddresses);
        require (results[0] ==0, "ctoken.enterMarket Failed");
    }

    //borrow
    function borrow(address _cTokenAddress, uint _underlyingAmount) external onlyOwner{
        CTokenInterface ctoken = CTokenInterface(_cTokenAddress);
        uint result = ctoken.borrow(_underlyingAmount);
        require (result ==0, "ctoken.borrow Failed");
    }

    //repay loan
    function replayLoan(address _cTokenAddress, uint _underlyingAmount) external onlyOwner{
        CTokenInterface ctoken = CTokenInterface(_cTokenAddress);
        IERC20(ctoken.underlying()).approve(_cTokenAddress, _underlyingAmount);
        uint result = ctoken.repayBorrow(_underlyingAmount);
        require (result ==0, "ctoken.repayBorrow Failed");
    }

    //get maximum loan Amount
    function getMaximumLoanAmount(address cTokenAddress) external returns(uint){
        CTokenInterface ctoken = CTokenInterface(cTokenAddress);
        (uint result, uint liquidity, uint shortfall) = comptroller.getAccountLiquidity(address(this));
        require(result ==0, "comptroller.getAccountLiquidity failed");
        if (liquidity == 0 ){
            return 0;
        }
        uint price = oracle.getUnderlyingPrice(cTokenAddress) ;

        return liquidity/price;
    }
}