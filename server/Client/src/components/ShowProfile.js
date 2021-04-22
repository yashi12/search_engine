import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import auth from "../reducers/auth";
import ProfileExperience from '../components/ProfileExperience'

const ShowProfile = ({
     auth,
     profile:{social,skills,_id,user,bio,experience,date}}) => {

    console.log("profile show",social,skills,_id);
    return (
        <div>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6 ">

                    <br/><br/>
                    <div className="row">
                        <div className="col">
                            <h5>Github</h5>
                            <p>{social.githubusername}</p>
                        </div>
                        <div className="col">
                            <h5>Linked In</h5>
                            <p>{social.linkedIn}</p>
                        </div>

                        <div className="form-group">
                            <h5>Twitter</h5>
                            <p>{social.twitter}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <h5>Bio</h5>
                        <p>{bio}</p>
                    </div>
                    <div className="form-group">
                        <h5>Skills</h5>
                        {skills.map((skill) => (
                            <span className="badge badge-secondary">{skill}</span>
                        ))}
                    </div>
                    {!auth.loading && user._id === auth.user._id && (
                        <div className="row">

                            <div className="col">
                                <Link to='/addExperience'>
                                    <button className="btn btn-primary">Add Experience</button>
                                </Link>
                            </div>
                            <div className="col">
                                <Link to='/update'>
                                    <button className="btn btn-primary">Update</button>
                                </Link>
                            </div>
                            <div className="col"></div>
                        </div>
                    )}


                </div>

            </div>

        </div>
    )

}

ShowProfile.prototype = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {  })(ShowProfile)
