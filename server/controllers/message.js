const mongoose = require('mongoose');

const User = mongoose.model("User");
const Message = mongoose.model("Message");

const sendMessage = ({body,params,payload},res)=>{
	let from = payload._id;
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

module.exports = {
	sendMessage,
	deleteMessage,
	resetMessageNotifications
}
