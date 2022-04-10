import React, { useEffect, useState, Fragment } from 'react';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'
import ContractItem from './ContractItem';
import { BiErrorCircle } from 'react-icons/bi'

const SearchDoubtContract = () => {
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
            const bal =  await myContract.methods.balance.call()
            
            //const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})
            
            //const con = await state.contract.methods.sessions('1').call()
        }
        else{
            window.alert("smart contract not deployed")
        }
    }

    const [dataFound, setDataFound] = useState(true)
  
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
        console.log(contractData)
        if(contractData.title === ''){
            setToggle(false)
            setDataFound(false)
        }
        else{
            setDoubtData(contractData)
            setToggle(true)
            setDataFound(true)
        } 
    }

  // State Initialization
	const [formData, setFormData] = useState({
        fetchId: ''
	})

    const [doubtData, setDoubtData] = useState(null)

    const [toggle, setToggle] = useState(false)

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
                <div className="col">
                <br/>
                <form className="bar" method="get" >
                    <div>
                        <h1 className="large text-primary">Enter Contract Id</h1>
                        <input onChange={e => onChange(e)} type="text" className="form-control" id="fetchId" placeholder="Search Contract"/>
                        <br/>
                        <button onClick={(e)=>fetchData(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                    </div>
                </form>
                </div>
                <div className="col"/>
                <div className="col"/>
            </div>
            <div >
                { toggle ? 
                <div>
                    <ContractItem doubt={doubtData} />
                </div> :
                <div>
                    {dataFound ? <div></div> : 
                        <div className="row">
                            <div className="col-4"></div>
                            <div className="col-6">
                                <br /><br />
                                <h3 className="text text-danger">NO CONTRACT FOUND  <BiErrorCircle/></h3>
                            </div>
                            <div className="col"></div>
                        </div>
                    }</div>
                }
            </div>
        </Fragment>
    )
}

export default SearchDoubtContract