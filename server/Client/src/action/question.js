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
    GET_ANSWER
} from './types'

// Get Questions
export const getQuestions = () => async dispatch => {
    try {
        axios.get('http://localhost:3000/api/discussion/')
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
    }
}

// Get Question
export const getQuestionDiscussion = id => async dispatch => {
    console.log("get question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    axios.get(`http://localhost:3000/api/discussion/ques/${id}`, config).
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
        const res = await axios.get(`http://localhost:3000/api/discussion/category/${category}`, config)
        console.log("result filter",res)
        dispatch({
            type: SEARCH_QUESTIONS,
            payload: res.data
        })

    } catch (err) {
        console.log("error add post dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
                status: err.response}
        })
    }
}

// Search Questions By Similarity
export const searchSimilarQuestion = category => async dispatch => {
    console.log("search question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    // const tags = topic.title.split(',')
    // const body = {title:tags}
    try {
        const res = await axios.get(`http://localhost:3000/api/discussion/category/${category}`, config)
        console.log("result filter",res)
        dispatch({
            type: SEARCH_QUESTIONS,
            payload: res.data
        })

    } catch (err) {
        console.log("error add post dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
                status: err.response}
        })
    }
}

// Update Question
export const updateQuestion = (id,data) => async dispatch => {
    console.log("inside update question")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    try {
        // console.log( "text body",body);
        const res = await axios.put(`http://localhost:3000/api/discussion/ques/${id}`, data, config)
        dispatch({
            type: UPDATE_QUESTION,
            payload: res.data
        })
        console.log("after dispatch")
        dispatch(setAlert('Question Updated','success'))

    } catch (err) {
        console.log("error question dispatch",err);
        dispatch({
            type: QUESTION_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
    }
}

// Delete  Questions
export const deleteQuestion = postId => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:3000/api/discussion/ques/${postId}`)
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
        const res = await axios.post('http://localhost:3000/api/discussion/ques', data, config)
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
    }
}