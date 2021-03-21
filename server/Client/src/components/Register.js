import { useState } from 'react'
import { connect } from 'react-redux'
import { setAlert } from '../action/alert'
import { register } from '../action/auth'
import PropTypes from 'prop-types'

const Register = ({ setAlert, register }) => {

    const [formData, setData] = useState({
        email : '',
        password : '',
        confirmPassword : ''
    })

    const { email , password , confirmPassword } = formData

    const onChange = e => setData({...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword){
            setAlert('Password does not match','danger')
        }
        else {
            register({email, password})
        }
    }

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
                <br/><br/>
            <section className="search-bar">

                <form className="bar" action="/api/signup" onSubmit={e => onSubmit(e)} role="form" method="post">
                    <div className="form-group">
                        <h1>Register</h1><br/>
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                            name="email" onChange={e => onChange(e)}></input>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                            name="password" onChange={e => onChange(e)}></input>
                        
                        
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Confirm Password</label>
                        <input type="password" className="form-control" 
                            name="confirmPassword" onChange={e => onChange(e)}></input>
                    </div>

                    <button type="submit" className="btn btn-primary">Register</button>

                </form>

                </section>
            </div>
            <div className="col"></div>
            
        </div>
    )
}

Register.propType = {
    setAlert : PropTypes.func.isRequired,
    register : PropTypes.func.isRequired,
}

export default connect(null, { setAlert, register })(Register)
