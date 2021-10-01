import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import post from "../reducers/post";
import question from '../reducers/question';

const Questions = ({ auth, question}) => {

    console.log(question)

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
                            {post.image ?
                                <img width="200" height="200"
                                     src={post.image}
                                    // src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                     alt="..."></img>
                                : <img width="200" height="200"
                                       // src={post.image}
                                    src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                       alt="..."></img>
                            }
                        </div>
                        <div className="col-md-8">
                            <div className="row g-0">
                                <div className="card-body">
                                    <h5 className="card-title">Q. {question.title}</h5>
                                    {/* <p className="card-text">{post.text}</p> */}
                                    <div dangerouslySetInnerHTML={{__html: question.description}}></div>
                                    <div>
                                        {question.tags.map((tag) => (
                                            <span className="badge badge-secondary">{tag}</span>
                                        ))}
                                    </div>
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
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(Questions)