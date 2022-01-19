import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Compound from '@compound-finance/compound-js'
import calculateApy from '../apy'
export default function Home({ apys }) {
  const formatPercent = number => `${new Number(number).toFixed(2)}%`
  return (
    
    <div className='container'>
      <Head>
        <title>Compound dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='row mt-4'>
        <div className='col-sm-12'>
          <div className="jumbotron">
            <h1 className='text-center'>Compound Dashboard</h1>
            <h5 className="display-4 text-center">Shows Compound APYs <br/> with COMP token rewards</h5>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <th>Ticker</th>
          <th>Supply APY</th>
          <th>COMP APY</th>
          <th>Total APY</th>
        </thead>
        <tbody>
          {apys && apys.map(apy => (
            <tr>
                <td>
                  <img src={`img/${apy.ticker.toLowerCase()}.png`} 
                    style ={{width: 25, height: 25, marginRight:10}}/>
                  {apy.ticker.toUpperCase()}
                </td>
                <td>
                  {formatPercent(apy.supplyApy)}
                </td>
                <td>
                  {formatPercent(apy.compApy)}
                </td>
                <td>
                  {formatPercent(parseFloat(apy.supplyApy) + parseFloat(apy.compApy))}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  )
}

export async function getServerSideProps(context){
  const apys = await Promise.all([
    calculateApy(Compound.cDAI, 'DAI'),
    calculateApy(Compound.cUSDC, 'USDC'),
    calculateApy(Compound.cUSDT, 'USDT'),
  ])
  
  return {
    props: {
      apys
    }
  }
}