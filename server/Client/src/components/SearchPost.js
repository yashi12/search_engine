import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Posts from './Posts';
import { searchPosts } from '../action/post';

const SearchPost = ({ searchPosts, post: { posts } }) => {
    const onSubmit = () => {
        searchPosts();
        console.log("call get post");
    };

    const [topic, setTopic] = useState('')

    const onClick = e => { setTopic(e.target.value) }

    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
            <div className="col">
            <br/>
            <form className="bar" method="get" action="/result">
                <div>
                    <h5>Enter Topic</h5>
                    <input onClick={e => onClick(e)} type="text" className="form-control" id="query" placeholder="Search Post" name="query"></input>
                    <br/>
                    <button onSubmit={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                </div>
            </form>
            </div>
            <div className="col"></div>
            <div className="col"></div>
        </div>
            <div >
                {posts.map((post) => (
                    <Posts key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    searchPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { searchPosts })(SearchPost);