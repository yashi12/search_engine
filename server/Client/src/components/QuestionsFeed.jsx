import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { getQuestions } from '../action/question';
import Spinner from './Spinner';

const QuestionsFeed = ({ getQuestions, question : {questions} }) => {
    useEffect(() => {
        getQuestions();
    }, [getQuestions]);

    return (
        <div>
            {
                questions ? <Fragment>
                <h1 className="large text-primary">Questions</h1>
                <div >
                    {/* passing data from get all question api to Questions component */}
                    {questions.map((question) => (
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
    question: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    question: state.question
});

export default connect(mapStateToProps, { getQuestions })(QuestionsFeed);