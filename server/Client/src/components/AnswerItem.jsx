import React from 'react'
import PropTypes from 'prop-types'
import { addAnswer, deleteAnswer, likeAnswer, updateAnswer, addComment } from '../action/answers'
import { AiFillLike,AiFillDelete,AiFillEdit } from 'react-icons/ai'
import { BiCommentAdd } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { connect } from 'react-redux'
import Comments from './Comments'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const AnswerItem = ({ answers:{answers},auth,GlobalId, deleteAnswer, likeAnswer,addComment, updateAnswer, addAnswer}) => {

    //const [loading,setLoading] = useState(false)

    // useEffect(()=>{
    //     getQuestionDiscussion(GlobalId)
    // },[getQuestionDiscussion])

    //console.log("answer data: ",answers)

    const [answerToggle, setAnswerToggle] = useState(false)

    const [updateToggle, setUpdateToggle] = useState(false)

    const [answerId, setAnswerId] = useState(null)

    const [commentId, setCommentId] = useState(null)

    const [updateData, setUpdateData] = useState("")

    const [answerData, setAnswerData] = useState("")

    const [commentToggle, setCommentToggle] = useState(false)

    const [commentData, setCommentData] = useState("")

    const Submit = e => {
        const userData = {email: auth.user.email,name:auth.user.name,_id:auth.user._id}
        e.preventDefault()
        console.log("comment : ",commentData)
        addAnswer(GlobalId,commentData,userData)
        setCommentToggle(!commentToggle)
        //setLoading(!loading)
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
        e.preventDefault()
        console.log("new answer : ",updateData)
        updateAnswer(answerId,updateData)
        setUpdateToggle(!updateToggle)
        //window.location.reload(false)
    }

    const DeleteAnswer = (id) => {
        deleteAnswer(id)
        //window.location.reload(false)
    }

    const Update = (e,description,id) => {
        e.preventDefault()
        setUpdateData(description)
        setAnswerId(id)
        setUpdateToggle(!updateToggle)
    }

    const Comment = (e) => {
        //e.preventDefault()
        addComment(commentId,answerData)
        setAnswerToggle(!answerToggle)
    }

    const AddComment = (e,id) => {
        e.preventDefault()
        setCommentId(id)
        setAnswerToggle(!answerToggle)
    }

    return (
        <div>
            <div >
                <button className="btn btn-primary" onClick={()=>setCommentToggle(!commentToggle)}>Add Comment <BiCommentAdd/></button>
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
                        answers.length > 0 ?
                            <div>
                                <h3>Answers</h3>
                                {
                                answers.map((element) => (
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
                                        {
                                            element.comments ? <Comments id={element._id}/> : <p>No Comments</p>
                                        }
                                        
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
    updateAnswer: PropTypes.func.isRequired,
    answers: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    answers: state.answers
})

export default connect(mapStateToProps, {addAnswer,  deleteAnswer, likeAnswer,addComment, updateAnswer})(AnswerItem)
