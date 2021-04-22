import React from 'react'

const Spinner = props => {
    return (
        <div className="row">
            <div className="col"></div>
            <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
            </div>
            <div className="col"></div>
        </div>
    )
}

Spinner.propTypes = {

}

export default Spinner
