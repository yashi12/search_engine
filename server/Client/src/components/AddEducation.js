import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { addExperience } from '../action/profile'


const AddEducation = ({ addEducation, history }) => {

    const [formData, setFormData] = useState({
        company: '',
        designation: '',
        start: '',
        end: '',
        current: false
    })

    const [toDateDisabled, toggleDisabled] = useState(false)

    const { company, designation, start, end, current } = formData

    const onChange = e = setFormData({...formData}, [e.target.id]= e.target.value)

    return (
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <br/><br/>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => {
                            e.preventDefault()
                            addExperience(formData, history)
                        }}>
                            <div className="form-group">
                                <label>Company</label>
                                <input onChange={e => onChange(e)} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Company"></input>
                                <br/>
                                <label>Designation</label>
                                <input onChange={e => onChange(e)} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Designation"></input>
                                <br/>
                                <label>Current Job</label>
                                <input type="checkbox" className="form-control" checked={current} id="current" onChange={e => {
                                    setFormData({...formData, current: !current})
                                    toggleDisabled(!toDateDisabled)
                                }} />
                                <br/>
                                <label >Start</label>
                                <input onChange={e => onChange(e)} type="date" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Start Year"></input>
                                <br/>
                                <label >End</label>
                                <input onChange={e => onChange(e)} type="date" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="End Year" disabled={toDateDisabled ? 'disabled':''}></input>
                                <br/>
                                
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

AddEducation.propTypes = {
    addExperience: PropTypes.func.isRequired
}

export default connect(null, {addEducation})(AddEducation)
