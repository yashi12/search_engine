import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styled from "styled-components";

const Label = styled.label`
	font-weight: bold;
`;
const Doubts = ({auth, doubt}) => {
	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-2"/>
				<div className="card mb-3 col-8">
					<div>
						<div className="mb-3 justify-content-between">
							<Label className="form-label">Address of Doubt Solver</Label>
							<div>{ doubt.addressOfDoubtSolver }</div>

							<Label className="form-label">Address of Doubt Resolver</Label>
							<div>
								{ doubt.addressOfDoubtResolver }
							</div>
						</div>
						<div className="mb-3">
							<Label>Title</Label>
							<div>
								{ doubt.title }
							</div>
						</div>
						<div className="mb-3">
							<Label>Description</Label>
							<div>
								{ doubt.description }
							</div>
						</div>
						<div className="mb-3">
							<Label>Tags</Label>
							<div>
								{doubt.tags.map((tag) => (
									<span className="badge badge-secondary">{tag}</span>
								))}
							</div>
						</div>
						<div className="mb-3">
							<Label>Amount</Label>
							<div>Rs. { doubt.raisedAmount ? doubt.raisedAmount : 0 }</div>
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
