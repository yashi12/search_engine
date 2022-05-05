import React,{useState, useEffect} from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'


const ProposalItem = props => {

    const [price, setPrice] = useState(0)

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	},[])

    const [toggle, setToggle] = useState(false)

    const [data, setData] = useState({description:"",amount:""})

    const handleClick = (e) => {
        e.preventDefault()
        if(e.target.name == "add"){
            console.log("add")
        }
        else{
            console.log("update")
        }
        setToggle(!toggle)
    }

    const onChange = e => {
        e.preventDefault()
        setData({...data,[e.target.id]:e.target.value})
    }

    const UpdateProposal = e => {
        e.preventDefault()
    }

    return (
        <div>
            <div>
                <button name="add" className="btn btn-primary" onClick={e=>handleClick(e)}>Add Proposal</button>
            </div>
            {
                toggle ? 
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
                                <div>Address</div>
                            </div>
                            <button className="btn btn-info" onClick={e=>UpdateProposal(e)}>Submit</button>
                        </form>
                        <br />
                    </div>
                </div> : <div></div>
            }
            <div>
                <button name="update" className="btn btn-primary" onClick={e=>handleClick(e)}>Update</button>
            </div>
        </div>
    )
}

ProposalItem.propTypes = {}

export default ProposalItem