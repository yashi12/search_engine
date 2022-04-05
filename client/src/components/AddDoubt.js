import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { addDoubt } from '../action/doubt'
import PropTypes from 'prop-types'
import Axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AddDoubt = ({addDoubt}) => {

	// State Initialization
	const [formData, setFormData] = useState({
		text: '',
		title:""
	})
	const [image,setImage] = useState()
	const [value, setValue] = useState('')

	const {text,title} = formData

	// setting values from inputs into a formData
	const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

	// To set the value of text in formData when the value changes
	useEffect(() => {
		setFormData({...formData,"text":value})
	}, [value])

	// Submitting the data
	const onSubmit = e => {
		e.preventDefault()
		//setFormData({...formData,"text":value})
		console.log("data",formData)
		const data = new FormData();
		data.append("text",formData.text);
		const tags = formData.title.split(',')
		tags.forEach(item => {
			data.append(
				"title",item
			); });

		// Axios.post("https://httpbin.org/anything",data)
		//     .then(res =>console.log("res",res))
		//     .catch(err =>console.log("err",err))
		console.log("buffer",data);
		addDoubt(data)
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

									<label className="form-label">Address of Doubt Resolver</label>
									<textarea onChange={e => onChange(e)} className="form-control" id="title" rows="1"/>

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
