import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styled from "styled-components";
import { CgProfile } from 'react-icons/cg'
import { Link } from 'react-router-dom'

const Label = styled.label`
	font-weight: bold;
`;
const Doubts = ({auth, doubt,price}) => {
	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-2"/>
				<div className="card mb-3 col-8">
					<div>
					<h4>{doubt.user.name} <Link className="btn btn-primary" to={`/profile/${doubt.user._id}`}><CgProfile/></Link></h4>
						<div className="mb-3">
							<Label>Title</Label>
							<div>
								{ doubt.title }
							</div>
						</div>
						<div className="mb-3">
							<Label>Description</Label>
							<div dangerouslySetInnerHTML={{__html: doubt.description}}/>
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
							<div>{ doubt.raisedAmount ? <div>{ doubt.raisedAmount/10**18 } ETH (Rs. {price*doubt.raisedAmount/10**18})</div> : 0 }</div>
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
	auth: PropTypes.object.isRequired,
	price: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
})

export default connect(mapStateToProps, {})(Doubts)
