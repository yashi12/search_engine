import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Posts from './Posts';
import { getPosts } from '../action/post';

const Feeds = ({ getPosts, post: { posts } }) => {
    useEffect(() => {
        getPosts();
        console.log("call get post");
    }, []);

    return (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <div >
                {posts.map((post) => (
                    <Posts key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPosts })(Feeds);