import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React,{ useState, useEffect } from 'react'
import { createProfile, getCurrentProfile } from '../action/profile'
import { Link, withRouter } from 'react-router-dom'
import profile from '../reducers/profile'
import { loadUser } from '../action/auth'

const initialState = {
    company: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    linkedIn: ''
};

const EditProfile = ({ profile:{profile, loading} ,createProfile, getCurrentProfile, history }) => {

    const [formData, setFormData] = useState({
        github: '',
        linked_in:'',
        twitter:'',
        bio:'',
        skills:''
    })

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    useEffect( () =>{
        if (!profile) getCurrentProfile();
        if (!loading && profile) {
            const profileData = { ...initialState };
            for (const key in profile) {
                if (key in profileData) profileData[key] = profile[key];
            }
            for (const key in profile.social) {
                if (key in profileData) profileData[key] = profile.social[key];
            }
            if (Array.isArray(profileData.skills))
                profileData.skills = profileData.skills.join(', ');
            setFormData(profileData);
        }
    }, [loading, getCurrentProfile, profile]);

    const {
        company,
        skills,
        githubusername,
        bio,
        twitter,
        linkedIn
    } = formData;

    //     getCurrentProfile()
    //
    //     setFormData({
    //         Github: loading || !profile.github ? '' : profile.github
    //     })
    // }, [loading])

    const onChange = e => setFormData(...formData, [e.target.id]= e.target.value)

    const onSubmit = e => {
        e.preventDefault()
        createProfile(formData, history, true)
    }

    return (
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6">
                    <form onSubmit={e => onSubmit(e)}>
                        <br/><br/>
                        <div className="row">
                            <button onClick={toggleSocialInputs(!displaySocialInputs)}>Add Social</button>
                            { displaySocialInputs && <div>
                                <div className="col">
                                    <label htmlFor="github">Github</label>
                                    <input onChange={e => onChange(e)} type="text" className="form-control" name="github" placeholder="Enter GitHub link" value={githubusername}/>
                                </div>
                                <div className="col">
                                    <label htmlFor="linked_in">Linked In</label>
                                    <input onChange={e => onChange(e)} type="text" className="form-control" name="linked_in" placeholder="Enter LinkedIn Link"/>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input onChange={e => onChange(e)} type="text" className="form-control" name="twitter" placeholder="Enter Twitter Link"/>
                                </div>
                            </div> }
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <textarea onChange={e => onChange(e)} name="bio" className="form-control" rows="5" maxLength="200"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skill">Skills</label>
                            <input onChange={e => onChange(e)} type="text" className="form-control" name="skill" placeholder="Password"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="experience">Experience</label>
                            <input onChange={e => onChange(e)} type="text" className="form-control" name="experience" placeholder="Password"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
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

export default connect(mapStateToProps, { createProfile, getCurrentProfile})(withRouter(EditProfile))
