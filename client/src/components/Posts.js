import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addLike, deletePost} from '../action/post'
import post from "../reducers/post";

const Posts = ({addLike, deletePost, auth, post}, showActions) => {
    return (
        <div>
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col-2"/>
                <div className="card mb-3 col-8">
                    <div className="row g-0">
                        <div className="col-md-4 mb-3">
                            {post.image ?
                                <img width="300" height="300"
    src={post.image}
    // src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
    alt="..."/>
                                : <img width="300" height="300"
    // src={post.image}
    src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg"
    alt="..."/>
                            }
                        </div>
                        <div className="col-md-8">
                            <div className="row g-0">
                                <div className="card-body">
                                    <h5 className="card-title">{post.userName}</h5>
                                    {/* <p className="card-text">{post.text}</p> */}
                                    <div dangerouslySetInnerHTML={{__html: post.text}}></div>
                                    <div>
                                        {post.title.map((tag) => (
                                            <span className="badge badge-secondary">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showActions && (
                                <div className="row g-1">
                                    <div className="col-9"/>
                                    <div className="col-3">
                                        <div className="card-body">
                                            <button onClick={e => addLike(post._id)} type="button" className="btn btn-primary">
                                            {/*<button onClick={e => addLikeNew(post._id)} type="button" className="btn btn-primary">*/}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-hand-thumbs-up-fill"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                                </svg>
                                                Like <span className="badge bg-secondary">{post.likeCount }</span>
                                            </button>
                                        </div>
                                        {!auth.loading && post.user === auth.user._id && (
                                            <div className="card-body">
                                                <button onClick={() => deletePost(post._id)} type="button"
                                                        className="btn btn-danger">Delete
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