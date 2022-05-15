import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Mycontract from '../abis/Mycontract.json'
import PropTypes, { element } from 'prop-types'
import Web3 from 'web3'
import { Link } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import { transactionFailed, transactionSuccessful } from '../action/transaction';
import {connect} from 'react-redux'
import { addProposal, updateProposal, initiateProposal } from '../action/doubt'
import Modal from "./Modal";

const ProposalItem = ({doubt:{proposals, loading},auth,transactionFailed,transactionSuccessful,topic,id,askerId,addProposal,updateProposal,initiateProposal,status}) => {

    useEffect(() => {
        loadWeb3()
        loadBlockchain()
    },[])

    const [state, setState] = useState({account:'',contract:null});

    const [showModal, setShowModal] = useState(false);
    const [activeObject, setActiveObject] = useState(null);

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
        //setState({account : accounts[0],...state})

        const networkId = await web3.eth.net.getId()
        if(Mycontract.networks[networkId]){

            const networkData = Mycontract.networks[networkId]
            const myContract = new web3.eth.Contract(Mycontract.abi, networkData.address)
            setState({account:accounts[0],contract:myContract})

            //const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})

            //const con = await state.contract.methods.sessions('1').call()
        }
        else{
            window.alert("smart contract not deployed")
        }
    }

    const onSubmit = async(e,amount,address,mentorId) => {
		e.preventDefault()

        const web3 = window.web3
		//setFormData({...formData,"text":value})
        //setFormData({...formData, amount: Web3.utils.BN(formData.amount)})
        const amt = web3.utils.toWei(amount.toString(), 'ether')
        console.log("amount : ",amt)
        console.log("asker address : ",state.account)
        console.log("solver : ",address)
        console.log("topic : ",topic)
        console.log("id : ",id)
        state.contract.methods.createSession(amt,state.account,address,topic,id).send({from:state.account,value:amt})
        .on('transactionHash', function(hash){
            setHash(hash)
            console.log("hash : ",hash)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmations : ",confirmationNumber)
            console.log("receiptx : ",receipt)
            transactionSuccessful()
            initiateProposal(id,mentorId)
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error : ',error)
            transactionFailed(error)
            console.log('receipt 3 : ',receipt)
        });
        //console.log("txn : ",send)
	}

    const [price, setPrice] = useState(0)

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	},[])

    const [proposalToggle, setProposalToggle] = useState(false)
    const [updateToggle, setUpdateToggle] = useState(false)

    const [data, setData] = useState({description:"",amount:0,address:state.account})
    const [updateData, setUpdateData] = useState({description:"",amount:0,address:state.account})

    const [hash, setHash] = useState(null)

    const [proposalId, setProposalId] = useState(0)

    const handleClick = (e,description,amount,id) => {
        e.preventDefault()
        if(e.target.name === "add"){
            setProposalToggle(!proposalToggle)
            setUpdateToggle(false)
        }
        else{
            setProposalToggle(false)
            setUpdateToggle(!updateToggle)
            setUpdateData({description:description,amount:amount,mentor_address:state.account})
            setProposalId(id)
        }
    }

    const onChange = e => {
        e.preventDefault()
        setData({...data,[e.target.id]:e.target.value})
    }

    const UpdateChange = e => {
        e.preventDefault()
        setUpdateData({...updateData,[e.target.id]:e.target.value})
    }

    const UpdateProposal = e => {
        e.preventDefault()
        setUpdateData({...updateData,amount:parseFloat(updateData.amount)})
        if(updateData.description.length < 20){
            alert('Description should be at least 20 characters')
        }
        if(updateData.mentor_address.length == 0){
            alert("Address can't be null")
        }
        if(updateData.amount <= 0){
            alert('Amount should be greater than 0')
        }
        else{
            updateProposal(id,updateData)
        }
        //addProposal(id,updateData)
    }

    const AddProposal = e => {
        e.preventDefault()
        let allow = true
        setData({...data,address:state.account,amount:parseInt(data.amount)})
        const sndData = {description: data.description,amount: parseFloat(data.amount),mentor_address:state.account}
        //console.log(id)
        //console.log(auth.user._id)
        proposals.map((element)=>{
            console.log("ids:",element.mentorId._id,"   ",auth.user._id)
            if(element.mentorId._id === auth.user._id){
                allow = false
            }
        })
        if(allow){
            if(sndData.description.length < 20){
                alert('Description should be at least 20 characters')
            }
            if(sndData.mentor_address.length == 0){
                alert("Address can't be null")
            }
            if(sndData.amount <= 0){
                alert('Amount should be greater than 0')
            }
            else{
                addProposal(id,sndData)
            }
        }
        else{
            alert('Your already have a proposal, please click on "Update" if you wish to change proposal')
        }
    }

    {/*
        add authentications
        user can comment on his own doubt
        auth on update and create contract
    */}

    return (
        <div>
            {
                hash ?
                <div>
                    <br />
                    <h5 className="text text-info">Transaction Hash</h5>
                    <p className="text text-info">{hash}</p>
                    <br />
                </div> :
                <div></div>
            }
            {
                auth.user._id !== askerId && status==='unsolved' ?
                <button name="add" className="btn btn-primary" onClick={e=>handleClick(e)}>Add Proposal</button>
                : <br/>
            }
            {
                proposalToggle ?
                <div className="row g-2">
                    <div className="col">
                        <form>
                            <div className="form-group">
                                <br />
                                <label>Description</label>
                                <textarea className="form-control" id="description" rows="3" value={data.description} onChange={e=>onChange(e)}></textarea>
                                <label>Amount (in ETH)</label>
                                <input type="number" width="50%" onChange={e => onChange(e)} value={data.amount} className="form-control" id="amount" />
                                <div>(Rs. {price*data.amount})</div>
                                <label>Address</label>
                                <div>{state.account}</div>
                            </div>
                            <button className="btn btn-primary" onClick={e=>AddProposal(e)}>Submit</button>
                        </form>
                        <br />
                    </div>
                </div> : <div></div>
            }
            {
                updateToggle ?
                <div className="row g-2">
                    <div className="col">
                        <form>
                            <div className="form-group">
                                <br />
                                <label>Description</label>
                                <textarea className="form-control" id="description" rows="3" value={updateData.description} onChange={e=>UpdateChange(e)}></textarea>
                                <label>Amount (in ETH)</label>
                                <input type="number" width="50%" onChange={e => UpdateChange(e)} value={updateData.amount} className="form-control" id="amount" />
                                <div>(Rs. {price*updateData.amount})</div>
                                <label>Address</label>
                                <div>{state.account}</div>
                            </div>
                            <button className="btn btn-primary" onClick={e=>UpdateProposal(e)}>Update</button>
                        </form>
                        <br />
                    </div>
                </div> : <div></div>
            }
            <div className='row g-3'>
                <div className='col mb-3'>
                    {
                        proposals.length > 0 ?
                        <div>
                            <br />
                            <h3>Responses</h3>

                            <dir>
                                <div className='row g-3'>
                                    <div className='col-1'>
                                        <h6>User</h6>
                                    </div>
                                    <div className='col-4'>
                                        <h6>Description</h6>
                                    </div>
                                    <div className='col-2'>
                                        <h6>Amount</h6>
                                    </div>
                                </div>
                            </dir>

                        </div>
                        : <div>No Responses Yet</div>
                    }
                </div>
            </div>
            <div className='row g-3'>
                <div className='col'>
                    {
                        proposals.length > 0 ?
                        <div>
                            {
                            proposals.map((element)=>(
                                <dir>
                                    <div className='row'>
                                        <div className='col-1'>
                                            {
                                            element.mentorId._id ?
                                            <div>{element.mentorId.name}<Link className="btn btn-primary" to={`/profile/${element.mentorId._id}`}><CgProfile/></Link></div>:
                                            <div></div>
                                            }
                                        </div>
                                        <div className='col-4'>
                                            {element.description}
                                        </div>
                                        <div className='col-2'>
                                            {element.amount}
                                            (Rs. {price*element.amount})
                                        </div>
                                        <div className='col-2'>
                                            {
                                                auth.user._id === element.mentorId._id ? <button name="update" className="btn btn-primary" onClick={e=>handleClick(e,element.description,element.amount,element._id)}>Update</button> : <div></div>
                                            }
                                        </div>
                                        <div>
                                            {
                                                auth.user._id === askerId && status==='unsolved' ? <button className='btn btn-primary' onClick={e=>onSubmit(e,element.amount,element.mentorMetamaskAddress,element.mentorId._id)}>Create Contract</button>: null
                                            }
                                        </div>
                                        <div>
                                            {
                                                auth.user._id === askerId?
                                                    <div>
                                                        <button className={"btn btn-success ml-2"} data-toggle="modal" data-target="#modal-message" onClick={e => {
                                                                let _id = element.mentorId._id;
                                                                let name = element.mentorId.name;

                                                                setActiveObject({_id, name});
                                                                setShowModal(true);
                                                        }}> Send Message </button>
                                                        {
                                                            showModal ? <Modal _id={activeObject._id} name={activeObject.name} auth={auth} closeModal={_ => setShowModal(false)}/> : null
                                                        }
                                                    </div> : null
                                            }
                                        </div>
                                    </div>
                                </dir>
                            ))
                            }
                        </div>
                        : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}

ProposalItem.propTypes = {
    data: PropTypes.object.isRequired,
    transactionFailed: PropTypes.func.isRequired,
    transactionSuccessful: PropTypes.func.isRequired,
    topic: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    doubt: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addProposal: PropTypes.func.isRequired,
    updateProposal: PropTypes.func.isRequired,
    initiateProposal: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    doubt: state.doubt
})

export default connect(mapStateToProps, {transactionFailed,transactionSuccessful,addProposal,updateProposal,initiateProposal})(ProposalItem)
