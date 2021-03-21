import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">DevLok</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto ">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/feed">Feed</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/learn">Learn</Link>
                        </li>
                        
                        <li className="nav-item active">
                            <Link className="nav-link" to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/login">Log In</Link>
                        </li>
                        
                    </ul>
                        
                            <form class="d-flex">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        
                </div>
            </div>
        </nav>
    )
}

export default Navbar


/*
<form action="/logout" method="post">
                            <button type="submit" id="logout"
                                    className="btn btn-outline-secondary" >Log Out <span className="caret"></span>
                            </button>
                        </form> */