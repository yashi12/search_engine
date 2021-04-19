import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState } from 'react'
import { createProfile } from '../action/profile'
import { Link, withRouter } from 'react-router-dom'

const AccountDetails = ({ createProfile, history }) => {

    const [formData, setFormData] = useState({
        Github: '',
        Linked_In:'',
        twitter:'',
        bio:'',
        skills:'',
        experience:''
    })

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    const onChange = e => setFormData(...formData, [e.target.id]= e.target.value)

    const onSubmit = e => {
        e.preventDefault()
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
                            <button onClick={toggleSocialInputs(!displaySocialInputs)}>Add Social</button>
                            { displaySocialInputs && <div>
                                <div class="col">
                                    <label>Github</label>
                                    <input type="text" class="form-control" name="github" aria-describedby="emailHelp" placeholder="Enter email"></input>
                                </div>
                                <div class="col">
                                    <label>Linked In</label>
                                    <input type="text" class="form-control" name="linked_in" placeholder="Password"></input>
                                </div>
                                
                                <div class="form-group">
                                    <label>Twitter</label>
                                    <input type="text" class="form-control" name="twitter" placeholder="Password"></input>
                                </div>
                            </div> }
                            
                        </div>
                        <div class="form-group">
                            <label >Bio</label>
                            <textarea name="bio" class="form-control" rows="5" maxLength="200"></textarea>
                        </div>
                        <div class="form-group">
                            <label >Skills</label>
                            <input type="text" class="form-control" name="skill" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label >Experience</label>
                            <input type="text" class="form-control" name="experience" placeholder="Password"></input>
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
