import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { getQuestionDiscussion } from '../action/question'
import question from '../reducers/question'

const QuestionDiscussion = ({ getQuestionDiscussion, question: {question, loading} , match}) => {

    // useEffect(()=>{
    //     getQuestionDiscussion(match.params.id)
    // }, [getQuestionDiscussion])

    return (
        <h1>
            post : {match.params.id}
        </h1>
    )
}


QuestionDiscussion.propTypes = {
    getQuestionDiscussion: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    question: state.question
})

export default connect(mapStateToProps, {getQuestionDiscussion})(QuestionDiscussion)
