import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowProfile from './ShowProfile';
import { getProfileById } from '../action/profile';

const SearchProfile = ({ searchPosts, post: { posts } }) => {
    const onSubmit = () => {
        getProfileById();
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
                    <ShowProfile key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

SearchProfile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getProfileById })(SearchProfile);