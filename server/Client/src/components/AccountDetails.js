import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { createProfile, getCurrentProfile } from '../action/profile'
import { Link, Redirect } from 'react-router-dom'
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

const AccountDetails = ({ profile:{profile, loading} ,createProfile, getCurrentProfile, history }) => {

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


    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = e => {
        e.preventDefault();
        console.log("changed data",formData);
        createProfile(formData, history, profile ? true : false);
    };
    return (
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <form onSubmit={onSubmit}>
                        <br/><br/>
                        <div class="row">
                            <button type="button" class="btn btn-primary" onClick={()=>toggleSocialInputs(!displaySocialInputs)}>Add Social</button>
                        </div>
                        <div className="row">
                            { displaySocialInputs &&( <div>
                                <br />
                                <div class="col">
                                    <label>Github</label>
                                    <input type="text" class="form-control" name="githubusername" aria-describedby="emailHelp" placeholder="Enter email" onChange={e => onChange(e)} value={githubusername}></input>
                                </div>
                                <div class="col">
                                    <label>Linked In</label>
                                    <input type="text" class="form-control" name="linkedIn" placeholder="Password" onChange={e => onChange(e)} value={linkedIn}></input>
                                </div>

                                <div class="col">
                                    <label>Twitter</label>
                                    <input type="text" class="form-control" name="twitter" placeholder="Password" onChange={e => onChange(e)} value={twitter}></input>
                                </div>
                                </div>)}
                        </div>
                        <br />
                        <div class="form-group">
                            <label >Bio</label>
                            <textarea name="bio" class="form-control" rows="5" maxLength="200" onChange={e => onChange(e)} value={bio}></textarea>
                        </div>
                        <div class="form-group">
                            <label >Skills</label>
                            <input type="text" class="form-control" name="skills" placeholder="Password" onChange={e => onChange(e)} value={skills}></input>
                        </div>
                        <input type="submit" className="btn btn-primary my-1" />
                        <Link className="btn btn-light my-1" to="/profile">
                            Go Back
                        </Link>
                        {/*<button type="submit" class="btn btn-primary"><Link to='/profile'>Submit</Link></button>*/}
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

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
    AccountDetails
);