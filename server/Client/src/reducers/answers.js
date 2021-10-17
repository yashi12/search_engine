import {
    ADD_ANSWER,
    GET_ANSWER,
    LIKE_ANSWER,
    DELETE_ANSWER,
    UPDATE_ANSWER,
    ANSWER_ERROR
} from '../action/types'

const initialState = {
    answers: [],
    answer: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case UPDATE_ANSWER:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case ADD_ANSWER:
            console.log("answers", state);
            return {
                ...state,
                posts: [payload, ...state.answers],
                loading: false
            }
        case DELETE_ANSWER:
            return {
                ...state,
                posts: state.answers.filter(post => post._id !== payload),
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
                posts: state.answers.map((post) => post._id === payload.postId ? { ...post,likes: payload.likes, likeCount:payload.likes.length } :post),
                loading: false 
            }


        default:
            return state
    }
}