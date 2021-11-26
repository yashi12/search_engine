import React from 'react'
import { Fragment, useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { Link } from 'react-router-dom'
import {  deleteQuestion, getQuestionDiscussion } from '../action/question'
import { addAnswer, getAnswer } from '../action/answers'
import { AiFillLike,AiFillDelete,AiFillEdit } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import AnswerItem from './AnswerItem'

const QuestionAnswerItem = ({  question ,answers:{answers, loading}, GlobalId, auth, deleteQuestion,addAnswer, getAnswer}) => {

    // useEffect(()=>{
    //     getAnswer(GlobalId)
    // }, [getAnswer])

    //const [commentToggle, setCommentToggle] = useState(false)

    //const [commentData, setCommentData] = useState("")

    const history = useHistory()

    const Delete = (e,id) => {
        e.preventDefault()
        deleteQuestion(id)
        history.push(`/questionsFeed`)
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
                        <div className="col-1"></div>
                        <div className="card mb-3 col-10">
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
                                            <h4>{question.result.user.name} <Link className="btn btn-primary" to={`/profile/${question.result.user._id}`}><CgProfile/></Link></h4>
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
                                        <div className="col-8"/>
                                        <div className="col-1">
                                            {!auth.loading && question.result.user._id === auth.user._id && (
                                                    <button onClick={e => Delete(e,question.result._id)} type="button"
                                                            className="btn btn-danger"><AiFillDelete/>
                                                    </button>
                                                    
                                            )}
                                        </div>
                                        <div className="col-1">
                                            {!auth.loading && question.result.user._id === auth.user._id && (
                                                <Link to={`/update/${question.result._id}`} className="btn btn-info">
                                                    <span ><AiFillEdit/></span>
                                                </Link>
                                            )}
                                        </div>
                                        
                                    </div>
                                    <br />
                                </div>
                            </div>
                            
                            {
                                loading || answers === null ? <div/> : <AnswerItem GlobalId={GlobalId}/>
                            }
                        </div>
                    </div>
                </div>
                : <Spinner />
            }
        </div>
    )
}

QuestionAnswerItem.propTypes = {
    auth: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    addAnswer: PropTypes.func.isRequired,
    getAnswer: PropTypes.func.isRequired,
    answers: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    answers: state.answers
})

export default connect(mapStateToProps, { deleteQuestion, addAnswer, getAnswer})(QuestionAnswerItem)

