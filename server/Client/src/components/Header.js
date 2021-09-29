const Header = () => {
    return (
    <div>
        <div className="row">
            <div className="col-2"/>
            <div className="card mb-3 col-8">
                <div className="row g-0">
                    <div className="col-md-4 mb-3">
                        <img width="250" height="250" src="https://media.wired.com/photos/5e59a85635982c0009f6eb8a/1:1/w_1350,h_1350,c_limit/python-popularity.jpg" alt="..."/>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-0">
                            <div className="card-body">
                                <h5 className="card-title">Name</h5>
                                <p className="card-text">This is a wider card with supporting text below as a natural 
                                lead-in to additional content. This content is a little bit longer.</p>  
                            </div>
                        </div>
                        <div className="row g-1">
                        <div className="col-9"/>
                        <div className="col-3">
                            <div className="card-body">
                                <button type="button" className="btn btn-primary">
                                Like <span className="badge bg-secondary">9</span>
                                </button>
                            </div>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Header
