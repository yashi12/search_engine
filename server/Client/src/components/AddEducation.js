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
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <br/><br/>
                <div class="card">
                    <div class="card-body">
                        <form onSubmit={e => {
                            e.preventDefault()
                            addExperience(formData, history)
                        }}>
                            <div class="form-group">
                                <label>Company</label>
                                <input onChange={e => onChange(e)} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Company"></input>
                                <br/>
                                <label>Designation</label>
                                <input onChange={e => onChange(e)} type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Designation"></input>
                                <br/>
                                <label>Current Job</label>
                                <input type="checkbox" class="form-control" checked={current} id="current" onChange={e => {
                                    setFormData({...formData, current: !current})
                                    toggleDisabled(!toDateDisabled)
                                }} />
                                <br/>
                                <label >Start</label>
                                <input onChange={e => onChange(e)} type="date" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Start Year"></input>
                                <br/>
                                <label >End</label>
                                <input onChange={e => onChange(e)} type="date" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="End Year" disabled={toDateDisabled ? 'disabled':''}></input>
                                <br/>
                                
                                <button type="submit" class="btn btn-primary">Add</button>
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
