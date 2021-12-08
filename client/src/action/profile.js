import axios from 'axios'
import {setAlert} from './alert'

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    GET_PROFILES,
    CLEAR_PROFILE,
    CLEAR_PROFILES, SEARCH_PROFILE, SEARCH_QUERY, SEARCH_ERROR, GET_PROFILE_BY_ID
} from './types'

const API = 'http://localhost:3000'

// Get current user

export const getCurrentProfile = () => async dispatch => {
    try {
        console.log("enter get profile")
        const res = await axios.get(`${API}/api/profile/me`)
        console.log("res", res)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        console.log("error profile",err.response)
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response,
                status: err.response
            }
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILES
    })
    try {
        const res = await axios.get(`${API}/api/profile`)
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response,
                status: err.response
            }
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Get profiles by skill filter
export const getProfilesBySkill = skill => async dispatch => {
    console.log("skill in action", skill);
    try {
        const res = await axios.get(`${API}/api/profile/filter/${skill}`)

        console.log("res",res.data);
        dispatch({
            type: SEARCH_PROFILE,
            payload: res.data
        })
    } catch (err) {
        console.log("err profile filter",err);
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Get profile by ID

export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`${API}/api/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE_BY_ID,
            payload: res.data
        })
    } catch (err) {
        console.log("profile by id error : ", err)
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Create or Update
export const createProfile = (formData, history, edit = false) => async dispatch => {

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // const {githubusername, linkedIn, twitter, bio, skills} = formData;
        //
        // let skillData = skills.split(',');
        // const body = {githubusername, linkedIn, twitter, bio, skills:skillData};
        console.log("form body", formData)
        const res = await axios.post(`${API}/api/profile`, formData, config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        if (!edit) {
            history.push('./profile')
        }
    } catch (err) {
        const error = err.response.data.errors;

        if (error) {
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })

    }
}

// Add experience
export const addExperience = (formData) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log("formdata", formData);
        const res = await axios.put(`${API}/api/profile/experience`, formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience added', 'success'))
        
    } catch (err) {
        const error = err.response.data.errors;

        if (error) {
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })

    }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education added', 'success'))

        history.push('/profile')

    } catch (err) {
        const error = err.response.data.errors;

        if (error) {
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })

    }
}

// Delete experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`${API}/api/profile/delete`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience removed', 'success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}

// Delete account and profile
export const deleteAccount = id => async dispatch => {
    if (window.confirm('Are you sure ?')) {
        try {
            const res = await axios.delete(`${API}/api/profile`)

            dispatch({
                type: CLEAR_PROFILE
            })
            dispatch({
                type: ACCOUNT_DELETED
            })

            dispatch(setAlert('ACCOUNT DELETED', 'success'))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            })
            const error = err.response.data.errors;
            if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        }
    }

}


export const searchQuery = topic => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        }
    }
    const body = {topic}
    try {
        console.log("enter get search", body)
        const res = await axios.post(`${API}/api/skill`, body, config)
        console.log("res", res.data)
        dispatch({
            type: SEARCH_QUERY,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: SEARCH_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
        const error = err.response.data.errors;
        if (error){
            error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
    }
}