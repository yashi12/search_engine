import { GET_PROFILE, PROFILE_ERROR,SEARCH_PROFILE, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES } from "../action/types"

const initialState = {
    profile: null,
    profiles: [],
    loading: true,
    error: {},
    searchProfiles: []
}

export default function(state = initialState, action){
    const { type, payload } = action

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
        case PROFILE_ERROR:
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
        default:
            return state
    }

}