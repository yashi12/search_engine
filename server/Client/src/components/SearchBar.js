import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Result from './Result';
import { searchQuery } from '../action/search';

const SearchBar = ({ searchQuery, result: { results }}) => {
    useEffect(() => {
        searchQuery();
        console.log("call get post");
    }, [searchQuery]);

    const onSubmit = e => {
        console.log("call submit",topic)
        e.preventDefault()
        searchQuery(topic);
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
                    <h5>Enter Query</h5>
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
                {results.map((post) => (
                    <Result post={post} />
                ))}
            </div>
        </Fragment>
    );
};

SearchBar.propTypes = {
    searchQuery: PropTypes.func.isRequired,
    result: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    result: state.result
});

export default connect(mapStateToProps, { searchQuery })(SearchBar);