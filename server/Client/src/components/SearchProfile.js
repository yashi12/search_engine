import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowProfile from './ShowProfile';
import { getProfilesBySkill } from '../action/profile';

const SearchProfile = ({ getProfilesBySkill, profile: { searchProfiles } }) => {
    useEffect(() => {
        getProfilesBySkill();
        console.log("call get post");
    }, [getProfilesBySkill]);


    const onSubmit = e => {
        e.preventDefault()
        getProfilesBySkill(topic.skill);
    };

    const [topic, setTopic] = useState({skill:''})

    const onChange = e => setTopic({ ...topic,[e.target.id]: e.target.value })


    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
            <div className="col">
            <br/>
            <form className="bar" method="get" >
                <div>
                    <h5>Enter Topic</h5>
                    <input onChange={e => onChange(e)} type="text" className="form-control" id="skill" placeholder="Search Post" name="query"/>
                    <br/>
                    <button onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                </div>
            </form>
            </div>
            <div className="col"/>
            <div className="col"/>
        </div>
            <div >
                {searchProfiles.map((profile) => (
                    <ShowProfile key={profile._id} profile={profile} />
                ))}
            </div>
        </Fragment>
    );
};

SearchProfile.propTypes = {
    getProfilesBySkill: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfilesBySkill })(SearchProfile);