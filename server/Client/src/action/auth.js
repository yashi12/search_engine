import axios from 'axios'
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS, REGISTER_FAIL
} from './types'

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