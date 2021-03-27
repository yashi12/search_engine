import axios from 'axios'
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED,
    AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT
} from './types'
import setAuthToken from '../utils/setAuthToken'

// Load User

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('api/auth')

        dispatch ({
            type : USER_LOADED,
            payload : res.data
        })

    } catch (err) {
        dispatch ({
            type: AUTH_ERROR
        })
    }
}


// Register User
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        }
    }

    // const body = JSON.stringify( {name, email, password} )
    const body = {name, email, password}
    console.log("ui body", body);

    try {
        const res = await axios.post('http://localhost:3000/api/users', body, config)

        dispatch ({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }
    catch(err) {
        const error = err.response.data.error;

        if (error){
            error.forEach(error => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch ({
            type: REGISTER_FAIL

        })
    }
}

// Log In User
export const login = ({ email, password}) => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        }
    }

    // const body = JSON.stringify( {name, email, password} )
    const body = {email, password}
    console.log("ui body", body);

    try {
        const res = await axios.post('http://localhost:3000/api/auth', body, config)

        dispatch ({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }
    catch(err) {
        const error = err.response.data.error;

        if (error){
            error.forEach(error => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch ({
            type: LOGIN_FAIL

        })
    }
}

// Log out

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}