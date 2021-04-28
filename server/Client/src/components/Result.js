import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from './Spinner'


const Result = query => {
    console.log("query data", query)
    if (query.query.data) {
        const dat = query.query.data
        // const dat = query

        const udemy = dat.udemy
        const coursera = dat.coursera
        const youtube = dat.youtube

        const blogs = dat.blog
        return (
            <div>
                <section className="container-fluid" id="Result">

                    <h1>Results</h1> <br/>
                    {query.query.related.length == 0 ? <div></div> :
                        <Fragment>
                            <h2>Related Topics</h2>
                            <div className="row">
                                <ul>{
                                    query.query.related.map((topic) => (
                                        <li className="badge badge-info">{topic}</li>
                                    ))
                                }
                                </ul>
                            </div>
                        </Fragment>}
                    {query.query.prerequisites.length ==0 ? <div></div> :
                        <Fragment>
                            <h2>Prerequisites</h2>
                            <div className="row">
                                {
                                    query.query.prerequisites.map((topic) => (
                                        <span className="badge badge-info">{topic}</span>
                                    ))
                                }
                            </div>
                        </Fragment>
                    }
                    <h2>Udemy</h2><br/>
                    <div className="row">
                        {udemy.map((UdemyData) => (

                            <div className="col">
                                <div className="card">
                                    <img src={UdemyData.image} className="card-img" alt="Best Ever Content!"
                                         className="card-img-top"
                                         alt="..."></img>

                                    <div className="card-body">
                                        <h5 className="card-title"></h5>
                                        <p className="card-text">{UdemyData.title}</p>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Instructor -{UdemyData.instructor} </li>
                                        <li className="list-group-item">Rating -{UdemyData.rating} </li>
                                    </ul>
                                    <div className="card-body">
                                        <a href={UdemyData.link} target="_blank" className="card-link">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        ))

                        }

                    </div>
                    <br/>

                    <br/>
                    <h2>Coursera</h2><br/>
                    <div className="row">
                        {coursera.map((CourseraData) => (
                            <div className="col">
                                <div className="card">
                                    <img src={CourseraData.image} className="card-img" alt="Best Ever Content!"
                                         className="card-img-top"
                                         alt="..."></img>

                                    <div className="card-body">
                                        <h5 className="card-title">{CourseraData.title}</h5>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Instructor -{CourseraData.instructor} </li>
                                        <li className="list-group-item">Rating - {CourseraData.rating}</li>
                                        <li className="list-group-item">Level - {CourseraData.level}</li>
                                    </ul>

                                    <div className="card-body">
                                        <a href={CourseraData.link} target="_blank" className="card-link">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <br/>
                    <h2>Youtube</h2><br/>
                    <div className="row">
                        {youtube.map((YoutubeData) => (
                            <div className="col">
                                <div className="card">
                                    <img src={YoutubeData.image} className="card-img" alt="Best Ever Content!"
                                         className="card-img-top"
                                         alt="..."></img>

                                    <div className="card-body">
                                        <h5 className="card-title">{YoutubeData.title}</h5>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Instructor -{YoutubeData.instructor} </li>
                                    </ul>
                                    <div className="card-body">
                                        <a href={YoutubeData.link} target="_blank" className="card-link">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <br/>

                </section>
            </div>
        )
    } else {
        return (
            <div>
                <Spinner/>
                <div>Fetching..</div>
            </div>
        )
    }
}


Result.propTypes = {
    result: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Result)
