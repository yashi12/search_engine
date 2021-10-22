import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { searchQuestions } from '../action/question';

const SearchQuestionByCategory = ({ searchQuestions, question: { searchQuestionArr }}) => {
    useEffect(() => {
        searchQuestions();
        console.log("call get question");
    }, [searchQuestions]);

    const onSubmit = e => {
        console.log("call submit",category)
        e.preventDefault()
        searchQuestions(category.title);
        console.log("call get question");
    };

    const [category, setTopic] = useState({title:''})

    const onChange = e => setTopic({ ...category,[e.target.id]: e.target.value })

    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
            <div className="col">
            <br/>
            <form className="bar" method="get" >
                <div>
                    <h1 className="large text-primary">Enter Category</h1>
                    <input onChange={e => onChange(e)} type="text" className="form-control" id="title" placeholder="Search Question" name="title"/>
                    <br/>
                    <button onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                </div>
            </form>
            </div>
            <div className="col"/>
            <div className="col"/>
        </div>
            <div >
                {searchQuestionArr.map((question) => (
                    <Questions key={question._id} question={question} />
                ))}
            </div>
        </Fragment>
    );
};

SearchQuestionByCategory.propTypes = {
    searchQuestions: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    question: state.question
});

export default connect(mapStateToProps, { searchQuestions })(SearchQuestionByCategory);