import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowProfiles from './ShowProfile';
import { getProfiles } from '../action/profile';
import ShowProfile from "./ShowProfile";

const Profiles = ({ getProfiles, profile: { profiles } }) => {
    useEffect(() => {
        getProfiles();
        console.log("call get post");
    }, [getProfiles]);

    return (
        <Fragment>
            <h1 className="large text-primary">Profiles</h1>
            <div >
                {profiles.map((profile) => (
                    <ShowProfile key={profile._id} profile={profile} />
                ))}
            </div>
        </Fragment>
    );
};

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
