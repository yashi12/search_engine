import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React,{ useState, useEffect } from 'react'
import { createProfile, getCurrentProfile } from '../action/profile'
import { Link, Redirect } from 'react-router-dom'
import profile from '../reducers/profile'
import { loadUser } from '../action/auth'

// State Initialization
const initialState = {
    company: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    linkedIn: ''
};

const AccountDetails = ({ profile:{profile, loading} ,createProfile, getCurrentProfile, history }) => {

    const [formData, setFormData] = useState({
        github: '',
        linked_in:'',
        twitter:'',
        bio:'',
        skills:''
    })

    // Toggling action
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


    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = e => {
        e.preventDefault();
        console.log("changed data",formData);
        createProfile(formData, history, !!profile);
    };
    return (
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6">
                    <form onSubmit={onSubmit}>
                        <br/><br/>
                        {/* Handling the toggle action */}
                        <div className="row">
                            <button type="button" className="btn btn-primary" onClick={()=>toggleSocialInputs(!displaySocialInputs)}>Add Social</button>
                        </div>
                        <div className="row">
                            { displaySocialInputs &&( <div>
                                <br />
                                {/* Taking inputs like Github username, Linked In and Twitter name */}
                                <div className="col">
                                    <label htmlFor="githubusername">Github</label>
                                    <input type="text" id="githubusername" className="form-control" name="githubusername" aria-describedby="emailHelp" placeholder="Enter email" onChange={e => onChange(e)} value={githubusername}/>
                                </div>
                                <div className="col">
                                    <label htmlFor="linkedin">Linked In</label>
                                    <input type="text" id="linkedin" className="form-control" name="linkedIn" placeholder="Password" onChange={e => onChange(e)} value={linkedIn}/>
                                </div>
                                <div className="col">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input type="text" id="twitter" className="form-control" name="twitter" placeholder="Password" onChange={e => onChange(e)} value={twitter}/>
                                </div>
                                </div>)}
                        </div>
                        <br />
                        {/* Taking Bio and Skills */}
                        <div className="form-group">
                            <label className="text-primary" htmlFor="bio">Bio</label>
                            <textarea name="bio" className="form-control" rows="5" maxLength="200" onChange={e => onChange(e)} value={bio}/>
                        </div>
                        <div className="form-group">
                            <label className="text-primary" htmlFor="skills">Skills</label>
                            <input type="text" className="form-control" name="skills" placeholder="Password" onChange={e => onChange(e)} value={skills}/>
                        </div>
                        <input type="submit" className="btn btn-primary my-1" />
                        <br/>
                        <Link className="btn btn-light my-1" to="/profile">
                            Go Back
                        </Link>
                        {/*<button type="submit" className="btn btn-primary"><Link to='/profile'>Submit</Link></button>*/}
                    </form>
                </div>

            </div>

        </div>

    )
}

AccountDetails.propTypes = {
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

// Accessing the profile from the redux state
const mapStateToProps = state => ({
    profile: state.profile
});

// Connecting react program with redux
export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
    AccountDetails
);