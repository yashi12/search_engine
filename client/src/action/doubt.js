// Add Doubt
import axios from "axios";
import {ADD_DOUBT, DOUBT_ERROR, GET_DOUBTS, GET_DOUBT, GET_DOUBT_TO_SOLVE, GET_PROPOSALS, UPDATE_PROPOSAL, ADD_PROPOSALS, SEARCH_DOUBT_BY_TAG} from "./types";
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

export const addProposal = (id,data) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		const res = await axios.post(`${process.env.REACT_APP_API}/api/mentor/doubt/${id}`, data)
		//const res = await axios.post(`${process.env.REACT_APP_API}/api/mentor/doubt/62791e3dd925a92f2cd7fdec`, data, config)
		dispatch({
			type: ADD_PROPOSALS,
			payload: res.data
		});
		console.log("add proposal data",res.data)
		dispatch(setAlert('Proposal Added','success'))

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

export const updateProposal = (id,data) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		axios.post(`${process.env.REACT_APP_API}/api/mentor/doubt/${id}`, data)
			.then((res) => {
				console.log(res.data)
				dispatch({
					type: UPDATE_PROPOSAL,
					payload: res.data
				})
				dispatch(setAlert('Proposal Updated','success'))
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

export const initiateProposal = (doubt_id,mentor_id) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		axios.post(`${process.env.REACT_APP_API}/api/book/initiate/${doubt_id}/mentor/${mentor_id}`)
			.then((res) => {
				console.log(res.data)
				dispatch(setAlert('Proposal Accepted','success'))
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

export const doubtSolved = (id) => async dispatch => {
	const config = {
		header: {'Content-Type': 'multipart/form-data'}
	}
	try {
		axios.post(`${process.env.REACT_APP_API}/api/book/solved/${id}`)
			.then((res) => {
				console.log(res.data)
				dispatch(setAlert('Doubt Solved','success'))
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
				
				dispatch({
					type: GET_DOUBT,
					payload: res.data
				})
				console.log("res data : ",res.data)
				dispatch({
					type: GET_PROPOSALS,
					payload: res.data.bookings
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

export const searchDoubt = tag => async dispatch => {
	try {
		axios.get(`${process.env.REACT_APP_API}/api/mentor/filter/${tag}`)
			.then((res) => {
				dispatch({
					type: SEARCH_DOUBT_BY_TAG,
					payload: res.data
				})
				if(res.data.length === 0){
					dispatch(setAlert('No Doubt Found','danger'))
				}
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



