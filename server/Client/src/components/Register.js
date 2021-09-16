import React,{ useState } from 'react'
import { connect } from 'react-redux'
import { setAlert } from '../action/alert'
import { register } from '../action/auth'
import PropTypes from 'prop-types'
import './LogIn-Register.css'
import { Link, Redirect } from 'react-router-dom'

const Register = ({ setAlert, register, isAuthenticated }) => {

    const [formData, setData] = useState({
        name : '',
        email : '',
        password : '',
        confirmPassword : ''
    })

    const { name, email , password , confirmPassword } = formData

    const onChange = e => setData({...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword){
            setAlert('Password does not match','danger')
        }
        else {
            console.log("ui name", name);
            register({name, email, password})
        }
    }

    if (isAuthenticated){
        return <Redirect to='/profile' />
    }

    return (
        <div>
            <div className="background" >
                <div className="shape"/>
                <div className="shape"/>
            </div>
            <form className="bar form-register"  onSubmit={e => onSubmit(e)} role="form" method="post">
                <h3>Register Here</h3>
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required="" name="email" onChange={e => onChange(e)} autoComplete="off"/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>

                <label htmlFor="exampleInputEmail1">Name</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="name" onChange={e => onChange(e)}/>

                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange={e => onChange(e)} type="password" className="form-control" id="exampleInputPassword1" name="password" />

                <label htmlFor="exampleInputPassword1">Confirm Password</label>
                <input type="password" className="form-control" name="confirmPassword" onChange={e => onChange(e)}/>
                <button type="submit" className="btn">Register</button>

            </form>
        </div>
    )
}

Register.propType = {
    setAlert : PropTypes.func.isRequired,
    register : PropTypes.func.isRequired,
    isAuthenticated : PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)
