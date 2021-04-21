import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createProfile } from '../action/profile'
import { Link, withRouter } from 'react-router-dom'

const AccountDetails = ({ createProfile, history }) => {
    console.log("start return");
    const [formData, setFormData] = useState({
        githubusername: '',
        linkedIn:'',
        twitter:'',
        bio:'',
        skills:''
    })

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = e => {
        e.preventDefault()
        console.log("formgdata",formData)
        createProfile(formData, history)
    }
    return (
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <form onSubmit={e => onSubmit(e)}>
                        <br/><br/>
                        <div class="row">
                            <button type="button" onClick={()=>toggleSocialInputs(!displaySocialInputs)}>Add Social</button>
                            { displaySocialInputs &&( <div>
                                <div class="col">
                                    <label>Github</label>
                                    <input type="text" class="form-control" name="githubusername" aria-describedby="emailHelp" placeholder="Enter email" onChange={e => onChange(e)}></input>
                                </div>
                                <div class="col">
                                    <label>Linked In</label>
                                    <input type="text" class="form-control" name="linkedIn" placeholder="Password" onChange={e => onChange(e)}></input>
                                </div>

                                <div class="form-group">
                                    <label>Twitter</label>
                                    <input type="text" class="form-control" name="twitter" placeholder="Password" onChange={e => onChange(e)}></input>
                                </div>
                            </div>)
                            }

                        </div>
                        <div class="form-group">
                            <label >Bio</label>
                            <textarea name="bio" class="form-control" rows="5" maxLength="200" onChange={e => onChange(e)}></textarea>
                        </div>
                        <div class="form-group">
                            <label >Skills</label>
                            <input type="text" class="form-control" name="skills" placeholder="Password" onChange={e => onChange(e)}></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>

            </div>

        </div>

    )
}

AccountDetails.prototype = {
    createProfile: PropTypes.func.isRequired
}

export default connect(null, { createProfile})(withRouter(AccountDetails))
