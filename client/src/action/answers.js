import axios from 'axios'
import { setAlert } from './alert'

import {
    ADD_ANSWER,
    GET_ANSWER,
    LIKE_ANSWER,
    DELETE_ANSWER,
    UPDATE_ANSWER,
    ANSWER_ERROR,
    ADD_COMMENT
} from './types'

// Get Answer By Id
export const getAnswer = id => async dispatch => {
    try {
        // Sending id through api and putting response in res
        const res = await axios.get(`http://localhost:3000/api/answer/${id}`)
        console.log("res posts ui", res);
        // dispatching get answer action and setting response as payload
        dispatch({
            type: GET_ANSWER,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Like Answer
export const likeAnswer = ansId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:3000/api/answer/like/${ansId}`)
        // in payload we are sending ansId to tell state which answer is liked
        dispatch({
            type: LIKE_ANSWER,
            payload: { ansId, likes: res.data  }
        })

    } catch (err) {
        console.log("error like", err);
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Add  Comment
export const addComment = (id,comment) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    const data = {text: comment}
    try {
        console.log( "text body",id, comment);
        const res = await axios.post(`http://localhost:3000/api/answer/comment/${id}`, data, config)
        dispatch({
            type: ADD_COMMENT,
            payload: {id : id, data: res.data}
        })
        console.log("comment added")
        dispatch(setAlert('Comment Added','success'))

    } catch (err) {
        console.log("error add answer dispatch",err);
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Delete  Answer
export const deleteAnswer = answerId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:3000/api/answer/delete/${answerId}`)
        dispatch({
            type: DELETE_ANSWER,
            payload: answerId
        })

        dispatch(setAlert('Answer removed','success'))

    } catch (err) {
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Add  Answer
export const addAnswer = (id,description,userData) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    const data = {description: description}
    try {
        console.log( "text body",id, description,userData);
        const res = await axios.post(`http://localhost:3000/api/answer/${id}`, data, config)
        dispatch({
            type: ADD_ANSWER,
            payload: {...res.data,user:userData}
        })
        console.log("after dispatch")
        dispatch(setAlert('Answer Added','success'))

    } catch (err) {
        console.log("error add answer dispatch",err);
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Update  Answer
export const updateAnswer = (id,description) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    const data = {description: description}
    try {
        console.log( "text body",id, description);
        const res = await axios.put(`http://localhost:3000/api/answer/${id}`, data, config)
        dispatch({
            type: UPDATE_ANSWER,
            payload: {ansId: id, data: res.data}
        })
        console.log("after dispatch")
        dispatch(setAlert('Answer Updated','success'))

    } catch (err) {
        console.log("error add answer dispatch",err);
        dispatch({
            type: ANSWER_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}