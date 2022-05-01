import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { getDoubtInfo } from '../action/doubt'
import DoubtItem from './DoubtItem'

const DoubtContract = ({ getDoubtInfo,match, doubt: {doubt, loading} }) => {

    // Component where all the data of the question will be displayed
    // match.params takes info from the url
    // here we took the id of the question from the url
    useEffect( async ()=>{
        getDoubtInfo(match.params.id) 
    }, [getDoubtInfo])

    return (
        <div>
            {/* Passing the data of the question to Question Answer component */}
            {
                loading || doubt === null ? 
                <Spinner />
                : <DoubtItem GlobalId={match.params.id} doubt={doubt} />
            }
        </div>
    )
}

DoubtContract.propTypes = {
    getDoubtInfo: PropTypes.func.isRequired,
    doubt: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    doubt: state.doubt
})

export default connect(mapStateToProps, {getDoubtInfo})(DoubtContract)
