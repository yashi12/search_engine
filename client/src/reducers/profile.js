import {
    GET_PROFILE,
    GET_PROFILE_BY_ID,
    PROFILE_ERROR,
    SEARCH_PROFILE,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILES,
    SEARCH_QUERY, SEARCH_ERROR
} from "../action/types"

const initialState = {
    profile: null,
    profiles: [],
    loading: true,
    error: {},
    searchProfiles: [],
    query: []
}

export default function(state = initialState, action){
    const { type, payload } = action
    console.log("payload",payload);
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case SEARCH_PROFILE:
            return {
                ...state,
                searchProfiles: payload,
                loading: false
            }
        case GET_PROFILE_BY_ID:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
        case SEARCH_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        case SEARCH_QUERY:
            return {
                ...state,
                query: payload,
                loading: false
            }
        default:
            return state
    }
}