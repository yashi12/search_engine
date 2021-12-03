import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import auth from "../reducers/auth";
import ProfileExperience from '../components/ProfileExperience'
import Moment from "react-moment";
import { CgProfile } from 'react-icons/cg'
import { AiFillInfoCircle } from 'react-icons/ai'
import { GrUpdate, GrUserExpert } from 'react-icons/gr'
import { MdWork } from 'react-icons/md'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { RiProfileLine, RiErrorWarningLine } from 'react-icons/ri'
import ReactStars from "react-rating-stars-component"

const ShowProfile = ({
                         auth,
                         profile: {social, skills, _id, user, bio, experience, date}
                     }) => {

    console.log("profile show", social, skills, _id);

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    return (
        <div>
            <div className="row">
                <div className="col-3"/>
                <div className="col-6 card shadow p-3 mb-5 bg-light rounded">
                    <h4><CgProfile/> {user.name}
                    <ReactStars
                        count={5}
                        isHalf={true}
                        edit={false}
                        size={24}
                        value={3.5}
                        activeColor="#5cb85c"
                    /></h4>
                    <br/>
                    {social ?
                    <div className="row card-body ">
                        <div className="col">
                            <h5><FaGithub/> Github</h5>
                            {social.githubusername ?
                                <a href={"https://github.com/"+social.githubusername} target="_blank">
                                {"https://github.com/"+social.githubusername}</a> : <div/>}
                        </div>
                        <div className="col">
                            <h5><FaLinkedin/> Linked In</h5>
                            {social.linkedIn ?
                                <a href={"https://github.com/"+social.linkedIn} target="_blank">
                                {"https://github.com/"+social.linkedIn}</a> : <div/>}
                        </div>

                        <div className="form-group">
                            <h5><FaTwitter/> Twitter</h5>
                            {social.twitter ?
                                <a href={"https://github.com/"+social.twitter} target="_blank">
                                {"https://github.com/"+social.twitter}</a> : <div/>}
                        </div>
                    </div>:<div/>}
                    <div className="form-group">
                        <h5><RiProfileLine/> Bio</h5>
                        {bio ?
                            <p>{bio}</p> : <div/>}
                    </div>
                    <div className="form-group">
                        <h5><GrUserExpert/> Skills</h5>
                        {skills.map((skill) => (
                            <h3><span className="badge badge-info">{skill}</span></h3>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col">
                            <button type="button" className="btn btn-primary"
                                onClick={() => toggleSocialInputs(!displaySocialInputs)}><span><AiFillInfoCircle/></span> Learn More
                            </button>
                        </div>
                        <div className="col">
                            
                        </div>
                        <div className="col"/>
                    </div>
                    <br/>
                    {displaySocialInputs && (
                        <div className="form-group">
                            <br/>
                                {experience.length > 0 ? (
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

                                        {experience.map((experience) => (
                                            <tbody>
                                            <tr>
                                                <td>{experience.company}</td>
                                                <td>{experience.title}</td>
                                                <td><Moment format="YYYY/MM/DD" date={experience.from}/></td>
                                                <td><Moment format="YYYY/MM/DD" date={experience.to}/></td>
                                                <td className="form-check" style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    <input className="form-check-input" type="checkbox" value=""
    id="defaultCheck1"
    checked={experience.current ? 'checked' : ''}/>
                                                </td>
                                            </tr>
                                            </tbody>
                                        ))}
                                        </table>
                                    </Fragment>
                                ) : (
                                    <h4>No experience credentials <RiErrorWarningLine/></h4>
                                )}

                        </div>
                    )}
                    {!auth.loading && user._id === auth.user._id && (
                        <div className="row">
                            <br/>
                            <div className="col">
                                <Link to='/addExperience'>
                                    <button className="btn btn-primary"><span><MdWork/></span> Add Experience</button>
                                </Link>
                            </div>
                            <div className="col">
                                <Link to='/update'>
                                    <button className="btn btn-primary"><span><GrUpdate/></span> Update</button>
                                </Link>
                            </div>
                        </div>
                    )}
                    <br/>

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

export default connect(mapStateToProps, {})(ShowProfile)
