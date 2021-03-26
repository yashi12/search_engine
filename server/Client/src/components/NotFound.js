const NotFound = () => {
    return (
        <section className="fullheight">
            <div className="jumbotron">
                <h1 className="display-4">No Result Found !</h1>
                <p className="lead"></p>
                <hr className="my-4"></hr>
                <p>Please enter another query</p>
                <form action="/">
                    <button type="submit" className="btn btn-primary btn-lg">Search Again</button>
                </form>
            </div>
        </section>
    )
}

export default NotFound
