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
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <br/>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => onSubmit(e)}>
                            <div className="form-group">
                                <h2>Add Experience</h2>
                                <label>Company</label>
                                <input onChange={e => onChange(e)} type="text" className="form-control"  id="company"></input>
                                <br/>
                                <label>Designation</label>
                                <input onChange={e => onChange(e)} type="text" className="form-control"  id="title"></input>
                                <br/>
                                <label>Current Job</label>
                                <br />
                                <input type="checkbox" className="" checked={current} id="current" onChange={e => {
                                    setFormData({...formData, current: !current})
                                    toggleDisabled(!toDateDisabled)
                                }} />
                                <br/>
                                <label >Start</label>
                                <input onChange={e => onChange(e)} type="date" className="form-control"  id="from"></input>
                                <br/>
                                <label >End</label>
                                <input onChange={e => onChange(e)} type="date" className="form-control"  id="to" disabled={toDateDisabled ? 'disabled':''}></input>
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

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
}

export default connect(null, {addExperience})(AddExperience)
