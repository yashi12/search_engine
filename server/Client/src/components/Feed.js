import React, {useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../action/post'
import Spinner from './Spinner'
import Posts from './Posts'

const Feed = ({ getPosts, post: {posts, loading} }) => {

    useEffect(() => {
        getPosts()
    }, [getPosts])

    return ( loading ? <Spinner /> :
    <Fragment>
        {
            posts.map(post => (
                <Posts key={post._id} post={post} />
            ))
        }
    </Fragment>
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPosts})(Feed)