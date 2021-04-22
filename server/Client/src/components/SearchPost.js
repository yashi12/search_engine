import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Posts from './Posts';
import { searchPosts } from '../action/post';

const SearchPost = ({ searchPosts, post: { posts } }) => {
    console.log("serach")
    const onSubmit = e => {
        console.log("call submit",topic)
        e.preventDefault()
        searchPosts(topic);
        console.log("call get post");
    };

    const [topic, setTopic] = useState({title:''})

    const onChange = e => setTopic({ ...topic,[e.target.id]: e.target.value })

    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
            <div className="col">
            <br/>
            <form className="bar" method="get" >
                <div>
                    <h5>Enter Topic</h5>
                    <input onChange={e => onChange(e)} type="text" className="form-control" id="title" placeholder="Search Post" name="title"></input>
                    <br/>
                    <button onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
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