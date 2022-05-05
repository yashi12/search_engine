import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Mycontract from '../abis/Mycontract.json'
import PropTypes from 'prop-types'
import Web3 from 'web3'

const ProposalItem = () => {

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
    const [updateData, setUpdateData] = useState({description:"",amount:0,address:""})

    const handleClick = (e,description,amount) => {
        e.preventDefault()
        if(e.target.name == "add"){
            setProposalToggle(!proposalToggle)
        }
        else{
            setUpdateToggle(!updateToggle)
            setUpdateData({description:description,amount:amount,address:state.account})
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
        console.log("update data : ",updateData)
    }

    const AddProposal = e => {
        e.preventDefault()
        console.log("data : ",data)
    }

    return (
        <div>
            <div>
                <button name="add" className="btn btn-primary" onClick={e=>handleClick(e)}>Add Proposal</button>
            </div>
            {
                proposalToggle ? 
                <div className="row g-2">
                    <div className="col">
                        <form>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" id="description" rows="3" value={data.description} onChange={e=>onChange(e)}></textarea>
                                <label>Amount (in ETH)</label>
                                <input type="number" width="100%" onChange={e => onChange(e)} value={data.amount} className="form-control" id="amount" />
                                <div>(Rs. {price*data.amount})</div>
                                <label>Address</label>
                                <div>{state.account}</div>
                            </div>
                            <button className="btn btn-info" onClick={e=>AddProposal(e)}>Submit</button>
                        </form>
                        <br />
                    </div>
                </div> : <div></div>
            }
            <div>
                <button name="update" className="btn btn-primary" onClick={e=>handleClick(e,"description",0)}>Update</button>
            </div>
            {
                updateToggle ? 
                <div className="row g-2">
                    <div className="col">
                        <form>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" id="description" rows="3" value={updateData.description} onChange={e=>UpdateChange(e)}></textarea>
                                <label>Amount (in ETH)</label>
                                <input type="number" width="100%" onChange={e => UpdateChange(e)} value={updateData.amount} className="form-control" id="amount" />
                                <div>(Rs. {price*data.amount})</div>
                                <label>Address</label>
                                <div>{state.account}</div>
                            </div>
                            <button className="btn btn-info" onClick={e=>UpdateProposal(e)}>Update</button>
                        </form>
                        <br />
                    </div>
                </div> : <div></div>
            }
        </div>
    )
}

ProposalItem.propTypes = {}

export default ProposalItem