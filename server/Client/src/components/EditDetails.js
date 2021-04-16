import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { createProfile, getCurrentProfile } from '../action/profile'
import { Link, withRouter } from 'react-router-dom'
import profile from '../reducers/profile'
import { loadUser } from '../action/auth'


const EditProfile = ({ profile:{profile, loading} ,createProfile, getCurrentProfile, history }) => {

    const [formData, setFormData] = useState({
        github: '',
        linked_in:'',
        twitter:'',
        bio:'',
        skills:'',
        experience:''
    })

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    useEffect( () =>{
        getCurrentProfile()
        
        setFormData({
            Github: loading || !profile.github ? '' : profile.github
        })
    }, [loading])

    const onChange = e => setFormData(...formData, [e.target.id]= e.target.value)

    const onSubmit = e => {
        e.preventDefault()
        createProfile(formData, history, true)
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
                                    <input onChange={e => onChange(e)} type="text" class="form-control" name="github" aria-describedby="emailHelp" placeholder="Enter email"></input>
                                </div>
                                <div class="col">
                                    <label>Linked In</label>
                                    <input onChange={e => onChange(e)} type="text" class="form-control" name="linked_in" placeholder="Password"></input>
                                </div>
                                
                                <div class="form-group">
                                    <label>Twitter</label>
                                    <input onChange={e => onChange(e)} type="text" class="form-control" name="twitter" placeholder="Password"></input>
                                </div>
                            </div> }
                            
                        </div>
                        <div class="form-group">
                            <label >Bio</label>
                            <textarea onChange={e => onChange(e)} name="bio" class="form-control" rows="5" maxLength="200"></textarea>
                        </div>
                        <div class="form-group">
                            <label >Skills</label>
                            <input onChange={e => onChange(e)} type="text" class="form-control" name="skill" placeholder="Password"></input>
                        </div>
                        <div class="form-group">
                            <label >Experience</label>
                            <input onChange={e => onChange(e)} type="text" class="form-control" name="experience" placeholder="Password"></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
                
            </div>
            
        </div>
        
    )
}

EditProfile.prototype = {
    createProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(null, { createProfile, getCurrentProfile})(withRouter(EditProfile))
