import React,{ useState } from 'react'
import { connect } from 'react-redux'
import { setAlert } from '../action/alert'
import { register } from '../action/auth'
import PropTypes from 'prop-types'
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
        <div className="row">
            <div className="col"/>
            <div className="col">
                <br/><br/>
                <section className="search-bar">

                    <form className="bar"  onSubmit={e => onSubmit(e)} role="form" method="post">
                        <div className="form-group">
                            <h1>Register</h1><br/>
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
    name="email" onChange={e => onChange(e)}/>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>

                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
    name="name" onChange={e => onChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"
    name="password" onChange={e => onChange(e)}/>


                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Confirm Password</label>
                            <input type="password" className="form-control"
    name="confirmPassword" onChange={e => onChange(e)}/>
                        </div>

                        <button type="submit" className="btn btn-primary">Register</button>

                    </form>

                </section>
            </div>
            <div className="col"/>

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
