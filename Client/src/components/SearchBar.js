const SearchBar = () => {
    return (
        <section className="search-bar container-fluid">

            <form className="bar" method="get" action="/result">
                <div>
                    <h1>Enter Query</h1>
                    <input type="text" className="form-control" id="query" placeholder="Search" name="query"></input>
                    
                    <button type="submit" className="btn btn-primary" id="searchQuery">Submit</button>
                </div>
            </form>

        </section>
    )
}

export default SearchBar
