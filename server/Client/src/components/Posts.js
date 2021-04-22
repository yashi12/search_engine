import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addLike, deletePost} from '../action/post'
import post from "../reducers/post";

const Posts = ({addLike, deletePost, auth, post: {_id, text, user, userName, likeCount, title}}, showActions) => {
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
                            <img width="200" height="200"
                                 src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                 alt="..."></img>
                        </div>
                        <div className="col-md-8">
                            <div className="row g-0">
                                <div className="card-body">
                                    <h5 className="card-title">{userName}</h5>
                                    <p className="card-text">{text}</p>
                                    <div>
                                        {title.map((tag) => (
                                            <span className="badge badge-secondary">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showActions && (
                                <div className="row g-1">
                                    <div className="col-9"></div>
                                    <div className="col-3">
                                        <div className="card-body">
                                            <button onClick={e => addLike(_id)} type="button" className="btn btn-primary">
                                                Like <span className="badge bg-secondary">{likeCount}</span>
                                            </button>
                                        </div>
                                        {!auth.loading && user === auth.user._id && (
                                            <div className="card-body">
                                                <button onClick={() => deletePost(_id)} type="button"
                                                        className="btn btn-primary">
                                                    Delete Post <span className="badge bg-danger"></span>
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </div>)}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Posts.defaultProps = {
    showActions: true
};

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    showActions: PropTypes.bool
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {addLike, deletePost})(Posts)