import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Result from './Result';
import { searchQuery } from '../action/profile';


const SearchNew = ({ searchQuery, profile: { query, loading } }) => {



    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    useEffect(() => {
        searchQuery();
        console.log("quey payload",query);
    }, [searchQuery]);


    const onSubmit = e => {
        e.preventDefault()
        searchQuery(topic.skill);
        toggleSocialInputs(true)

    };

    const [topic, setTopic] = useState({skill:''})

    const onChange = e => setTopic({ ...topic,[e.target.id]: e.target.value })


    return (
        <Fragment>
            <div className="container-fluid row align-items-center">

                <div className="col">
                    <br/>
                    <form className="bar" method="get" >
                        <div>
                            <h5>Enter Topic</h5>
                            <input onChange={e => onChange(e)} type="text" className="form-control" id="skill" placeholder="Search Post" name="query"></input>
                            <br/>
                            <button disabled={topic.skill==""?true:false} onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                        </div>
                    </form>
                </div>
                <div className="col"></div>
                <div className="col"></div>
            </div>
            <div >
                { (displaySocialInputs && !loading) ?
                   <Result query={query}/>
                    : <div></div>

                }
            </div>
        </Fragment>
    );
};

SearchNew.propTypes = {
    searchQuery: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    loading: state.loading
});

export default connect(mapStateToProps, { searchQuery })(SearchNew);