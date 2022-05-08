import React from "react";
import axios from "axios";
import {setAlert} from "../action/alert";
import {connect} from "react-redux";

const Modal = props =>{
	console.log(props);
	const sendMessage = (id) =>{
		let data = {_id : props.auth.user._id, content : document.getElementById('send-message').value};
		const config = {
			header: {'Content-Type': 'multipart/form-data'}
		}
		axios.post(`${process.env.REACT_APP_API}/api/message/send-message/${id}`, data, config).then(r => {
			if(r.status === 201) {
				setAlert('Message Sent Successfully', 'success');
			}else {
				setAlert('Message Not Sent', 'danger');
			}
		});
	}

	return(
		<div id="modal-message" className="modal fade p-0 mt-5" tabIndex="-1" role="dialog">
			<div className="modal-dialog w-100 mx-auto" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="staticBackdropLabel">Send Message to {props.name}</h5>
						<button type="button" className="close" data-dismiss="modal" onClick={props.closeModal}>
							<span>&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<form className="" method="post">
							<textarea id="send-message" name="name" placeholder="Your message..." rows="6" className="w-100" required></textarea>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={props.closeModal}>Never mind</button>
						<button type="submit" className="btn btn-primary" form="send-message" onClick={e => {
							sendMessage(props._id);
							props.closeModal();
						}} data-dismiss="modal">Send Message</button>
					</div>
				</div>
			</div>
		</div>
	)
}
const mapStateToProps = (state) => ({
	props : state.props
});

export default connect(mapStateToProps, {  })(Modal);

