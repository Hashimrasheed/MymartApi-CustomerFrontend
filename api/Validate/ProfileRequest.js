const mongoose = require('mongoose');
const User = require('../models/User');
var fs = require('fs');

exports.UpdateProfileRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code:500,
            message:"Request body can't be empty",
            errors: "Request body can't be empty",
            data:{}
        })
    }
    flag=true;

    if(!req.body.name){
        flag=false
        messages.name="Name field is required"
    }
    if(!req.body.email){
        flag=false
        messages.email="Email field is required"
    } else {
        const result =  await User.findOne({_id:{$ne:req.userData.userId},email: req.body.email}).exec();
        if(result){
            flag=false
            messages.email="Email should be unique"
        }
    }

    if(!req.body.mobile){
        flag=false
        messages.mobile="Mobile field is required"
    } else {
        const result =  await User.findOne({_id:{$ne:req.userData.userId},mobile: req.body.mobile}).exec();
        if(result){
            flag=false
            messages.mobile="Mobile already registerd with us."
        }
    }

    if(!flag){
        return res.status(500).json({
            status_code:500,
            message:"Errors",
            errors: messages,
            data:{}
        })
    }

    next();
}
