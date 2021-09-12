const jwt = require('jsonwebtoken');
const {JWT_KEY} = require('../config/constant')

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, JWT_KEY);
        // console.log(decoded)
        req.userData = decoded.data;
        next();
    }catch(error){
        return res.status(401).json({
            message: "Auth Failed"
        });
    }
};