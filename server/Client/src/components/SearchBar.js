const SearchBar = () => {
    return (
        <div className="row align-items-center">
            <div className="col"></div>
            <div className="col">
            <br/><br/><br/><br/><br/><br/><br/>
            <form className="bar" method="get" action="/result">
                <div>
                    <h1>Enter Query</h1>
                    <input type="text" className="form-control" id="query" placeholder="Search" name="query"></input>
                    <br/>
                    <button type="submit" className="btn btn-primary" id="searchQuery">Submit</button>
                </div>
            </form>
            </div>
            <div className="col"></div>
        </div>
        
    )
}

export default SearchBar
