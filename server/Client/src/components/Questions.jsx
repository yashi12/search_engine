import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import question from '../reducers/question';
import { deleteQuestion } from '../action/question';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg'

const Questions = ({ auth, question, deleteQuestion}, showActions) => {

    // got the data of question from the QuestionFeed component
    return (
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
                            {question.media ?
                                <img width="200" height="200"
                                     src={question.media}
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
                                    {/* <h4>{question.user.name} <Link className="btn btn-primary" to={`/profile/${question.user._id}`}><CgProfile/></Link></h4> */}
                                    <h4 className="card-title">Q. <div dangerouslySetInnerHTML={{__html: question.title}}></div></h4>
                                    <h6><div dangerouslySetInnerHTML={{__html: question.description}}></div></h6>
                                    <br />
                                    {/* <p>
                                        Tags :{' '}
                                        {question.tags.map((tag) => (
                                            <span className="badge badge-secondary">{tag}</span>
                                        ))}
                                    </p>
                                    <p>
                                        Category :{' '}<span className="badge badge-secondary">{question.category}</span>
                                    </p> */}
                                </div>
                            </div>
                            <div className="row g-1">
                                <div className="col-9"/>
                                <div className="col-3">
                                    {/* Link to the page with question and all it's details */}
                                    <Link to={`/question/${question._id}`} className="btn btn-primary">
                                        Answers <span className="badge badge-light">{question.answers ? <p>{question.answers.length}</p> : <p></p> }</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Questions.defaultProps = {
    showActions: true
};

Questions.propTypes = {
    question: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    showActions: PropTypes.bool
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {deleteQuestion})(Questions)