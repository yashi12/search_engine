import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'
import { transactionFailed, transactionSuccessful } from '../action/transaction';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

/* global BigInt */

const BlockTry = ({transactionFailed,transactionSuccessful}) => {

    useEffect(() => {
        loadWeb3()
        loadBlockchain()
    },[])

    const [state, setState] = useState({account:'',contract:null})
    
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

    const [balance, setBalance] = useState(0)

    const loadBlockchain = async () => {
        const web3 = window.web3

        const accounts = await web3.eth.requestAccounts()
        //setState({account : accounts[0],...state})
        
        const networkId = await web3.eth.net.getId()
        if(Mycontract.networks[networkId]){

            const networkData = Mycontract.networks[networkId]
            const myContract = new web3.eth.Contract(Mycontract.abi, networkData.address)
            setState({account:accounts[0],contract:myContract})

            //const name =  await myContract.methods.name().call()
            const bal =  await myContract.methods.balance.call()
            setBalance(parseFloat(bal).toFixed(2))
            
            //const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})
            
            //const con = await state.contract.methods.sessions('1').call()
        }
        else{
            window.alert("smart contract not deployed")
        }
    }

    const [price, setPrice] = useState(0)

    // State Initialization
	const [formData, setFormData] = useState({
		address: '',
		id: '',
        topic: '',
        amount: 0
	})

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	},[formData.amount])

    const fetchBalance = async(e) => {
        e.preventDefault()
        const balance =  await state.contract.methods.balance.call()
        setBalance(parseFloat(balance).toFixed(2))
    }
  
    const [hash, setHash] = useState(null)

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

	// Submitting the data
	const onSubmit = async(e) => {
		e.preventDefault()

        const web3 = window.web3
		//setFormData({...formData,"text":value})
        //setFormData({...formData, amount: Web3.utils.BN(formData.amount)})
        const amount = web3.utils.toWei(formData.amount.toString(), 'ether')
        console.log("amount : ",amount)
        state.contract.methods.createSession(amount,state.account,formData.address,formData.topic,formData.id).send({from:state.account,value:amount})
        .on('transactionHash', function(hash){
            setHash(hash)
            console.log("hash : ",hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmations : ",confirmationNumber)
            console.log("receiptx : ",receipt)
            transactionSuccessful()
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error : ',error)
            transactionFailed(error)
            console.log('receipt 3 : ',receipt)
        });
        //console.log("txn : ",send)
	}

    // 0x9B79Fcfb243236f12867a38B22B49c045792821f

  return (
    <div>
        <div className="row">
            <div className="col-1"/>
            <div className="col-5">
                <br/><br/>
                <div className="card">
                    <div className="card-body">
                        <form id="add-post-form" encType="multipart/form-data">
                            {/* Taking Inputs */}
                            <div className="form-group">
                                <div className="mb-3 justify-content-between">
                                    <label className="form-label">Address of Doubt Solver</label>
                                    <input onChange={e => onChange(e)} className="form-control" id="address" type="text"/>

                                    <label className="form-label">Address of Doubt Asker</label>
                                    <p>{state.account}</p>

                                </div>
                                <div className="mb-3">
                                    <label>Id</label>
                                    <input onChange={(e) => {
                                        onChange(e)
                                    }} minLength="1" className="form-control" id="id"/>
                                </div>
                                <div className="mb-3">
                                    <label>Topic</label>
                                    <input onChange={(e) => {
                                        onChange(e)
                                    }} minLength="1" className="form-control" id="topic"/>
                                </div>
                                <div className="mb-3">
                                    <label>Amount (in ETH)</label>
                                    <input type="number" width="100%" onChange={e => onChange(e)} className="form-control" id="amount" />
                                    <div>(Rs. {price*formData.amount})</div>
                                </div>
                                <button onClick={(e)=>onSubmit(e)} className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div>
                    <br /><br />
                    <div><button className="btn btn-primary" onClick={fetchBalance} >Balance(in ETH) : {balance/10**18}</button></div>
                    <div className="text text-primary">(Rs. {balance*price/10**18})</div>
                </div>
                <div>
                    <br />
                    <div className="text text-info">ETH PRICE - (Rs. {price})</div>
                </div>
                <br />
                {
                    hash ? 
                    <div>
                        <h5 className="text text-info">Transaction Hash</h5>
                        <p className="text text-info">{hash}</p>
                    </div> :
                    <div></div>
                }
                
            </div>
            
        </div>
    </div>
)
}

BlockTry.propTypes = {
	transactionFailed: PropTypes.func.isRequired,
    transactionSuccessful: PropTypes.func.isRequired
}

// Connecting react program with redux
export default connect(null, {transactionFailed,transactionSuccessful})(BlockTry)
