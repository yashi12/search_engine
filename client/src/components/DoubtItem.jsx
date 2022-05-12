import React, {useEffect, useState} from 'react'
import axios from 'axios';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styled from "styled-components";
import { CgProfile } from 'react-icons/cg'
import { Link } from 'react-router-dom'
import ProposalItem from './ProposalItem';
import Modal from "./Modal";

const Label = styled.label`
	font-weight: bold;
`;

const DoubtItem = ({auth, doubt, GlobalId}) => {

    const [price, setPrice] = useState(0)

	const [showModal, setShowModal] = useState(false);
	const [activeObject, setActiveObject] = useState(null);
    const data = doubt.doubt.doubt

    useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	})

	return (
		<div>
			<div className="row">
				<br/>
			</div>
			<div className="row">
				<div className="col-1"/>
				<div className="card mb-3 col-10">
					<div >
						<br />
						<h4>
							{data.user.name}
							<Link className="btn btn-primary" to={`/profile/${data.user._id}`}><CgProfile/></Link>
							<div>
								{
									data.user._id.toString() !== auth.user._id ?
										<div>
											<button className={"btn btn-sm btn-success rounded-pill ml-5 float-right"}
													data-toggle="modal" data-target="#modal-message" onClick={e => {
												let _id = data.user._id;
												let name = data.user.name;

												setActiveObject({_id, name});
												setShowModal(true);
											}}>Send Message</button>
											{
												showModal ? <Modal _id = {activeObject._id} name = {activeObject.name} auth={auth} closeModal = {e => setShowModal(false)}/> : null
											}
										</div>
									:null
								}
							</div>
						</h4>
						<div className="mb-3">
							<Label>Title</Label>
							<div>
								{ data.title }
							</div>
						</div>
						<div className="mb-3">
							<Label>Description</Label>
							<div dangerouslySetInnerHTML={{__html: data.description}}/>
						</div>
                        <div className="mb-3">
							<Label>Status</Label>
							<div>{ data.status }</div>
						</div>
						<div className="mb-3">
							<Label>Tags</Label>
							<div>
								{data.tags.map((tag) => (
									<span className="badge badge-secondary">{tag}</span>
								))}
							</div>
						</div>
						<div className="mb-3">
							<Label>Amount</Label>
							<div>{ data.raisedAmount ? <div>{ data.raisedAmount/10**18 } ETH (Rs. {price*data.raisedAmount/10**18})</div> : 0 }</div>
						</div>
                        <ProposalItem bookings={doubt.doubt} topic={data.title} id={data._id} askerId={data.user._id} status={data.status}/>
					</div>
				</div>
			</div>
		</div>
	)
}

DoubtItem.defaultProps = {
	showActions: true
};

DoubtItem.propTypes = {
	doubt: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth,
    doubt: state.doubt
})

export default connect(mapStateToProps, {})(DoubtItem)
