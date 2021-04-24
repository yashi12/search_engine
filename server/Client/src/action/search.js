import axios from 'axios'
import {setAlert} from './alert'

import {
    SEARCH_QUERY,
    SEARCH_ERROR
} from './types'

// Get result

export const searchQuery = topic => async dispatch => {
    try {
        console.log("enter get search")
        const res = await axios.get(`http://localhost:3000/search${topic}`)
        console.log("res", res)
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
