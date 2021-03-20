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

    const body = JSON.stringify( {email, password} )

    try {
        const res = await axios.post('/api/user', body, config)

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