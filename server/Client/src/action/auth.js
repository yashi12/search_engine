import axios from 'axios'
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS, REGISTER_FAIL
} from './types'

// Register User
export const register = ({email, password}) => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        }
    }

    // const body = JSON.stringify( {email, password} )
    const body = {email,password}
    // console.log("ui body", body.email);
    try {
        const res = await axios.post('http://localhost:3000/api/users', body, config)

        dispatch ({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    }
    catch(err) {
        // console.log("error",err);
        const error = err.response.data.error;
        
        if (error){
            error.forEach(error => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch ({
            type: REGISTER_FAIL

        })
    }
}