const mongoose = require('mongoose');

const User = mongoose.model("User");
const Message = mongoose.model("Message");

const sendMessage = ({body,params,payload},res)=>{
	let from = body._id;
	let to = params.to;
	let fromPromise = new Promise((resolve, reject)=>{
		User.findById(from,"messages",(err,user)=>{
			if(err){
				reject(err);
				return res.json({ error : err });
			}
			from = user;
			resolve(user);
		})
	})
	let toPromise = new Promise((resolve, reject)=>{
		User.findById(to,"messages latestMessageNotifications",(err,user)=>{
			if(err){
				reject(err);
				return res.json({ error : err });
			}
			to = user;
			resolve(user);
		});
	});

	let sendMessagePromise = Promise.all([fromPromise,toPromise]).then(()=>{

		function hasMessageFrom(messages,id) {
			for(let message of messages){
				if(message.fromID.toString() === id.toString()){
					return message;
				}
			}
		}

		function sendMessageTo(to,from, notify = false){
			return new Promise((resolve, reject)=>{
				if (notify && !to.latestMessageNotifications.includes(from._id)){
					to.latestMessageNotifications.push(from._id);
				}
				let foundMessage = hasMessageFrom(to.messages,from._id)
				if (foundMessage){
					foundMessage.content.push(message);
					to.save().then((user)=>{
						resolve(user);
					}).catch((err)=>{
						reject(err);
						return res.json({error : err});
					})
				}else {
					let newMessage = new Message();
					newMessage.fromID = from._id;
					newMessage.content = [message];

					to.messages.push(newMessage);
					to.save().then((user)=>{
						resolve(user);
					}).catch((err)=>{
						reject(err);
						return res.json({error : err});
					});
				}
			});
		}

		let message = {
			messenger : from._id,
			message : body.content
		}

		let sendMessageToRecipient = sendMessageTo(to,from,true);
		let sendMessageToAuthor = sendMessageTo(from,to);

		return new Promise((resolve) => {
			Promise.all([sendMessageToRecipient,sendMessageToAuthor]).then(()=>{
				resolve();
			});
		});
	});
	sendMessagePromise.then(()=>{
		res.status(201).json({ message : "Sent Message" });
	});
}

const resetMessageNotifications = ({payload}, res)=>{
	User.findById(payload._id,(err,user)=>{
		if(err){
			return res.json({ error : err });
		}
		user.latestMessageNotifications = [];
		user.save().then(()=>{
			res.status(201).json({ message: "Reset message notifications." })
		}).catch((err)=>{
			res.send({ error : err });
		})
	})
}

const deleteMessage  = ({payload,params},res)=>{
	User.findById(payload._id,(err,user)=>{
		if(err){
			return res.json({ error : err });
		}
		user.messages.id(params.id).remove();

		user.save().then(()=>{
			res.status(201).json({ message : "Deleted Successfully" });
		}).catch((err)=>{
			return res.send({ error :err });
		})
	})
}

const getMessage = (req, res)=>{
	User.findById(req.params.userid, null,{lean:true},(err,user)=>{
		if(err){
			return res.status(400).json({ error : err });
		}
		if (!user){
			return res.status(404).json({ error : "User does not exists."});
		}

		function addMessengerDetails(messages) {
			return new Promise((resolve) => {
				if (!messages.length){
					resolve(messages);
				}
				let usersArray = [];
				for (const message of messages) {
					usersArray.push(message.fromID);
				}

				User.find({'_id': { $in : usersArray }},"name",{},(err,users)=>{
					if(err){
						return res.json({ error : err });
					}
					for (let message of messages) {
						for (let i = 0; i < users.length; i++) {

							if (message.fromID.toString() === users[i]._id.toString()){
								message.messengerName = users[i].name;
								users.splice(i,1);
								break;
							}
						}
					}
					resolve(messages);
				})
			});
		}

		let messageDetails = addMessengerDetails(user.messages);
		Promise.all([messageDetails]).then((val)=>{
			res.status(200).json({ name : user.name, _id : user._id, messages : val[0] });
		});
	});
}

module.exports = {
	getMessage,
	sendMessage,
	deleteMessage,
	resetMessageNotifications
}
