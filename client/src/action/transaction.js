import { setAlert } from './alert'

// Transaction Successful
export const transactionSuccessful = () => async dispatch => {
    dispatch(setAlert('Transaction Successful', 'success'))
}

// Transaction Failed
export const transactionFailed = (error) => async dispatch => {
    if(error.message){
        dispatch(setAlert(error.message, 'danger'))
    }
    else {
        dispatch(setAlert(error.message, 'danger'))
    }
}
