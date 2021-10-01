import {
    GET_QUESTIONS,
    QUESTION_ERROR,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    ASK_QUESTION,
    SEARCH_QUESTIONS
} from '../action/types'

const initialState = {
    questions: [],
    question: null,
    loading: true,
    error: {},
    searchQuestionArr: [],
    query: []
}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case GET_QUESTIONS:
            return {
                ...state,
                questions: payload,
                loading: false
            }
        case ASK_QUESTION:
            return {
                ...state,
                questions: [payload, ...state.posts],
                loading: false
            }
        case DELETE_QUESTION:
            return {
                ...state,
                questions: state.posts.filter(post => post._id !== payload),
                loading: false
            }
        case QUESTION_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case SEARCH_QUESTIONS:
            return {
                ...state,
                searchQuestionArr: payload,
                loading: false
            }
        case UPDATE_QUESTION:
            return {
                ...state,
                questions: state.posts.map((post) => post._id === payload.postId ? { ...post,likes: payload.likes, likeCount:payload.likes.length } :post),
                loading: false 
            }

        default:
            return state
    }
}