import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile, getProfileById} from '../action/profile'
import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import ProfileExperience from '../components/ProfileExperience'
import { GrUpdate, GrUserExpert } from 'react-icons/gr'
import { MdWork } from 'react-icons/md'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { RiProfileLine, RiErrorWarningLine } from 'react-icons/ri'

const ProfileInfo = ({getProfileById,match,profile: {profile}, auth }) => {

    useEffect(() => {
        getProfileById(match.params.id)
    }, [getProfileById])

    // const {githubusername, linkedIn, twitter, bio, skills} = profile;

    return ( profile ? 
    <Fragment>
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6 card shadow p-3 mb-5 bg-light rounded">

                    <br/>
                    <h3>{profile["user"].name}</h3>
                    <div className="form-group card-body">
                        <h5><RiProfileLine/> Bio</h5>
                        {profile["bio"] ?
                            <p>{profile["bio"]}</p> : <div/>}
                    </div>
                    {profile["social"] ?
                        <div className="row card-body">
                            <div className="col">
                                <h5><FaGithub/> Github</h5>
                                {profile["social"].githubusername ?
                                    <p>{profile["social"].githubusername}</p> : <div/>}
                            </div>
                            <div className="col">
                                <h5><FaLinkedin/> Linked In</h5>
                                {profile["social"].linkedIn ?
                                    <p>{profile["social"].linkedIn}</p> : <div/>}
                            </div>

                            <div className="form-group">
                                <h5><FaTwitter/> Twitter</h5>
                                {profile["social"].twitter ?
                                    <p>{profile["social"].twitter}</p> : <div/>}
                            </div>
                        </div>
                        : <div>No Social contact detail available</div>
                    }
                    <div className="form-group card-header">
                        <h5><GrUserExpert/> Skills</h5>
                        {profile["skills"].map((skill) => (
                            <h5>
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
                            <h4>No experience credentials <RiErrorWarningLine/></h4>
                        )}
                    </div>
                    {!auth.loading && profile["user"]._id === auth.user._id && (
                        <div className="row card-footer">
                            <div className="col">
                                <Link to='/update'>
                                    <button type="button" className="btn btn-primary"><span><GrUpdate/></span> Update Profile</button>
                                </Link>
                            </div>
                            <div className="col">
                                <Link to='/addExperience'>
                                    <button className="btn btn-primary"><span><MdWork/></span> Add Experience</button>
                                </Link>
                            </div>
                        </div>
                    )}
                    


                </div>

            </div>

        </div>
    </Fragment> : <Spinner/>)

}

ProfileInfo.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getProfileById})(ProfileInfo)
