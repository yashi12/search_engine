import axios from 'axios'
import { setAlert } from './alert'

import {
    GET_PROFILE,
    PROFILE_ERROR
} from './types'

// Get current user

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile')

        dispatch ({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,
            status: err.response.status}
        })
    }
}

// Create or Update
export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated':'Profile Created', 'success'))

        if (!edit){
            history.push('./profile')
        }
    }
    catch (err) {
        const error = err.response.data.error;

        if (error){
            error.forEach(error => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,
            status: err.response.status}
        })

    }
}