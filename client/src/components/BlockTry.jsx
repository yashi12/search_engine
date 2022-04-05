import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'

const BlockTry = () => {

  useEffect(() => {
    loadWeb3()
    loadBlockchain()
  },[])

  const [address, setAddress] = useState({account:''})
  
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non ethereum browser detected')
    }
  }

  const loadBlockchain = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.requestAccounts()
    setAddress({account : accounts[0]})

    const networkId = await web3.eth.net.getId()
    if(Mycontract.networks[networkId]){

      const networkData = Mycontract.networks[networkId]
      const myContract = new web3.eth.Contract(Mycontract.abi, networkData.address)

      const name =  await myContract.methods.name().call()
      const balance =  await myContract.methods.balance.call()
      const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})
      //const contract = await myContract.methods.sessions('1').call()

      console.log("name : ",name)
      console.log("balance : ",balance)
      console.log("contract : ",send)
    }
    else{
      window.alert("smart contract not deployed")
    }
  }
  
  return (
    <div>
      <h2 className="large text-primary">Account : {address.account}</h2>
    </div>
  );
}


export default BlockTry;
