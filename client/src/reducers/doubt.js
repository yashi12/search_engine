import {
    ADD_DOUBT,
    DOUBT_ERROR,
    GET_DOUBTS,
    GET_DOUBT,
    GET_DOUBT_TO_SOLVE
} from '../action/types'

const initialState = {
    doubts: [],
    doubt: null,
    doubtsToSolve: [],
    loading: true,
    error: {}
}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case GET_DOUBTS:
            return {
                ...state,
                doubts: payload,
                loading: false
            }
        case GET_DOUBT_TO_SOLVE:
            return {
                ...state,
                doubtsToSolve: payload,
                loading: false
            }
        case GET_DOUBT:
            return {
                ...state,
                doubt: payload,
                loading: false
            }
        case ADD_DOUBT:
            return {
                ...state,
                doubts: [payload, ...state.doubts],
                loading: false
            }
        case DOUBT_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state
    }
}
