import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addLike, removeLike } from '../action/post'

const Posts = ({ addLike, removeLike,auth , post: {_id, text, name, user, like} }) => {

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
                        <img width="200" height="200" src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg" alt="..."></img>
                    </div>
                    <div class="col-md-8">
                        <div class="row g-0">
                            <div class="card-body">
                                <h5 class="card-title">Name</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural 
                                lead-in to additional content. This content is a little bit longer.</p>  
                            </div>
                        </div>
                        <div class="row g-1">
                        <div class="col-9"></div>
                        <div class="col-3">
                            <div class="card-body">
                                <button onClick={e => addLike(_id)} type="button" class="btn btn-primary">
                                Like <span class="badge bg-secondary">9</span>
                                </button>
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

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {addLike, removeLike})(Posts)