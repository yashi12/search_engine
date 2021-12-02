import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { getQuestionDiscussion } from '../action/question'
import QuestionAnswerItem from './QuestionAnswerItem'

const QuestionDiscussion = ({ getQuestionDiscussion,match, question: {question, loading} }) => {

    // Component where all the data of the question will be displayed
    // match.params takes info from the url
    // here we took the id of the question from the url
    useEffect( async ()=>{
        getQuestionDiscussion(match.params.id) 
    }, [getQuestionDiscussion])

    return (
        <div>
            {/* Passing the data of the question to Question Answer component */}
            {
                loading || question === null ? 
                <Spinner />
                : <QuestionAnswerItem GlobalId={match.params.id} question={question} />
            }
        </div>
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
