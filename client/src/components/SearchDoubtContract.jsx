import React, { useEffect, useState, Fragment } from 'react';
import Web3 from 'web3'
import Mycontract from '../abis/Mycontract.json'
import ContractItem from './ContractItem';
import { BiErrorCircle } from 'react-icons/bi'
import axios from 'axios';

const SearchDoubtContract = () => {

    const [contractArr, setContractArr] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3000/api/book/initiate').then((res)=>{
            axios.get(`${process.env.REACT_APP_API}/api/mentor/final/`).then((res2)=>{
                setContractArr(res.data)
                loadWeb3()
                loadBlockchain(res.data,res2.data)
            })
        })
    },[])

    const [state, setState] = useState({account:'',contract:null})
    const [dataFound, setDataFound] = useState(true)
    const [doubtData, setDoubtData] = useState([])
    const [toggle, setToggle] = useState(false)
    
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

    const loadBlockchain = async (data,data2) => {
        const web3 = window.web3
        
        const accounts = await web3.eth.requestAccounts()
        //setState({account : accounts[0],...state})
        let contracts = []
        const networkId = await web3.eth.net.getId()
        if(Mycontract.networks[networkId]){

            const networkData = Mycontract.networks[networkId]
            const myContract = new web3.eth.Contract(Mycontract.abi, networkData.address)
            setState({account:accounts[0],contract:myContract})
            console.log("responce : ",data)
            for(let i=0;i<data.length;i++){
                let sessionData = await myContract.methods.sessions(data[i].doubtId).call()
                let contractData = {
                    addressOfDoubtSolver : sessionData.doubtSolver,
                    addressOfDoubtResolver : sessionData.doubtAsker,
                    title : sessionData.topic,
                    description : sessionData.isCompleted ? 'Completed':'Not completed',
                    tags : [],
                    id: sessionData.id,
                    raisedAmount : parseFloat(sessionData.amount).toFixed(2)
                }
                if(contractData.title === ''){
                    setToggle(false)
                    setDataFound(false)
                }
                else{
                    contracts.push(contractData)
                    
                    setToggle(true)
                    setDataFound(true)
                }
            }
            console.log("data 2:",data2)
            for(let i=0;i<data2.length;i++){
                if(data2[i].status !== 'solved'){
                    console.log(data2[i].doubtId)
                    let sessionData = await myContract.methods.sessions(data2[i].doubtId._id).call()
                    let contractData = {
                        addressOfDoubtSolver : sessionData.doubtSolver,
                        addressOfDoubtResolver : sessionData.doubtAsker,
                        title : sessionData.topic,
                        description : sessionData.isCompleted ? 'Completed':'Not completed',
                        tags : [],
                        id: sessionData.id,
                        raisedAmount : parseFloat(sessionData.amount).toFixed(2)
                    }
                    if(contractData.title === ''){
                        setToggle(false)
                        setDataFound(false)
                    }
                    else{
                        contracts.push(contractData)
                        
                        setToggle(true)
                        setDataFound(true)
                    }
                }
            }
            setDoubtData(contracts)

            //const name =  await myContract.methods.name().call()
            //const bal =  await myContract.methods.balance.call()
            
            //const send = await myContract.methods.createSession(1,'0x9B79Fcfb243236f12867a38B22B49c045792821f','0x3A314d8553e4bAB7cA9a2Fca4D8b3d28b95Bf2de', 'react js','2').send({from:address.account})
            
            //const con = await state.contract.methods.sessions('1').call()
        }
        else{
            window.alert("smart contract not deployed")
        }
        
        
        console.log("doubt data : ",doubtData)
    }


    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
                <div className="col">
                <br/>
                <h1 className="large text-primary">Your Contracts</h1>
                </div>
                <div className="col"/>
                <div className="col"/>
            </div>
            <div >
                <div>
                    {   doubtData.length !== 0 ?
                        doubtData.map((contract)=>(
                            <ContractItem doubt={contract} contract={state.contract} account={state.account} />
                        )) :
                        <div className="row">
                            <div className="col-4"></div>
                            <div className="col-6">
                                <br /><br />
                                <h3 className="text text-danger">NO CONTRACT FOUND  <BiErrorCircle/></h3>
                            </div>
                            <div className="col"></div>
                        </div>
                    }
                </div> 
            </div>
        </Fragment>
    )
}

export default SearchDoubtContract