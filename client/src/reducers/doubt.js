import {
    ADD_DOUBT,
    DOUBT_ERROR,
    GET_DOUBTS,
    GET_DOUBT,
    GET_DOUBT_TO_SOLVE,
    GET_PROPOSALS,
    UPDATE_PROPOSAL,
    ADD_PROPOSALS
} from '../action/types'

const initialState = {
    doubts: [],
    doubt: null,
    doubtsToSolve: [],
    loading: true,
    error: {},
    proposals: []
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
        case UPDATE_PROPOSAL:
            return {
                ...state,
                proposals: state.proposals.map((post) => post._id === payload.ansId ? {...payload.data, user:post.user} : post),
                loading: false
            }
        case ADD_PROPOSALS:
            console.log("proposals", state);
            return {
                ...state,
                proposals: [payload, ...state.proposals],
                loading: false
            }
        case GET_PROPOSALS:
            return {
                ...state,
                proposals: payload,
                loading: false
            }
        default:
            return state
    }
}
