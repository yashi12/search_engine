import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../action/auth'
import  React,{ useState } from 'react'
import './LogIn-Register.css';
import axios from "axios";

const LogIn = ({ login, isAuthenticated }) => {

	const [formData, setData] = useState({
		email : '',
		password : ''
	})

	const { email , password} = formData

	const onChange = e => setData({...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		e.preventDefault();
		login({email, password})
	}

	// Redirect if logged in

	if(isAuthenticated){
		return <Redirect to='/profile' />
	}

	const responseGoogleSuccess = (response) => {
		console.log(response);
		axios({
			method:"POST",
			url:"http://localhost:3000/api/auth/googlelogin",
			data: {token: response.tokenId}
		}).then(resp=>{
			console.log("google login success",resp.data.token);
			login({email, password})
		})
	}

	const responseGoogle = (response) => {
		console.log(response);
	}
	return (
		<div className="body-lr">
			<div className="background">
				<div className="shape"/>
				<div className="shape"/>
			</div>
			<form className="bar form-lr" role="form" method="post" onSubmit={e => onSubmit(e)}>
				<h3>Login Here</h3>
				<label htmlFor="exampleInputEmail1">Email address</label>
				<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required=""
					   name="email" onChange={e => onChange(e)} autoComplete="off"/>
				<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>

				<label htmlFor="exampleInputPassword1">Password</label>
				<input onChange={e => onChange(e)} type="password" className="form-control" id="exampleInputPassword1" name="password" />
				<button type="submit" className="btn">Log In</button>
				{/* <div className="social">
					<div className="go"
						 clientId={process.env.REACT_APP_CID}
						 buttonText="Login"
						 onSuccess={responseGoogleSuccess}
						 onFailure={responseGoogle}
						 cookiePolicy={'single_host_origin'}>
						<i className="fab fa-google"/>
						Google
					</div>
					<div className="fb">
						<i className="fab fa-facebook"/>
						Facebook
					</div>
				</div> */}
			</form>
		</div>
	)
}

LogIn.prototype = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(LogIn)
