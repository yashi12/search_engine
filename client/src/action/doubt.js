// Add Doubt
import axios from "axios";
import {ADD_DOUBT, DOUBT_ERROR, GET_DOUBTS, GET_DOUBT, GET_DOUBT_TO_SOLVE} from "./types";
import {setAlert} from "./alert";

export const addDoubt = (data) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		const res = await axios.post(`${process.env.REACT_APP_API}/api/mentor/doubt/`, data, config)
		dispatch({
			type: ADD_DOUBT,
			payload: res.data
		});

		dispatch(setAlert('Doubt Created','success'))

	} catch (err) {
		console.log("error add post dispatch",err);
		dispatch({
			type: DOUBT_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}

export const getDoubts = () => async dispatch => {
	try {
		axios.get(`${process.env.REACT_APP_API}/api/mentor/`)
			.then((res) => {
				dispatch({
					type: GET_DOUBTS,
					payload: res.data
				})
			})
	} catch (err) {
		dispatch({
			type: DOUBT_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}

export const getDoubtInfo = id => async dispatch => {
	try {
		axios.get(`${process.env.REACT_APP_API}/api/mentor/doubt/${id}`)
			.then((res) => {
				console.log("data : ",res)
				dispatch({
					type: GET_DOUBT,
					payload: res.data
				})
			})
	} catch (err) {
		dispatch({
			type: DOUBT_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}

export const getDoubtsToSolve = () => async dispatch => {
	try {
		axios.get(`${process.env.REACT_APP_API}/api/mentor/final/`)
			.then((res) => {
				dispatch({
					type: GET_DOUBT_TO_SOLVE,
					payload: res.data
				})
			})
	} catch (err) {
		dispatch({
			type: DOUBT_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}

export const getOwnDoubts = () => async dispatch => {
	try {
		axios.get(`${process.env.REACT_APP_API}/api/mentor/own`)
			.then((res) => {
				dispatch({
					type: GET_DOUBTS,
					payload: res.data
				})
			})
	} catch (err) {
		dispatch({
			type: DOUBT_ERROR,
			payload: {msg: err.response,
				status: err.response}
		})
		const error = err.response.data.errors;
		if (error){
			error.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
	}
}
export const addLearningSession = () => {
	
}
