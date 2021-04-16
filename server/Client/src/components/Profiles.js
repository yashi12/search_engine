import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { getProfiles } from '../action/profile'

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {

    useEffect (() => {
        getProfiles()
    }, [])

    return (
        <div>
        { loading ? <Spinner /> : <div></div>}
            
        </div>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
