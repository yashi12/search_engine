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
export const likeAnswer = postId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:3000/api/posts/like/${postId}`)

        dispatch({
            type: LIKE_ANSWER,
            payload: { postId, likes: res.data  }
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
            payload: postId
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
export const addAnswer = (id,data) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    try {
        // console.log( "text body",body);
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