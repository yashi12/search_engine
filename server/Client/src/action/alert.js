import {v4 as uuid} from 'uuid' ;
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType, timeout = 2000) => dispatch => {
    // uuid is a module to generate random ids
    const id  = uuid() ;
    dispatch({
        type : SET_ALERT,
        payload: {msg, alertType, id}
    })

    setTimeout(() => dispatch({type: REMOVE_ALERT,payload:id}), 3000, timeout)
}