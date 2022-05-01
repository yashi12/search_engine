import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { FaMoneyBillAlt, FaAddressCard } from 'react-icons/fa'
import { BsCardHeading } from 'react-icons/bs'
import { GrStatusInfo } from 'react-icons/gr'
import { transactionFailed, transactionSuccessful } from '../action/transaction';
import axios from 'axios';

const Label = styled.label`
	font-weight: bold;
    font-size: 1.1em;
    font-family: Georgia, serif;
`;

const ContractItem = ({doubt,contract,account}) => {

    const [price, setPrice] = useState(0)

    const [hash, setHash] = useState(null)

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	})

    const endSession = async(e) => {
        e.preventDefault()
        console.log(contract)
        contract.methods.endSession(doubt.id).send({from:account})
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
    }

    const refund = async(e) => {
        e.preventDefault()
        console.log(contract)
        contract.methods.refund(doubt.id).send({from:account})
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
    }

	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-2"/>
                <div className="col-8 mb-3">
                    {
                        hash ? 
                        <div>
                            <h5 className="text text-info">Transaction Hash</h5>
                            <p className="text text-info">{hash}</p>
                        </div> :
                        <div></div>
                    }
                    <div className="card" >
                        <br />
                        <div className="card-body">
                            <div className="mb-3">
                                <Label>Title <BsCardHeading/></Label>
                                <div>
                                    { doubt.title }
                                </div>
                            </div>
                            <div className="mb-3">
                                <Label>Status <GrStatusInfo/></Label>
                                <div>
                                    { doubt.description }
                                </div>
                            </div>
                            <div className="mb-3">
                                <Label>Address Of Doubt Asker <FaAddressCard/></Label>
                                <div>
                                    { doubt.addressOfDoubtResolver }
                                </div>
                            </div>
                            <div className="mb-3">
                                <Label>Address Of Doubt Solver <FaAddressCard/></Label>
                                <div>
                                    { doubt.addressOfDoubtSolver }
                                </div>
                            </div>
                            <div className="mb-3">
                                <Label>Amount <FaMoneyBillAlt/></Label>
                                <div>{ doubt.raisedAmount/10**18 } ETH (Rs. {price*doubt.raisedAmount/10**18})</div>
                            </div>
                            
                            <button onClick={e=>endSession(e)} className="btn btn-primary">End Session</button>
                            <br />
                            <br />
                            <button onClick={e=>refund(e)} className="btn btn-primary">Refund</button>
                            <br />
                        </div>
                    </div>
                </div>
                
			</div>
		</div>
	)
}

export default ContractItem
