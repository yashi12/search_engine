import React from 'react'

const Spinner = props => {
    console.log("spinner");
    return (
        <div className="row">
            <div className="col"/>
            <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
            </div>
            <div className="col"/>
        </div>
    )
}

Spinner.propTypes = {

}

export default Spinner
