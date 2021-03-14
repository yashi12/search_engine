const Register = () => {
    return (
        <div>
            <section>
                <div className="alert alert-danger">
                    <h2></h2></div>
            </section>
            <section className="search-bar">

                <form className="bar" action="/api/signup" role="form" method="post">
                    <div className="form-group">
                        <h1>Register</h1><br/>
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required=""
                            name="email"></input>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                       
                        <div className="alert alert-danger"></div>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" required=""
                            name="password"></input>
                        
                        <div className="alert alert-danger">{{incorrectPassword}}</div>
                        
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Confirm Password</label>
                        <input type="password" className="form-control" required=""
                            name="confirmPassword"></input>
                    </div>

                    <span id="confirmMessage" style="color:red"> </span>
                    <button type="submit" className="btn btn-primary">Register</button>

                </form>

            </section>
        </div>
    )
}

export default Register
