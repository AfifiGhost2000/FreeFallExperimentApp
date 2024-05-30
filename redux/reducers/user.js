import { USER_STATE_CHANGE, USER_IMAGE_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initialState = {
    currentUser: null,
    userImage: []
}

export const user = (state = initialState, action) => {
    
    switch(action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_IMAGE_STATE_CHANGE:
            return {
                ...state,
                userImage: action.userImage
            }
            case CLEAR_DATA:
                return{
                    ...state,
                    currentUser: null
                }
        default:
            return state;


    

    }
}