import {
    ADD_ANSWER,
    GET_ANSWER,
    LIKE_ANSWER,
    DELETE_ANSWER,
    UPDATE_ANSWER,
    ANSWER_ERROR,
    ADD_COMMENT
} from '../action/types'

const initialState = {
    answers: [],
    answer: null,
    loading: true,
    error: {},
    comments : []
}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case UPDATE_ANSWER:
            return {
                ...state,
                answers: state.answers.map((post) => post._id === payload.ansId ? {...payload.data, user:post.user} : post),
                loading: false
            }
        case ADD_ANSWER:
            console.log("answers", state);
            return {
                ...state,
                answers: [payload, ...state.answers],
                loading: false
            }
        case ADD_COMMENT:
            console.log()
            return {
                ...state,
                answers: state.answers.map((post) => post._id === payload.id ? { ...post, comments:payload.data.comments } :post),
                loading: false
            }
        case DELETE_ANSWER:
            return {
                ...state,
                answers: state.answers.filter(post => post._id !== payload),
                loading: false
            }
        case ANSWER_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case LIKE_ANSWER:
            return {
                ...state,
                answers: state.answers.map((post) => post._id === payload.ansId ? { ...post, likeCount:payload.likes.likeCount } :post),
                loading: false 
            }
        case GET_ANSWER:
            return {
                ...state,
                answers: payload,
                loading: false
            }

        default:
            return state
    }
}