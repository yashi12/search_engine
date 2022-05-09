import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../action/auth'
import React, { Fragment } from 'react'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

    // These links will be displayed once the user has logged in
    const authLinks = (
        <ul className="navbar navbar-nav mr-auto w-100">
            {/* <li className="nav-item active">
                <Link className="nav-link" to="/search">Learn</Link>
            </li> */}
            <li className="nav-item dropdown active">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Post
                </a>
                <div className="dropdown-menu" >
                    <Link className="dropdown-item" to="/feed">Feed</Link>
                    <Link className="dropdown-item" to="/addPost">Add Post</Link>
                    <Link className="dropdown-item" to="/searchPost">Search Post</Link>
                    <Link className="dropdown-item" to="/profiles">Find Devs</Link>
                    <Link className="dropdown-item" to="/searchProfile">Search Profile</Link>
                    {/*<Link className="dropdown-item" to="/search">Learn</Link>*/}
                </div>
            </li>
            <li className="nav-item dropdown active">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Doubt
                </a>
                <div className="dropdown-menu" >
                    <Link className="dropdown-item" to="/addDoubt">Add Doubt</Link>
                    <Link className="dropdown-item" to="/doubtFeed">Doubts Feed</Link>
                    <Link className="dropdown-item" to="/myDoubt">My Doubts</Link>
                    <Link className="dropdown-item" to="/doubtsToSolve">Doubts To Solve</Link>
                    <Link className="dropdown-item" to="/searchDoubtByTag">Search Doubt By Tag</Link>
                </div>
            </li>
            <li className="nav-item dropdown active">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Contracts
                </a>
                <div className="dropdown-menu" >
                    <Link className="dropdown-item" to="/blockchain">Add Contract</Link>
                    <Link className="dropdown-item" to="/searchDoubtContract">Search Contract</Link>
                </div>
            </li>
            <li className="nav-item dropdown active">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Questions
                </a>
                <div className="dropdown-menu" >
                    <Link className="dropdown-item" to="/searchQuestion">Search Question</Link>
                    <Link className="dropdown-item" to="/similarQuestion">Search Similar Question</Link>
                    <Link className="dropdown-item" to="/askQuestion">Ask Question</Link>
                    <Link className="dropdown-item" to="/questionsFeed">Questions Feed</Link>
                    <Link className="dropdown-item" to="/myQuestions">My Questions</Link>
                </div>
            </li>

            <li className="nav-item active">
                <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/messages">Messages</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" onClick={logout} to="#">Log Out</Link>
            </li>
        </ul>
    )

    // These links will be displayed to everyone
    const guestLinks = (
        <nav className="navbar navbar-nav w-100 navbar-dark">
            <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/login">Log In</Link>
            </li>
        </nav>
    )

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CodeBlockS</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
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

export default connect(mapStateToProps, { logout })(Navbar)
