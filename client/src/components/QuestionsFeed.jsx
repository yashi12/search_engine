import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { getQuestions } from '../action/question';
import Spinner from './Spinner';

const QuestionsFeed = ({ getQuestions, question : {questions}, auth}) => {
    useEffect(() => {
        getQuestions();
    }, [getQuestions]);

    return (
        <div>
            {
                questions ? <Fragment>
                <br />
                <h1 className="large text-primary">Questions Feed</h1>
                <div >
                    {/* passing data from get all question api to Questions component */}
                    {questions.filter(function(question){
                        return question.user._id !== auth.user._id ;
                    }).map((question) => (
                        <Questions key={question._id} question={question} />
                    ))}
                </div>
                </Fragment> :
                <Spinner />
            }
        </div>
        
        
    );
};

QuestionsFeed.propTypes = {
    getQuestions: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    question: state.question,
    auth: state.auth
});

export default connect(mapStateToProps, { getQuestions })(QuestionsFeed);