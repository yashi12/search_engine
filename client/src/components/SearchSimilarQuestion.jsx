import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { searchSimilarQuestion } from '../action/question';
import Spinner from './Spinner';

const SearchSimilarQuestion = ({ searchSimilarQuestion, question: { similarQuestionArr, loading }}) => {
    // useEffect(() => {
    //     searchSimilarQuestion();
    //     console.log("call get post");
    // }, [searchSimilarQuestion]);

    const [ spinnerToggle, setSpinnerToggle ] = useState(false)

    const onSubmit = e => {
        console.log("call submit",topic)
        e.preventDefault()
        searchSimilarQuestion(topic);
        console.log("call get post");
        setSpinnerToggle(true)
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
                        <h1 className="large text-primary">Enter Question</h1>
                        <input onChange={e => onChange(e)} type="text" className="form-control" id="title" placeholder="Search" name="title"/>
                        <br/>
                        <button onClick={e => onSubmit(e)} disabled={topic.title.length === 0 ? 'disabled':''} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                    </div>
                </form>
                </div>
                <div className="col"/>
                <div className="col"/>
            </div>
            <div >
                {spinnerToggle && (loading || similarQuestionArr === []) ? <Spinner/> : 
                    similarQuestionArr.map((question) => (
                    <Questions key={question._id} question={question} search={true} />
                ))}
            </div>
        </Fragment>
    )
}

SearchSimilarQuestion.propTypes = {
    searchSimilarQuestion: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    question: state.question
});

export default connect(mapStateToProps,{searchSimilarQuestion})(SearchSimilarQuestion)
