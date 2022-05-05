import React from "react";
import {message} from "../action/message";

const Modal = props =>{
	if (!props.show){
		return null;
	}

	function sendMessage(id) {
		message({id : id, content : document.getElementById('send-message').innerText});
		props.onClose();
		return null;
	}

	return(
		<div className="modal fade p-0" onClick={props.onClose}>
			<div className="modal-dialog w-100 mx-auto" onClick={e => e.stopPropagation()}>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="staticBackdropLabel">Send Message to {props.name}</h5>
						<button type="button" className="close" onClick={props.onClose}>
							<span>&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<form className="" method="post" id="send-message">
							<textarea name="name" placeholder="Your message..." rows="6" className="w-100" required></textarea>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" onClick={props.onClose}>Never mind</button>
						<button type="submit" className="btn btn-primary" form="send-message" onClick={sendMessage(props.id,props.name)}>Send Message</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Modal;
