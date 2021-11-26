import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { getQuestionDiscussion } from '../action/question'
import QuestionAnswerItem from './QuestionAnswerItem'

const QuestionDiscussion = ({ getQuestionDiscussion,match, question: {question, loading} }) => {

    useEffect( async ()=>{
        getQuestionDiscussion(match.params.id) 
    }, [getQuestionDiscussion])

    return (
        <div>
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
