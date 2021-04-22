import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    SEARCH_POST
} from '../action/types'

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {},
    searchPostArr: []

}

export default function(state = initialState, action){
    const { type, payload} = action
    switch( type){
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case ADD_POST:
            console.log("posts", state);
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== payload),
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case SEARCH_POST:
            return {
                ...state,
                searchPostArr: payload,
                loading: false
            }
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) => post._id === payload.id ? { ...post,likes: payload.likes } :post),
                loading: false 
            }
        default:
            return state
    }
}