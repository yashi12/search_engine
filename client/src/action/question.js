import axios from 'axios'
import { setAlert } from './alert'

import {
    ASK_QUESTION,
    GET_QUESTIONS,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    SEARCH_QUESTIONS,
    QUESTION_ERROR,
    GET_QUESTION,
    GET_ANSWER,
    SIMILAR_QUESTIONS,
    CLEAR_QUESTION
} from './types'

// const API = 'http://localhost:3000'

// Get Questions
export const getQuestions = () => async dispatch => {
    try {
        axios.get(`${process.env.REACT_APP_API}/api/discussion/`)
        .then((res) => {
            console.log("res questions ui", res)

            dispatch({
                type: GET_QUESTIONS,
                payload: res.data
            })
        })
    } catch (err) {
        console.log("Error in questions")
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Get Question
export const getQuestionDiscussion = id => async dispatch => {
    console.log("get question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    axios.get(`${process.env.REACT_APP_API}/api/discussion/ques/${id}`, config).
    then(res => {
        console.log("result filter",res)
        dispatch({
            type: GET_QUESTION,
            payload: res.data
        })
        dispatch({
            type: GET_ANSWER,
            payload: res.data.answers
        })
    }).catch(err => {
        console.log("error add question dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
                status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    })   
}

// Search Questions By Category
export const searchQuestions = category => async dispatch => {
    console.log("search question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    // const tags = topic.title.split(',')
    // const body = {title:tags}
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/discussion/category/${category}`, config)
        console.log("result search question",res.data)
        dispatch({
            type: SEARCH_QUESTIONS,
            payload: res.data
        })
        if (res.data.length === 0){
            dispatch(setAlert(`No question found. Please search for another category`, 'warning'))
        }

    } catch (err) {
        console.log("error add post dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
                status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Search Questions By Similarity
export const searchSimilarQuestion = topic => async dispatch => {

    if (topic.title === ''){
        dispatch({
            type: CLEAR_QUESTION,
            payload: []
        })
    }
    else{
        console.log("search question",topic)
        const config = {
            header: {'Content-Type': 'application/json'}
        }
        // const tags = topic.title.split(',')
        // const body = {title:tags}
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/discussion/similar-question/`,topic, config)
            console.log("similarity result filter",res)
            dispatch({
                type: SIMILAR_QUESTIONS,
                payload: res.data.similarQuesArray
            })
            if (res.data.similarQuesArray !== []){
                dispatch(setAlert('Found Similar Questions','success'))
            }
            else {
                dispatch(setAlert('No question found, Please enter another question','warning'))
            }
        } catch (err) {
            console.log("error add post dispatch",err);
            dispatch({
                type: QUESTION_ERROR,
                payload: {msg: err.response,
                    status: err.response}
            })
            const error = err.response.data.errors;
            if (error){
                error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
            }
        }
    }
}

// Update Question
export const updateQuestion = (id,data,history) => async dispatch => {
    console.log("inside update question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    try {
        // console.log( "text body",body);
        const res = await axios.put(`${process.env.REACT_APP_API}/api/discussion/ques/${id}`, data, config)
        dispatch({
            type: UPDATE_QUESTION,
            payload: res.data
        })
        console.log("after dispatch")
        dispatch(setAlert('Question Updated','success'))
        history.push(`/question/${id}`)

    } catch (err) {
        console.log("error question dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Delete  Questions
export const deleteQuestion = postId => async dispatch => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API}/api/discussion/ques/${postId}`)
        dispatch({
            type: DELETE_QUESTION,
            payload: postId
        })

        dispatch(setAlert('Question removed','success'))

    } catch (err) {
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Ask Questions
export const askQuestion = (data) => async dispatch => {
    console.log("inside ask question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    try {
        // console.log( "text body",body);
        const res = await axios.post(`${process.env.REACT_APP_API}/api/discussion/ques`, data, config)
        dispatch({
            type: ASK_QUESTION,
            payload: res.data
        })
        console.log("after dispatch")
        dispatch(setAlert('Question Added','success'))

    } catch (err) {
        console.log("error question dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}