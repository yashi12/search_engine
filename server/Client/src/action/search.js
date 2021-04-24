import axios from 'axios'
import {setAlert} from './alert'

import {
    SEARCH_QUERY,
    SEARCH_ERROR
} from './types'

// Get result

export const searchQuery = topic => async dispatch => {
    const config = {
        header: {
            'Content-Type': 'application/json'
        }
    }
    const body = {topic}
    try {
        console.log("enter get search", body)
        const res = await axios.post('http://localhost:3000/api/skill', body, config)
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
    }
}
