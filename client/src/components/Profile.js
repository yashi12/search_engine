import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentProfile} from '../action/profile'
import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import { CgProfile } from 'react-icons/cg'
import ProfileExperience from '../components/ProfileExperience'
import { GrUpdate, GrUserExpert } from 'react-icons/gr'
import { MdWork } from 'react-icons/md'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { RiProfileLine, RiErrorWarningLine } from 'react-icons/ri'
import ReactStars from "react-rating-stars-component"

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
            <br/>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6 card shadow p-3 mb-5 bg-light rounded">

                    <br/>
                    <h4><CgProfile/> {profile["user"].name} 
                    <ReactStars
                        count={5}
                        isHalf={true}
                        edit={false}
                        size={24}
                        value={profile["user"].rating.rating}
                        activeColor="#5cb85c"
                    /></h4>
                    <div className="row card-body">
                        {profile["social"] ?
                            <Fragment>
                                <div className="col">
                                    <h5><FaGithub/> Github</h5>
                                    {profile["social"].githubusername ?
                                        <a href={"https://github.com/"+profile["social"].githubusername} target="_blank">
                                        {"https://github.com/"+profile["social"].githubusername}</a> : <div/>}
                                </div>
                                <div className="col">
                                    <h5><FaLinkedin/> Linked In</h5>
                                    {profile["social"].linkedIn ?
                                        <a href={"https://github.com/"+profile["social"].linkedIn} target="_blank">
                                        {"https://github.com/"+profile["social"].linkedIn}</a> : <div/>}
                                        
                                </div>

                                <div className="col">
                                    <h5><FaTwitter/> Twitter</h5>
                                    {profile["social"].twitter ?
                                        <a href={"https://github.com/"+profile["social"].twitter} target="_blank">
                                        {"https://github.com/"+profile["social"].twitter}</a> : <div/>}
                                       
                                </div>
                            </Fragment>
                            : <div/>}
                    </div>
                    <div className="form-group card-body">
                        <h5><RiProfileLine/> Bio</h5>
                        {profile["bio"] ?
                            <p>{profile["bio"]}</p> : <div/>}
                    </div>
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


                </div>

            </div>

        </div>
    </Fragment>) : <div>Profile does not exist
        <div className="row">

            <div className="col">
                <Link to='/update'>
                    <button type="button" className="btn btn-primary"><span><GrUpdate/></span> Update Profile</button>
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