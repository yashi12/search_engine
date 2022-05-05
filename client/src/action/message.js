import axios from "axios";
import {ADD_MESSAGE, MESSAGE_ERROR} from "./types";
import {setAlert} from "./alert";

export const message = (data) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		const res = await axios.post(`${process.env.REACT_APP_API}/api/send-message/${data.id}`, data, config)
		dispatch({
			type: ADD_MESSAGE,
			payload: res.data
		});

		dispatch(setAlert('Message Sent Successfully','success'))

	} catch (err) {
		console.log("error add post dispatch",err);
		dispatch({
			type: MESSAGE_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}
