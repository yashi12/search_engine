import React, {useEffect, useRef, useState} from 'react'
import './Messages.css'
import axios from "axios";
import {setAlert} from "../action/alert";
import {connect} from "react-redux";
import Spinner from './Spinner';

const Messages = ({auth}) => {
	let activeMessage = {
		fromID :"",
		fromName : "",
		fromProfilePicture : "",
		messageGroups: []
	};

	let userName = "";
	let [userID,setUserID] = useState("");
	const [msg, setMsg] = useState([]);
	const [actMsg, setActMsg] = useState(activeMessage);
	const [loading, setLoading] = useState(false)
	const [action, setAction] = useState(false)

	useEffect(()=>{
		const config={
			header: {'Content-Type': 'multipart/form-data'}
		}
		axios.get(`${process.env.REACT_APP_API}/api/message/get-messages/${auth.user._id}`, config).then(r => {
			if(r.status === 200) {
				activeMessage.fromID = activeMessage.fromID ||  ((r.data.messages.length > 0)? r.data.messages[0].fromID : "");

				userName = r.data.name;
				setUserID(r.data._id);
				setMsg(r.data.messages.reverse());
			}else {
				setAlert('Error', 'danger');
				setLoading(true)
			}
		});
	},[action])

	useEffect(()=>{
		activeMessage.fromID = activeMessage.fromID || ((msg.length > 0) ? msg[0].fromID : "");
		setActiveMessage(activeMessage.fromID);
	},[msg,action])

	const messagesEndRef = useRef(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	useEffect(() => {
		scrollToBottom();
	}, [actMsg.messageGroups]);

	let setActiveMessage = (id) => {
		for (const message of msg) {
			if (message.fromID.toString() === id.toString()){
				activeMessage.fromID = message.fromID;
				activeMessage.fromName = message.messengerName;
				// activeMessage.fromProfilePicture = message.messengerProfileImage;
				activeMessage.messageGroups = [];
				//setActMsg(activeMessage)
				for (const content of message.content) {
					let me = (content.messenger.toString() === userID.toString());

					if (activeMessage.messageGroups.length) {
						const lastMessengerID = activeMessage.messageGroups[activeMessage.messageGroups.length - 1].id;
						if (content.messenger.toString() === lastMessengerID.toString()) {
							activeMessage.messageGroups[activeMessage.messageGroups.length - 1].messages.push(content.message);
							continue;
						}
					}

					let group = {
						// image: me ? userProfileImage : message.messengerProfileImage,
						name: me ? "Me" : message.messengerName,
						id: content.messenger,
						messages: [content.message],
						isMe: me
					}

					activeMessage.messageGroups.push(group);
				}
			}
		}
		setActMsg(activeMessage);
		setLoading(true)
	}

	let deleteMessage = (id) => {
		const config={
			header: {'Content-Type': 'multipart/form-data'}
		}
		const data = {
			_id : auth.user._id
		}
		axios.post(`${process.env.REACT_APP_API}/api/message/delete-messages/${id}`, data ,config).then(r => {
			if(r.status === 201) {
				setMsg(msg.filter(item => item._id.toString() !== id.toString()));
			}else {
				setAlert('Error', 'danger');
				setLoading(true)
			}
		});

	}

	function sendMessage(e) {
		e.preventDefault();
		let newMessage = document.getElementById('newMessage').value;
		if (!newMessage){
			return;
		}

		let data = {
			_id : auth.user._id,
			content : newMessage
		}
		const config = {
			header: {'Content-Type': 'multipart/form-data'}
		}
		axios.post(`${process.env.REACT_APP_API}/api/message/send-message/${actMsg.fromID}`, data ,config).then(r => {
			if (r.status === 201) {
				let groups = actMsg.messageGroups;
				if (groups[groups.length-1].isMe){
					groups[groups.length-1].messages.push(newMessage);
				}else {
					let newGroup = {
						name : userName,
						id : userID,
						messages : [newMessage],
						isMe : true
					}
					groups.push(newGroup);
				}
				actMsg.messageGroups = groups;

				for (const message of msg) {
					if (message.fromID.toString() === actMsg.fromID.toString()){
						let newContent = {
							message : newMessage,
							messenger : userID
						}
						message.content.push(newContent);
					}
				}
				setMsg(msg);
				document.getElementById('newMessage').value = "";
			}
		});
		setAction(!action)
	}


	return (
		<div>
			{
				loading ? 
			<div id="wrapper">
				<div id="content-wrapper" className="d-flex flex-column">
					<div id="content">
						<div className="container-fluid p-0 p-sm-4">
							<h1 className="h3 mb-4 text-gray-800 text-center text-md-left">Your Messages</h1>
							<h2 className="h4 ml-3 font-weight-300">
							{
								msg.length ? "" : "You Currently have no messages!"
							}
							</h2>
							<div className="row mb-5">
								<div className="col-xl-4 col-lg-5">
									<div className="message-list mb-5 custom-scroll pr-3">
										{
											msg.map((message)=>(
												<div key={message.fromID} onClick={_ => setActiveMessage(message.fromID)} className="message p-3 pr-5 my-4 bg-white">
													<div className="messenger">
														<div className="d-flex justify-content-between align-items-center">
															<div className="">
																{/*<a><img alt="image" src="../../src/images/login.png" className="rounded-circle profile-img-md"/></a>*/}
																<span className="ml-3"><a className="link text-primary">{ message.messengerName }</a></span>
															</div>
															<i className="link mb-2 fas fa-trash-alt" onClick={e => deleteMessage(message._id)}></i>
														</div>
														<p className="mt-2 text-truncate">{ message.content[message.content.length-1].message }...</p>
													</div>
												</div>
											))
										}
									</div>
								</div>
								<div className="col-xl-7 col-lg-7">
									{
										msg.length ?
											<div className="message-window shadow bg-white d-flex flex-column justify-content-between">
												<div className="message-content p-3 grow-1 custom-scroll">
													{
														actMsg.messageGroups.map((mGroup,index1) => (
															<div key={"group-"+index1} className="messenger mb-5">
																<div className={`mb-2 ${mGroup.isMe ? "ml-auto w-max" : ""}`} >
																	{
																		mGroup.isMe ? <span className="mr-3"><a className="link">{mGroup.name}</a></span> : null
																	}
																	{/*<a><img alt="image" src="../images/login.png" className="rounded-circle profile-img-sm"/></a>*/}
																	{
																		mGroup.isMe ? null : <span className="ml-3"><a className="link">{ mGroup.name }</a></span>
																	}
																</div>

																<div>
																	{
																		mGroup.messages.map((message,index2) => (
																			<div key={index1 + " " + index2} className={`mb-2 ${mGroup.isMe? 'w-max mr-5 ml-auto' : ' w-75 ml-5'}`}>
																				<p className={`d-inline text-white px-4 p-2 rounded-pill message-style ${mGroup.isMe ? 'w-max ml-auto bg-success': 'bg-primary'}`}>{ message }</p>
																			</div>
																		))
																	}
																</div>
															</div>
														))
													}
													<div ref={messagesEndRef} />
												</div>
												<div>
													<form onSubmit={e => sendMessage(e)}>
														<textarea className="w-100 border-top p-3 custom-scroll" placeholder="Your message..." name="name" rows="4" required id = "newMessage"></textarea>
														<input type="submit" className="w-100 p-2 border-0 btn-primary" value="Send Message" />
													</form>
												</div>
											</div> : <div></div>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
				:<div><Spinner/></div>
			}
			
		</div>
	)
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {  })(Messages);
