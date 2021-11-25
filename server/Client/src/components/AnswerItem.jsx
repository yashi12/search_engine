import React from 'react'
import PropTypes from 'prop-types'
import { addAnswer, deleteAnswer, likeAnswer, updateAnswer, addComment } from '../action/answers'
import { AiFillLike,AiFillDelete,AiFillEdit } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { connect } from 'react-redux'
import Comments from './Comments'
import { Link } from 'react-router-dom'
import { Fragment, useEffect, useState, useRef } from 'react'

const AnswerItem = ({ answer,auth,GlobalId, deleteAnswer, likeAnswer,addComment, updateAnswer}) => {

    //const [loading,setLoading] = useState(false)

    const [answerToggle, setAnswerToggle] = useState(false)

    const [updateToggle, setUpdateToggle] = useState(false)

    const [answerId, setAnswerId] = useState(null)

    const [commentId, setCommentId] = useState(null)

    const [updateData, setUpdateData] = useState("")

    const [answerData, setAnswerData] = useState("")

    const [commentToggle, setCommentToggle] = useState(false)

    const [commentData, setCommentData] = useState("")

    const Submit = e => {
        e.preventDefault()
        console.log("comment : ",commentData)
        addAnswer(GlobalId,commentData)
    }

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

    const Comment = (e) => {
        e.preventDefault()
        addComment(commentId,answerData)
    }

    const AddComment = (e,id) => {
        e.preventDefault()
        setCommentId(id)
        setAnswerToggle(!answerToggle)
    }

    return (
        <div>
            <div >
                <button className="btn btn-primary" onClick={()=>setCommentToggle(!commentToggle)}><BiCommentAdd/></button>
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
                        answer.length > 0 ?
                            <div>
                                <h3>Answers</h3>
                                {
                                answer.map((element) => (
                                    <div>
                                        <div className="row">
                                    
                                            <div className="col-1">{element.user.name}<Link className="btn btn-primary" to={`/profile/${element.user._id}`}><CgProfile/></Link></div>
                                            <div className="col-7">{element.description}</div>
                                            <div className="col-1"><button className="btn btn-primary" type="button" onClick={e=>likeAnswer(element._id)}>
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
    )
}

AnswerItem.propTypes = {
    deleteQuestion: PropTypes.func.isRequired,
    addAnswer: PropTypes.func.isRequired,
    deleteAnswer: PropTypes.func.isRequired,
    likeAnswer: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    updateAnswer: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {  deleteAnswer, likeAnswer,addComment, updateAnswer})(AnswerItem)
