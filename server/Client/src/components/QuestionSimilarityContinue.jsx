import React from 'react'
import { useHistory } from 'react-router'
import Questions from './Questions'
import { askQuestion } from '../action/question'

const QuestionSimilarityContinue = ({similarQuestions, questionData}) => {

    const history = useHistory()

    const Submit = (e) => {
        e.preventDefault()
        askQuestion(questionData)
        history.push(`/questionsFeed`)
    }

    return (
        <div>
            <div className="container-fluid align-items-center">
                <h1 className="large text-primary">Looks like we've got some questions similar to 
                what you want to ask</h1>
                <br />
                {similarQuestions === null ? <div></div> : 
                    similarQuestions.map((question) => (
                    <Questions key={question._id} question={question} />
                ))}
                <br />
                <h1 className="large text-primary">Not what you are looking for ?</h1>
                <button onClick={(e)=>{Submit(e)}} className="btn btn-primary">Continue to ask question</button>
            </div>
        </div>
    )
}

export default QuestionSimilarityContinue
