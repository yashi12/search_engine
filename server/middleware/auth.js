const jwt = require('jsonwebtoken');
const config = require('config');

const User =require('../models/User');

const authCheck = (req,res,next)=>{
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('SECRET_KEY'));
        req.user = decoded.user;
        console.log("user", req.user.id);
        User.findById(req.user.id)
            .then(user => {
                if (!user) {
                    res.status(401).json({msg: 'Token is not valid'});
                } else {
                    next();
                }
            })
    }catch (err){
        res.status(401).json({msg: 'Token is not valid'});
    }
};


module.exports = authCheck;