import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile} from '../action/profile'
import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import Moment from 'react-moment';
import auth from "../reducers/auth";
import ProfileExperience from '../components/ProfileExperience'

const Profile = ({
                     getCurrentProfile,
                     auth: {user},
                     profile: {profile, loading}
                 }) => {

    useEffect(() => {
        getCurrentProfile()
    }, [])
    console.log("profile log:", profile);


    // const {githubusername, linkedIn, twitter, bio, skills} = profile;

    return (profile === null ? <Spinner/> : !profile.hasOwnProperty("msg") ? (<Fragment>
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6 card shadow p-3 mb-5 bg-light rounded">

                    <br/><br/>
                    <div className="row card-body">
                        {profile["social"] ?
                            <Fragment>
                                <div className="col">
                                    <h5>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                            <path
                                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                        </svg>
                                        Github</h5>
                                    {profile["social"].githubusername ?
                                        <p>{profile["social"].githubusername}</p> : <div/>}
                                </div>
                                <div className="col">
                                    <h5>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                            <path
                                                d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                        </svg>
                                        Linked In</h5>
                                    {profile["social"].linkedIn ?
                                        <p>{profile["social"].linkedIn}</p> : <div/>}
                                </div>

                                <div className="form-group">
                                    <h5>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                                            <path
                                                d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                        </svg>Twitter</h5>
                                    {profile["social"].twitter ?
                                        <p>{profile["social"].twitter}</p> : <div/>}
                                </div>
                            </Fragment>
                            : <div/>}
                    </div>
                    <div className="form-group card-body">
                        <h5>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                                <path
                                    d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                            </svg>
                            Bio</h5>
                        {profile["bio"] ?
                            <p>{profile["bio"]}</p> : <div/>}
                    </div>
                    <div className="form-group card-header">
                        <h5>Skills</h5>
                        {profile["skills"].map((skill) => (
                            <h5>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-check2" viewBox="0 0 16 16">
                                    <path
                                        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                                <span className="badge badge-warning">{skill}</span></h5>
                        ))}
                    </div>
                    <div className="form-group card-group">

                        {profile["experience"].length > 0 ? (
                            <Fragment>
                                <h5>Experience</h5>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Company</th>
                                        <th scope="col">Designation</th>
                                        <th scope="col">Start</th>
                                        <th scope="col">End</th>
                                        <th scope="col">Current</th>
                                    </tr>
                                    </thead>

                                    {profile["experience"].map((experience) => (
                                        <ProfileExperience
                                            key={experience._id}
                                            experience={experience}
                                        />
                                    ))}
                                </table>
                            </Fragment>

                        ) : (
                            <h4>No experience credentials</h4>
                        )}
                    </div>
                    <div className="row card-footer">

                        <div className="col">
                            <Link to='/update'>
                                <button type="button" className="btn btn-primary">Update Profile</button>
                            </Link>
                        </div>
                        <div className="col">
                            <Link to='/addExperience'>
                                <button className="btn btn-primary">Add Experience</button>
                            </Link>
                        </div>
                    </div>


                </div>

            </div>

        </div>
    </Fragment>) : <div>Profile does not exist
        <div className="row">

            <div className="col">
                <Link to='/update'>
                    <button type="button" className="btn btn-primary">Update Profile</button>
                </Link>
            </div>
            <div className="col-10">

            </div>
        </div></div>)

}

Profile.prototype = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Profile)
