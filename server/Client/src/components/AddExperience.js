import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { addExperience } from '../action/profile'


const AddExperience = ({ addExperience, history }) => {

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        from: '',
        to: '',
        current: false
    })

    const [toDateDisabled, toggleDisabled] = useState(false)

    const { company, title, from, to, current } = formData

    const onChange = e => setFormData({...formData, [e.target.id]: e.target.value})

    const onSubmit = e => {
        e.preventDefault();
        console.log("data",formData);
        addExperience(formData, history)
    }

    return (
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <br/>
                <div class="card">
                    <div class="card-body">
                        <form onSubmit={e => onSubmit(e)}>
                            <div class="form-group">
                                <h2>Add Experience</h2>
                                <label>Company</label>
                                <input onChange={e => onChange(e)} type="text" class="form-control"  id="company"></input>
                                <br/>
                                <label>Designation</label>
                                <input onChange={e => onChange(e)} type="text" class="form-control"  id="title"></input>
                                <br/>
                                <label>Current Job</label>
                                <br />
                                <input type="checkbox" class="" checked={current} id="current" onChange={e => {
                                    setFormData({...formData, current: !current})
                                    toggleDisabled(!toDateDisabled)
                                }} />
                                <br/>
                                <label >Start</label>
                                <input onChange={e => onChange(e)} type="date" class="form-control"  id="from"></input>
                                <br/>
                                <label >End</label>
                                <input onChange={e => onChange(e)} type="date" class="form-control"  id="to" disabled={toDateDisabled ? 'disabled':''}></input>
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

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
}

export default connect(null, {addExperience})(AddExperience)
