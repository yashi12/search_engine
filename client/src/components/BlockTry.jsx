import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'
import Doubts from './Doubts';


const BlockTry = () => {

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

    const [doubtData, setDoubtData] = useState(null)

    const fetchBalance = async(e) => {
        e.preventDefault()
        const balance =  await state.contract.methods.balance.call()
        setBalance(parseFloat(balance).toFixed(2))
    }
  
    const fetchData = async(e) => {
        e.preventDefault()
        const sessionData = await state.contract.methods.sessions(formData.fetchId).call()
        const contractData = {
            addressOfDoubtSolver : sessionData.doubtSolver,
            addressOfDoubtResolver : sessionData.doubtAsker,
            title : sessionData.topic,
            description : sessionData.isCompleted ? 'Completed':'Not completed',
            tags : [],
            id: sessionData.id,
            raisedAmount : parseFloat(sessionData.amount).toFixed(2)
        }
        setDoubtData(contractData)
        setToggle(true)
    }

  // State Initialization
	const [formData, setFormData] = useState({
		address: '',
		id: '',
        topic: '',
        amount: 0,
        fetchId: ''
	})

    const [toggle, setToggle] = useState(false)

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

	// Submitting the data
	const onSubmit = async(e) => {
		e.preventDefault()
		//setFormData({...formData,"text":value})
        //setFormData({...formData, amount: Web3.utils.BN(formData.amount)})

        const send = await state.contract.methods.createSession(formData.amount,state.account,formData.address,formData.topic,formData.id).send({from:state.account,value:formData.amount})
        console.log("txn : ",send)
	}

    // 0x9B79Fcfb243236f12867a38B22B49c045792821f

  return (
    <div>
        <div className="row">
            <div className="col-3"/>
            <div className="col-6">
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
                                    <label>Amount</label>
                                    <input type="number" width="100%" onChange={e => onChange(e)} className="form-control" id="amount" />
                                </div>
                                <button onClick={(e)=>onSubmit(e)} className="btn btn-primary">Submit</button>
                                <br />
                                <hr />
                                <div className="mb-3">
                                    <label>Id</label>
                                    <input type="text" width="100%" onChange={e => onChange(e)} className="form-control" id="fetchId" step="50" min="0"/>
                                </div>
                                <button onClick={(e)=>fetchData(e)} className="btn btn-primary">Fetch</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-3">
                <br /><br />
                <div><button className="btn btn-primary" onClick={fetchBalance} >Balance : {balance}</button></div>
            </div>
            
        </div>
        { toggle ? <div>
            <Doubts key={doubtData.id} doubt={doubtData} />
        </div> :
        <div></div>

        }
    </div>
)
}


export default BlockTry;
