import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { Link } from 'react-router-dom'
import { getQuestionDiscussion, deleteQuestion } from '../action/question'
import { addAnswer, deleteAnswer, likeAnswer, updateAnswer, addComment } from '../action/answers'
import { AiFillLike,AiFillDelete,AiFillEdit } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import Comments from './Comments'

const QuestionDiscussion = ({ getQuestionDiscussion, question: {question} , match, auth, deleteQuestion,addAnswer, deleteAnswer, likeAnswer,addComment, updateAnswer}) => {


    useEffect(()=>{
        getQuestionDiscussion(match.params.id)
    }, [getQuestionDiscussion, updateAnswer, deleteQuestion, addAnswer,likeAnswer])

    const [commentToggle, setCommentToggle] = useState(false)

    const [answerToggle, setAnswerToggle] = useState(false)

    const [updateToggle, setUpdateToggle] = useState(false)

    const [answerId, setAnswerId] = useState(null)

    const [commentId, setCommentId] = useState(null)

    const [updateData, setUpdateData] = useState("")

    const [commentData, setCommentData] = useState("")

    const [answerData, setAnswerData] = useState("")

    const onChange = e => {
        e.preventDefault()
        if (e.target.id === "comment"){
            setCommentData(e.target.value)
        }
        else if (e.target.id === "update"){
            setUpdateData(e.target.value)
        }
        else if (e.target.id === "answer"){
            setAnswerData(e.target.value)
        }
    }

    const history = useHistory()

    const Submit = e => {
        console.log("comment : ",commentData)
        addAnswer(match.params.id,commentData)
    }

    const UpdateAnswer = e => {
        console.log("new answer : ",updateData)
        updateAnswer(answerId,updateData)
        //window.location.reload(false)
    }

    const DeleteAnswer = (id) => {
        deleteAnswer(id)
        window.location.reload(false)
        
    }

    const Update = (e,description,id) => {
        e.preventDefault()
        setUpdateData(description)
        setAnswerId(id)
        setUpdateToggle(!updateToggle)
    }

    const Delete = (e,id) => {
        e.preventDefault()
        deleteQuestion(id)
        history.push(`/questionsFeed`)
    }

    const Comment = (e) => {
        e.preventDefault()
        addComment(commentId,answerData)
    }

    const AddComment = (e,id) => {
        e.preventDefault()
        setCommentId(id)
        setAnswerToggle(!answerToggle)
    }

    const Like = (e,id) => {
        likeAnswer(id)
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
                                        <div className="col-1">
                                            <button className="btn btn-primary" onClick={()=>setCommentToggle(!commentToggle)}><BiCommentAdd/></button>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </div>
                            {
                                commentToggle ? 
                                <div className="row g-2">
                                    <div className="col">
                                        <form>
                                            <div className="form-group">
                                                <label>Enter Answer (min 50 characters)</label>
                                                <textarea className="form-control" id="comment" rows="3" value={commentData} onChange={e=>onChange(e)}></textarea>
                                            </div>
                                            <button className="btn btn-primary" onClick={e=>Submit(e)}>Add</button>
                                        </form>
                                        <br />
                                    </div>
                                </div> : <div></div>
                            }
                            {
                                updateToggle ? 
                                <div className="row g-2">
                                    <div className="col">
                                        <form>
                                            <div className="form-group">
                                                <label>Update Answer</label>
                                                <textarea className="form-control" id="update" rows="3" value={updateData} onChange={e=>onChange(e)}></textarea>
                                            </div>
                                            <button className="btn btn-info" onClick={e=>UpdateAnswer(e)}><AiFillEdit/></button>
                                        </form>
                                        <br />
                                    </div>
                                </div> : <div></div>
                            }
                            {
                                answerToggle ? 
                                <div className="row g-2">
                                    <div className="col">
                                        <form>
                                            <div className="form-group">
                                                <label>Add Comment</label>
                                                <textarea className="form-control" id="answer" rows="3" value={answerData} onChange={e=>onChange(e)}></textarea>
                                            </div>
                                            <button className="btn btn-info" onClick={e=>Comment(e)}><AiFillEdit/></button>
                                        </form>
                                        <br />
                                    </div>
                                </div> : <div></div>
                            }
                            <div className="row g-3">
                                <div className="col">
                                    {
                                        question.answers.length > 0 ?
                                            <div>
                                                <h3>Answers</h3>
                                                {
                                                question.answers.map((element) => (
                                                    <div>
                                                        <div className="row">
                                                    
                                                            <div className="col-1">{element.user.name}<Link className="btn btn-primary" to={`/profile/${element.user._id}`}><CgProfile/></Link></div>
                                                            <div className="col-7">{element.description}</div>
                                                            <div className="col-1"><button className="btn btn-primary" onClick={e=>Like(e,element._id)}>
                                                                <AiFillLike/>: <span className="badge badge-light">{element.likeCount}</span>
                                                            </button></div>
                                                            <div className="col-1"><button className="btn btn-primary" onClick={e=>AddComment(e,element._id)}>
                                                                <BiCommentAdd/>
                                                            </button></div>
                                                            <div className="col-1">
                                                                {!auth.loading && element.user._id === auth.user._id && (
                                                                    <button onClick={e => Update(e,element.description,element._id)} type="button"
                                                                            className="btn btn-info"><AiFillEdit/>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="col-1">
                                                                {!auth.loading && element.user._id === auth.user._id && (
                                                                    <button onClick={() => DeleteAnswer(element._id)} type="button"
                                                                            className="btn btn-danger"><AiFillDelete/>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Comments id={element._id}/>
                                                        <hr />
                                                    </div>
                                                    
                                                ))
                                                }
                                            </div>:
                                            <h2>No Answers</h2>
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
    deleteQuestion: PropTypes.func.isRequired,
    addAnswer: PropTypes.func.isRequired,
    deleteAnswer: PropTypes.func.isRequired,
    likeAnswer: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    updateAnswer: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    question: state.question,
    comments: state.comments,
    auth: state.auth
})

export default connect(mapStateToProps, {getQuestionDiscussion, deleteQuestion, addAnswer, deleteAnswer, likeAnswer,addComment, updateAnswer})(QuestionDiscussion)
