import axios from 'axios'
import { setAlert } from './alert'

import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    SEARCH_POST
} from './types'

// Get Posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:3000/api/posts')
        console.log("res posts ui", res);

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Search Post
export const searchPosts = (topic) => async dispatch => {
    console.log("search post")
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    // const tags = topic.title.split(',')
    // const body = {title:tags}
    try {
        console.log( "text body 1",topic.title);
        const res = await axios.get(`http://localhost:3000/api/posts/filter/${topic.title}`, config)
        console.log("result filter",res)
        dispatch({
            type: SEARCH_POST,
            payload: res.data
        })

    } catch (err) {
        console.log("error add post dispatch",err);
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response,
                status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Add Like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:3000/api/posts/like/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data  }
        })
        //dispatch(setAlert('Post liked','success'))
    } catch (err) {
        console.log("error like", err);
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Delete  post
export const deletePost = postId => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:3000/api/posts/${postId}`)
        dispatch({
            type: DELETE_POST,
            payload: postId
        })

        dispatch(setAlert('Post removed','success'))

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Add  post
export const addPost = (data) => async dispatch => {
    const config = {
        header: {'Content-Type': 'multipart/form-data'}
    }
    try {
        // console.log( "text body",body);
        const res = await axios.post('http://localhost:3000/api/posts', data, config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        console.log("after dispatch")
        dispatch(setAlert('Post Created','success'))

    } catch (err) {
        console.log("error add post dispatch",err);
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response,
            status: err.response}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}