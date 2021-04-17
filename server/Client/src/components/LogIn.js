import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../action/auth'
import  { useState } from 'react'

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

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
            <br/><br/>
            <section className="search-bar">
                <form className="bar" role="form" method="post" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                        <h1>Log In</h1><br/>
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required=""
                            name="email" onChange={e => onChange(e)}></input>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input onChange={e => onChange(e)} type="password" className="form-control" id="exampleInputPassword1" name="password"></input>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <div className="form-group text-center">
                        <small><button type="submit" formaction="/forgotPassword" className="btn btn-link">Forgot
                            password?</button></small>
                    </div>
                </form>

                </section>
            </div>
            <div className="col"></div>
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
