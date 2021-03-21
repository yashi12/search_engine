const LogIn = () => {
    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
            <br/><br/>
            <section className="search-bar">
                <form className="bar" role="form" method="post" action="/api/token">
                    <div className="form-group">
                        <h1>Log In</h1><br/>
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required=""
                            name="email"></input>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" name="password"></input>
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

export default LogIn
