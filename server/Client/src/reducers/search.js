import {
    SEARCH_ERROR,
    SEARCH_QUERY
} from '../action/types'

const initialState = {
    results: [],
    result: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case SEARCH_QUERY:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case SEARCH_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state
    }
}