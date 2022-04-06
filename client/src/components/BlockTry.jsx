import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'

import ReactQuill from 'react-quill'

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
            //const balance =  await myContract.methods.balance.call()
            //const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})
            
            //const con = await state.contract.methods.sessions('1').call()
        }
        else{
            window.alert("smart contract not deployed")
        }
    }

    const sendData = async() => {

    }
  
    const fetchData = async() => {
        const con = await state.contract.methods.sessions('3').call()
        console.log("con : ",con)
    }

  // State Initialization
	const [formData, setFormData] = useState({
		text: '',
		title:""
	})
	const [value, setValue] = useState('')

	const {text,title} = formData

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

	// To set the value of text in formData when the value changes
	useEffect(() => {
		setFormData({...formData,"text":value})
	}, [value])

	// Submitting the data
	const onSubmit = async(e) => {
		e.preventDefault()
		//setFormData({...formData,"text":value})
		const data = new FormData();
		data.append("text",formData.text);
		const tags = formData.title.split(',')
		tags.forEach(item => {
			data.append(
				"title",item
			); });

        const send = await state.contract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'blockchain','3').send({from:state.account})
        console.log("txn : ",send)
	}

  return (
    <div className="row">
        <div className="col-3"/>
        <div className="col-6">
            <br/><br/>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={e => onSubmit(e)} id="add-post-form" encType="multipart/form-data">
                        {/* Taking Inputs */}
                        <div className="form-group">
                            <div className="mb-3 justify-content-between">
                                <label className="form-label">Address of Doubt Solver</label>
                                <textarea onChange={e => onChange(e)} className="form-control" id="title" rows="1"/>

                                <label className="form-label">Address of Doubt Asker</label>
                                <p>{state.account}</p>

                            </div>
                            <div className="mb-3">
                                <label>Title</label>
                                <textarea onChange={(e) => {
                                    onChange(e)
                                }} minLength="1" className="form-control" id="title" rows="1"/>
                            </div>
                            <div className="mb-3">
                                <label>Add Description</label>
                                <small>(Min 20 words)</small>
                                {/* <textarea onChange={e => onChange(e)} className="form-control" id="text" rows="3"></textarea> */}
                                <ReactQuill theme="snow" value={value} onChange={setValue} />
                            </div>
                            <div className="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea onChange={e => onChange(e)} className="form-control" id="title" rows="2"/>
                            </div>
                            <div className="mb-3">
                                <label>Amount</label>
                                <input type="number" width="100%" onChange={e => onChange(e)} className="form-control" id="title" step="50" min="0"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button onClick={fetchData} className="btn btn-primary">Fetch</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
)
}


export default BlockTry;
