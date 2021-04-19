import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../action/post'
import Spinner from './Spinner'

const Posts = ({ getPosts, post: {posts, loading} }) => {

    useEffect(() => {
        getPosts()
    }, [getPosts])

    return ( loading ? <Spinner /> :
    <div>
        <div className="row">
            <br/>
        </div>
        <div className="row">
            <div className="col-2"></div>
            <div className="card mb-3 col-8">
                <div className="row g-0">
                    <div className="col-md-4 mb-3">
                        <img width="200" height="200" src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg" alt="..."></img>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-0">
                            <div className="card-body">
                                <h5 className="card-title">Name</h5>
                                <p className="card-text">This is a wider card with supporting text below as a natural 
                                lead-in to additional content. This content is a little bit longer.</p>  
                            </div>
                        </div>
                        <div className="row g-1">
                        <div className="col-9"></div>
                        <div className="col-3">
                            <div className="card-body">
                                <button type="button" className="btn btn-primary">
                                Like <span className="badge bg-secondary">9</span>
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
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts)