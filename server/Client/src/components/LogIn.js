import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../action/auth'
import  React,{ useState } from 'react'
import { GoogleLogin } from 'react-google-login';
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
        <div className="row">
            <div className="col"/>
            <div className="col">
            <br/><br/>
            <section className="search-bar">
                <form className="bar" role="form" method="post" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                        <h1>Log In</h1><br/>
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required=""
    name="email" onChange={e => onChange(e)}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input onChange={e => onChange(e)} type="password" className="form-control" id="exampleInputPassword1" name="password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <GoogleLogin
                    clientId={process.env.REACT_APP_CID}
                    buttonText="Login"
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />

                </section>
            </div>
            <div className="col"/>

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
