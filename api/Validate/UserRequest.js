const User = require('../models/User');

exports.UserUpdateRequest = async (req, res, next) => {
    const user_id = req.params.id
    console.log(user_id)
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    let flag = true;

    if (!req.body.name) {
        flag = false
        messages.name = "Name field is required"
    }
    if (!req.body.email) {
        flag = false
        messages.email = "Email field is required"
    } else {
        const result = await User.findOne({_id: {$ne: user_id}, email: req.body.email}).exec();
        if (result) {
            flag = false
            messages.email = "Email already exists"
        }
    }

    if (!req.body.username) {
        flag = false
        messages.username = "Username field is required"
    } else {
        const result = await User.findOne({_id: {$ne: user_id}, username: req.body.username}).exec();
        if (result) {
            flag = false
            messages.username = "Username field already exists. Choose anoter one."
        }
    }

    if (!req.body.mobile) {
        flag = false
        messages.mobile = "Mobile field is required"
    } else {
        const result = await User.findOne({_id: {$ne: user_id}, mobile: req.body.mobile}).exec();
        if (result) {
            flag = false
            messages.mobile = "Mobile already registered with us."
        }
    }

    if (!flag) {

        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: {}
        })
    }


    next();
}
exports.LoginRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Username and Password is required",
            errors: "Username and Password is required",
            data: {}
        })
    }
    flag = true;

    if (!req.body.username) {
        flag = false
        messages.username = "Username field is required"
    }

    if (!req.body.password) {
        flag = false
        messages.password = "Password field is required"
    }
    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: {}
        })
    }

    next();
}

exports.ForgotPasswordRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Request body can't be empty",
            errors: "Request body can't be empty",
            data: {}
        })
    }
    flag = true;

    if (!req.body.username) {
        flag = false
        messages.username = "Username or Email field is required"
    } else {
        const result = await User.findOne({$or: [{email: req.body.username}, {username: req.body.username}]})
            .exec();
        if (!result) {
            flag = false
            messages.email = "Username or Email not found"
        }
    }
    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: {}
        })
    }

    next();
}

exports.ResetPasswordRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Request body can't be empty",
            errors: "Request body can't be empty",
            data: {}
        })
    }
    flag = true;

    if (!req.body.password) {
        flag = false
        messages.password = "Password field is required"
    }
    if (!req.body.confirm_password) {
        flag = false
        messages.confirm_password = "Confirm field is required"
    } else {
        if (req.body.password !== req.body.confirm_password) {
            flag = false
            messages.confirm_password = "Both password should be equal"
        }
    }
    if (!req.body.resetToken) {
        flag = false
        messages.resetToken = "Reset token is required"
    } else {
        const result = await User.findOne({resetToken: req.body.resetToken}).exec();
        if (!result) {
            flag = false
            messages.resetToken = "Invalid or reset token is expired"
        }
    }

    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: {}
        })
    }

    next();
}

exports.ChangePasswordRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Request body can't be empty",
            errors: "Request body can't be empty",
            data: {}
        })
    }
    flag = true;

    if (!req.body.password) {
        flag = false
        messages.password = "Password field is required"
    }
    if (!req.body.confirm_password) {
        flag = false
        messages.confirm_password = "Confirm field is required"
    } else {
        if (req.body.password !== req.body.confirm_password) {
            flag = false
            messages.confirm_password = "Both password should be equal"
        }
    }
    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: {}
        })
    }

    next();
}


exports.LoginFromAdminRequest = async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    let messages = {}
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(500).json({
            status_code: 500,
            message: "Request body can't be empty",
            errors: "Request body can't be empty",
            data: {}
        })
    }
    flag = true;

    if (!req.body.email) {
        flag = false
        messages.email = "Email field is required"
    } else {
        const result = await User.findOne({_id: req.body.email}).count();
        //console.log(result);
        if (!result) {
            flag = false
            messages.email = "User does not exist!"
        }
    }

    if (!req.body.type) {
        flag = false
        messages.type = "Enter valid type value here"
    }


    if (!flag) {
        return res.status(500).json({
            status_code: 500,
            message: "Errors",
            errors: messages,
            data: null
        })
    }

    next();
}
