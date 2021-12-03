import React from 'react'
import { useHistory } from 'react-router'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Questions from './Questions'
import { askQuestion } from '../action/question'

const QuestionSimilarityContinue = ({similarQuestions, questionData,image, askQuestion}) => {

    const history = useHistory()

    const Submit = (e) => {
        e.preventDefault()
        console.log(questionData)
        const data = new FormData();
        data.append("title",questionData.title)
        data.append("description",questionData.description)
        data.append("tags",questionData.tags)
        data.append("category",questionData.category)
        data.append("media",image);
        askQuestion(questionData)
        //history.push(`/questionsFeed`)
    }

    return (
        <div>
            <div className="container-fluid align-items-center">
                <br /><br />
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                    <h1 className="large text-primary">Looks like we've got some questions similar to 
                    what you want to ask</h1>
                    </div>
                    <div className="col-1"></div>
                </div>
                
                <br />
                {similarQuestions === null ? <div></div> : 
                    similarQuestions.map((question) => (
                    <Questions key={question._id} question={question} />
                ))}
                <br />
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <h1 className="large text-primary">Not what you are looking for ?</h1>
                        <br />
                        <button onClick={(e)=>{Submit(e)}} className="btn btn-primary">Continue &amp; ask question</button>
                    </div>
                    <div className="col-2"></div>
                </div>
                <br /><br />
            </div>
        </div>
    )
}

QuestionSimilarityContinue.propTypes = {
    askQuestion: PropTypes.func.isRequired
}

export default connect(null,{askQuestion})(QuestionSimilarityContinue)
