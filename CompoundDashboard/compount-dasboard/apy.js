
import Compound from '@compound-finance/compound-js'
const provider = 'https://speedy-nodes-nyc.moralis.io/73a1107d1b7ea02c019eeea2/eth/mainnet';

const comptroller = Compound.util.getAddress(Compound.Comptroller);
const opf = Compound.util.getAddress(Compound.PriceFeed);

const cTokenDecimals = 8; 

const blocksPerDay =4*60*24;
const daysPerYear =365;
const ethMantissa = Math.pow(10,18);

async function calculateSupplyApy(cToken){
    const supplyRatePerBlock = await Compound.eth.read(
        cToken,
        'function supplyRatePerBlock() returns(uint)',
        [],
        {provider}
    );
    let supplyRatePerDay = ((supplyRatePerBlock *blocksPerDay)/ethMantissa) +1;
    return  100*(Math.pow( supplyRatePerDay, daysPerYear-1) -1);
}

async function calculateCompApy(cToken, ticker, underlyingDecimals){
    
    let compSpeed = await Compound.eth.read(
        comptroller,
        'function compSpeeds(address) external view returns (uint)',
        [ cToken ],
        { provider }
      );
      
      let compPrice = await Compound.eth.read(
        opf,
        'function price(string memory symbol) external view returns (uint)',
        [ Compound.COMP ],
        { provider }
      );
    
      let underlyingPrice = await Compound.eth.read(
        opf,
        'function price(string memory symbol) external view returns (uint)',
        [ ticker ],
        { provider }
      );
    
      let totalSupply = await Compound.eth.read(
        cToken,
        'function totalSupply() returns (uint)',
        [],
        { provider }
      );
    
      let exchangeRate = await Compound.eth.read(
        cToken,
        'function exchangeRateCurrent() returns (uint)',
        [],
        { provider }
      );

    compSpeed = compSpeed /1e18;
    compPrice = compPrice /1e6;
    underlyingPrice = underlyingPrice/1e6;
    exchangeRate =+exchangeRate.toString()/ethMantissa;
    totalSupply = +totalSupply.toString() * exchangeRate * underlyingPrice / Math.pow(10, underlyingDecimals);
    const compPerDay = compSpeed * blocksPerDay;
    return 100* (compPrice* compPerDay/totalSupply) * 365
}

async function calculateApy(cTokenTicker, underlyingTokenTicker){
    const underlyingDecimals = Compound.decimals[cTokenTicker];
    const cTokenAddress = Compound.util.getAddress(cTokenTicker);
    const [supplyApy, compApy] = await Promise.all([
        calculateSupplyApy(cTokenAddress),
        calculateCompApy(cTokenAddress, underlyingTokenTicker,underlyingDecimals)
    ])
    return {ticker: underlyingTokenTicker, supplyApy, compApy}
}

export default calculateApy;