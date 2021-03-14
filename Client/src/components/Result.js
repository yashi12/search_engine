const Result = () => {
    return (
        <div>
            <section className="container-fluid" id="Result">

                <h1>Results</h1> <br/>

                <h2>Udemy</h2><br/>
                <div className="row">
                    
                    <div className="col">
                        <div className="card" style="width: 18rem;">
                            <img src="{{cource.course_image}}" className="card-img" alt="Best Ever Content!" className="card-img-top"
                                alt="..."></img>
                        
                            <div className="card-body">
                                <h5 className="card-title"></h5>
                                <p className="card-text">good</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Instructor - </li>
                                <li className="list-group-item">Rating - </li>
                            </ul>
                            <div className="card-body">
                                <a href="{{cource.course_link}}" target="_blank" className="card-link">Learn More</a>
                            </div>
                        </div>
                    </div>
                   
                </div>
                <br/>

                <br/>
                <h2>Coursera</h2><br/>
                <div className="row">

                    <div className="col">
                        <div className="card" style="width: 18rem;">
                            <img src="{{cource.course_image}}" className="card-img" alt="Best Ever Content!" className="card-img-top"
                                alt="..."></img>
                           
                            <div className="card-body">
                                <h5 className="card-title"></h5>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Instructor - </li>
                                <li className="list-group-item">Rating - </li>
                                <li className="list-group-item">Level - </li>
                            </ul>

                            <div className="card-body">
                                <a href="{{cource.course_link}}" target="_blank" className="card-link">Learn More</a>
                            </div>
                        </div>
                    </div>
                    
                </div>

                <br/>
                <h2>Youtube</h2><br/>
                <div className="row">
                    
                    <div className="col">
                        <div className="card" style="width: 18rem;">
                            <img src="{{cource.course_image}}" className="card-img" alt="Best Ever Content!" className="card-img-top"
                                alt="..."></img>
                           
                            <div className="card-body">
                                <h5 className="card-title"></h5>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Instructor - </li>
                            </ul>
                            <div className="card-body">
                                <a href="{{cource.course_link}}" target="_blank" className="card-link">Learn More</a>
                            </div>
                        </div>
                    </div>
                  
                </div>

                <br/>
                <h2>Blogs</h2><br/>
                <div className="row">
                    
                    <div className="col">
                        <div className="card" style="width: 18rem;">
                            <div className="card-body">
                                <h5 className="card-title"></h5>
                            </div>
                            <div className="card-body">
                                <a href="{{blog.blog_link}}" target="_blank" className="card-link">Learn More</a>
                            </div>
                        </div>
                    </div>
               
                </div>
            </section>
        </div>
    )
}

export default Result
