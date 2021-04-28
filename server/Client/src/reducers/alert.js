import { SET_ALERT , REMOVE_ALERT } from  '../action/types'

const initialState = [{
    id : 1,
    msg : '',
    alertType : ''
}]

export default function(state = initialState, action){
    const { type, payload } = action

    switch(action.type){
        case SET_ALERT :
            return [...state, payload] ;
        case REMOVE_ALERT :
            return state.filter(alert => alert.id !== payload);
        default :
            return state
    }
}