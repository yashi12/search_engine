import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { addDoubt } from '../action/doubt'
import PropTypes from 'prop-types'
import Axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {FaMoneyBillAlt} from "react-icons/fa";
import styled from "styled-components";
import axios from "axios";

const Label = styled.label`
	font-weight: bold;
    font-size: 1.1em;
    font-family: Georgia, serif;
`;
const AddDoubt = ({addDoubt}) => {

	// State Initialization
	const [formData, setFormData] = useState({
		title:"",
		description : "",
		raisedAmount : "",
		tags : []
	})
	const [value, setValue] = useState('')
	const [price, setPrice] = useState(0)
 	const {text,title} = formData

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

	// To set the value of text in formData when the value changes
	useEffect(() => {
		setFormData({...formData,"text":value})
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
			.then((data)=>{
				setPrice(data.data.ethereum.inr);
			})
	}, [value])

	// Submitting the data
	const onSubmit = e => {
		e.preventDefault();
		if(formData.raisedAmount > 0){
			formData.description = formData.text;
			formData.raisedAmount = formData.raisedAmount*10**18
			addDoubt(formData);
		}
		else{
			alert('Amount should be greater than 0')
		}
		//
	}

	return (
		<div className="row">
			<div className="col-3"/>
			<div className="col-6">
				<br/><br/>
				<div className="card">
					<div className="card-body">
						<form  id="add-post-form" encType="multipart/form-data">
							{/* Taking Inputs */}
							<div className="form-group">
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
									<ReactQuill theme="snow" value={value} onChange={setValue} id="description"/>
								</div>
								<div className="mb-3">
									<label>Add Tags</label>
									<small>(Please don't add more than 30 tags)</small>
									<textarea onChange={e => onChange(e)} className="form-control" id="tags" rows="2"/>
								</div>
								<div className="mb-3">
									<label>Amount (in ETH)</label>
									<input type="number" width="100%" onChange={e => onChange(e)} className="form-control" id="raisedAmount"/>
									<div>(Rs. {price * formData.raisedAmount})</div>
								</div>
								<button onClick={e => onSubmit(e)} className="btn btn-primary">Submit</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

AddDoubt.propTypes = {
	addDoubt: PropTypes.func.isRequired
}

// Connecting react program with redux
export default connect(null, {addDoubt})(AddDoubt)
