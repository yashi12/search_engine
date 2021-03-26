const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <a className="navbar-brand" href="#">NLPSE</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto ">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item active" >
                        <a className="nav-link" href="#skillOfWeek">Skill of the week</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="/login">Log In</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="/register">Register</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link" href="/contact">Contact Us</a>
                    </li>
                    <li>
                        <form action="/logout" method="post">
                            <button type="submit" id="logout"
                                    className="btn btn-outline-secondary" >Log Out <span className="caret"></span>
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
