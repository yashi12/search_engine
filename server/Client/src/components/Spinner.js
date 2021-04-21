import React from 'react'

const Spinner = props => {
    return (
        <div className="row">
            <div className="col"></div>
            <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
            </div>
            <div className="col"></div>
        </div>
    )
}

Spinner.propTypes = {

}

export default Spinner
