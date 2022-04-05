import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import post from "../reducers/post";
import ReactQuill from "react-quill";

const Doubts = ({auth, doubt}) => {
	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-2"/>
				<div className="card mb-3 col-8">
					<div className="row g-0">
						<div className="mb-3 justify-content-between">
							<label className="form-label">Address of Doubt Solver</label>
							<div>{ doubt.addressOfDoubtSolver }</div>

							<label className="form-label">Address of Doubt Resolver</label>
							<div>
								{ doubt.addressOfDoubtResolver }
							</div>
						</div>
						<div className="mb-3">
							<label>Title</label>
							<div>
								{ doubt.title }
							</div>
						</div>
						<div className="mb-3">
							<label>Description</label>
							<div>
								{ doubt.description }
							</div>
						</div>
						<div className="mb-3">
							<label>Tags</label>
							<div>
								{doubt.tags.map((tag) => (
									<span className="badge badge-secondary">{tag}</span>
								))}
							</div>
						</div>
						<div className="mb-3">
							<label>Amount</label>
							<div>Rs. { doubt.amount }</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

Doubts.defaultProps = {
	showActions: true
};

Doubts.propTypes = {
	doubt: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(mapStateToProps, {})(Doubts)
