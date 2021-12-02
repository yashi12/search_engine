import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Posts from './Posts';
import { getPosts } from '../action/post';

// Importing posts array from post (a component in state)
const Feeds = ({ getPosts, post: { posts } }) => {
    useEffect(() => {
        getPosts();
        console.log("call get post");
    }, [getPosts]);

    return (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            {/* mapping through the posts array and passing the data to Posts component to display them */}
            <div >
                {posts.map((post) => (
                    <Posts key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.prototype = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    post: state.post
});

export default connect(mapStateToProps, { getPosts })(Feeds);