import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { getQuestionDiscussion, deleteQuestion } from '../action/question'

const QuestionDiscussion = ({ getQuestionDiscussion, question: {question, loading} , match, auth, deleteQuestion}) => {

    useEffect(()=>{
        getQuestionDiscussion(match.params.id)
    }, [getQuestionDiscussion])

    const [commentToggle, setCommentToggle] = useState(false)

    const [commentData, setCommentData] = useState("")

    const onChange = e => setCommentData(e.target.value)

    const Submit = () => {
        console.log(commentData)
    }

    return (
        <div>
            {
                question ? 
                <div>
                    <div className="row">
                        <br/>
                    </div>
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="card mb-3 col-8">
                            <div className="row g-0">
                                <div className="col-md-4 mb-3">
                                    <br />
                                    {question.result.media ?
                                        <img width="200" height="200"
                                            src={question.result.media}
                                            // src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                            alt="..."></img>
                                        : <img width="200" height="200"
                                            src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                            alt="..."></img>
                                    }
                                </div>
                                <div className="col-md-8">
                                    <div className="row g-0">
                                        <div className="card-body">
                                            <h4 className="card-title">Q. <div dangerouslySetInnerHTML={{__html: question.result.title}}></div></h4>
                                            <h6><div dangerouslySetInnerHTML={{__html: question.result.description}}></div></h6>
                                            <br />
                                            <p>
                                                Tags :{' '}
                                                {question.result.tags.map((tag) => (
                                                    <span className="badge badge-secondary">{tag}</span>
                                                ))}
                                            </p>
                                            <p>
                                                Category :{' '}<span className="badge badge-secondary">{question.result.category}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row g-1">
                                        <div className="col-5"/>
                                        <div className="col-3">
                                            {!auth.loading && question.result.user === auth.user._id && (
                                                    <button onClick={() => deleteQuestion(question.result._id)} type="button"
                                                            className="btn btn-danger">Delete
                                                    </button>
                                            )}
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-primary" onClick={()=>setCommentToggle(!commentToggle)}>Add Comment</button>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </div>
                            {
                                commentToggle ? 
                                <div className="row g-2">
                                    <div className="col">
                                        <form >
                                            <div class="form-group">
                                                <label>Enter Solution</label>
                                                <textarea className="form-control" id="comment" rows="3" value={commentData} onChange={e=>onChange(e)}></textarea>
                                            </div>
                                            <button className="btn btn-primary" onClick={()=>Submit()}>Comment</button>
                                        </form>
                                        <br />
                                    </div>
                                </div> : <div></div>
                            }
                            <div className="row g-3">
                                <div className="col-1"></div>
                                <div className="col-11">
                                    {
                                        question.answers.length > 0 ? 
                                        <Fragment>
                                            {question.answers.array.forEach(element => {
                                                <div>
                                                    <p>{element}</p><br />
                                                </div>
                                                
                                            })}
                                        </Fragment> :
                                        <Fragment>No answers</Fragment>
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                : <Spinner />
            }
        </div>
    )
}


QuestionDiscussion.propTypes = {
    getQuestionDiscussion: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    auth: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    question: state.question,
    auth: state.auth
})

export default connect(mapStateToProps, {getQuestionDiscussion, deleteQuestion})(QuestionDiscussion)
