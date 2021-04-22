import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addLike, deletePost} from '../action/post'

const Posts = ({addLike, deletePost, auth, post: {_id, text, user, userName, likeCount, title}}, showActions) => {
    return (
        <div>
            <div className="row">
                <br/>
            </div>
            <div class="row">
                <div class="col-2"></div>
                <div class="card mb-3 col-8">
                    <div class="row g-0">
                        <div class="col-md-4 mb-3">
                            <img width="200" height="200"
                                 src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
                                 alt="..."></img>
                        </div>
                        <div class="col-md-8">
                            <div class="row g-0">
                                <div class="card-body">
                                    <h5 class="card-title">{userName}</h5>
                                    <p class="card-text">{text}</p>
                                    <div>
                                        {title.map((tag) => (
                                            <span className="badge badge-secondary">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showActions && (
                                <div class="row g-1">
                                    <div class="col-9"></div>
                                    <div class="col-3">
                                        <div class="card-body">
                                            <button onClick={() => addLike(_id)} type="button" class="btn btn-primary">
                                                Like <span class="badge bg-secondary">{likeCount}</span>
                                            </button>
                                        </div>
                                        {!auth.loading && user === auth.user._id && (
                                            <div class="card-body">
                                                <button onClick={() => deletePost(_id)} type="button"
                                                        class="btn btn-primary">
                                                    Delete Post <span class="badge bg-danger"></span>
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