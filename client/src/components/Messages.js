import React, {useEffect, useState} from 'react'
import './Messages.css'
import axios from "axios";
import {setAlert} from "../action/alert";
import {connect} from "react-redux";
import {getQuestions} from "../action/question";
import Spinner from './Spinner';

const Messages = ({auth}) => {
	let activeMessage = {
		fromID :"",
		fromName : "",
		fromProfilePicture : "",
		messageGroups: []
	};

	let messages = [];
	let userProfileImage = "default_avatar";
	let userName = "";
	let userID = "";

	const [msg, setMsg] = useState(null)
	const [actMsg, setActMsg] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(()=>{
		const config={
			header: {'Content-Type': 'multipart/form-data'}
		}
		axios.get(`${process.env.REACT_APP_API}/api/message/get-messages/${auth.user._id}`, config).then(r => {
			if(r.status === 200) {
				
				console.log("data : ",r.data.messages);
				activeMessage.fromID = activeMessage.fromID ||  r.data.messages? "" : r.data.messages[0].fromID;
				messages =  r.data.messages.reverse();
				setMsg(messages)
				//console.log("data 2",msg)
				userName = r.data.name;
				userID = r.data._id;
				setActiveMessage(activeMessage.fromID);
			}else {
				setAlert('Error', 'danger');
				setLoading(true)
			}
		});
	},[])

	let setActiveMessage = (id) => {
		for (const message of messages) {
			if (message.fromID.toString() === id){
				activeMessage.fromID = message.fromID;
				activeMessage.fromName = message.messengerName;
				activeMessage.fromProfilePicture = message.messengerProfileImage;
				//setActMsg(activeMessage)
				let groups = (activeMessage.messageGroups = []);
				for (const content of message.content) {
					let me = (content.messenger.toString() === userID.toString());

					if (groups.length) {
						const lastMessengerID = groups[groups.length - 1].id;
						if (content.messenger.toString() === lastMessengerID.toString()) {
							groups[groups.length - 1].messages.push(content.message);
							continue;
						}
					}

					let group = {
						image: me ? userProfileImage : message.messengerProfileImage,
						name: me ? "Me" : message.messengerName,
						id: content.messenger,
						messages: [content.message],
						isMe: me
					}

					groups.push(group);
				}
			}
		}
		
		setActMsg(activeMessage)
		setLoading(true)
	}

	let deleteMessage = (_id) => {}

	function sendMessage() {

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
												<div onClick={_ => setActiveMessage(message.fromID)} className="message p-3 pr-5 my-4 bg-white">
													<div className="messenger">
														<div className="d-flex justify-content-between align-items-center">
															<div className="">
																{/*<a><img alt="image" src="assets/images/{{message.messengerProfileImage}}.jpg" className="rounded-circle profile-img-md"></a>*/}
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
														actMsg.messageGroups.map((mGroup) => (
															<div className="messenger mb-5">
																<div className={`mb-2 ${mGroup.isMe ? "ml-auto w-max" : ""}`} >
																	mGroup.isMe ? <span className="mr-3"><a className="link">{ mGroup.name }</a></span> : <span></span>
																	{/*<a><img alt="image" src="assets/images/{{mGroup.image}}.jpg" className="rounded-circle profile-img-sm"></a>*/}
																	mGroup.isMe ? <span></span> : <span className="ml-3"><a className="link">{ mGroup.name }</a></span>
																</div>

																<div className={`mb-2 ${mGroup.isMe? "w-max ml-auto mr-5" : "w-75 ml-5"}`}>
																	{
																		mGroup.messages.map((message) => (
																			<p className={`d-inline text-white px-4 p-2 rounded-pill message-style ${mGroup.isMe ? 'w-max ml-auto bg-success': 'bg-primary'}`}>{{ message }}</p>
																		))
																	}
																</div>
															</div>
														))
													}
												</div>
												<div>
													<form onSubmit={_ => sendMessage()}>
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
