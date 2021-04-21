import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../action/profile'
import { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import auth from "../reducers/auth";
import ProfileExperience from '../components/ProfileExperience'

const ShowProfile = ({getCurrentProfile,
     auth: { user }, 
     profile:{profile, loading}}) => {

    useEffect(() => {
        getCurrentProfile()
    }, [])
    console.log("profile",profile);
    // const {githubusername, linkedIn, twitter, bio, skills} = profile;

    return (loading && profile === null ? <Spinner />:(<Fragment>
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 ">
                    
                    <br/><br/>
                    <div class="row">
                        <div class="col">
                            <h5>Github</h5>
                            {/*<p>{profile.social.githubusername}</p>*/}
                        </div>
                        <div class="col">
                            <h5>Linked In</h5>
                            {/*<p>{profile.social.linkedIn}</p>*/}
                        </div>
                        
                        <div class="form-group">
                            <h5>Twitter</h5>
                            {/*<p>{profile.social.twitter}</p>*/}
                        </div>
                    </div>
                    <div class="form-group">
                        <h5 >Bio</h5>
                        {/*<p>{profile.bio}</p>*/}
                    </div>
                    <div class="form-group">
                        <h5 >Skills</h5>
                        {/*<p>{skills}</p>*/}
                    </div>
                    <div class="form-group">
                        <h5 >Experience</h5>
                        {profile.experience.length > 0 ? (
                            <Fragment>
                            {profile.experience.map((experience) => (
                                <ProfileExperience
                                key={experience._id}
                                experience={experience}
                                />
                            ))}
                            </Fragment>
                        ) : (
                            <h4>No experience credentials</h4>
                        )}
                    </div>
                    <div className="row">
                        
                        
                        <div className="col">
                            <Link to='/addExperience'><button className="btn btn-primary">Add Experience</button></Link>
                        </div>
                        <div className="col"></div>
                    </div>


                </div>
                
            </div>
            
        </div>
    </Fragment>))
    
}

ShowProfile.prototype = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(ShowProfile)
