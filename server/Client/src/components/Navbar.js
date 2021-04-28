import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../action/auth'
import { Fragment } from 'react'

const Navbar = ({ auth: {isAuthenticated, loading}, logout }) => {

    const authLinks = (
        <ul className="navbar-nav mr-auto ">
            <li className="nav-item active">
                <Link className="nav-link" to="/feed">Feed</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/search">Learn</Link>
            </li>
            
            <li className="nav-item active">
                <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/addPost">Add Post</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" onClick={logout} >Log Out</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/searchPost">Search Post</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/searchProfile">Search Profile</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/profiles">Find Devs</Link>
            </li>
        </ul>
    )

    const guestLinks = (
        <div>
        <ul className="navbar-nav mr-auto ">
            <li className="nav-item active">
                <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/login">Log In</Link>
            </li>
        </ul>
      </div>
    )

    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">DevLok</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }                   
                </div>
            </div>
        </nav>
    )
}

Navbar.prototype = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logout} )(Navbar)

