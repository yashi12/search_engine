import axios from 'axios'
import { setAlert } from './alert'

import {
    ADD_ANSWER,
    GET_ANSWER,
    LIKE_ANSWER,
    DELETE_ANSWER,
    UPDATE_ANSWER,
    ANSWER_ERROR
} from './types'

// Get Answer
export const getAnswer = id => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:3000/api/answer/${id}`)
        console.log("res posts ui", res);

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
    }
}

// Like Answer
export const likeAnswer = ansId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:3000/api/posts/like/${ansId}`)

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
    }
}

// Add  Answer
export const addAnswer = (id,description) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    const data = {description: description}
    try {
        console.log( "text body",id, description);
        const res = await axios.post(`http://localhost:3000/api/answer/${id}`, data, config)
        dispatch({
            type: ADD_ANSWER,
            payload: res.data
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
            payload: res.data
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
    }
}