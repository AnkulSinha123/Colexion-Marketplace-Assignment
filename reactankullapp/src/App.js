import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import Colexion from './Colexion.json'
import Wallet from "./Wallet.js"
export default function Home() {

  const [loadingState, setLoadingState] = useState('not-loaded')
  const [ind, setInd] = useState([])
  const colexionAddress = "0x8B39344620a99329E85700f6076846d8055659d8";
   
  useEffect(() => {
    load()
  }, [])
  async function load() {
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/18cc6b2bcafa47439d6533f1c5edc316")
    const contract = new ethers.Contract(colexionAddress, Colexion, provider)
    // console.log( await contract.getProductArray())
    const data = await contract.getProductArray()
    
    console.log(data)

    const items = await Promise.all(data.map(async i => {
      let price = ethers.utils.formatUnits(i.price, 'ether')
      console.log(i.price)
      console.log(price)
      let item = {
        id: i.id,
        price:String(price),
        imageURL: i.imageURL,
        name: i.name,
        description: i.description,
      }
      return item
    }))
    setInd(items)
    setLoadingState('loaded') 
  }
  async function buyProduct(index) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(colexionAddress, Colexion, signer)
    // console.log(index)
    
    const price = ethers.utils.parseUnits(String(index.price), 'ether')   
    console.log(String(price))
    const transaction = await contract.buyProduct(index.id, {
      value: String(price)
    })
    
     await transaction.wait()
     load()
  }
  if (loadingState === 'loaded' && !ind.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    
    
    <div className="flex justify-center">
       <Wallet />
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            ind.map((index, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={index.imageURL} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{index.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{index.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{index.price} ETH</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyProduct(index)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    
  )
  
}